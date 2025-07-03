/**
 * TODO: Bunu parcalara bolup AI ile yeniden kurmak lazim, asiri karmasik oldu
 * - 2 konfeti patliyor
 */
import { cn } from "@/app/lib/utils"
import {
	ArrowPathIcon,
	DocumentTextIcon,
	LanguageIcon,
	PuzzlePieceIcon,
} from "@heroicons/react/24/outline"
import confetti from "canvas-confetti"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, Text } from "lucide-react"
import { useEffect, useState } from "react"

type SegmentItem = {
	text: string
	index: number
	type: "source" | "target" | "lit"
}

type MatchGroup = {
	source: number
	target: number
	lit: number
}

/**
 * @purpose Prepare game items by filtering duplicates and shuffling
 */
function prepareGameItems(segments: { in: string; out: string }[]): {
	sourceItems: SegmentItem[]
	targetItems: SegmentItem[]
} {
	// Create items with unique keys for duplicates
	const sourceItems = segments.map((seg, i) => ({
		text: seg.in,
		index: i,
		type: "source" as const,
	}))
	const targetItems = segments.map((seg, i) => ({
		text: seg.out,
		index: i,
		type: "target" as const,
	}))

	// Shuffle both arrays
	return {
		sourceItems: [...sourceItems],
		targetItems: [...targetItems].sort(() => Math.random() - 0.5),
	}
}

/**
 * @purpose Modern language matching game with Duolingo-inspired design
 */
export function LanguageMatchGame(props: {
	texts: { in: string; out: string; lit?: string }
	segments: { in: string; out: string; lit?: string }[]
	onComplete?: () => void
	onItemClick?: (item: {
		text: string
		index: number
		type: "source" | "target" | "lit"
	}) => void
}) {
	const [selectedItem, setSelectedItem] = useState<SegmentItem | null>(null)
	const [matchedGroups, setMatchedGroups] = useState<MatchGroup[]>([])
	const [sourceItems, setSourceItems] = useState<SegmentItem[]>([])
	const [targetItems, setTargetItems] = useState<SegmentItem[]>([])
	const [isTranslationsOpen, setIsTranslationsOpen] = useState(false)
	const [uniqueSegmentsLength, setUniqueSegmentsLength] = useState(0)

	// Get group number for an item
	const getGroupNumber = (index: number) => {
		const group = matchedGroups.findIndex(
			g => g.source === index || g.target === index || g.lit === index
		)
		return group !== -1 ? group + 1 : undefined
	}

	// Get group color based on group number
	const getGroupColor = (groupNumber?: number) => {
		if (!groupNumber) return ""
		const colors = [
			"bg-blue-500/20 ring-blue-500/50",
			"bg-pink-500/20 ring-pink-500/50",
			"bg-yellow-500/20 ring-yellow-500/50",
			"bg-indigo-500/20 ring-indigo-500/50",
			"bg-red-500/20 ring-red-500/50",
		]
		return colors[(groupNumber - 1) % colors.length]
	}

	const resetGame = () => {
		const { sourceItems: newSourceItems, targetItems: newTargetItems } =
			prepareGameItems(props.segments)
		setSourceItems(newSourceItems)
		setTargetItems(newTargetItems)
		setSelectedItem(null)
		setMatchedGroups([])
	}

	// Initialize game items
	useEffect(() => {
		const { sourceItems, targetItems } = prepareGameItems(props.segments)
		setSourceItems(sourceItems)
		setTargetItems(targetItems)
		setUniqueSegmentsLength(props.segments.length)
	}, [props.segments])

	// Handle item click
	const handleItemClick = async (item: SegmentItem) => {
		props.onItemClick?.(item)

		// Allow TTS playback for matched items
		const groupNumber = getGroupNumber(item.index)
		if (groupNumber !== undefined) {
			if (item.type === "lit" || item.type === "target") {
				const group = matchedGroups[groupNumber - 1]
				const targetText = targetItems.find(
					t => t.index === group.target
				)?.text
				if (targetText) {
					props.onItemClick?.({
						text: targetText,
						index: group.target,
						type: "target",
					})
				}
			}
			return
		}

		// Play TTS for transliteration clicks
		if (item.type === "lit") {
			const targetItem = targetItems.find(t => t.index === item.index)
			if (targetItem) {
				props.onItemClick?.({
					text: targetItem.text,
					index: targetItem.index,
					type: "target",
				})
				return
			}
		}

		if (!selectedItem) {
			setSelectedItem(item)
			return
		}

		// If clicking same item or same type, update selection
		if (selectedItem.type === item.type) {
			setSelectedItem(item)
			return
		}

		// Find existing partial match
		const existingGroupIndex = matchedGroups.findIndex(group => {
			const items = [group.source, group.target, group.lit]
			return (
				items.includes(selectedItem.index) || items.includes(item.index)
			)
		})

		if (existingGroupIndex !== -1) {
			// Add to existing group if indices match
			const group = matchedGroups[existingGroupIndex]
			if (selectedItem.index === item.index) {
				const updatedGroup = { ...group }
				if (selectedItem.type === "source")
					updatedGroup.source = selectedItem.index
				if (selectedItem.type === "target")
					updatedGroup.target = selectedItem.index
				if (selectedItem.type === "lit")
					updatedGroup.lit = selectedItem.index
				if (item.type === "source") updatedGroup.source = item.index
				if (item.type === "target") updatedGroup.target = item.index
				if (item.type === "lit") updatedGroup.lit = item.index

				const newGroups = [...matchedGroups]
				newGroups[existingGroupIndex] = updatedGroup

				// Check if group is complete
				if (
					updatedGroup.source !== -1 &&
					updatedGroup.target !== -1 &&
					updatedGroup.lit !== -1
				) {
					navigator.vibrate?.(100)

					// Check if game is complete
					if (matchedGroups.length === uniqueSegmentsLength) {
						props.onComplete?.()
					}
				}

				setMatchedGroups(newGroups)
				setSelectedItem(null)
			} else {
				// Error feedback
				navigator.vibrate?.([50, 50, 50])
				setSelectedItem(null)
			}
		} else {
			// Create new group if indices match
			if (selectedItem.index === item.index) {
				const newGroup: MatchGroup = {
					source: -1,
					target: -1,
					lit: -1,
				}
				if (selectedItem.type === "source")
					newGroup.source = selectedItem.index
				if (selectedItem.type === "target")
					newGroup.target = selectedItem.index
				if (selectedItem.type === "lit") newGroup.lit = selectedItem.index
				if (item.type === "source") newGroup.source = item.index
				if (item.type === "target") newGroup.target = item.index
				if (item.type === "lit") newGroup.lit = item.index

				setMatchedGroups([...matchedGroups, newGroup])
				setSelectedItem(null)
			} else {
				// Error feedback
				navigator.vibrate?.([50, 50, 50])
				setSelectedItem(null)
			}
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="relative space-y-8">
			{/* Full Text */}
			<div className="space-y-4 px-4 select-text">
				<div className="flex items-center gap-2 text-sm text-white/50 font-medium mb-2">
					<Text className="w-4 h-4" />
					<span>Tam Metin</span>
				</div>
				<div className="text-base text-gray-300/70">{props.texts.in}</div>
				<div className="text-base text-orange-300/70">
					{props.texts.out}
				</div>
				{props.texts.lit && (
					<div className="text-base font-mono tracking-wide text-purple-300/70">
						{props.texts.lit}
					</div>
				)}
				<div className="h-px bg-white/5" />
			</div>

			{/* Game Section */}
			<div className="space-y-8">
				<div className="flex items-center justify-center gap-2 text-sm text-white/50 font-medium">
					<PuzzlePieceIcon className="w-4 h-4" />
					<span>Parçaları Eşleştir</span>
				</div>
				<div className="min-h-[200px] flex items-center">
					<div className="w-full">
						{/* Source Text Card */}
						<motion.div
							initial={{ y: -5, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							className="bg-black/20 backdrop-blur-sm rounded-xl p-4 space-y-2">
							<div className="flex items-center gap-2 text-sm text-white/50 font-medium px-2">
								<DocumentTextIcon className="w-4 h-4" />
								<span>Orijinal Metin</span>
							</div>
							<div className="flex flex-wrap justify-center gap-2">
								<AnimatePresence>
									{sourceItems.map((item, displayIndex) => {
										const groupNumber = getGroupNumber(item.index)
										const groupColor = getGroupColor(groupNumber)
										return (
											<motion.button
												key={`source-${displayIndex}`}
												initial={{ opacity: 0, scale: 0.8 }}
												animate={{ opacity: 1, scale: 1 }}
												exit={{ opacity: 0, scale: 0.8 }}
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
												transition={{
													type: "spring",
													stiffness: 400,
													damping: 25,
													delay: displayIndex * 0.05,
												}}
												onClick={() => handleItemClick(item)}
												className={cn(
													"px-2 py-1 rounded-md text-center relative",
													"transition-all font-medium leading-tight",
													groupColor || "bg-white/10",
													selectedItem?.index === item.index &&
														selectedItem?.type === item.type &&
														"ring-2 ring-white/30 scale-[0.98]",
													groupNumber && "ring-2",
													"min-w-[100px] max-w-[160px]",
													item.text.length > 40
														? "text-base"
														: item.text.length > 30
														? "text-base"
														: item.text.length > 20
														? "text-base"
														: "text-base"
												)}>
												{item.text}
											</motion.button>
										)
									})}
								</AnimatePresence>
							</div>
						</motion.div>

						{/* Target Text Card */}
						<motion.div
							initial={{ y: 5, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							className="bg-black/20 backdrop-blur-sm rounded-xl p-4 mt-2">
							<div className="flex items-center gap-2 text-sm text-white/50 font-medium px-2">
								<LanguageIcon className="w-4 h-4" />
								<span>Çeviri</span>
							</div>
							<div className="flex flex-wrap justify-center gap-2">
								<AnimatePresence>
									{targetItems.map((item, displayIndex) => {
										const groupNumber = getGroupNumber(item.index)
										const groupColor = getGroupColor(groupNumber)
										return (
											<motion.button
												key={`target-${displayIndex}`}
												initial={{ opacity: 0, scale: 0.8 }}
												animate={{ opacity: 1, scale: 1 }}
												exit={{ opacity: 0, scale: 0.8 }}
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
												transition={{
													type: "spring",
													stiffness: 400,
													damping: 25,
													delay: displayIndex * 0.05,
												}}
												onClick={() => handleItemClick(item)}
												className={cn(
													"px-2 py-1 rounded-md text-center relative",
													"transition-all font-medium leading-tight",
													groupColor || "bg-white/10",
													selectedItem?.index === item.index &&
														selectedItem?.type === item.type &&
														"ring-2 ring-white/30 scale-[0.98]",
													groupNumber && "ring-2",
													"min-w-[100px] max-w-[160px]",
													item.text.length > 40
														? "text-base"
														: item.text.length > 30
														? "text-base"
														: item.text.length > 20
														? "text-base"
														: "text-base"
												)}>
												{item.text}
											</motion.button>
										)
									})}
								</AnimatePresence>
							</div>
						</motion.div>
					</div>
				</div>
			</div>

			{/* Translations Toggle */}
			<button
				onClick={() => setIsTranslationsOpen(!isTranslationsOpen)}
				className="w-full flex items-center justify-center gap-2 py-3 text-sm text-white/50 hover:text-white/70 transition-colors">
				<span>
					{isTranslationsOpen ? "Çevirileri Gizle" : "Çevirileri Göster"}
				</span>
				<ChevronDown
					className={cn(
						"w-4 h-4 transition-transform",
						isTranslationsOpen && "rotate-180"
					)}
				/>
			</button>

			{/* Translations Content */}
			<AnimatePresence>
				{isTranslationsOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ type: "spring", stiffness: 200, damping: 20 }}
						className="overflow-hidden">
						<div className="pt-4 space-y-8">
							{/* Segments */}
							<div className="px-4 space-y-4 select-text">
								<div className="flex items-center gap-2 text-xs text-white/50 font-medium">
									<PuzzlePieceIcon className="w-4 h-4" />
									<span>Parçalar</span>
								</div>
								{props.segments.map((segment, i) => (
									<div key={i} className="space-y-2">
										<div className="text-base text-gray-300/70">
											{segment.in}
										</div>
										<div className="text-base text-orange-300/70">
											{segment.out}
										</div>
										{segment.lit && (
											<div className="text-base font-mono tracking-wide text-purple-300/70">
												{segment.lit}
											</div>
										)}
										{i < props.segments.length - 1 && (
											<div className="h-px bg-white/5" />
										)}
									</div>
								))}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<div className="h-1" />

			{/* Success Message */}
			<AnimatePresence>
				{matchedGroups.length > 0 &&
					matchedGroups.length === uniqueSegmentsLength && (
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							onAnimationStart={() => {
								// Victory confetti
								confetti({
									particleCount: 300,
									spread: 180,
									origin: { y: 0.8 },
									colors: ["#FFD700", "#FFA500", "#FF69B4"],
									startVelocity: 45,
									gravity: 0.3,
									ticks: 200,
								})
								// Side confetti after delay
								setTimeout(() => {
									confetti({
										particleCount: 100,
										angle: 60,
										spread: 80,
										origin: { x: 0, y: 0.8 },
										colors: ["#00ff00", "#0000ff", "#ff0000"],
									})
									confetti({
										particleCount: 100,
										angle: 120,
										spread: 80,
										origin: { x: 1, y: 0.8 },
										colors: ["#00ff00", "#0000ff", "#ff0000"],
									})
								}, 500)
							}}
							className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
							<motion.div
								initial={{ y: 5 }}
								animate={{ y: 0 }}
								className="bg-black/40 p-3 rounded-lg text-center">
								<motion.div
									animate={{
										rotate: [0, 10, -10, 10, 0],
										scale: [1, 1.1, 1],
									}}
									transition={{ duration: 0.5 }}
									className="text-lg">
									🎉
								</motion.div>
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.1 }}
									className="text-green-400 font-medium text-xs">
									Tebrikler!
								</motion.div>
								<motion.button
									initial={{ opacity: 0, y: 5 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.2 }}
									onClick={resetGame}
									className="mt-2 px-3 py-1 text-xs bg-white/10 hover:bg-white/20 rounded-md flex items-center justify-center gap-2">
									<ArrowPathIcon className="w-4 h-4" />
									<span>Tekrar</span>
								</motion.button>
							</motion.div>
						</motion.div>
					)}
			</AnimatePresence>
		</motion.div>
	)
}
