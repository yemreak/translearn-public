"use client"

import { Color } from "@/app/types/ui"
import { motion } from "framer-motion"
import { forwardRef, useMemo } from "react"
import { twMerge } from "tailwind-merge"

/**
 * Interactive listening button with inward wave animations
 * Represents a person in active listening or receptive state
 *
 * @purpose Represents active listening state with dynamic wave animations that respond to sound intensity
 * @inspirations
 * - Natural empathy patterns in human conversation
 * - Emotional resonance in active listening
 * - Deep understanding through attentive presence
 *
 * Animation Behaviors:
 * 1. Wave Inward (listeningWaveInward)
 *    - Contracting rings that move inward
 *    - Represents sound waves being received
 *    - Mimics how we focus on incoming sound
 *    - Like embracing emotional content
 *
 * 2. Focus Glow (focusGlow)
 *    - Inner shadow that pulses
 *    - Shows concentration and attention
 *    - Like a person's focused listening state
 *    - Emotional resonance indicator
 *
 * 3. Attentive Pulse (attentivePulse)
 *    - Subtle contraction of main button
 *    - Indicates active reception
 *    - Similar to leaning in when listening
 *    - Shows emotional engagement
 *
 * 4. Nodding Motion (nodListening)
 *    - Gentle up and down movement
 *    - Shows acknowledgment and understanding
 *    - Like nodding while listening
 *    - Emotional validation gesture
 *
 * Dynamic Behaviors:
 * - Amplitude Intensity: Animations respond to emotional intensity in voice
 * - Wave Count: More waves appear with higher emotional engagement
 * - Opacity: Increases with emotional resonance
 *
 * Use Cases:
 * - During voice input recording
 * - When receiving emotional content
 * - For deep listening experiences
 * - Showing active empathy state
 */

/**
 * Interactive listening button with inward wave animations
 * Represents a person in active listening or receptive state
 *
 * @purpose Shows active listening state with dynamic wave animations that respond to sound intensity
 * @inspirations
 * - Apple's Siri voice input visualization
 * - Google's voice search animation
 * - Sound wave physics and human attention patterns
 */
const ListeningButton = forwardRef<
	HTMLButtonElement,
	{
		color: Color
		amplitude: number
		onClick?: () => void
		size?: number
	}
>(({ color, amplitude, onClick, size = 22 }, ref) => {
	// Calculate visual properties based on emotional intensity
	const { waveCount, opacity, scale } = useMemo(() => {
		// Normalize amplitude between thresholds
		const minThreshold = 0.15 // Minimum emotional engagement
		const maxThreshold = 0.85 // Peak emotional resonance
		const normalizedAmp = Math.max(0, Math.min(1, amplitude))
		const smoothAmp =
			normalizedAmp < minThreshold
				? 0
				: normalizedAmp > maxThreshold
				? 1
				: (normalizedAmp - minThreshold) / (maxThreshold - minThreshold)

		return {
			waveCount: Math.min(2 + Math.floor(smoothAmp * 3), 4), // Emotional wave layers
			opacity: Math.min(0.3 + smoothAmp * smoothAmp * 0.7, 0.9), // Emotional intensity
			scale: 1 + smoothAmp * 0.1, // Emotional presence
		}
	}, [amplitude])

	return (
		<div className="inline-flex items-center justify-center">
			<motion.div
				className="relative"
				style={{ width: `${size * 4}px`, height: `${size * 4}px` }}>
				{/* Wave animations - emotional reception */}
				<div className="absolute inset-0">
					{Array.from({ length: waveCount }).map((_, index) => (
						<div
							key={index}
							className={twMerge(
								"absolute inset-0 rounded-full border-2",
								"transition-all duration-300",
								index === 0
									? "animate-listeningWaveInward"
									: "animate-listeningWaveInwardDelayed",
								`border-${color}-500`
							)}
							style={{
								transform: `scale(${scale + index * 0.1})`,
								opacity: opacity * (1 - index * 0.2),
							}}
						/>
					))}

					{/* Focus glow effect - emotional attention */}
					<div
						className={twMerge(
							"absolute inset-0 rounded-full",
							"animate-listeningFocusGlow",
							`shadow-lg shadow-${color}-500/40`
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
						"animate-listeningAttentivePulse",
						`border-${color}-500`,
						`bg-${color}-500/20`,
						`shadow-lg shadow-${color}-500/40`
					)}
					ref={ref}>
					{/* Inner circle - emotional presence */}
					<div
						className={twMerge(
							"rounded-full",
							"transition-all duration-300",
							"animate-listeningNod",
							`bg-${color}-500/70`
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
})

ListeningButton.displayName = "ListeningButton"

export { ListeningButton }
