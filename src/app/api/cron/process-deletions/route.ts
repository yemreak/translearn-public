"use server"

import { serverConfig } from "@/config"
import { createSupabaseServiceRoleClient } from "@/services/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
	// API anahtarı kontrolü
	const { searchParams } = new URL(request.url)
	const apiKey = searchParams.get("apiKey")

	if (apiKey !== serverConfig.cron.secret) {
		return NextResponse.json(
			{ error: "Unauthorized" },
			{ status: 401 }
		)
	}

	try {
		const supabase = await createSupabaseServiceRoleClient()

		// Silinmesi gereken hesapları bul
		const { data: deletionRequests, error: fetchError } =
			await supabase
				.from("deletion_requests")
				.select("id, user_id")
				.eq("cancelled", false)
				.eq("processed", false)
				.lte("scheduled_deletion_date", new Date().toISOString())

		if (fetchError) {
			throw new Error(
				`Silme istekleri alınamadı: ${fetchError.message}`
			)
		}

		if (!deletionRequests || deletionRequests.length === 0) {
			return NextResponse.json({
				message: "İşlenecek silme isteği bulunamadı",
			})
		}

		const results = []

		// Her bir kullanıcı için silme işlemini gerçekleştir
		for (const request of deletionRequests) {
			try {
				// Kullanıcı bilgilerini al
				const { data: userData, error: userError } =
					await supabase.auth.admin.getUserById(request.user_id)

				if (userError) {
					throw new Error(
						`Kullanıcı bilgisi alınamadı: ${userError.message}`
					)
				}

				// User data will be deleted via cascade

				// Kullanıcıyı sil
				const { error: deleteError } =
					await supabase.auth.admin.deleteUser(request.user_id)

				if (deleteError) {
					throw new Error(
						`Kullanıcı silinemedi: ${deleteError.message}`
					)
				}

				// Silme isteğini işlendi olarak işaretle
				await supabase
					.from("deletion_requests")
					.update({
						processed: true,
						processed_at: new Date().toISOString(),
					})
					.eq("id", request.id)

				// Silme işlemini logla
				await supabase.from("account_deletion_logs").insert({
					user_id: request.user_id,
					email: userData.user?.email || "unknown",
					ip_address: "cron-job",
					user_agent: "cron-job",
					reason: "scheduled-deletion",
				})

				results.push({
					userId: request.user_id,
					status: "deleted",
				})
			} catch (userProcessError) {
				console.error(`Kullanıcı silme hatası: ${userProcessError}`)
				results.push({
					userId: request.user_id,
					status: "error",
					error:
						userProcessError instanceof Error
							? userProcessError.message
							: "Bilinmeyen hata",
				})
			}
		}

		return NextResponse.json({
			processed: results.length,
			results,
		})
	} catch (error) {
		console.error("Cron job hatası:", error)
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Bilinmeyen bir hata oluştu",
			},
			{ status: 500 }
		)
	}
}
