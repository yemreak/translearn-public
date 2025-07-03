"use client"

import { cn } from "@/app/lib/utils"
import { Color } from "@/app/types/ui"
import { motion } from "framer-motion"

/**
 * Interactive seeking button with orbital animations
 * Represents a person actively seeking attention or interaction
 *
 * Animation Behaviors:
 * 1. Orbital Particles (seekingOrbit)
 *    - Small particles orbiting around the button
 *    - Represents active scanning and searching behavior
 *    - Mimics how humans look around when seeking attention
 *
 * 2. Main Glow (seekingPulse)
 *    - Pulsing glow effect that expands and contracts
 *    - Shows the button's active state and energy
 *    - Like a person's aura when they want to be noticed
 *
 * 3. Bounce Animation (seekingBounce)
 *    - Gentle up and down movement with slight rotation
 *    - Represents eagerness and anticipation
 *    - Similar to how people shift weight when excited
 *
 * 4. Inner Glow (seekingGlow)
 *    - Central circle that pulses with opacity changes
 *    - Shows the core energy and readiness
 *    - Like a person's inner excitement when seeking interaction
 *
 * Use Cases:
 * - Initial state when waiting for user interaction
 * - After completing a task and ready for new input
 * - When the system needs user's attention
 */
export const SeekingButton = ({
	color,
	onClick,
	size = 22,
}: {
	color: Color
	onClick?: () => void
	size?: number
}) => {
	return (
		<div
			className={cn(
				"inline-flex items-center justify-center seeking-animations"
			)}>
			<motion.div
				className="relative"
				style={{ width: `${size * 4}px`, height: `${size * 4}px` }}>
				{/* Why: Orbital particles create a sense of active searching */}
				<div className="absolute inset-0">
					{/* Why: Multiple particles suggest thorough attention-seeking */}
					{/* <div
						className={cn(
							"absolute w-3 h-3 rounded-full animate-seekingOrbit",
							"top-[45%] left-[45%]",
							`bg-${color}/40`
						)}
					/> */}
					{/* <div
						className={cn(
							"absolute w-2 h-2 rounded-full animate-seekingOrbitReverse",
							"top-[45%] left-[45%]",
							`bg-${color}/30`
						)}
					/> */}

					{/* Why: Glow effect mimics the energy of seeking attention */}
					<div
						className={cn(
							"absolute inset-0 rounded-full backdrop-blur-sm animate-seekingPulse",
							`bg-${color}-500/10 shadow-${color}-500/70`
						)}
					/>

					{/* Why: Inner glow represents the core energy of the seeking state */}
					<div
						className={cn(
							"absolute inset-0 rounded-full border-2 animate-seekingGlow",
							`border-${color}-500`,
							`shadow-lg shadow-${color}-500/50`
						)}
					/>
				</div>

				{/* Why: Main button needs to be prominent but not aggressive */}
				<button
					onClick={onClick}
					className={cn(
						"absolute inset-0",
						"rounded-full border-2",
						"flex items-center justify-center",
						"select-none touch-none animate-seekingBounce",
						"touch-manipulation",
						`border-${color}-500 bg-${color}-500/10`,
						`shadow-lg shadow-${color}-500/40`
					)}>
					<div
						className={cn(
							"rounded-full border-2 transition-all duration-300 animate-seekingGlow",
							`border-${color}-500 bg-${color}-500/40`
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
