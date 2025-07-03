/**
 * @reason Language switcher component inspired by ion channels
 * Like a cell membrane protein that switches states with a click
 *
 * @inspiration
 * - Ion channels: Binary state switching
 * - Neurotransmitter release: Quick response to stimulus
 * - Membrane potential: Visual feedback on state change
 */
"use client"

import { LanguageCode } from "@/app/types/common"
import { AnimatePresence, motion } from "framer-motion"

type LanguageSwitcherProps = {
	value: LanguageCode
	onChange: (language: LanguageCode) => void
}

export function LanguageSwitcher({
	value,
	onChange,
}: LanguageSwitcherProps) {
	const toggleLanguage = () => {
		onChange(value === "en" ? "tr" : "en")
	}

	return (
		<button
			onClick={toggleLanguage}
			className="p-2 rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/5 transition-colors flex items-center gap-2">
			{/* <div className="w-6 h-6 text-white/70">
				<LanguageIcon />
			</div> */}
			<AnimatePresence mode="wait">
				<motion.div
					key={value}
					initial={{ y: 10, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: -10, opacity: 0 }}
					className="w-6 flex items-center justify-center">
					<span className="text-sm font-medium text-white/70">
						{value.toUpperCase()}
					</span>
				</motion.div>
			</AnimatePresence>
		</button>
	)
}
