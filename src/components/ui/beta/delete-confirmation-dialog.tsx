import { t } from "@/app/lib/language"
import { SupportedLanguageCode } from "@/app/types/common"
import { Tables } from "@/types/supabase"
import {
	ExclamationTriangleIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline"
import { motion } from "framer-motion"
import { useEffect } from "react"

type DeleteConfirmationDialogProps = {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	selectedItems: Tables<'user_histories'>[]
	language: SupportedLanguageCode
}

export function DeleteConfirmationDialog({
	isOpen,
	onClose,
	onConfirm,
	selectedItems,
	language,
}: DeleteConfirmationDialogProps) {
	// Close on escape key
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose()
		}

		if (isOpen) {
			window.addEventListener("keydown", handleKeyDown)
		}

		return () => {
			window.removeEventListener("keydown", handleKeyDown)
		}
	}, [isOpen, onClose])

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="fixed inset-0 bg-black/80 backdrop-blur-sm"
				onClick={onClose}
			/>

			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.95 }}
				className="relative w-full max-w-md mx-auto p-6 rounded-xl bg-black/90 border border-red-500/30 shadow-xl">
				<div className="absolute top-4 right-4">
					<button
						onClick={onClose}
						className="p-1 rounded-full hover:bg-white/10 active:bg-white/5">
						<XMarkIcon className="w-5 h-5 text-white/70" />
					</button>
				</div>

				<div className="flex items-start gap-4 mb-6">
					<div className="p-2 rounded-full bg-red-500/20 flex-shrink-0">
						<ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
					</div>

					<div className="w-full overflow-hidden">
						<h3 className="text-lg font-medium text-white/90 mb-2">
							{t("history.confirmDelete", language)}
						</h3>
						<p className="text-sm text-white/70 mb-4">
							{t("history.deleteWarning", language)}
						</p>

						<div className="mb-4">
							<div className="text-sm font-medium text-white/70 mb-2">
								{selectedItems.length === 1
									? t("history.deletingOneItem", language)
									: t("history.deletingMultipleItems", language).replace(
											"{count}",
											selectedItems.length.toString()
									  )}
							</div>

							{selectedItems.length <= 5 && (
								<div className="max-h-32 overflow-y-auto space-y-2 bg-white/5 rounded-lg p-3">
									{selectedItems.map(item => (
										<div
											key={item.id}
											className="text-xs text-white/60 truncate w-full break-words">
											{item.transcription ||
												item.transcreation ||
												t("history.untitled", language)}
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="flex justify-end gap-3">
					<button
						onClick={onClose}
						className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/5 text-sm text-white/70">
						{t("cancel", language)}
					</button>

					<motion.button
						onClick={onConfirm}
						whileTap={{ scale: 0.95 }}
						className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 active:bg-red-500/10 text-sm text-red-500 font-medium">
						{t("delete", language)}
					</motion.button>
				</div>
			</motion.div>
		</div>
	)
}
