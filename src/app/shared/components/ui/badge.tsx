import { cn } from "@/app/lib/utils"
import { Color } from "@/app/types/ui"
import { motion } from "framer-motion"

const colorVariants: Record<Color, string> = {
	purple: "bg-purple-950/50 text-purple-300 ring-purple-500/30",
	blue: "bg-blue-950/50 text-blue-300 ring-blue-500/30",
	green: "bg-green-950/50 text-green-300 ring-green-500/30",
	yellow: "bg-yellow-950/50 text-yellow-300 ring-yellow-500/30",
	red: "bg-red-950/50 text-red-300 ring-red-500/30",
	gray: "bg-gray-800/50 text-gray-300 ring-gray-500/30",
	white: "bg-white/10 text-white ring-white/30",
	pink: "bg-pink-950/50 text-pink-300 ring-pink-500/30",
	orange: "bg-orange-950/50 text-orange-300 ring-orange-500/30",
	dark: "bg-black/50 text-gray-300 ring-gray-500/30",
}

export function Badge({
	color,
	text,
	icon: Icon,
}: {
	color: Color
	text: string
	icon?: React.ElementType
}) {
	return (
		<motion.span
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			className={cn(
				"inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
				colorVariants[color]
			)}>
			{Icon && <Icon className="w-3 h-3" />}
			{text}
		</motion.span>
	)
}
