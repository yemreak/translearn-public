import { motion, useSpring } from "framer-motion"
import { useEffect } from "react"

type LoadingBeakerProps = {
	progress: number
	color?: "purple" | "blue" | "green" | "pink"
	size?: "sm" | "md" | "lg"
	showLabel?: boolean
}

const COLORS = {
	purple: {
		border: "border-purple-500",
		fill: "from-purple-600 to-purple-400",
		bubble: "bg-purple-300",
		text: "text-purple-400",
	},
	blue: {
		border: "border-blue-500",
		fill: "from-blue-600 to-blue-400",
		bubble: "bg-blue-300",
		text: "text-blue-400",
	},
	green: {
		border: "border-green-500",
		fill: "from-green-600 to-green-400",
		bubble: "bg-green-300",
		text: "text-green-400",
	},
	pink: {
		border: "border-pink-500",
		fill: "from-pink-600 to-pink-400",
		bubble: "bg-pink-300",
		text: "text-pink-400",
	},
}

const SIZES = {
	sm: {
		container: "w-16 h-24",
		neck: "w-6 h-3",
		bubble: "w-1.5 h-1.5",
		text: "text-xs",
	},
	md: {
		container: "w-24 h-32",
		neck: "w-8 h-4",
		bubble: "w-2 h-2",
		text: "text-sm",
	},
	lg: {
		container: "w-32 h-40",
		neck: "w-10 h-5",
		bubble: "w-2.5 h-2.5",
		text: "text-base",
	},
}

export function LoadingBeaker({
	progress,
	color = "purple",
	size = "md",
	showLabel = true,
}: LoadingBeakerProps) {
	const fillHeight = useSpring(0, {
		stiffness: 100,
		damping: 30,
	})

	useEffect(() => {
		fillHeight.set(progress)
	}, [progress, fillHeight])

	const colors = COLORS[color]
	const dimensions = SIZES[size]

	return (
		<motion.div className={`relative ${dimensions.container} mx-auto`}>
			{/* Beaker Container */}
			<div
				className={`absolute inset-0 border-2 ${colors.border} rounded-b-lg`}>
				{/* Beaker Fill */}
				<motion.div
					className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${colors.fill} rounded-b-lg`}
					style={{
						height: `${fillHeight.get() * 100}%`,
					}}
				/>
				{/* Bubbles */}
				<motion.div
					className="absolute bottom-0 left-0 right-0 overflow-hidden"
					style={{ height: `${fillHeight.get() * 100}%` }}>
					{[...Array(5)].map((_, i) => (
						<motion.div
							key={i}
							className={`absolute ${colors.bubble} ${dimensions.bubble} rounded-full`}
							animate={{
								y: [-20, -40],
								x: [0, i % 2 === 0 ? 5 : -5],
								opacity: [0.5, 0],
							}}
							transition={{
								duration: 1,
								repeat: Infinity,
								delay: i * 0.2,
							}}
							style={{
								left: `${20 + i * 15}%`,
								bottom: "0%",
							}}
						/>
					))}
				</motion.div>
			</div>
			{/* Beaker Neck */}
			<div
				className={`absolute -top-4 left-1/2 -translate-x-1/2 ${dimensions.neck} border-2 border-b-0 ${colors.border} rounded-t-lg`}
			/>
			{/* Progress Text */}
			{showLabel && (
				<div
					className={`absolute -bottom-8 left-1/2 -translate-x-1/2 font-medium ${colors.text} ${dimensions.text}`}>
					{Math.round(progress * 100)}%
				</div>
			)}
		</motion.div>
	)
}
