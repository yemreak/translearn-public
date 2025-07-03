import { createSupabaseServerClient } from "@/services/supabase/server"
import { headers } from "next/headers"

const DELETION_COOLDOWN_DAYS = 7
const MAX_DELETIONS_PER_IP = 3
const IP_DELETION_WINDOW_DAYS = 30

export type DeletionRequest = {
	id: string
	userId: string
	requestedAt: string
	scheduledDeletionDate: string
	cancelled: boolean
	processed: boolean
}

export async function requestAccountDeletion() {
	const supabase = await createSupabaseServerClient()
	const headersList = await headers()

	// IP adresi ve user agent bilgilerini al
	const ip = headersList.get("x-forwarded-for") || "unknown"
	const userAgent = headersList.get("user-agent") || "unknown"

	// IP adresinden son 30 gün içinde yapılan silme işlemlerini kontrol et
	const { data: ipLogs, error: ipLogsError } = await supabase
		.from("account_deletion_logs")
		.select("id")
		.eq("ip_address", ip)
		.gte(
			"deleted_at",
			new Date(
				Date.now() - IP_DELETION_WINDOW_DAYS * 24 * 60 * 60 * 1000
			).toISOString()
		)

	if (ipLogsError) {
		throw new Error(`IP kontrol hatası: ${ipLogsError.message}`)
	}

	// IP limitini kontrol et
	if (ipLogs && ipLogs.length >= MAX_DELETIONS_PER_IP) {
		throw new Error(
			`Bu IP adresinden çok fazla hesap silme işlemi yapıldı. Lütfen ${IP_DELETION_WINDOW_DAYS} gün sonra tekrar deneyin.`
		)
	}

	// Hesap silme isteği oluştur
	const { data, error } = await supabase.rpc("request_account_deletion", {
		scheduled_days: DELETION_COOLDOWN_DAYS,
		client_ip: ip,
		client_user_agent: userAgent,
	})

	if (error) {
		throw new Error(`Hesap silme isteği oluşturulamadı: ${error.message}`)
	}

	return data
}

export async function cancelDeletionRequest() {
	const supabase = await createSupabaseServerClient()

	// Kullanıcının aktif silme isteğini bul
	const { data: requests, error: fetchError } = await supabase
		.from("deletion_requests")
		.select("id")
		.eq("cancelled", false)
		.eq("processed", false)
		.limit(1)

	if (fetchError) {
		throw new Error(`Silme isteği bulunamadı: ${fetchError.message}`)
	}

	if (!requests || requests.length === 0) {
		throw new Error("İptal edilecek aktif bir silme isteği bulunamadı")
	}

	// İsteği iptal et
	const { error: updateError } = await supabase
		.from("deletion_requests")
		.update({ cancelled: true })
		.eq("id", requests[0].id)

	if (updateError) {
		throw new Error(`Silme isteği iptal edilemedi: ${updateError.message}`)
	}

	return { success: true }
}

export async function getDeletionRequest(): Promise<DeletionRequest | null> {
	const supabase = await createSupabaseServerClient()

	const { data, error } = await supabase
		.from("deletion_requests")
		.select("*")
		.eq("cancelled", false)
		.eq("processed", false)
		.order("requested_at", { ascending: false })
		.limit(1)

	if (error) {
		throw new Error(`Silme isteği bilgisi alınamadı: ${error.message}`)
	}

	if (!data || data.length === 0) {
		return null
	}

	return {
		id: data[0].id,
		userId: data[0].user_id,
		requestedAt: data[0].requested_at,
		scheduledDeletionDate: data[0].scheduled_deletion_date,
		cancelled: data[0].cancelled,
		processed: data[0].processed,
	}
}
