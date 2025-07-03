"use client"

import { Color } from "@/app/types/ui"
import { motion } from "framer-motion"
import { useState } from "react"
import { twMerge } from "tailwind-merge"

/**
 * Interactive understanding button with cognitive animations
 * Represents a person in deep thought or processing state
 *
 * Animation Behaviors:
 * 1. Cognitive Wheel (understandingCognitiveRotate)
 *    - Rotating dashed circles in opposite directions
 *    - Represents active mental processing
 *    - Like gears turning in the mind during understanding
 *
 * 2. Synaptic Flash (understandingSynapseFlash)
 *    - Inner glow that pulses with learning
 *    - Shows neural connections forming
 *    - Like neurons firing during learning
 *
 * 3. Focus Boundary (understandingPulse)
 *    - Outer calm border that expands and contracts
 *    - Shows concentration level
 *    - Like brain waves during deep focus
 *
 * 4. Completion Indicator (fadeIn)
 *    - Two vertical lines that appear when processing completes
 *    - Shows successful understanding
 *    - Like a person nodding in comprehension
 *
 * Use Cases:
 * - During speech-to-text processing
 * - When analyzing user input
 * - While performing complex calculations
 * - Showing active AI processing state
 */
export const UnderstandingButton = ({
	color,
	onPause,
	onResume,
	size = 22,
}: {
	color: Color
	onPause?: () => void
	onResume?: () => void
	size?: number
}) => {
	const [isProcessing, setIsProcessing] = useState(true)

	return (
		<div className="inline-flex items-center justify-center">
			<motion.div
				className="relative"
				style={{ width: `${size * 4}px`, height: `${size * 4}px` }}>
				{/* Container for all effects */}
				<div className="absolute inset-0">
					{/* Outer calm border - represents focus boundary */}
					<div
						className={twMerge(
							"absolute inset-0 rounded-full transition-all duration-500",
							`bg-${color}-500/5`,
							isProcessing ? "animate-understandingPulse" : "opacity-30",
							`shadow-lg shadow-${color}-500/20`
						)}
					/>

					{/* Inner glow area - represents deep thinking */}
					<div
						className={twMerge(
							"absolute inset-2 rounded-full transition-all duration-500",
							`bg-${color}-500/10`,
							isProcessing
								? "animate-understandingSynapseFlash"
								: "opacity-30",
							`shadow-[inset_0_0_50px_rgba(var(--tw-shadow-color))]`,
							`shadow-${color}-500/10`
						)}
					/>
				</div>

				{/* Main button */}
				<button
					className={twMerge(
						"absolute inset-0",
						"rounded-full",
						"flex items-center justify-center",
						"transition-all duration-500",
						"select-none touch-none",
						"touch-manipulation",
						`bg-${color}-500/15`,
						"hover:bg-opacity-10"
					)}
					onClick={() => {
						if (onPause && onResume) {
							const isPausing = !isProcessing
							setIsProcessing(isPausing)
							if (isPausing) onPause()
							else onResume()
						}
					}}>
					{/* Cognitive wheel - represents thought process */}
					<div
						className={twMerge(
							"rounded-full border-2 transition-all duration-300 relative",
							`border-${color}-500 border-dashed`,
							isProcessing
								? "animate-understandingCognitiveRotate opacity-60"
								: "opacity-50",
							`shadow-[0_0_20px_rgba(var(--tw-shadow-color))]`,
							`shadow-${color}-500/20`
						)}
						style={{
							width: `${size * 2}px`,
							height: `${size * 2}px`,
						}}>
						<div
							className={twMerge(
								"w-full h-full rounded-full border-2 border-dotted",
								`border-${color}-500`,
								isProcessing
									? "animate-understandingCognitiveRotateReverse opacity-80"
									: "opacity-50"
							)}
						/>

						{/* Completion indicator */}
						{!isProcessing && (
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="flex gap-1">
									<div
										className={twMerge(
											"w-[2px] h-3 rounded-full animate-understandingFadeIn",
											`bg-${color}-500/50`
										)}
									/>
									<div
										className={twMerge(
											"w-[2px] h-3 rounded-full animate-understandingFadeIn",
											`bg-${color}-500/50`
										)}
									/>
								</div>
							</div>
						)}
					</div>
				</button>
			</motion.div>
		</div>
	)
}
