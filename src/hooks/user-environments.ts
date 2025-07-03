import {
	deleteUserApiKey,
	getUserApiKeys,
	saveUserApiKey,
} from "@/app/actions/user-environments"
import {
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query"
import { useAuth } from "./auth"

export type UserEnvironmentKey =
	| "openai_key"
	| "elevenlabs_key"
	| "elevenlabs_voice_id"

export function useUserEnvironments() {
	const { user } = useAuth()
	const queryClient = useQueryClient()

	const { data: keyStatus = {}, isLoading } = useQuery({
		queryKey: ["user-environment-status", user?.id],
		queryFn: async () => {
			if (!user) return {}
			return await getUserApiKeys(user.id)
		},
		enabled: !!user,
	})

	const updateEnvironment = useMutation({
		mutationFn: async ({
			key,
			value,
		}: {
			key: UserEnvironmentKey
			value: string
		}) => {
			if (!user) throw new Error("User not authenticated")
			await saveUserApiKey(user.id, key, value)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["user-environment-status", user?.id],
			})
		},
	})

	const deleteEnvironment = useMutation({
		mutationFn: async (key: UserEnvironmentKey) => {
			if (!user) throw new Error("User not authenticated")
			await deleteUserApiKey(user.id, key)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["user-environment-status", user?.id],
			})
		},
	})

	// Helper to check if a key exists (secure - doesn't expose actual key)
	const hasKey = (key: UserEnvironmentKey): boolean => {
		return !!keyStatus[key]
	}

	// Check which features are available
	const hasOpenAI = hasKey("openai_key")
	const hasElevenLabs = hasKey("elevenlabs_key")
	const hasCustomVoice = hasKey("elevenlabs_voice_id")

	return {
		keyStatus,
		isLoading,
		updateEnvironment,
		deleteEnvironment,
		hasKey,
		hasOpenAI,
		hasElevenLabs,
		hasCustomVoice,
	}
}
