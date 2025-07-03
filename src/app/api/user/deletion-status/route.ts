"use server"

import { getDeletionRequest } from "@/services/account-deletion"
import { NextResponse } from "next/server"

export async function GET() {
	try {
		const deletionRequest = await getDeletionRequest()
		return NextResponse.json({ deletionRequest })
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
