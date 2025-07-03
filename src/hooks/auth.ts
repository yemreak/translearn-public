import { useAuthStore } from "@/app/store/auth"
import { useUiStore } from "@/app/store/ui"
import { createSupabaseBrowserClient } from "@/services/supabase/client"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

export function useAuth() {
	const supabaseBrowser = createSupabaseBrowserClient()
	const [isLoading, setIsLoading] = useState(false)
	const user = useAuthStore(state => state.user)
	const setCurrentLanguage = useUiStore(
		state => state.setCurrentLanguage
	)

	// Kullanıcı tablolarını kontrol et ve yoksa oluştur
	useEffect(() => {
		const initializeUserTables = async () => {
			if (!user) return

			try {
				// User Preferences tablosunu kontrol et (browser tarafında yapılabilir)
				const { data: preferencesData, error: preferencesError } =
					await supabaseBrowser
						.from("user_preferences")
						.select("*")
						.eq("user_id", user.id)
						.maybeSingle()

				if (
					preferencesError &&
					preferencesError.code !== "PGRST116"
				) {
					throw preferencesError
				}

				// Eğer preferences tablosu yoksa oluştur
				if (!preferencesData) {
					const { error: insertPreferencesError } =
						await supabaseBrowser.from("user_preferences").insert({
							user_id: user.id,
							source_language: "tr",
							target_language: "en",
						})

					if (insertPreferencesError) throw insertPreferencesError
				} else {
					// Kullanıcı dil tercihini UI store'a aktar
					setCurrentLanguage(preferencesData.source_language)
				}
			} catch (error) {
				console.error("Error initializing user tables:", error)
				toast.error(
					"Kullanıcı bilgileri yüklenirken bir hata oluştu."
				)
			}
		}

		initializeUserTables()
	}, [user, supabaseBrowser, setCurrentLanguage])

	const signIn = useCallback(async () => {
		setIsLoading(true)
		try {
			const { error } = await supabaseBrowser.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: `${window.location.origin}/auth/callback`,
				},
			})
			if (error) throw error
		} finally {
			setIsLoading(false)
		}
	}, [supabaseBrowser])

	const signOut = useCallback(async () => {
		setIsLoading(true)
		try {
			const { error } = await supabaseBrowser.auth.signOut()
			if (error) throw error
			window.location.reload()
		} finally {
			setIsLoading(false)
		}
	}, [supabaseBrowser])

	return {
		signIn,
		signOut,
		user,
		isLoading,
	}
}
