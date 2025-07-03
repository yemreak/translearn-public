import { ReactNode } from "react"

/**
 * @purpose Display header content with iOS-style layout
 */
export function Header(props: {
	left?: {
		content: ReactNode
		description?: string
	}
	middle?: {
		content: ReactNode
		description?: string
	}
	right?: {
		content: ReactNode
		description?: string
	}
}) {
	return (
		<header
			id="app-header"
			className="fixed top-[44px] left-0 right-0 z-[10]">
			{/* Ambient Background - Inspired by Linear's subtle gradients */}
			<div className="absolute inset-0">
				<div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-transparent" />
			</div>

			{/* Content - Inspired by Apple Music's focused layout */}
			<div className="relative">
				<div className="container max-w-screen-sm mx-auto">
					<nav className="grid grid-cols-[48px_1fr_48px] items-center h-16">
						{/* Left - Quick Actions */}
						<div className="flex justify-start px-4">
							{props.left?.content}
						</div>

						{/* Middle - Context & Navigation */}
						<div className="flex justify-center">
							<div className="relative group">{props.middle?.content}</div>
						</div>

						{/* Right - Secondary Actions */}
						<div className="flex justify-end px-4">
							{props.right?.content}
						</div>
					</nav>
				</div>
			</div>

			{/* Bottom Fade - Inspired by Notion's seamless transitions */}
			<div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-transparent to-transparent pointer-events-none" />
		</header>
	)
}
