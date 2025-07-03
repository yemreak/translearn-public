import { ReactNode } from "react"
import { cn } from "../lib/utils"

/**
 * @purpose Reusable footer item component to reduce code duplication
 */
function FooterItem({ content }: { content: ReactNode }) {
	return (
		<div className="flex flex-col items-center gap-2">
			<div
				className={cn(
					"flex items-center"
							)}>
				{content}
			</div>
			{/* add gap */}
			<div className="pb-[2rem]" />
			{/* {description && (
				<p className="text-xs text-gray text-center max-w-[10rem]">
					{description}
				</p>
			)} */}
		</div>
	)
}

/**
 * @purpose Display footer with floating effect and proper spacing
 * Grid Layout: |empty|left|middle(x3)|right|empty|
 */
export function Footer(props: {
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
		<footer className="fixed bottom-0 left-0 right-0 z-[10] overflow-x-hidden">
			<div className="bg-gradient-to-t from-black via-black/50 to-transparent backdrop-blur-[2px]">
				<div className="relative p-4">
					<div className="container max-w-screen-sm mx-auto">
						<div className="grid grid-cols-7 items-center">
							{/* Empty space */}
							<div className="col-span-1" />

							{/* Left section */}
							<div className="col-span-1 flex justify-end">
								{props.left && <FooterItem {...props.left} />}
							</div>

							{/* Middle section (takes 3 columns) */}
							<div className="col-span-3 flex justify-center">
								{props.middle && <FooterItem {...props.middle} />}
							</div>

							{/* Right section */}
							<div className="col-span-1 flex justify-start">
								{props.right && <FooterItem {...props.right} />}
							</div>

							{/* Empty space */}
							<div className="col-span-1" />
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}
