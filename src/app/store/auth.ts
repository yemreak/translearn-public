import { createSupabaseBrowserClient } from "@/services/supabase/client"
import { User } from "@supabase/supabase-js"
import { create } from "zustand"

// Auth state (memory-only, no persist)
export const useAuthStore = create<{ user?: User }>()(set => {
	const supabaseBrowser = createSupabaseBrowserClient()

	// Setup auth state listener
	supabaseBrowser.auth.onAuthStateChange((_event, session) => {
		set({ user: session?.user })

		// Clear voice store when user signs out
	})

	return { user: undefined }
})
