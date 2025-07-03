import { cn } from "../lib/utils"

/**
 * @purpose Display iOS-style status bar
 */
export function StatusBar() {
	return (
		<div
			className={cn(
				"fixed top-0 left-0 right-0 z-[10]",
				"h-[44px]",
				"flex justify-center items-center",
				"bg-black/80 backdrop-blur-md"
			)}>
			<h1 className="text-[10px] tracking-[0.2em] font-semibold text-white/70">
				TransLearn
			</h1>
		</div>
	)
}
