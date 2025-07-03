import { cn } from "@/app/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"

/**
 * @reason Simple TTS player with minimal controls for speed adjustment
 */
export function TtsPlayer(props: {
	isPlaying: boolean
	currentTime: number
	duration: number
	speed: number
	onPlayPause: () => void
	onSeek: (time: number) => void
	onSpeedChange: (speed: number) => void
	speeds: number[]
	seekStep: number
}) {
	const [isSpeedOpen, setIsSpeedOpen] = useState(false)

	// Format seconds with leading zero
	const formatSeconds = (time: number) =>
		Math.floor(time).toString().padStart(2, "0")

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="mt-4 p-4 bg-black/20 backdrop-blur-sm rounded-xl">
			<div className="flex items-center justify-center gap-2">
				{/* Time Display */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
					className="w-10 text-center">
					<span className="text-sm font-mono text-white/50">
						{formatSeconds(props.currentTime)}s
					</span>
				</motion.div>

				{/* Backward Button */}
				<motion.button
					whileTap={{ scale: 0.95 }}
					onClick={() =>
						props.onSeek(Math.max(0, props.currentTime - props.seekStep))
					}
					className="w-10 h-10 flex items-center justify-center rounded-lg text-white/50 active:bg-white/5">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="w-5 h-5">
						<path d="M9.195 18.44c1.25.713 2.805-.19 2.805-1.629v-2.34l6.945 3.968c1.25.714 2.805-.188 2.805-1.628V8.688c0-1.44-1.555-2.342-2.805-1.628L12 11.03v-2.34c0-1.44-1.555-2.343-2.805-1.629l-7.108 4.062c-1.26.72-1.26 2.536 0 3.256l7.108 4.061Z" />
					</svg>
				</motion.button>

				{/* Play/Pause Button */}
				<motion.button
					whileTap={{ scale: 0.95 }}
					onClick={props.onPlayPause}
					className="w-12 h-12 flex items-center justify-center rounded-lg bg-white/10 active:bg-white/5 transition-all duration-300">
					{props.isPlaying ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="w-6 h-6 text-white">
							<path
								fillRule="evenodd"
								d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z"
								clipRule="evenodd"
							/>
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="w-6 h-6 text-white">
							<path
								fillRule="evenodd"
								d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
								clipRule="evenodd"
							/>
						</svg>
					)}
				</motion.button>

				{/* Forward Button */}
				<motion.button
					whileTap={{ scale: 0.95 }}
					onClick={() =>
						props.onSeek(
							Math.min(
								props.duration,
								props.currentTime + (props.seekStep || 5)
							)
						)
					}
					className="w-10 h-10 flex items-center justify-center rounded-lg text-white/50 active:bg-white/5">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="w-5 h-5">
						<path d="M5.055 7.06c-1.25-.714-2.805.189-2.805 1.628v8.123c0 1.44 1.555 2.342 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.342 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256L14.805 7.06C13.555 6.346 12 7.25 12 8.688v2.34L5.055 7.06Z" />
					</svg>
				</motion.button>

				{/* Speed Button */}
				<motion.button
					whileTap={{ scale: 0.95 }}
					onClick={() => setIsSpeedOpen(true)}
					className={cn(
						"w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300",
						"text-white/70 active:bg-white/5",
						props.speed !== 1 && "bg-white/10"
					)}>
					{props.speed}x
				</motion.button>

				{/* Duration Display */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
					className="w-10 text-center">
					<span className="text-sm font-mono text-white/50">
						{formatSeconds(props.duration)}s
					</span>
				</motion.div>
			</div>

			{/* Speed Selection Sheet */}
			<AnimatePresence>
				{isSpeedOpen && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
							onClick={() => setIsSpeedOpen(false)}
						/>
						<motion.div
							initial={{ opacity: 0, y: 100 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 100 }}
							className="fixed inset-x-0 bottom-0 p-4 bg-black/90 backdrop-blur-xl rounded-t-3xl z-50">
							<div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" />
							<div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
								{props.speeds.map(speed => (
									<motion.button
										key={speed}
										whileTap={{ scale: 0.95 }}
										onClick={() => {
											props.onSpeedChange(speed)
											setIsSpeedOpen(false)
										}}
										className={cn(
											"p-4 rounded-xl text-lg font-medium transition-all duration-300",
											props.speed === speed
												? "bg-white/20 text-white"
												: "text-white/50 active:bg-white/10"
										)}>
										{speed}x
									</motion.button>
								))}
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</motion.div>
	)
}
