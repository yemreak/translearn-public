"use client"

import { useAuth } from "@/hooks/auth"
import { useAccountDeletion } from "@/hooks/use-account-deletion"
import {
	ArrowRightOnRectangleIcon,
	ClockIcon,
	TrashIcon,
} from "@heroicons/react/24/outline"
import { addDays, format } from "date-fns"
import { tr } from "date-fns/locale"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Drawer } from "vaul"

export function DeleteAccountButton() {
	const { requestDeletion, isLoading } = useAccountDeletion()
	const { signOut } = useAuth()
	const [isOpen, setIsOpen] = useState(false)
	const [confirmText, setConfirmText] = useState("")
	const [showSuccess, setShowSuccess] = useState(false)
	const [deletionDate, setDeletionDate] = useState<Date | null>(null)
	const [hasDeletionRequest, setHasDeletionRequest] = useState(false)

	// Hesap silme isteği var mı kontrol et
	useEffect(() => {
		const checkDeletionStatus = async () => {
			try {
				const response = await fetch("/api/user/deletion-status")
				if (!response.ok) return

				const data = await response.json()
				if (data.deletionRequest) {
					setHasDeletionRequest(true)
				}
			} catch (error) {
				console.error("Silme durumu kontrol edilemedi:", error)
			}
		}

		checkDeletionStatus()
	}, [])

	// Eğer zaten silme isteği varsa butonu gösterme
	if (hasDeletionRequest) {
		return null
	}

	const handleDeleteAccount = async () => {
		if (confirmText !== "DELETE") {
			toast.error("Please type DELETE to confirm")
			return
		}

		try {
			await requestDeletion()
			// Calculate deletion date (7 days from now)
			const deletionDate = addDays(new Date(), 7)
			setDeletionDate(deletionDate)
			setShowSuccess(true)
			setConfirmText("")
		} catch (error) {
			console.error("Silme hatası:", error)
		}
	}

	const handleLogout = async () => {
		await signOut()
	}

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className="w-full px-3 py-1.5 rounded-lg text-white/50 hover:text-red-400 text-sm transition-colors flex items-center justify-center gap-2 opacity-60 hover:opacity-100">
				<TrashIcon className="w-4 h-4" />
				<span>Hesabımı Sil</span>
			</button>

			<Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
				<Drawer.Portal>
					<Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
					<Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-b from-gray-900 to-black">
						<div className="container max-w-md mx-auto px-4 pb-8 pt-4 space-y-6">
							{!showSuccess ? (
								<>
									<Drawer.Title className="text-xl font-bold text-red-400">
										Hesabını Silmek İstediğine Emin Misin?
									</Drawer.Title>

									<div className="space-y-4">
										<p className="text-white/80">
											Bu işlem hesabınızı ve tüm verilerinizi kalıcı olarak
											silecektir.
										</p>

										<div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
											<p className="text-sm text-red-400">
												Bu işlem geri alınamaz ve tüm verileriniz 7 gün
												sonra silinecektir.
											</p>
										</div>

										<div className="space-y-2">
											<label className="text-sm text-white/70">
												Silme işlemini onaylamak için &apos;DELETE&apos;
												yazın
											</label>
											<input
												type="text"
												value={confirmText}
												onChange={e => setConfirmText(e.target.value)}
												placeholder="DELETE"
												className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white"
											/>
										</div>

										<div className="flex gap-3 pt-4">
											<button
												onClick={() => setIsOpen(false)}
												className="flex-1 py-2 rounded-lg bg-white/10 text-white/80">
												İptal
											</button>

											<motion.button
												onClick={handleDeleteAccount}
												disabled={isLoading || confirmText !== "DELETE"}
												whileTap={{ scale: 0.98 }}
												className={`
                                            flex-1 py-2 rounded-lg flex items-center justify-center gap-2
                                            ${
																							confirmText === "DELETE"
																								? "bg-red-500 text-white"
																								: "bg-red-500/30 text-white/50"
																						}
                                        `}>
												<TrashIcon className="w-4 h-4" />
												{isLoading ? "İşleniyor..." : "Hesabımı Sil"}
											</motion.button>
										</div>
									</div>
								</>
							) : (
								<>
									<Drawer.Title className="text-xl font-bold text-white">
										Hesap Silme İsteği Oluşturuldu
									</Drawer.Title>

									<div className="space-y-4">
										<div className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-lg">
											<ClockIcon className="w-5 h-5 text-white/70 flex-shrink-0 mt-0.5" />
											<div>
												<p className="text-white/90">
													Hesabınız{" "}
													<strong className="text-red-400">
														{deletionDate &&
															format(deletionDate, "d MMMM yyyy", {
																locale: tr,
															})}
													</strong>{" "}
													tarihinde silinecektir.
												</p>
												<p className="text-sm text-white/70 mt-1">
													Bu süre içinde hesabınıza giriş yapabilir ve silme
													işlemini iptal edebilirsiniz.
												</p>
											</div>
										</div>

										<div className="flex gap-3 pt-4">
											<button
												onClick={() => setIsOpen(false)}
												className="flex-1 py-2 rounded-lg bg-white/10 text-white/80">
												Kapat
											</button>

											<motion.button
												onClick={handleLogout}
												whileTap={{ scale: 0.98 }}
												className="flex-1 py-2 rounded-lg bg-white/20 text-white flex items-center justify-center gap-2 hover:bg-white/30 transition-colors">
												<ArrowRightOnRectangleIcon className="w-4 h-4" />
												Çıkış Yap
											</motion.button>
										</div>
									</div>
								</>
							)}
						</div>
					</Drawer.Content>
				</Drawer.Portal>
			</Drawer.Root>
		</>
	)
}
