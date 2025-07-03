import { Color } from "@/app/types/ui"
import { motion } from "framer-motion"
import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

/**
 * @reason Single atomic unit for button behavior
 * Like a living cell - one unit that handles everything naturally
 * - Foreground: Immediate, visible processes (like ripples when touching water)
 * - Background: Deeper, continuous processes (like heartbeat or breathing)
 */
type ProgressButtonProps = {
	// Core DNA - defines identity
	color: Color
	// Processing nature - defines behavior pattern
	nature: "foreground" | "background"
	// Life state - defines current phase
	isLoading?: boolean
	isCompleted?: boolean
	// Loading state text - like cell signaling
	loadingText?: string
	// Response - defines interaction
	onClick?: () => void
	// Body - defines appearance
	children: ReactNode
	disabled?: boolean
}

/**
 * @reason Natural UI patterns for async operations
 * - Foreground: Like ripples in water, immediate visual feedback
 * - Background: Like heartbeat, continuous background process
 */
export function ProgressButton(props: ProgressButtonProps) {
	// Core styles - Like DNA, defines the base structure
	const baseClasses =
		"w-full p-4 rounded-lg transition-all relative overflow-hidden"

	// Visual patterns - Like cell membranes, defines boundaries
	const colorClasses: Record<Color, string> = {
		green: "bg-white/5 hover:bg-white/10 active:bg-white/5",
		purple: "bg-white/5 hover:bg-white/10 active:bg-white/5",
		blue: "bg-white/5 hover:bg-white/10 active:bg-white/5",
		pink: "bg-white/5 hover:bg-white/10 active:bg-white/5",
		orange: "bg-white/5 hover:bg-white/10 active:bg-white/5",
		yellow: "bg-white/5 hover:bg-white/10 active:bg-white/5",
		red: "bg-white/5 hover:bg-white/10 active:bg-white/5",
		white: "bg-white/5 hover:bg-white/10 active:bg-white/5",
		dark: "bg-white/5 hover:bg-white/10 active:bg-white/5",
		gray: "bg-white/5 hover:bg-white/10 active:bg-white/5",
	}

	// Energy patterns - Like cellular energy, defines motion
	const gradientColors: Record<Color, string> = {
		green: "from-green-300/30 via-green-500/30 to-green-300/30",
		purple: "from-purple-300/30 via-purple-500/30 to-purple-300/30",
		blue: "from-blue-300/30 via-blue-500/30 to-blue-300/30",
		pink: "from-pink-300/30 via-pink-500/30 to-pink-300/30",
		orange: "from-orange-300/30 via-orange-500/30 to-orange-300/30",
		yellow: "from-yellow-300/30 via-yellow-500/30 to-yellow-300/30",
		red: "from-red-300/30 via-red-500/30 to-red-300/30",
		white: "from-white/30 via-white/50 to-white/30",
		dark: "from-gray-800/30 via-gray-900/30 to-gray-800/30",
		gray: "from-gray-300/30 via-gray-500/30 to-gray-300/30",
	}

	// Success patterns - Like growth completion in nature
	const completedColors: Record<Color, string> = {
		green: "text-green-500/70",
		purple: "text-purple-500/70",
		blue: "text-blue-500/70",
		pink: "text-pink-500/70",
		orange: "text-orange-500/70",
		yellow: "text-yellow-500/70",
		red: "text-red-500/70",
		white: "text-white/70",
		dark: "text-gray-900/70",
		gray: "text-gray-500/70",
	}

	// Natural composition - Like a living cell with all its parts
	return (
		<button
			onClick={props.onClick}
			disabled={props.disabled || props.isLoading || props.isCompleted}
			className={twMerge(
				baseClasses,
				colorClasses[props.color],
				(props.isLoading || props.isCompleted) && "cursor-not-allowed"
			)}>
			{/* Content - Like cell nucleus */}
			<div
				className={twMerge(
					"relative z-10",
					props.isCompleted && "opacity-0"
				)}>
				{props.isLoading && props.loadingText
					? props.loadingText
					: props.children}
			</div>

			{/* Loading Animation - Like cell division */}
			{props.isLoading && (
				<div className="absolute inset-0">
					{props.nature === "foreground" && (
						<>
							{/* Foreground Animation - Like water ripples */}
							<motion.div
								className={twMerge(
									"absolute inset-0 rounded-lg",
									"border-[1.5px] border-transparent",
									"bg-gradient-to-r bg-[length:200%_100%]",
									gradientColors[props.color],
									"animate-[gradient_2s_linear_infinite]"
								)}
								style={{
									maskImage:
										"linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
									WebkitMaskImage:
										"linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
									WebkitMaskComposite: "xor",
									maskComposite: "exclude",
								}}
							/>
							<motion.div
								className={twMerge(
									"absolute inset-[1px] rounded-lg opacity-10",
									"bg-gradient-to-r bg-[length:200%_100%]",
									gradientColors[props.color],
									"animate-[gradient_2s_linear_infinite]",
									"blur-sm"
								)}
							/>
						</>
					)}

					{props.nature === "background" && (
						<>
							{/* Background Animation - Like heartbeat or breathing */}
							<motion.div
								animate={{
									scale: [1, 1.05, 1],
									opacity: [0.08, 0.58, 0.08],
								}}
								transition={{
									duration: 2.5,
									repeat: Infinity,
									ease: [0.4, 0, 0.6, 1],
								}}
								className={twMerge(
									"absolute inset-0 rounded-lg",
									"border-[1.5px] border-transparent",
									"bg-gradient-to-br",
									gradientColors[props.color],
									"shadow-[0_0_15px_rgba(255,255,255,0.1)]"
								)}
							/>
							{/* Multiple layers for depth perception */}
							{[...Array(2)].map((_, i) => (
								<motion.div
									key={i}
									animate={{
										scale: [1, 1.1, 1],
										opacity: [
											0.05 - i * 0.02,
											0.4 - i * 0.05,
											0.05 - i * 0.02,
										],
									}}
									transition={{
										duration: 2.5,
										repeat: Infinity,
										ease: [0.4, 0, 0.6, 1],
										delay: i * 0.3,
									}}
									className={twMerge(
										"absolute -inset-2 rounded-lg blur-md",
										"bg-gradient-to-br",
										gradientColors[props.color]
									)}
								/>
							))}
						</>
					)}
				</div>
			)}

			{/* Completion Animation - Like growth completion */}
			{props.isCompleted && (
				<motion.div
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0, opacity: 0 }}
					className="absolute inset-0 flex items-center justify-center">
					<motion.div
						initial={{ pathLength: 0 }}
						animate={{ pathLength: 1 }}
						transition={{ duration: 0.3, ease: "easeOut" }}
						className={twMerge("w-6 h-6", completedColors[props.color])}>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round">
							<motion.path
								d="M20 6L9 17L4 12"
								initial={{ pathLength: 0 }}
								animate={{ pathLength: 1 }}
								transition={{ duration: 0.3, ease: "easeOut" }}
							/>
						</svg>
					</motion.div>
				</motion.div>
			)}
		</button>
	)
}
