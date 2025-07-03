"use server"

import { serverConfig } from "@/config"
import { createServerClient as csc } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export async function createSupabaseServerClient() {
	const cookieStore = await cookies()

	return csc(serverConfig.supabase.url, serverConfig.supabase.anonKey, {
		cookies: {
			getAll() {
				return cookieStore.getAll()
			},
			setAll(cookiesToSet) {
				try {
					cookiesToSet.forEach(({ name, value, options }) => {
						cookieStore.set(name, value, options)
					})
				} catch (error) {
					console.error(error)
				}
			},
		},
	})
}

/**
 * TODO: bunu kaldirmaya calis
 */
export async function createSupabaseServiceRoleClient() {
	return createClient(
		serverConfig.supabase.url,
		serverConfig.supabase.serviceRoleKey,
		{
			auth: { autoRefreshToken: false, persistSession: false },
		}
	)
}
