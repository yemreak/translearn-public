/**
 * @purpose Display original text, translation, transcreation and transliteration with synchronized highlighting during playback
 */
export function SegmentCard(props: {
	segment: {
		in?: string
		out?: string
		lit?: string
	}
	activeIndices?: {
		out: [number, number]
		lit: [number, number]
	}
	onClick?: () => void
	onIndicesClick?: (position: number) => void
}) {
	const handleTextClick = (
		type: "in" | "out" | "lit",
		e: React.MouseEvent
	) => {
		if (!props.segment[type] || type === "in") {
			props.onClick?.()
			return
		}
		if (!props.onIndicesClick) return

		// Get click position relative to text
		const target = e.currentTarget as HTMLDivElement
		const rect = target.getBoundingClientRect()
		const x = e.clientX - rect.left
		const textPosition = Math.floor(
			(x / rect.width) * props.segment[type]!.length
		)

		// Call onTextClick with the position if provided
		if (props.onIndicesClick) {
			props.onIndicesClick(textPosition)
			return
		}
	}

	const highlightText = (text?: string, indices?: [number, number]) => {
		if (!text) return null
		if (!indices) return text

		const [start, end] = indices
		const before = text.slice(0, start)
		const highlight = text.slice(start, end)
		const after = text.slice(end)

		return (
			<span>
				{before}
				<span className="bg-white/30 text-white transition-all duration-200 rounded px-0.5 animate-pulse">
					{highlight}
				</span>
				{after}
			</span>
		)
	}

	return (
		<>
			<div className="max-w-2xl mx-auto">
				<div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 transition-all duration-500 hover:bg-black/30 animate-fade-in ">
					{/* Original Text */}
					<div className="mb-3">
						{props.segment.in ? (
							<div
								className="text-lg font-medium text-white/90 transition-all duration-300 animate-slide-up cursor-pointer active:opacity-70"
								onClick={e => handleTextClick("in", e)}>
								{props.segment.in}
							</div>
						) : (
							<div className="h-7 bg-white/5 rounded animate-pulse" />
						)}
					</div>

					{/* Translation */}
					<div className="mb-2">
						{props.segment.out ? (
							<div
								className="text-base text-white/70 transition-all duration-300 animate-slide-up delay-100 cursor-pointer active:opacity-70"
								onClick={e => handleTextClick("out", e)}>
								{highlightText(props.segment.out, props.activeIndices?.out)}
							</div>
						) : (
							<div className="h-6 bg-white/5 rounded animate-pulse" />
						)}
					</div>

					{/* Transliteration */}
					<div>
						{props.segment.lit ? (
							<div
								className="text-sm font-mono text-white/50 tracking-wide transition-all duration-300 animate-slide-up delay-200 cursor-pointer active:opacity-70"
								onClick={e => handleTextClick("lit", e)}>
								{highlightText(props.segment.lit, props.activeIndices?.lit)}
							</div>
						) : (
							<div className="h-5 bg-white/5 rounded animate-pulse" />
						)}
					</div>
				</div>
			</div>
		</>
	)
}
