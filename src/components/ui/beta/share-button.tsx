"use client"

import { cn } from "@/app/lib/utils"

type ShareButtonProps = {
	onClick: () => void
	className?: string
	type: "ios" | "android"
}

/**
 * @reason Share button component that triggers content sharing
 * Like a cell's vesicle that packages content for export
 *
 * @example
 * <ShareButton onClick={() => setIsShareSheetOpen(true)} />
 */
export function ShareButton({
	onClick,
	type,
	className,
}: ShareButtonProps) {
	return type === "ios" ? (
		<button
			onClick={onClick}
			className={cn(
				"p-3 rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/5 transition-colors",
				className
			)}>
			<div className="w-6 h-6 text-white/70">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round">
					<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
					<polyline points="16 6 12 2 8 6" />
					<line x1="12" y1="2" x2="12" y2="15" />
				</svg>
			</div>
		</button>
	) : (
		<button
			onClick={onClick}
			className={cn(
				"p-3 rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/5 transition-colors",
				className
			)}>
			<div className="w-6 h-6 text-white/70">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round">
					<circle cx="18" cy="5" r="3" />
					<circle cx="6" cy="12" r="3" />
					<circle cx="18" cy="19" r="3" />
					<line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
					<line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
				</svg>
			</div>
		</button>
	)
}
