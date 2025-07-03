"use server"

import { requestAccountDeletion } from "@/services/account-deletion"
import { NextResponse } from "next/server"

export async function POST() {
	try {
		const result = await requestAccountDeletion()
		return NextResponse.json(result)
	} catch (error) {
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Bilinmeyen bir hata oluştu",
			},
			{ status: 400 }
		)
	}
}
