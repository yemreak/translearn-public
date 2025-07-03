import { SidebarIcon } from "@/components/icons"

import { t } from "@/app/lib/language"
import { cn } from "@/app/lib/utils"
import { useUiStore } from "@/app/store/ui"
import AccountDeletionStatus from "@/components/account-deletion-status"
import { DeleteAccountButton } from "@/components/ui/delete-account-button"
import { useAuth } from "@/hooks/auth"
import {
	ChevronUpIcon,
	HomeIcon,
} from "@heroicons/react/24/outline"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { LanguageSettings } from "./LanguageSettings"
import { ApiKeySection } from "./ApiKeySection"

type SidebarProps = {
	isOpen: boolean
	onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
	const auth = useAuth()
	const lang = "tr" as const
	const [isUserExpanded, setIsUserExpanded] = useState(false)
	const pathname = usePathname()
	const { currentLanguage } = useUiStore()

	if (!auth.user) return null

	const navigationItems = [
		{
			name: t("sidebar.navigation.home", currentLanguage),
			href: "/",
			icon: HomeIcon,
		},
	]

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
					/>

					{/* Sidebar */}
					<motion.div
						initial={{ x: "-100%" }}
						animate={{ x: 0 }}
						exit={{ x: "-100%" }}
						transition={{ type: "spring", damping: 25, bounce: 0 }}
						className="fixed inset-y-0 left-0 w-80 bg-black isolate z-50 h-[100dvh] overflow-hidden">
						{/* Content */}
						<div className="relative h-full flex flex-col">
							{/* iOS Safe Area */}
							<div className="h-safe-top bg-black/80" />

							{/* Header */}
							<div className="h-[60px] flex items-center px-4 border-b border-white/10">
								<button
									onClick={onClose}
									className="p-2 rounded-lg hover:bg-white/10 transition-colors">
									<SidebarIcon className="w-6 h-6 text-white/70" />
								</button>
								<h2 className="flex-1 text-lg font-medium text-center">
									{t("sidebar.title", lang)}
								</h2>
								<div className="w-10" />
							</div>

							{/* Main Content Area */}
							<div className="flex-1 p-4 pt-8 space-y-6">
								<nav className="flex flex-col gap-1 p-2">
									{navigationItems.map(item => {
										const isActive = pathname === item.href

										return (
											<Link
												key={item.href}
												href={item.href}
												className={cn(
													"flex items-center gap-3 px-3 py-2 rounded-lg",
													"text-sm font-medium",
													isActive
														? "bg-white/10 text-white"
														: "text-white/70 hover:text-white hover:bg-white/5"
												)}>
												<item.icon className="w-5 h-5" />
												<span>{item.name}</span>

												{isActive && (
													<motion.div
														layoutId="active-nav"
														className="absolute left-0 w-1 h-8 bg-purple-500 rounded-r-full"
													/>
												)}
											</Link>
										)
									})}
								</nav>

								{/* Language Settings */}
								<div className="mt-6">
									<LanguageSettings lang={currentLanguage} />
								</div>

								{/* API Key Configuration */}
								<ApiKeySection />
							</div>

							{/* User Card - Bottom Fixed */}
							<div className="relative mt-auto pt-4 pb-4">
								{/* Expanded User Panel */}
								<AnimatePresence>
									{isUserExpanded && (
										<motion.div
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											className="overflow-hidden border-t border-white/10">
											<div className="p-4 space-y-3 bg-white/5">
												{/* Account Deletion Status */}
												<AccountDeletionStatus />

												{/* Sign Out Button */}
												<button
													onClick={auth.signOut}
													className="w-full px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 text-sm transition-colors flex items-center justify-center gap-2">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="16"
														height="16"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
														className="text-white/70">
														<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
														<polyline points="16 17 21 12 16 7" />
														<line x1="21" y1="12" x2="9" y2="12" />
													</svg>
													{t("sidebar.signOut", lang)}
												</button>

												{/* Delete Account Button */}
												<DeleteAccountButton />
											</div>
										</motion.div>
									)}
								</AnimatePresence>

								{/* User Card Button */}
								<button
									onClick={() => setIsUserExpanded(!isUserExpanded)}
									className="w-full p-4 flex items-center gap-4 hover:bg-white/5 transition-colors border-t border-white/10">
									<div className="flex items-center gap-4 flex-1">
										{auth.user.user_metadata?.avatar_url && (
											<div className="relative w-10 h-10">
												<Image
													src={auth.user.user_metadata.avatar_url}
													alt=""
													fill
													className="rounded-full object-cover"
												/>
											</div>
										)}
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-white/90 truncate">
												{auth.user.user_metadata?.full_name ||
													t("settings.user.anonymous", lang)}
											</p>
											<p className="text-sm text-white/50 truncate">
												{auth.user.email}
											</p>
										</div>
									</div>
									<ChevronUpIcon
										className={`w-5 h-5 text-white/70 transition-transform duration-200 ${
											isUserExpanded ? "rotate-0" : "rotate-180"
										}`}
									/>
								</button>
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	)
}
