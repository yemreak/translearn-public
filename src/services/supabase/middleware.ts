"use server"

import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "./server"

export async function updateSession(request: NextRequest) {
	const response = NextResponse.next({
		request: { headers: request.headers },
	})

	const supabase = await createSupabaseServerClient()

	// This will refresh session if expired - required for Server Components
	// https://supabase.com/docs/guides/auth/server-side/nextjs
	const {
		data: { user },
		// error,
	} = await supabase.auth.getUser()
	return { response, user }
}
