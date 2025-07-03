/**
 * @reason Share content with native-like iOS share sheet
 * Like a cell's exocytosis process - packaging and releasing content
 */
"use client"

import { cn } from "@/app/lib/utils"
import { motion } from "framer-motion"
import { useMemo, useState } from "react"
import { BottomSheet } from "./bottom-sheet"
type ShareSheetProps = {
	isOpen: boolean
	onClose: () => void
	content: {
		original?: string
		translation?: string
		transliteration?: string
		audio_base64?: string
	}
}

export function ShareSheet({ isOpen, onClose, content }: ShareSheetProps) {
	const [copiedId, setCopiedId] = useState<string | null>(null)

	const handleShare = async (text: string | undefined, id: string) => {
		if (!text) return

		if (navigator.share) {
			await navigator.share({
				text: text,
			})
		} else {
			await navigator.clipboard.writeText(text)
			setCopiedId(id)
			// Reset copied state after animation
			setTimeout(() => setCopiedId(null), 1500)
		}
	}

	const handleAudioShare = async () => {
		if (!content.audio_base64) return

		// Convert base64 to blob
		const response = await fetch(
			`data:audio/mp3;base64,${content.audio_base64}`
		)
		const blob = await response.blob()

		// Try to share
		if (navigator.share) {
			const file = new File([blob], "audio.mp3", { type: "audio/mp3" })
			await navigator.share({
				files: [file],
			})
		} else {
			// Fallback to download if share is not available
			const url = URL.createObjectURL(blob)
			const a = document.createElement("a")
			a.href = url
			a.download = "audio.mp3"
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
			URL.revokeObjectURL(url)
		}
	}

	const shareOptions = [
		{
			id: "copy-original",
			label: "Original",
			icon: (
				<div
					className={cn(
						"w-full h-full relative overflow-hidden",
						"text-white/70 transition-colors",
						"group-hover:text-white/90"
					)}>
					<motion.div
						animate={{
							opacity: copiedId === "copy-original" ? 0 : 1,
							y: copiedId === "copy-original" ? 20 : 0,
						}}
						transition={{ duration: 0.2 }}
						className="flex justify-center">
						<svg
							className="w-8 h-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
							/>
						</svg>
					</motion.div>
					<motion.div
						initial={{ scale: 0, opacity: 0 }}
						animate={{
							scale: copiedId === "copy-original" ? 1 : 0,
							opacity: copiedId === "copy-original" ? 1 : 0,
						}}
						className="absolute inset-0 flex items-center justify-center">
						<svg
							className="w-8 h-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<motion.path
								initial={{ pathLength: 0 }}
								animate={{
									pathLength: copiedId === "copy-original" ? 1 : 0,
								}}
								transition={{ duration: 0.4, delay: 0.2 }}
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</motion.div>
				</div>
			),
			onClick: () => handleShare(content.original, "copy-original"),
			disabled: !content.original,
		},
		{
			id: "copy-translation",
			label: "Translation",
			icon: (
				<div
					className={cn(
						"w-full h-full relative overflow-hidden",
						"text-orange-400/70 transition-colors",
						"group-hover:text-orange-400"
					)}>
					<motion.div
						animate={{
							opacity: copiedId === "copy-translation" ? 0 : 1,
							y: copiedId === "copy-translation" ? 20 : 0,
						}}
						transition={{ duration: 0.2 }}
						className="flex justify-center">
						<svg
							className="w-8 h-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
							/>
						</svg>
					</motion.div>
					<motion.div
						initial={{ scale: 0, opacity: 0 }}
						animate={{
							scale: copiedId === "copy-translation" ? 1 : 0,
							opacity: copiedId === "copy-translation" ? 1 : 0,
						}}
						className="absolute inset-0 flex items-center justify-center">
						<svg
							className="w-8 h-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<motion.path
								initial={{ pathLength: 0 }}
								animate={{
									pathLength: copiedId === "copy-translation" ? 1 : 0,
								}}
								transition={{ duration: 0.4, delay: 0.2 }}
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</motion.div>
				</div>
			),
			onClick: () => handleShare(content.translation, "copy-translation"),
			disabled: !content.translation,
		},
		{
			id: "copy-transliteration",
			label: "Pronunciation",
			icon: (
				<div
					className={cn(
						"w-full h-full relative overflow-hidden",
						"text-green-400/70 transition-colors",
						"group-hover:text-green-400"
					)}>
					<motion.div
						animate={{
							opacity: copiedId === "copy-transliteration" ? 0 : 1,
							y: copiedId === "copy-transliteration" ? 20 : 0,
						}}
						transition={{ duration: 0.2 }}
						className="flex justify-center">
						<svg
							className="w-8 h-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
							/>
						</svg>
					</motion.div>
					<motion.div
						initial={{ scale: 0, opacity: 0 }}
						animate={{
							scale: copiedId === "copy-transliteration" ? 1 : 0,
							opacity: copiedId === "copy-transliteration" ? 1 : 0,
						}}
						className="absolute inset-0 flex items-center justify-center">
						<svg
							className="w-8 h-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<motion.path
								initial={{ pathLength: 0 }}
								animate={{
									pathLength: copiedId === "copy-transliteration" ? 1 : 0,
								}}
								transition={{ duration: 0.4, delay: 0.2 }}
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</motion.div>
				</div>
			),
			onClick: () =>
				handleShare(content.transliteration, "copy-transliteration"),
			disabled: !content.transliteration,
		},
		{
			id: "share-audio",
			label: "Audio",
			icon: (
				<div
					className={cn(
						"w-full h-full relative overflow-hidden",
						"text-purple-400/70 transition-colors",
						"group-hover:text-purple-400"
					)}>
					<motion.div className="flex justify-center">
						<svg
							className="w-8 h-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
							/>
						</svg>
					</motion.div>
				</div>
			),
			onClick: handleAudioShare,
			disabled: !content.audio_base64,
		},
	]

	// Calculate content height with more space
	const contentHeight = useMemo(() => {
		let height = 0
		if (content.original) height += 1
		if (content.translation) height += 1
		if (content.transliteration) height += 1
		if (content.audio_base64) height += 1

		// Base height + content height * item height (increased spacing)
		return Math.max(35, Math.min(75, 35 + height * 10)) + "%"
	}, [content])

	return (
		<BottomSheet
			isOpen={isOpen}
			onClose={onClose}
			height={contentHeight}
			title="Share">
			<div className="flex flex-col h-full">
				{/* Preview */}
				<div className="flex-1 space-y-4 overflow-y-auto px-4">
					{(content.original ||
						content.translation ||
						content.transliteration ||
						content.audio_base64) && (
						<div className="space-y-4">
							{content.original && (
								<div>
									<div className="text-sm text-white/50 mb-1">Original</div>
									<div className="text-sm text-white/90">
										{content.original}
									</div>
								</div>
							)}
							{content.translation && (
								<div>
									<div className="text-sm text-white/50 mb-1">
										Translation
									</div>
									<div className="text-sm text-white/90">
										{content.translation}
									</div>
								</div>
							)}
							{content.transliteration && (
								<div>
									<div className="text-sm text-white/50 mb-1">
										Pronunciation
									</div>
									<div className="text-sm text-white/90">
										{content.transliteration}
									</div>
								</div>
							)}
							{content.audio_base64 && (
								<div>
									<div className="text-sm text-white/50 mb-1">Audio</div>
									<div className="text-sm text-white/90">
										Available for download
									</div>
								</div>
							)}
						</div>
					)}
				</div>

				{/* Share Options */}
				<div className="grid grid-cols-4 gap-4 p-4 mt-auto">
					{shareOptions.map(option => (
						<button
							key={option.id}
							onClick={option.onClick}
							disabled={option.disabled}
							className={cn(
								"group flex flex-col items-center transition-opacity",
								option.disabled && "opacity-50 cursor-not-allowed"
							)}>
							<div className="w-12 h-12">{option.icon}</div>
							<span className="text-xs text-white/70">{option.label}</span>
						</button>
					))}
				</div>
			</div>
		</BottomSheet>
	)
}
