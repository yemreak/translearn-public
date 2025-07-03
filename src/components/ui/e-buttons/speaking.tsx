"use client"

import { Color } from "@/app/types/ui"
import { motion } from "framer-motion"
import { twMerge } from "tailwind-merge"

/**
 * Interactive speaking button with wave animations
 * Represents a person in speaking or active communication state
 *
 * Animation Behaviors:
 * 1. Wave Outward (speakingWaveOutward)
 *    - Expanding rings that fade out
 *    - Represents sound waves emanating from speech
 *    - Mimics how sound travels outward when speaking
 *    - Like ripples in a pond, showing emotional impact
 *
 * 2. Expression Glow (speakingExpressionGlow)
 *    - Pulsing glow effect around the button
 *    - Shows the energy of active communication
 *    - Like a person's animated state while speaking
 *    - Reflects emotional intensity in voice
 *
 * 3. Active Pulse (activePulse)
 *    - Main button subtle scaling
 *    - Indicates active speech output
 *    - Similar to vocal cord vibrations
 *    - Shows confidence in expression
 *
 * 4. Inner Circle (scale effect)
 *    - Enlarged central circle
 *    - Shows confident projection
 *    - Like a person speaking with presence
 *    - Core of emotional expression
 *
 * Use Cases:
 * - During text-to-speech output
 * - When system is providing audio feedback
 * - For voice notifications or announcements
 * - Showing active speaking state
 * - Expressing emotional content
 */

export const SpeakingButton = ({
	color,
	onClick,
	size = 22,
}: {
	color: Color
	onClick: () => void
	size?: number
}) => {
	return (
		<div className="inline-flex items-center justify-center">
			<motion.div
				className="relative"
				style={{ width: `${size * 4}px`, height: `${size * 4}px` }}>
				{/* Container for all effects */}
				<div className="absolute inset-0">
					{/* Outer wave effects - emotional ripples */}
					<div
						className={twMerge(
							"absolute inset-0 rounded-full border-2 animate-speakingWaveOutward",
							`border-${color}-500`
						)}
					/>
					<div
						className={twMerge(
							"absolute inset-0 rounded-full border-2 animate-speakingWaveOutward [animation-delay:1s]",
							`border-${color}-500`
						)}
					/>

					{/* Expression glow effect - emotional energy */}
					<div
						className={twMerge(
							"absolute inset-0 rounded-full animate-speakingExpressionGlow",
							`shadow-lg shadow-${color}-500/30`
						)}
					/>
				</div>

				{/* Main button - emotional core */}
				<button
					onClick={onClick}
					className={twMerge(
						"absolute inset-0",
						"rounded-full border-2",
						"flex items-center justify-center",
						"transition-all duration-500",
						"select-none touch-none",
						"touch-manipulation",
						"hover:bg-opacity-10",
						"animate-speakingActivePulse",
						`border-${color}-500 bg-${color}-500/20`,
						`shadow-lg shadow-${color}-500/40`
					)}>
					{/* Inner circle - emotional presence */}
					<div
						className={twMerge(
							"rounded-full",
							"transition-all duration-300",
							`bg-${color}-500/70`,
							"scale-105"
						)}
						style={{
							width: `${size * 2}px`,
							height: `${size * 2}px`,
						}}
					/>
				</button>
			</motion.div>
		</div>
	)
}
