"use client"

import { cn } from "@/app/lib/utils"
import { motion } from "framer-motion"
import { Drawer } from "vaul"

/**
 * @reason iOS-style bottom sheet component for modal interactions
 */

type BottomSheetProps = {
	isOpen: boolean
	onClose: () => void
	title?: string
	height?: string
	className?: string
	children: React.ReactNode
}

export function BottomSheet({
	isOpen,
	onClose,
	title,
	height = "50%",
	className,
	children,
}: BottomSheetProps) {
	return (
		<Drawer.Root open={isOpen} onOpenChange={onClose}>
			<Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
			<Drawer.Portal>
				<Drawer.Content
					className={cn(
						"bg-[#1c1c1e]/95 backdrop-blur-xl fixed bottom-0 left-0 right-0",
						"z-50 rounded-t-[10px] flex flex-col",
						"touch-none focus:outline-none",
						className
					)}
					style={{
						height,
						maxHeight: height,
						marginTop: "6rem", // 24px in tailwind
					}}>
					{/* Visually hidden title for accessibility */}
					<Drawer.Title className="sr-only">{title}</Drawer.Title>
					<Drawer.Description className="sr-only">
						{title ? `${title} content` : "Content"}
					</Drawer.Description>
					<div className="p-4 pb-2">
						<div className="mx-auto w-12 h-1.5 bg-zinc-300/40 rounded-full" />
					</div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="flex-1 overflow-auto overscroll-contain rounded-t-[10px] p-4">
						{children}
					</motion.div>
				</Drawer.Content>
			</Drawer.Portal>
		</Drawer.Root>
	)
}
