import { SpeakerWaveIcon } from "@heroicons/react/24/outline"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { Drawer } from "vaul"

type LookupDrawerProps = {
	isOpen: boolean
	onClose: () => void
	selectedText: string
	transliteration?: string
	translation?: string
	onTtsClick?: () => void
	isTransliterationLoading?: boolean
	isTranslationLoading?: boolean
	isTtsLoading?: boolean
}

function BubbleEffect() {
	return (
		<div className="absolute inset-0 overflow-hidden">
			{[...Array(5)].map((_, i) => (
				<motion.div
					key={i}
					className="absolute w-2 h-2 rounded-full bg-white/5"
					animate={{
						y: [-20, -40],
						x: [0, i % 2 === 0 ? 5 : -5],
						opacity: [0.2, 0],
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
		</div>
	)
}

function TtsButton({
	onClick,
	isLoading,
}: {
	onClick?: () => void
	isLoading?: boolean
}) {
	const [isPlaying, setIsPlaying] = useState(false)

	const handleClick = () => {
		if (!onClick || isLoading) return
		setIsPlaying(true)
		onClick()
		// Reset after animation duration
		setTimeout(() => setIsPlaying(false), 2000)
	}

	return (
		<motion.button
			onClick={handleClick}
			className="p-2 rounded-full hover:bg-white/10 active:bg-white/5 transition-all"
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

function LoadingPulse() {
	return (
		<div className="flex gap-1">
			{[...Array(3)].map((_, i) => (
				<motion.div
					key={i}
					className="w-1 h-1 rounded-full bg-white/20"
					animate={{
						scale: [1, 1.2, 1],
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

function LoadingShimmer() {
	return (
		<div className="relative overflow-hidden">
			<motion.div
				className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
				animate={{ x: ["0%", "200%"] }}
				transition={{
					duration: 2,
					repeat: Infinity,
					ease: "linear",
				}}
			/>
		</div>
	)
}

export function LookupDrawer({
	isOpen,
	onClose,
	selectedText,
	transliteration,
	translation,
	onTtsClick,
	isTransliterationLoading,
	isTranslationLoading,
	isTtsLoading,
}: LookupDrawerProps) {
	return (
		<AnimatePresence>
			{isOpen && (
				<Drawer.Root
					open={isOpen}
					onOpenChange={onClose}
					shouldScaleBackground>
					<Drawer.Portal>
						<div className="fixed inset-0 z-[60]">
							<Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
							<Drawer.Content className="fixed bottom-0 left-0 right-0 h-[70vh] bg-black/95 rounded-t-[20px] border-t border-white/10 backdrop-blur-xl">
								<div className="relative h-full">
									{/* Handle */}
									<div className="absolute top-3 inset-x-0 flex justify-center">
										<div className="w-12 h-1.5 rounded-full bg-white/20" />
									</div>

									{/* Content */}
									<div className="h-full pt-12 pb-8 px-6">
										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: 20 }}
											transition={{ duration: 0.2 }}
											className="relative h-full flex flex-col">
											{/* Selected Text */}
											<div className="relative">
												<div className="relative text-center space-y-2 py-4">
													<Drawer.Title asChild>
														<h3 className="text-xl font-medium text-white">
															{selectedText}
														</h3>
													</Drawer.Title>
													{isTransliterationLoading ? (
														<div className="flex justify-center">
															<LoadingPulse />
														</div>
													) : (
														transliteration && (
															<p className="font-mono text-sm text-white/50">
																{transliteration}
															</p>
														)
													)}
													{onTtsClick && (
														<div className="mt-2">
															<TtsButton
																onClick={onTtsClick}
																isLoading={isTtsLoading}
															/>
														</div>
													)}
												</div>
											</div>

											{/* Translation */}
											{(isTranslationLoading || translation) && (
												<motion.div
													initial={{ opacity: 0, y: 10 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ delay: 0.1 }}
													className="mt-8">
													<div className="relative p-4 rounded-xl bg-white/[0.02] border border-white/10">
														{isTranslationLoading ? (
															<>
																<LoadingShimmer />
																<div className="h-4 w-2/3 mx-auto bg-white/10 rounded" />
															</>
														) : (
															<>
																<BubbleEffect />
																<p className="relative text-base text-white/90">
																	{translation}
																</p>
															</>
														)}
													</div>
												</motion.div>
											)}
										</motion.div>
									</div>
								</div>
							</Drawer.Content>
						</div>
					</Drawer.Portal>
				</Drawer.Root>
			)}
		</AnimatePresence>
	)
}
