import { useAuthStore } from "@/app/store/auth"
import { createSupabaseBrowserClient } from "@/services/supabase/client"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export function useUser() {
	const user = useAuthStore(state => state.user)
	const supabaseBrowser = createSupabaseBrowserClient()

	const deleteAccount = useMutation({
		mutationFn: async () => {
			if (!user) throw new Error("User not found")

			const response = await fetch("/api/user/delete", {
				method: "POST",
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.message || "Failed to delete account")
			}

			// Sign out after successful deletion
			await supabaseBrowser.auth.signOut()
			window.location.href = "/"

			return { success: true }
		},
		onError: error => {
			console.error("Error deleting account:", error)
			toast.error("Failed to delete account")
		},
	})

	return {
		user,
		deleteAccount: deleteAccount.mutate,
		isDeletingAccount: deleteAccount.isPending,
	}
}
