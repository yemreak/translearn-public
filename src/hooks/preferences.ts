import { useAuthStore } from "@/app/store/auth"
import { useUiStore } from "@/app/store/ui"
import { createSupabaseBrowserClient } from "@/services/supabase/client"
import { Tables } from "@/types/supabase"
import {
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query"

export function usePreferences() {
	const supabaseBrowser = createSupabaseBrowserClient()
	const user = useAuthStore(state => state.user)
	const queryClient = useQueryClient()
	const setCurrentLanguage = useUiStore(state => state.setCurrentLanguage)

	const { data: preferences, isLoading } = useQuery({
		queryKey: ["preferences", user?.id],
		queryFn: async () => {
			if (!user) return null

			const { data, error } = await supabaseBrowser
				.from("user_preferences")
				.select("*")
				.single()

			if (error) throw error

			// Sync with UI store
			if (data) {
				setCurrentLanguage(data.source_language)
			}

			return data as Tables<'user_preferences'>
		},
		enabled: !!user,
	})

	const updateMutation = useMutation({
		mutationFn: async (preferences: Partial<Tables<'user_preferences'>>) => {
			if (!user) throw new Error("User not found")

			const { error, data } = await supabaseBrowser
				.from("user_preferences")
				.upsert({ ...preferences, user_id: user.id })
				.select()
				.single()

			if (error) throw error

			// Sync with UI store when source language is updated
			if (data && preferences.source_language) {
				setCurrentLanguage(data.source_language)
			}

			return data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["preferences", user?.id] })
		},
	})

	return {
		...preferences,
		isLoading,
		update: updateMutation.mutate,
	}
}
