import { t } from "@/app/lib/language"
import { useUiStore } from "@/app/store/ui"
import { ExclamationTriangleIcon } from "@/components/icons"
import { SpeakerWaveIcon } from "@heroicons/react/24/outline"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { BottomSheet } from "./bottom-sheet"

type LookupSheetProps = {
	isOpen: boolean
	onClose: () => void
	selectedText: string
	transliteration?: string
	translation?: string
	segments?: Array<{ in: string; out: string }>
	onTtsClick?: (speed: number) => void
	speed?: number
	onSpeedChange?: (speed: number) => void
	isTransliterationLoading?: boolean
	isTranslationLoading?: boolean
	isTtsLoading?: boolean
}

function TtsButton({
	onClick,
	isLoading,
	speed,
}: {
	onClick?: (speed: number) => void
	isLoading?: boolean
	speed: number
}) {
	const [isPlaying, setIsPlaying] = useState(false)

	const handleClick = () => {
		if (!onClick || isLoading) return
		setIsPlaying(true)
		onClick(speed)
		setTimeout(() => setIsPlaying(false), 2000)
	}

	return (
		<motion.button
			onClick={handleClick}
			className="p-2 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/5 transition-all"
			whileTap={{ scale: 0.95 }}>
			<motion.div
				animate={
					isPlaying
						? {
								scale: [1, 1.2, 1],
								opacity: [1, 0.7, 1],
						  }
						: isLoading
						? {
								scale: [1, 1.1, 1],
								opacity: [0.5, 0.7, 0.5],
						  }
						: {}
				}
				transition={{
					duration: isPlaying ? 2 : 1,
					repeat: isPlaying || isLoading ? Infinity : 0,
					ease: "easeInOut",
				}}>
				<SpeakerWaveIcon className="w-5 h-5 text-white/70" />
			</motion.div>
		</motion.button>
	)
}

function LoadingDots() {
	return (
		<div className="flex gap-1">
			{[...Array(3)].map((_, i) => (
				<motion.div
					key={i}
					className="w-1 h-1 rounded-full bg-white/20"
					animate={{
						opacity: [0.2, 0.5, 0.2],
					}}
					transition={{
						duration: 1,
						repeat: Infinity,
						delay: i * 0.2,
						ease: "easeInOut",
					}}
				/>
			))}
		</div>
	)
}

function LoadingBar() {
	return (
		<div className="relative h-0.5 w-full bg-white/5 overflow-hidden rounded-full">
			<motion.div
				className="absolute inset-y-0 bg-white/20 w-1/4 rounded-full"
				animate={{
					x: ["-100%", "400%"],
				}}
				transition={{
					duration: 2,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>
		</div>
	)
}

function SpeedSelector({
	speed,
	onSpeedChange,
}: {
	speed: number
	onSpeedChange: (speed: number) => void
}) {
	const [isOpen, setIsOpen] = useState(false)
	const speeds = [0.6, 0.7, 0.8, 1, 1.2]

	return (
		<div className="relative">
			<motion.button
				onClick={() => setIsOpen(!isOpen)}
				className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 active:bg-white/10 transition-all text-sm font-medium text-white/80"
				whileTap={{ scale: 0.95 }}>
				{speed}x
			</motion.button>

			<AnimatePresence>
				{isOpen && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 z-40"
							onClick={() => setIsOpen(false)}
						/>
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 10 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 10 }}
							className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl rounded-t-2xl p-4 z-50 border-t border-white/10">
							<div className="flex justify-center gap-2">
								{speeds.map(s => (
									<button
										key={s}
										onClick={() => {
											onSpeedChange(s)
											setIsOpen(false)
										}}
										className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
											speed === s
												? "bg-white/20 text-white"
												: "text-white/50 hover:text-white/70 hover:bg-white/10"
										}`}>
										{s}x
									</button>
								))}
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	)
}

export function LookupSheet({
	isOpen,
	onClose,
	selectedText,
	transliteration,
	translation,
	segments,
	onTtsClick,
	speed = 1,
	onSpeedChange,
	isTransliterationLoading,
	isTranslationLoading,
	isTtsLoading,
}: LookupSheetProps) {
	const { currentLanguage } = useUiStore()
	const [localSpeed, setLocalSpeed] = useState(speed)
	return (
		<BottomSheet
			isOpen={isOpen}
			onCloseAction={onClose}
			height="50vh"
			className="bg-black/95 backdrop-blur-xl">
			{/* Header */}
			<div className="flex items-center justify-between px-2">
				<div className="flex-1" />
				<div className="flex-[2] text-center">
					<div className="space-y-1">
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className="text-lg font-medium text-white/90 select-text">
							{selectedText}
						</motion.div>

						{/* Interactive Transliteration */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.1 }}
							className="flex flex-col items-center">
							{isTransliterationLoading && <LoadingDots />}
							{transliteration && (
								<motion.div
									initial={{ opacity: 0, y: -5 }}
									animate={{ opacity: 1, y: 0 }}
									className="overflow-hidden">
									<p className="font-mono text-sm text-white/50 tracking-wide select-text">
										{transliteration}
									</p>
								</motion.div>
							)}
							{isTransliterationLoading && (
								<motion.p
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="mt-1 text-xs text-white/30">
									Loading pronunciation...
								</motion.p>
							)}
							{onTtsClick && (
								<div className="mt-2 flex items-center justify-center gap-2">
									<TtsButton
										onClick={onTtsClick}
										isLoading={isTtsLoading}
										speed={localSpeed}
									/>
									<SpeedSelector
										speed={localSpeed}
										onSpeedChange={(newSpeed) => {
											setLocalSpeed(newSpeed)
											onSpeedChange?.(newSpeed)
										}}
									/>
								</div>
							)}
						</motion.div>
					</div>
				</div>
				<div className="flex-1" />
			</div>

			{/* Content */}
			<div className="px-6 pt-6">
				{/* Translation */}
				{(isTranslationLoading || translation) && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="mt-4">
						<div className="relative p-4 rounded-xl bg-white/[0.02] border border-white/10">
							{isTranslationLoading ? (
								<div className="space-y-4">
									<LoadingBar />
									<div className="h-4 w-2/3 mx-auto bg-white/5 rounded" />
								</div>
							) : (
								<p className="text-base text-white/90 text-center select-text">
									{translation}
								</p>
							)}
						</div>
					</motion.div>
				)}

				{/* Segments */}
				{segments && segments.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="mt-8 space-y-4">
						{segments.map((segment, index) => (
							<div
								key={index}
								className="flex flex-col gap-2 p-4 rounded-xl bg-white/[0.02] border border-white/10">
								<p className="text-sm text-white/70 select-text">
									{segment.in}
								</p>
								<p className="text-sm text-white/50 select-text">
									{segment.out}
								</p>
							</div>
						))}
					</motion.div>
				)}

				{/* ai warning */}
				<div className="mt-4 text-center text-xs text-white/50">
					<p>
						<ExclamationTriangleIcon className="w-4 h-4 inline-block mr-2" />
						{t("lookup.aiWarning", currentLanguage)}
					</p>
				</div>
			</div>
		</BottomSheet>
	)
}
