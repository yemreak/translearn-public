"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export function useAccountDeletion() {
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	const requestDeletion = async () => {
		setIsLoading(true)
		try {
			const response = await fetch("/api/user/delete-request", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || "Hesap silme isteği oluşturulamadı")
			}

			toast.success(
				"Hesap silme isteği oluşturuldu. Hesabınız 7 gün içinde silinecektir."
			)
			router.refresh()
			return data
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Hesap silme isteği oluşturulamadı"
			)
			throw error
		} finally {
			setIsLoading(false)
		}
	}

	const cancelDeletion = async () => {
		setIsLoading(true)
		try {
			const response = await fetch("/api/user/cancel-deletion", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || "Hesap silme isteği iptal edilemedi")
			}

			toast.success("Hesap silme isteği iptal edildi.")
			router.refresh()
			return data
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Hesap silme isteği iptal edilemedi"
			)
			throw error
		} finally {
			setIsLoading(false)
		}
	}

	return {
		isLoading,
		requestDeletion,
		cancelDeletion,
	}
}
