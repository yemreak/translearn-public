import { useAuthStore } from "@/app/store/auth"
import { Tables } from "@/types/supabase"
import {
	useInfiniteQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query"
import { toast } from "sonner"

const PAGE_SIZE = 25

export function useHistory() {
	const user = useAuthStore(state => state.user)
	const queryClient = useQueryClient()

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useInfiniteQuery({
			queryKey: ["history", user?.id],
			queryFn: async ({ pageParam = 0 }) => {
				if (!user) return []

				const response = await fetch("/api/history", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				})

				if (!response.ok) throw new Error("Failed to fetch history")
				const allData =
					(await response.json()) as Tables<"user_histories">[]

				// Handle pagination client-side
				const from = pageParam * PAGE_SIZE
				const to = from + PAGE_SIZE
				return allData.slice(from, to)
			},
			getNextPageParam: (lastPage, allPages) => {
				if (!lastPage || lastPage.length < PAGE_SIZE) return undefined
				return allPages.length
			},
			enabled: !!user,
			initialPageParam: 0,
			staleTime: Infinity, // Never mark as stale
			gcTime: Infinity, // Never remove from cache
		})

	const addMutation = useMutation({
		mutationFn: async (
			item: Omit<
				Tables<"user_histories">,
				"id" | "user_id" | "created_at" | "updated_at"
			>
		) => {
			if (!user) throw new Error("User not found")

			const response = await fetch("/api/history", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(item),
			})

			if (!response.ok) throw new Error("Failed to add history")
			return (await response.json()) as Tables<"user_histories">
		},
		onSuccess: newItem => {
			// Manually update the cache
			queryClient.setQueryData<{
				pages: Tables<"user_histories">[][]
			}>(["history", user?.id], old => {
				if (!old) return { pages: [[newItem]] }
				return {
					...old,
					pages: [[newItem, ...old.pages[0]], ...old.pages.slice(1)],
				}
			})
		},
		onError: () => {
			toast.error("Failed to add history")
		},
	})

	const updateMutation = useMutation({
		mutationFn: async (
			data: Partial<Tables<"user_histories">> & { id: string }
		) => {
			if (!user) throw new Error("User not found")

			const response = await fetch("/api/history", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})

			if (!response.ok) throw new Error("Failed to update history")
			return (await response.json()) as Tables<"user_histories">
		},
		onSuccess: updatedItem => {
			// Manually update the cache
			queryClient.setQueryData<{
				pages: Tables<"user_histories">[][]
			}>(["history", user?.id], old => {
				if (!old) return { pages: [] }
				return {
					...old,
					pages: old.pages.map(page =>
						page.map(item =>
							item.id === updatedItem.id ? updatedItem : item
						)
					),
				}
			})
		},
		onError: () => {
			toast.error("Failed to update history")
		},
	})

	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			if (!user) throw new Error("User not found")

			const response = await fetch("/api/history", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id }),
			})

			if (!response.ok) throw new Error("Failed to delete history")
		},
		onSuccess: (_, id) => {
			// Manually update the cache
			queryClient.setQueryData<{
				pages: Tables<"user_histories">[][]
			}>(["history", user?.id], old => {
				if (!old) return { pages: [] }
				return {
					...old,
					pages: old.pages.map(page =>
						page.filter(item => item.id !== id)
					),
				}
			})
		},
		onError: () => {
			toast.error("Failed to delete history")
		},
	})

	const clearMutation = useMutation({
		mutationFn: async () => {
			if (!user) throw new Error("User not found")

			// For clear all, we'll need to fetch all IDs first then delete them
			const response = await fetch("/api/history", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			})

			if (!response.ok)
				throw new Error("Failed to fetch history for clearing")
			const allData =
				(await response.json()) as Tables<"user_histories">[]

			// Delete each item individually
			await Promise.all(
				allData.map(async item => {
					const deleteResponse = await fetch("/api/history", {
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ id: item.id }),
					})
					if (!deleteResponse.ok)
						throw new Error(
							`Failed to delete history item ${item.id}`
						)
				})
			)
		},
		onSuccess: () => {
			// Manually update the cache
			queryClient.setQueryData(["history", user?.id], {
				pages: [],
			})
		},
		onError: () => {
			toast.error("Failed to clear history")
		},
	})

	return {
		items: (data?.pages.flat() ?? []) as Tables<"user_histories">[],
		hasMore: hasNextPage,
		isLoading: isFetchingNextPage,
		add: addMutation.mutateAsync,
		update: updateMutation.mutateAsync,
		delete: deleteMutation.mutateAsync,
		clear: clearMutation.mutateAsync,
		fetch: fetchNextPage,
	}
}
