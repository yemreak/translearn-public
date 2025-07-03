"use client"

import { Button } from "@/components/ui/button"
import { useAccountDeletion } from "@/hooks/use-account-deletion"
import { ClockIcon } from "@heroicons/react/24/outline"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"
import { useEffect, useState } from "react"

export default function AccountDeletionStatus() {
	const [deletionRequest, setDeletionRequest] = useState<{
		id: string
		scheduledDeletionDate: string
	} | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const { cancelDeletion, isLoading: isCancelling } = useAccountDeletion()

	useEffect(() => {
		const fetchDeletionStatus = async () => {
			try {
				const response = await fetch("/api/user/deletion-status")
				if (!response.ok) {
					throw new Error("Silme durumu alınamadı")
				}
				const data = await response.json()
				setDeletionRequest(data.deletionRequest)
			} catch (error) {
				console.error("Silme durumu alınamadı:", error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchDeletionStatus()
	}, [])

	if (isLoading) {
		return (
			<div className="p-4 text-center text-white/70">Yükleniyor...</div>
		)
	}

	if (!deletionRequest) {
		return null
	}

	const scheduledDate = new Date(deletionRequest.scheduledDeletionDate)
	const timeRemaining = formatDistanceToNow(scheduledDate, {
		addSuffix: true,
		locale: tr,
	})

	const handleCancelDeletion = async () => {
		try {
			await cancelDeletion()
			setDeletionRequest(null)
		} catch (error) {
			console.error("İptal hatası:", error)
		}
	}

	return (
		<div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
			<div className="flex items-start gap-3">
				<ClockIcon className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
				<div className="flex-1">
					<h3 className="font-medium text-white">
						Hesap Silme İsteği Aktif
					</h3>
					<p className="text-sm text-white/70 mt-1">
						Hesabınız{" "}
						<strong className="text-red-400">{timeRemaining}</strong>{" "}
						silinecektir. Bu işlem geri alınamaz ve tüm verileriniz kalıcı
						olarak silinecektir.
					</p>
					<div className="mt-3">
						<Button
							variant="outline"
							size="sm"
							className="bg-white/5 hover:bg-white/10 border-white/10 text-white"
							onClick={handleCancelDeletion}
							disabled={isCancelling}>
							{isCancelling
								? "İptal Ediliyor..."
								: "Silme İsteğini İptal Et"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
