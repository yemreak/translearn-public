"use client"

import { clientConfig } from "@/config"
import { createBrowserClient as _createBrowserClient } from "@supabase/ssr"

export function createSupabaseBrowserClient() {
	return _createBrowserClient(
		clientConfig.supabase.url,
		clientConfig.supabase.anonKey
	)
}
