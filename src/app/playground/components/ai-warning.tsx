import { AnimatePresence, motion } from "framer-motion"

import { t } from "@/app/lib/language"
import { useUiStore } from "@/app/store/ui"
import { SupportedLanguageCode } from "@/app/types/common"
import { InformationCircleIcon } from "@heroicons/react/24/outline"

export function AIWarning(props: {
	language: SupportedLanguageCode
}) {
	const { isAiWarningDismissed, dismissAiWarning } = useUiStore()

	return (
		<AnimatePresence>
			{!isAiWarningDismissed && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ type: "spring", duration: 0.5 }}
					className="flex items-center justify-center gap-2 mb-4 bg-gray-900/80 backdrop-blur-sm px-4 py-2 rounded-xl">
					<InformationCircleIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
					<span className="text-sm text-gray-300">
						{t("playground.aiWarning", props.language)}
					</span>
					<button
						onClick={dismissAiWarning}
						className="ml-2 p-1 rounded-full hover:bg-white/5 active:bg-white/10 transition-colors">
						<motion.div
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							className="w-5 h-5 text-gray-400">
							×
						</motion.div>
					</button>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
