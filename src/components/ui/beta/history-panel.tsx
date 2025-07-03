import { t } from "@/app/lib/language"
import { cn } from "@/app/lib/utils"
import { SupportedLanguageCode } from "@/app/types/common"
import { HistoryIcon, ShareIcon } from "@/components/icons"
import { Tables } from "@/types/supabase"
import {
	ArrowDownOnSquareIcon,
	ChatBubbleBottomCenterTextIcon,
	ClockIcon,
	LanguageIcon,
	MagnifyingGlassIcon,
	PauseIcon,
	PlayIcon,
	SpeakerWaveIcon,
	TrashIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline"
import { motion } from "framer-motion"
import React, { useEffect, useRef, useState } from "react"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"
import { ShareSheet } from "./share-sheet"

// Format time like nature's cycles (minute:second)
const formatTime = (seconds: number) => {
	const mins = Math.floor(seconds / 60)
	const secs = Math.floor(seconds % 60)
	return `${mins}:${secs.toString().padStart(2, "0")}`
}

/**
 * @reason Format dates in a consistent, user-friendly way across the app with language support
 */
const formatDate = (
	dateString: string,
	language: SupportedLanguageCode = "en"
) => {
	try {
		const date = new Date(dateString)
		if (isNaN(date.getTime())) return t("time.invalid", language)

		const now = new Date()
		const diff = now.getTime() - date.getTime()
		const minutes = Math.floor(diff / 1000 / 60)

		// Show time for today's items
		if (minutes < 60) {
			const formattedTime = date.toLocaleTimeString(
				language === "tr" ? "tr-TR" : "en-US",
				{
					hour: "numeric",
					minute: "2-digit",
					hour12: false,
				}
			)
			return formattedTime
		}

		// Show date and time for all other items
		return date.toLocaleString(
			language === "tr" ? "tr-TR" : "en-US",
			{
				month: "short",
				day: "numeric",
				hour: "numeric",
				minute: "2-digit",
				hour12: false,
			}
		)
	} catch (error) {
		console.error("Date formatting error:", error)
		return t("time.invalid", language)
	}
}

// Highlight matching text
const HighlightText = ({
	text,
	searchQuery,
}: {
	text: string
	searchQuery: string
}) => {
	if (!searchQuery) return <>{text}</>

	const parts = []
	let lastIndex = 0
	const query = searchQuery.toLowerCase()
	const textLower = text.toLowerCase()

	// Find all matches
	let currentIndex = 0
	while (true) {
		const index = textLower.indexOf(query, currentIndex)
		if (index === -1) break

		// Add non-matching text before this match
		if (index > lastIndex) {
			parts.push(
				<span key={`text-${lastIndex}`} className="text-white/70">
					{text.slice(lastIndex, index)}
				</span>
			)
		}

		// Add matching text
		parts.push(
			<span
				key={`match-${index}`}
				className="text-white bg-white/20 rounded px-0.5">
				{text.slice(index, index + query.length)}
			</span>
		)

		lastIndex = index + query.length
		currentIndex = lastIndex
	}

	// Add remaining text
	if (lastIndex < text.length) {
		parts.push(
			<span key="text-end" className="text-white/70">
				{text.slice(lastIndex)}
			</span>
		)
	}

	return <>{parts}</>
}

/**
 * @reason Search sheet component for focused search experience
 */
const SearchSheet = ({
	isOpen,
	onClose,
	items,
	onRestore,
	language,
}: {
	isOpen: boolean
	onClose: () => void
	items: Tables<'user_histories'>[]
	onRestore: (item: Tables<'user_histories'>) => void
	language: SupportedLanguageCode
}) => {
	const [searchQuery, setSearchQuery] = useState("")
	const searchRef = useRef<HTMLInputElement>(null)

	// Filter items based on search
	const filteredItems = items.filter(item => {
		if (!searchQuery) return true

		const query = searchQuery.toLowerCase()
		const hasMatchInTranscription = item.transcription
			?.toLowerCase()
			.includes(query)
		const hasMatchInTranscreation = item.transcreation
			?.toLowerCase()
			.includes(query)
		const hasMatchInTransliteration = item.transliteration
			?.toLowerCase()
			.includes(query)

		return (
			hasMatchInTranscription ||
			hasMatchInTranscreation ||
			hasMatchInTransliteration
		)
	})

	// Auto focus search input when sheet opens
	useEffect(() => {
		if (isOpen) {
			// RAF for smooth animation and reliable focus
			requestAnimationFrame(() => {
				searchRef.current?.focus()
			})
		}
	}, [isOpen])

	// Clear search when sheet closes
	useEffect(() => {
		if (!isOpen) {
			setSearchQuery("")
		}
	}, [isOpen])

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 flex items-start justify-center">
			<div
				className="fixed inset-0 bg-black/80 backdrop-blur-sm"
				onClick={onClose}
			/>
			<div className="relative w-full max-w-lg mt-20 mx-auto p-4 space-y-4">
				{/* Search Input */}
				<div className="relative">
					<div className="absolute left-3 top-1/2 -translate-y-1/2">
						<MagnifyingGlassIcon className="w-4 h-4 text-white/30" />
					</div>
					<input
						ref={searchRef}
						type="search"
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
						placeholder={t("history.search", language)}
						autoFocus
						enterKeyHint="search"
						inputMode="search"
						className="w-full pl-10 pr-10 py-3 bg-white/10 rounded-lg text-sm text-white/70 placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
					/>
					{searchQuery && (
						<button
							onClick={() => setSearchQuery("")}
							className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 active:bg-white/5">
							<XMarkIcon className="w-3.5 h-3.5 text-white/30" />
						</button>
					)}
				</div>

				{/* Results */}
				<div className="space-y-2 max-h-[60vh] overflow-y-auto">
					{filteredItems.map(item => (
						<motion.div
							key={item.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							className="w-full p-4 rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/5 transition-colors cursor-pointer"
							onClick={() => {
								onRestore(item)
								onClose()
							}}>
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm text-white/70">
									{new Date(item.created_at!).toLocaleTimeString()}
								</span>
								<span className="text-xs text-white/50 uppercase">
									{item.source_language}
								</span>
							</div>
							{item.transcription && (
								<div className="mb-2">
									<div className="text-xs text-white/50 mb-1">
										{t("history.original", language)}
									</div>
									<div className="text-sm">
										<HighlightText
											text={item.transcription}
											searchQuery={searchQuery}
										/>
									</div>
								</div>
							)}
							{item.transcreation && (
								<div>
									<div className="text-xs text-white/50 mb-1">
										{t("history.translation", language)}
									</div>
									<div className="text-sm">
										<HighlightText
											text={item.transcreation}
											searchQuery={searchQuery}
										/>
									</div>
								</div>
							)}
						</motion.div>
					))}
					{filteredItems.length === 0 && (
						<div className="text-center py-8 text-white/50">
							{t("noResults", language)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

interface HistoryPanelProps {
	items: Tables<'user_histories'>[]
	onRestore: (item: Tables<'user_histories'>) => void
	isPanelVisible: boolean
	onPanelVisibilityChange: (visible: boolean) => void
	language: SupportedLanguageCode
	onDelete: (id: string) => void
	onLoadMore: () => void
	isLoading: boolean
}

/**
 * @reason History panel component that shows previous recordings in a collapsible stack
 */
export function HistoryPanel({
	items,
	onRestore,
	isPanelVisible,
	onPanelVisibilityChange,
	language,
	onDelete,
	onLoadMore,
	isLoading,
}: HistoryPanelProps) {
	const [expandedId, setExpandedId] = useState<string | null>(() => {
		if (typeof window !== "undefined") {
			return localStorage.getItem("transpeech_last_expanded")
		}
		return null
	})
	const [isSearchOpen, setIsSearchOpen] = useState(false)
	const [isShareSheetOpen, setIsShareSheetOpen] = useState(false)
	const [selectedItem, setSelectedItem] =
		useState<Tables<'user_histories'> | null>(null)
	const [playingId, setPlayingId] = useState<string | null>(null)
	const [isSelectionMode, setIsSelectionMode] = useState(false)
	const [selectedIds, setSelectedIds] = useState<Set<string>>(
		new Set()
	)

	// Delete confirmation states
	const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
		useState(false)
	const [itemToDelete, setItemToDelete] = useState<string | null>(
		null
	)
	const [itemsToDelete, setItemsToDelete] = useState<Tables<'user_histories'>[]>(
		[]
	)

	// Handle selection mode
	const toggleSelection = (id: string) => {
		setSelectedIds(prev => {
			const next = new Set(prev)
			if (next.has(id)) {
				next.delete(id)
			} else {
				next.add(id)
			}
			return next
		})
	}

	const handleDeleteSelected = () => {
		// Get all selected items
		const selectedItems = items.filter(item =>
			selectedIds.has(item.id)
		)
		setItemsToDelete(selectedItems)
		setIsDeleteConfirmOpen(true)
	}

	const confirmDeleteSelected = async () => {
		// Delete all selected items
		for (const item of itemsToDelete) {
			onDelete(item.id)
		}

		// Reset selection mode and close dialog
		setSelectedIds(new Set())
		setIsSelectionMode(false)
		setIsDeleteConfirmOpen(false)
		setItemsToDelete([])
	}

	// Save expanded state
	useEffect(() => {
		if (expandedId) {
			localStorage.setItem("transpeech_last_expanded", expandedId)
		} else {
			localStorage.removeItem("transpeech_last_expanded")
		}
	}, [expandedId])

	// Audio ref for history items
	const audioRef = useRef<HTMLAudioElement | null>(null)

	// Cleanup audio on unmount
	useEffect(() => {
		return () => {
			if (audioRef.current) {
				audioRef.current.pause()
				audioRef.current.src = ""
				audioRef.current = null
			}
		}
	}, [])

	// Handle audio end
	const handleAudioEnd = () => {
		setPlayingId(null)
	}

	// Play audio from history item
	const handleAudioPlay = (
		item: Tables<'user_histories'>,
		e: React.MouseEvent
	) => {
		e.stopPropagation()

		if (playingId === item.id && audioRef.current) {
			audioRef.current.pause()
			setPlayingId(null)
			return
		}

		if (!item.tts_audio_base64) return

		if (audioRef.current) {
			audioRef.current.pause()
		}

		audioRef.current = new Audio(
			`data:audio/mpeg;base64,${item.tts_audio_base64}`
		)
		audioRef.current.addEventListener("ended", handleAudioEnd)
		audioRef.current.play()
		setPlayingId(item.id)
	}

	const handleDeleteItem = (
		item: Tables<'user_histories'>,
		e: React.MouseEvent
	) => {
		e.stopPropagation()
		setItemToDelete(item.id)
		setItemsToDelete([item])
		setIsDeleteConfirmOpen(true)
	}

	const confirmDeleteItem = async () => {
		if (itemToDelete) {
			onDelete(itemToDelete)
		}

		// Reset state
		setItemToDelete(null)
		setItemsToDelete([])
		setIsDeleteConfirmOpen(false)
	}

	if (items.length === 0) return null

	const hasMore = 5 < items.length

	const handleShare = (item: Tables<'user_histories'>, e: React.MouseEvent) => {
		e.stopPropagation() // Prevent item selection/restore
		setSelectedItem(item)
		setIsShareSheetOpen(true)
	}

	return (
		<div className="space-y-2 animate-in fade-in slide-in-from-bottom duration-700">
			<div className="flex items-center justify-between px-2">
				<div className="flex items-center gap-2">
					<h3 className="text-sm font-medium text-white/70">
						{t("history.title", language)}
					</h3>
					{isSelectionMode && (
						<span className="text-xs text-white/50">
							{selectedIds.size} {t("history.selected", language)}
						</span>
					)}
				</div>
				<div className="flex items-center gap-2">
					{isSelectionMode ? (
						<>
							<button
								onClick={() => {
									setIsSelectionMode(false)
									setSelectedIds(new Set())
								}}
								className="text-xs text-white/50 hover:text-white/70 transition-colors">
								{t("history.cancelSelection", language)}
							</button>
							<button
								onClick={handleDeleteSelected}
								disabled={selectedIds.size === 0}
								className={cn(
									"text-xs transition-colors",
									selectedIds.size === 0
										? "text-red-500/50 cursor-not-allowed"
										: "text-red-500 hover:text-red-400"
								)}>
								{t("history.deleteSelected", language)}
							</button>
						</>
					) : (
						<>
							<span className="text-xs text-white/50">
								{items.length} {t("history.items", language)}
							</span>
							<button
								onClick={() => setIsSearchOpen(true)}
								className="p-1 rounded-lg hover:bg-white/10 active:bg-white/5">
								<MagnifyingGlassIcon className="w-3.5 h-3.5 text-white/50" />
							</button>
							{isPanelVisible && (
								<button
									onClick={() => setIsSelectionMode(true)}
									className="text-xs text-white/50 hover:text-white/70 transition-colors">
									{t("history.select", language)}
								</button>
							)}
							<button
								onClick={() =>
									onPanelVisibilityChange(!isPanelVisible)
								}
								className="text-xs text-white/50 hover:text-white/70 transition-colors">
								{isPanelVisible
									? t("history.hide", language)
									: t("history.show", language)}
							</button>
						</>
					)}
				</div>
			</div>

			{isPanelVisible && (
				<motion.div
					initial={{ height: 0, opacity: 0 }}
					animate={{ height: "auto", opacity: 1 }}
					exit={{ height: 0, opacity: 0 }}
					transition={{ duration: 0.3 }}
					className="space-y-2">
					<div className="space-y-2">
						{items.map(item => (
							<motion.div
								key={item.id}
								initial={false}
								animate={{
									height: expandedId === item.id ? "auto" : "48px",
								}}
								className="overflow-hidden">
								<div className="w-full">
									<div
										onClick={() => {
											if (isSelectionMode) {
												toggleSelection(item.id)
											} else {
												setExpandedId(
													expandedId === item.id ? null : item.id
												)
											}
										}}
										className={cn(
											"w-full p-3 rounded-lg transition-all duration-300",
											isSelectionMode
												? selectedIds.has(item.id)
													? "bg-white/20"
													: "bg-white/5 hover:bg-white/10 active:bg-white/5"
												: "bg-white/5 hover:bg-white/10 active:bg-white/5",
											"cursor-pointer"
										)}>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												{isSelectionMode && (
													<div
														className={cn(
															"w-4 h-4 rounded border transition-all duration-300",
															selectedIds.has(item.id)
																? "bg-white border-white"
																: "border-white/30"
														)}
													/>
												)}
												<span className="text-sm text-white/70">
													{formatDate(item.created_at!, language)}
												</span>
												{item.duration != null &&
												item.duration > 0 ? (
													<div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5">
														<ClockIcon className="w-3 h-3 text-white/50" />
														<span className="text-xs font-medium text-white/50">
															{formatTime(item.duration)}
														</span>
													</div>
												) : (
													<div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5">
														<ChatBubbleBottomCenterTextIcon className="w-3 h-3 text-white/50" />
														<span className="text-xs font-medium text-white/50">
															{t("history.text", language)}
														</span>
													</div>
												)}
											</div>
											<div className="flex items-center gap-2">
												{item.transliteration && (
													<div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5">
														<LanguageIcon className="w-3 h-3 text-white/50" />
													</div>
												)}
												{item.tts_audio_base64 && (
													<div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5">
														<SpeakerWaveIcon className="w-3 h-3 text-white/50" />
													</div>
												)}
												<span className="text-xs text-white/50 uppercase">
													{item.source_language}
												</span>
											</div>
										</div>
										{expandedId === item.id && (
											<div className="mt-3 space-y-3 text-left">
												{item.transcription && (
													<div>
														<div className="text-xs text-white/50 mb-1">
															{t("history.original", language)}
														</div>
														<div className="text-sm">
															{item.transcription}
														</div>
													</div>
												)}
												{item.transcreation && (
													<div>
														<div className="text-xs text-white/50 mb-1">
															{t("history.translation", language)}
														</div>
														<div className="text-sm">
															{item.transcreation}
														</div>
													</div>
												)}
												{item.transliteration && (
													<div>
														<div className="text-xs text-white/50 mb-1">
															{t("history.pronunciation", language)}
														</div>
														<div className="text-sm">
															{item.transliteration}
														</div>
													</div>
												)}
												<div className="flex justify-end gap-2">
													<motion.button
														onClick={e => handleDeleteItem(item, e)}
														whileTap={{ scale: 0.95 }}
														className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 active:bg-red-500/10"
														title={t("delete", language)}>
														<TrashIcon className="w-4 h-4 text-red-500" />
													</motion.button>
													<div className="flex-1" />
													<motion.button
														onClick={e => {
															e.stopPropagation()
															onRestore(item)
														}}
														whileTap={{ scale: 0.95 }}
														whileHover={{ y: -2 }}
														className="p-2 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/10"
														title={t("loadToPlayground", language)}>
														<ArrowDownOnSquareIcon className="w-4 h-4 text-white/70" />
													</motion.button>
													<motion.button
														onClick={e => handleShare(item, e)}
														whileTap={{ scale: 0.95 }}
														whileHover={{ rotate: 15 }}
														className="p-2 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 active:bg-orange-500/10"
														title={t("share", language)}>
														<ShareIcon className="w-4 h-4 text-orange-500" />
													</motion.button>
													{item.tts_audio_base64 && (
														<motion.button
															onClick={e => handleAudioPlay(item, e)}
															whileTap={{ scale: 0.95 }}
															animate={
																playingId === item.id
																	? { scale: [1, 1.1, 1] }
																	: {}
															}
															transition={{
																repeat: Infinity,
																duration: 1,
															}}
															className="p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 active:bg-purple-500/10">
															{playingId === item.id ? (
																<PauseIcon className="w-4 h-4 text-purple-500" />
															) : (
																<PlayIcon className="w-4 h-4 text-purple-500" />
															)}
														</motion.button>
													)}
												</div>
											</div>
										)}
									</div>
								</div>
							</motion.div>
						))}
						{hasMore && (
							<motion.button
								onClick={onLoadMore}
								disabled={isLoading}
								whileHover={{ scale: isLoading ? 1 : 1.02 }}
								whileTap={{ scale: isLoading ? 1 : 0.98 }}
								className={cn(
									"w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/5 transition-all duration-300",
									isLoading && "opacity-50 cursor-not-allowed"
								)}>
								<div className="flex items-center justify-center gap-2">
									<HistoryIcon
										className={cn(
											"w-4 h-4 text-white/50",
											isLoading && "animate-spin"
										)}
									/>
									<span className="text-sm text-white/50">
										{isLoading
											? "Yükleniyor..."
											: `${items.length} ${t(
													"history.remaining",
													language
											  )}`}
									</span>
								</div>
							</motion.button>
						)}
					</div>
				</motion.div>
			)}

			<SearchSheet
				isOpen={isSearchOpen}
				onClose={() => setIsSearchOpen(false)}
				items={items}
				onRestore={onRestore}
				language={language}
			/>

			<ShareSheet
				isOpen={isShareSheetOpen}
				onClose={() => {
					setIsShareSheetOpen(false)
					setSelectedItem(null)
				}}
				content={{
					original: selectedItem?.transcription,
					translation: selectedItem?.transcreation || "",
					transliteration: selectedItem?.transliteration || "",
					audio_base64: selectedItem?.tts_audio_base64 || "",
				}}
			/>

			<DeleteConfirmationDialog
				isOpen={isDeleteConfirmOpen}
				onClose={() => {
					setIsDeleteConfirmOpen(false)
					setItemToDelete(null)
					setItemsToDelete([])
				}}
				onConfirm={
					itemToDelete ? confirmDeleteItem : confirmDeleteSelected
				}
				selectedItems={itemsToDelete}
				language={language}
			/>
		</div>
	)
}
