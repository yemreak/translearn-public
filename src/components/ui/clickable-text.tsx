/**
 * @purpose Clickable inline text component that accurately detects click position on text
 *
 * @description
 * Uses span (inline element) instead of div (block) to:
 * - Limit clickable area to just the text content
 * - Calculate click position relative to actual text width
 * - Maintain natural text flow in layout
 *
 * @implementation
 * - Uses getBoundingClientRect() for precise text boundaries
 * - Calculates character index based on click position
 * - Maps click position to predefined segments
 * - Supports character highlighting with smooth transition
 *
 * @reasoning
 * Initially wrong approach:
 * - "Need a clickable container" -> Used div
 * - "Need to handle click anywhere in container" -> Used full width
 * - "Need to calculate position relative to container" -> Complex math
 *
 * Correct approach:
 * - "Need clickable text" -> Used span
 * - "Need to handle click only on text" -> Natural text width
 * - "Need to calculate position relative to text" -> Simple math
 *
 * Important note on semantic HTML:
 * We use <span> because this is a text-level component, not a container.
 * Using <div> would:
 * - Break natural text flow
 * - Create unnecessary block-level container
 * - Make click position calculation less accurate
 *
 * @example
 * <ClickableText
 *   text="Hello World"
 *   segments={[{start: 0, end: 5, text: "Hello"}, {start: 6, end: 11, text: "World"}]}
 *   highlightIndex={5}
 *   onClick={(charIndex, segment) => console.log(charIndex, segment)}
 * />
 */
import { CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline"
import { AnimatePresence, motion } from "framer-motion"
import { type ReactNode, useState, useEffect } from "react"
import { toast } from "sonner"

function RefreshOverlay() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="absolute inset-0 overflow-hidden rounded-lg bg-black/5 backdrop-blur-[1px]">
			<motion.div
				initial={{ x: "-100%" }}
				animate={{ x: "100%" }}
				transition={{
					duration: 1.5,
					repeat: Infinity,
					ease: "linear",
				}}
				className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent"
			/>
		</motion.div>
	)
}

export type ClickableTextOnClick = (info: {
	charIndex: number
	word: string
	wordStart: number
	wordEnd: number
	segment: { start: number; end: number; text: string }
}) => void
export type ClickableTextProps = {
	text: string
	segments: Array<{
		start: number
		end: number
		text: string
	}>
	highlightIndex?: number
	isPersistentHighlight?: boolean
	className?: string
	isRefreshing?: boolean
	highlightSegments?: boolean
	onClick?: ClickableTextOnClick
}

export function ClickableText(props: ClickableTextProps) {
	const [showCopyCheck, setShowCopyCheck] = useState(false)
	const [persistentHighlight, setPersistentHighlight] = useState<number | undefined>(
		props.highlightIndex
	)
	const [tappedSegmentIndex, setTappedSegmentIndex] = useState<number | null>(null)
	const [showHint, setShowHint] = useState(false)

	const effectiveHighlight = props.isPersistentHighlight
		? persistentHighlight ?? props.highlightIndex
		: props.highlightIndex

	// Show hint for first-time users on mobile
	useEffect(() => {
		if (props.highlightSegments && props.segments.length > 0) {
			const hasSeenHint = localStorage.getItem("clickableTextHintShown")
			if (!hasSeenHint && "ontouchstart" in window) {
				setShowHint(true)
				setTimeout(() => {
					setShowHint(false)
					localStorage.setItem("clickableTextHintShown", "true")
				}, 3000)
			}
		}
	}, [props.highlightSegments, props.segments.length])

	// Split text into words and spaces, keeping both
	const words = props.text.split(/(\s+)/)
	let currentIndex = 0
	const wordInfo = words.map(word => {
		const start = currentIndex
		const end = currentIndex + word.length
		currentIndex += word.length
		// Clean word from punctuation but keep original for display
		const cleanWord = word.replace(/[.,!?;:'"()]/g, "").trim()

		// Find which segment this word belongs to
		const segmentIndex = props.segments.findIndex(
			segment =>
				// Word is completely inside segment
				(start >= segment.start && end <= segment.end) ||
				// Word overlaps with segment start
				(start < segment.start && end > segment.start) ||
				// Word overlaps with segment end
				(start < segment.end && end > segment.end) ||
				// Segment is completely inside word
				(segment.start >= start && segment.end <= end)
		)

		return {
			word,
			cleanWord,
			start,
			end,
			isSpace: /^\s+$/.test(word),
			segmentIndex: segmentIndex !== -1 ? segmentIndex : null,
		}
	})

	const handleClick = (
		e: React.MouseEvent<HTMLSpanElement>,
		wordData: {
			word: string
			cleanWord: string
			start: number
			end: number
			isSpace: boolean
			segmentIndex: number | null
		}
	) => {
		if (!props.onClick || wordData.isSpace) return

		const target = e.currentTarget
		const rect = target.getBoundingClientRect()
		const clickX = e.clientX - rect.left
		const charWidth = rect.width / wordData.word.length
		const charIndex = wordData.start + Math.floor(clickX / charWidth)

		if (props.isPersistentHighlight) {
			setPersistentHighlight(charIndex)
		}

		const clickedSegment = props.segments.find(
			segment => charIndex >= segment.start && charIndex < segment.end
		)

		if (clickedSegment) {
			// Show tap feedback
			if (wordData.segmentIndex !== null) {
				setTappedSegmentIndex(wordData.segmentIndex)
				setTimeout(() => setTappedSegmentIndex(null), 300)
			}

			props.onClick({
				charIndex,
				word: wordData.cleanWord,
				wordStart: wordData.start,
				wordEnd: wordData.end,
				segment: clickedSegment,
			})
		}
	}

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(props.text)
			setShowCopyCheck(true)
			setTimeout(() => setShowCopyCheck(false), 1000)
		} catch {
			toast.error("Failed to copy text")
		}
	}

	if (!props.text) return null

	const renderText = (): ReactNode => {
		// For each character in the text, determine if it belongs to a segment
		// and if that segment is currently hovered
		const charSegmentMap = new Array(props.text.length).fill(null)
		const charHoveredMap = new Array(props.text.length).fill(false)

		if (props.highlightSegments) {
			props.segments.forEach((segment, segmentId) => {
				for (let i = segment.start; i < segment.end; i++) {
					if (i < props.text.length) {
						charSegmentMap[i] = segmentId
					}
				}
			})
		}

		if (typeof effectiveHighlight === "number") {
			return wordInfo.map((info, index) => {
				// Apply underline to spaces that are part of segments
				if (info.isSpace) {
					const spaceChars = info.word.split("")
					const renderedSpaceChars = spaceChars.map((_char, charIndex) => {
						const globalCharIndex = info.start + charIndex
						const inSegment = charSegmentMap[globalCharIndex] !== null
						const isHovered = charHoveredMap[globalCharIndex]

						return props.highlightSegments && inSegment ? (
							<span
								key={charIndex}
								className="relative"
								style={{
									borderBottom: `3px solid ${
										tappedSegmentIndex === charSegmentMap[globalCharIndex]
											? "rgba(255, 255, 255, 0.9)"
											: isHovered
											? "rgba(255, 255, 255, 0.7)"
											: "rgba(255, 255, 255, 0.5)"
									}`,
									display: "inline-block",
									width: "0.25em", // Ensure space width is preserved
								}}>
								&nbsp;
							</span>
						) : (
							<span key={charIndex}>&nbsp;</span>
						)
					})

					return <span key={index}>{renderedSpaceChars}</span>
				}

				const isHighlighted =
					effectiveHighlight >= info.start && effectiveHighlight < info.end

				// Split the word into characters and apply underline to those in segments
				const wordChars = info.word.split("")
				const renderedChars = wordChars.map((char, charIndex) => {
					const globalCharIndex = info.start + charIndex
					const inSegment = charSegmentMap[globalCharIndex] !== null
					const isHovered = charHoveredMap[globalCharIndex]

					// Apply underline style to characters in segments
					return props.highlightSegments && inSegment ? (
						<motion.span
							key={charIndex}
							className="relative"
							initial={
								showHint && charSegmentMap[globalCharIndex] === 0 && charIndex === 0
									? { y: 0 }
									: false
							}
							animate={
								showHint && charSegmentMap[globalCharIndex] === 0 && charIndex === 0
									? { y: [-2, 0, -2] }
									: {}
							}
							transition={{
								duration: 0.5,
								repeat: 3,
								delay: charIndex * 0.05,
							}}
							style={{
								borderBottom: `3px solid ${
									tappedSegmentIndex === charSegmentMap[globalCharIndex]
										? "rgba(255, 255, 255, 0.9)"
										: isHovered
										? "rgba(255, 255, 255, 0.7)"
										: "rgba(255, 255, 255, 0.5)"
								}`,
								display: "inline-block",
								backgroundColor:
									tappedSegmentIndex === charSegmentMap[globalCharIndex]
										? "rgba(255, 255, 255, 0.1)"
										: "transparent",
								transition: "all 0.2s ease",
							}}>
							{char}
						</motion.span>
					) : (
						<span key={charIndex}>{char}</span>
					)
				})

				if (isHighlighted) {
					const preHighlight = info.word.slice(0, effectiveHighlight - info.start)
					const highlight = info.word[effectiveHighlight - info.start]
					const postHighlight = info.word.slice(effectiveHighlight - info.start + 1)

					return (
						<span
							key={index}
							className={`inline-block`}
							onClick={e => handleClick(e, info)}>
							{preHighlight}
							<motion.span
								initial={{ backgroundColor: "rgba(255, 255, 255, 0)" }}
								animate={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
								className="text-white rounded px-0.5">
								{highlight}
							</motion.span>
							{postHighlight}
						</span>
					)
				}

				return (
					<span
						key={index}
						className={`inline-block touch-manipulation ${
							info.segmentIndex !== null ? "active:scale-[0.98] cursor-pointer" : ""
						}`}
						style={{
							// Add padding for better touch targets on mobile
							padding: info.segmentIndex !== null ? "4px 2px" : "0",
							margin: info.segmentIndex !== null ? "-4px -2px" : "0",
						}}
						onClick={e => handleClick(e, info)}>
						{renderedChars}
					</span>
				)
			})
		}

		return wordInfo.map((info, index) => {
			// Apply underline to spaces that are part of segments
			if (info.isSpace) {
				const spaceChars = info.word.split("")
				const renderedSpaceChars = spaceChars.map((_char, charIndex) => {
					const globalCharIndex = info.start + charIndex
					const inSegment = charSegmentMap[globalCharIndex] !== null
					const isHovered = charHoveredMap[globalCharIndex]

					return props.highlightSegments && inSegment ? (
						<span
							key={charIndex}
							className="relative"
							style={{
								borderBottom: `3px solid ${
									tappedSegmentIndex === charSegmentMap[globalCharIndex]
										? "rgba(255, 255, 255, 0.9)"
										: isHovered
										? "rgba(255, 255, 255, 0.7)"
										: "rgba(255, 255, 255, 0.5)"
								}`,
								display: "inline-block",
								width: "0.25em", // Ensure space width is preserved
							}}>
							&nbsp;
						</span>
					) : (
						<span key={charIndex}>&nbsp;</span>
					)
				})

				return <span key={index}>{renderedSpaceChars}</span>
			}

			// Split the word into characters and apply underline to those in segments
			const wordChars = info.word.split("")
			const renderedChars = wordChars.map((char, charIndex) => {
				const globalCharIndex = info.start + charIndex
				const inSegment = charSegmentMap[globalCharIndex] !== null
				const isHovered = charHoveredMap[globalCharIndex]

				// Apply underline style to characters in segments
				return props.highlightSegments && inSegment ? (
					<motion.span
						key={charIndex}
						className="relative"
						initial={
							showHint && charSegmentMap[globalCharIndex] === 0 && charIndex === 0
								? { y: 0 }
								: false
						}
						animate={
							showHint && charSegmentMap[globalCharIndex] === 0 && charIndex === 0
								? { y: [-2, 0, -2] }
								: {}
						}
						transition={{
							duration: 0.5,
							repeat: 3,
							delay: charIndex * 0.05,
						}}
						style={{
							borderBottom: `3px solid ${
								tappedSegmentIndex === charSegmentMap[globalCharIndex]
									? "rgba(255, 255, 255, 0.9)"
									: isHovered
									? "rgba(255, 255, 255, 0.7)"
									: "rgba(255, 255, 255, 0.5)"
							}`,
							display: "inline-block",
							backgroundColor:
								tappedSegmentIndex === charSegmentMap[globalCharIndex]
									? "rgba(255, 255, 255, 0.1)"
									: "transparent",
							transition: "all 0.2s ease",
						}}>
						{char}
					</motion.span>
				) : (
					<span key={charIndex}>{char}</span>
				)
			})

			return (
				<span
					key={index}
					className={`inline-block touch-manipulation ${
						info.segmentIndex !== null ? "active:scale-[0.98] cursor-pointer" : ""
					}`}
					style={{
						// Add padding for better touch targets on mobile
						padding: info.segmentIndex !== null ? "4px 2px" : "0",
						margin: info.segmentIndex !== null ? "-4px -2px" : "0",
					}}
					onClick={e => handleClick(e, info)}>
					{renderedChars}
				</span>
			)
		})
	}

	return (
		<div className="group flex items-center gap-2 relative">
			{/* Mobile hint */}
			<AnimatePresence>
				{showHint && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="absolute -top-8 left-0 text-xs text-white/60 whitespace-nowrap bg-black/80 px-2 py-1 rounded">
						Tap phrases to explore →
					</motion.div>
				)}
			</AnimatePresence>
			<span
				className={`relative inline-block cursor-pointer transition-opacity duration-200 select-none ${
					props.className || ""
				} ${props.isRefreshing ? "opacity-50" : ""}`}>
				<AnimatePresence>{props.isRefreshing && <RefreshOverlay />}</AnimatePresence>
				{renderText()}
			</span>
			<motion.button
				initial={false}
				animate={{
					scale: showCopyCheck ? 1 : 1,
					opacity: 1,
				}}
				whileTap={{ scale: 0.95 }}
				onClick={handleCopy}
				className="opacity-0 group-hover:opacity-100 transition-all duration-200">
				{showCopyCheck ? (
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ type: "spring", stiffness: 200, damping: 20 }}>
						<CheckCircleIcon className="w-4 h-4 text-green-400" />
					</motion.div>
				) : (
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ type: "spring", stiffness: 200, damping: 20 }}>
						<DocumentDuplicateIcon className="w-4 h-4 text-white/50 hover:text-white/70" />
					</motion.div>
				)}
			</motion.button>
		</div>
	)
}

// Example usage for playground with two ClickableText components
/*
// Original transcribed text with segments
const originalText = "Bu bir örnek cümledir ve segmentleri göstermek için kullanılacak.";
const originalSegments = [
	{ start: 0, end: 16, text: "Bu bir örnek cümledir" },
	{ start: 21, end: 52, text: "segmentleri göstermek için kullanılacak" }
];

// Transcreated text with reverse segments
const transcreatedText = "This is an example sentence and will be used to show segments.";
const transcreatedSegments = [
	{ start: 0, end: 27, text: "This is an example sentence" },
	{ start: 32, end: 59, text: "will be used to show segments" }
];

// In your component:
return (
	<div className="flex flex-col gap-6">
		<div>
			<h3 className="text-sm font-medium mb-2">Original Text (with segments)</h3>
			<ClickableText
				text={originalText}
				segments={originalSegments}
				highlightSegments={true}
				onClick={(info) => {
		;
				}}
			/>
		</div>

		<div>
			<h3 className="text-sm font-medium mb-2">Transcreated Text (with reverse segments)</h3>
			<ClickableText
				text={transcreatedText}
				segments={transcreatedSegments}
				highlightSegments={true}
				onClick={(info) => {
		;
				}}
			/>
		</div>
	</div>
);
*/
