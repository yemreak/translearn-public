import { extractUserId } from "@/app/lib/utils"
import { createSupabaseServiceRoleClient } from "@/services/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
	try {
		const userId = extractUserId(request)
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		// Delete the user account (this will cascade delete all related data)
		const serviceSupabase = await createSupabaseServiceRoleClient()
		const { error: deleteError } =
			await serviceSupabase.auth.admin.deleteUser(userId)

		if (deleteError) {
			throw deleteError
		}

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("Error deleting user account:", error)
		return NextResponse.json(
			{ error: "Failed to delete user account" },
			{ status: 500 }
		)
	}
}
