/**
 * @purpose Handle Google OAuth callback and session management
 */
"use server"

import { createSupabaseServerClient } from "@/services/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url)
	const code = searchParams.get("code")
	const next = searchParams.get("next") ?? "/"

	if (code) {
		const supabaseServer = await createSupabaseServerClient()
		await supabaseServer.auth.exchangeCodeForSession(code)
	}

	// URL to redirect to after sign in process completes
	return NextResponse.redirect(new URL(next, request.url))
}
