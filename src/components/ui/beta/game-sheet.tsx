"use client"

import { t } from "@/app/lib/language"
import { SupportedLanguageCode } from "@/app/types/common"
import { AnimatePresence, motion } from "framer-motion"
import { BottomSheet } from "./bottom-sheet"
import { LanguageMatchGame } from "./language-match-game"

/**
 * @reason Game panel component that handles game state, audio, and UI
 */
export function GameSheet(props: {
	texts: { in: string; out: string; lit?: string }
	segments?: { in: string; out: string; lit?: string }[]
	isOpen: boolean
	onClose: () => void
	language: SupportedLanguageCode
	onComplete?: () => void
	onItemClick?: (item: {
		text: string
		index: number
		type: "source" | "target" | "lit"
	}) => void
	speed?: number
	onSpeedChange?: (speed: number) => void
	isLoading?: boolean
}) {
	return (
		<AnimatePresence>
			{props.isOpen && (
				<BottomSheet
					isOpen={props.isOpen}
					onCloseAction={props.onClose}
					height="75%"
					title="Game">
					<div className="flex flex-col h-full relative">
						{/* Content */}
						<div className="flex-1 overflow-y-auto pb-[72px]">
							{!props.segments || props.isLoading ? (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="flex items-center justify-center h-[250px]">
									<div className="text-sm text-white/50">
										{t("gameLoading", props.language)}
									</div>
								</motion.div>
							) : (
								<LanguageMatchGame
									texts={props.texts}
									segments={props.segments}
									onComplete={props.onComplete}
									onItemClick={props.onItemClick}
								/>
							)}
						</div>

						{/* Speed Control */}
						{props.segments && (
							<div className="absolute bottom-0 left-0 right-0 bg-[#1c1c1e]/95 backdrop-blur-xl border-t border-white/10">
								<div className="p-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2 text-white/50">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor"
												className="w-4 h-4">
												<path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
											</svg>
											<span className="text-xs">Speed</span>
										</div>
										<div className="flex gap-2">
											{[0.5, 0.8, 1, 1.2, 1.5].map(speed => (
												<button
													key={speed}
													onClick={() => props.onSpeedChange?.(speed)}
													className={`px-3 py-1 rounded-lg text-xs transition-colors ${
														props.speed === speed
															? "bg-white/10 text-white"
															: "text-white/50 hover:text-white/70"
													}`}>
													{speed}x
												</button>
											))}
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</BottomSheet>
			)}
		</AnimatePresence>
	)
}
