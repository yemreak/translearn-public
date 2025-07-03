"use client"

import { AppLayout } from "@/app/layout/app-layout"
import { cn } from "@/app/lib/utils"
import { t } from "@/app/lib/language"
import {
	BrainIcon,
	GoogleIcon,
	MicrophoneIcon,
	SparklesIcon,
} from "@/components/icons"
import { useAuth } from "@/hooks/auth"
import { useUiStore } from "@/app/store/ui"
import { motion } from "framer-motion"
import { useState } from "react"
import { HowItWorks } from "../../components/ui/beta/how-it-works"

export default function AuthPage() {
	const auth = useAuth()
	const [isSigningIn, setIsSigningIn] = useState(false)
	const [showHowItWorks, setShowHowItWorks] = useState(false)
	const currentLanguage = useUiStore(state => state.currentLanguage)

	const handleSignIn = async () => {
		try {
			setIsSigningIn(true)
			await auth.signIn()
		} finally {
			setIsSigningIn(false)
		}
	}

	const setCurrentLanguage = useUiStore(state => state.setCurrentLanguage)

	const toggleLanguage = () => {
		setCurrentLanguage(currentLanguage === "tr" ? "en" : "tr")
	}

	const content = (
		<div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
			{/* Language Toggle */}
			<div className="absolute top-4 right-4">
				<motion.button
					onClick={toggleLanguage}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 transition-colors">
					<span className="text-sm font-medium">
						{currentLanguage === "tr" ? "EN" : "TR"}
					</span>
				</motion.button>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="w-full max-w-2xl space-y-12">
				{/* Brand */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="text-center space-y-2">
					<h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
						{t("auth.brand.title", currentLanguage)}
					</h1>
					<p className="text-white/50 text-base">
						{t("auth.brand.subtitle", currentLanguage)}
					</p>
				</motion.div>

				{/* Hero */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
					className="text-center space-y-6">
					<h2 className="text-4xl font-bold text-white">
						{t("auth.hero.title", currentLanguage)}
					</h2>
					<p className="text-white/70 text-lg max-w-xl mx-auto">
						{t("auth.hero.description", currentLanguage)}
					</p>

					{/* Quick Actions */}
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
						<motion.button
							onClick={handleSignIn}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							disabled={isSigningIn}
							className={cn(
								"flex items-center justify-center gap-3",
								"px-6 py-3 rounded-xl text-base font-medium",
								"bg-gradient-to-r from-blue-600 to-blue-700",
								"text-white shadow-lg shadow-blue-900/20",
								"transition-all duration-200",
								"disabled:opacity-50 disabled:cursor-not-allowed",
								"active:shadow-sm"
							)}>
							<GoogleIcon className="w-5 h-5" />
							<span>
								{isSigningIn ? t("auth.cta.signing", currentLanguage) : t("auth.cta.start", currentLanguage)}
							</span>
						</motion.button>
						<motion.button
							onClick={() => {
								setShowHowItWorks(!showHowItWorks)
							}}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							disabled
							className={cn(
								"flex items-center justify-center gap-3",
								"px-6 py-3 rounded-xl text-base font-medium",
								"bg-white/10 hover:bg-white/20",
								"text-white/90",
								"transition-all duration-200",
								"active:shadow-sm",
								"disabled:opacity-50 disabled:cursor-not-allowed",
								showHowItWorks && "bg-white/20"
							)}>
							<SparklesIcon className="w-5 h-5" />
							<span>{t("auth.cta.howItWorks", currentLanguage)}</span>
						</motion.button>
					</div>
				</motion.div>

				{/* Features */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.4 }}
					className="space-y-6">
					<HowItWorks
						showHowItWorks={showHowItWorks}
						onClose={() => setShowHowItWorks(false)}
					/>

					<div className="grid gap-6">
						<motion.div
							whileHover={{ scale: 1.02 }}
							className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
							<div className="flex flex-col items-center gap-4">
								<MicrophoneIcon className="w-12 h-12 text-blue-400" />
								<div className="space-y-2 text-center">
									<h3 className="text-xl font-medium text-white">
										{t("auth.feature1.title", currentLanguage)}
									</h3>
									<p className="text-white/70 text-lg">
										{t("auth.feature1.description", currentLanguage)}
									</p>
								</div>
							</div>
						</motion.div>

						<motion.div
							whileHover={{ scale: 1.02 }}
							className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
							<div className="flex flex-col items-center gap-4">
								<BrainIcon className="w-12 h-12 text-yellow-400" />
								<div className="space-y-2 text-center">
									<h3 className="text-xl font-medium text-white">
										{t("auth.feature2.title", currentLanguage)}
									</h3>
									<p className="text-white/70 text-lg">
										{t("auth.feature2.description", currentLanguage)}
									</p>
								</div>
							</div>
						</motion.div>

						<motion.div
							whileHover={{ scale: 1.02 }}
							className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
							<div className="flex flex-col items-center gap-4">
								<SparklesIcon className="w-12 h-12 text-purple-400" />
								<div className="space-y-2 text-center">
									<h3 className="text-xl font-medium text-white">
										{t("auth.feature3.title", currentLanguage)}
									</h3>
									<p className="text-white/70 text-lg">
										{t("auth.feature3.description", currentLanguage)}
									</p>
								</div>
							</div>
						</motion.div>
					</div>
				</motion.div>

				{/* CTA */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.6 }}
					className="space-y-6">
					<motion.button
						onClick={handleSignIn}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						disabled={isSigningIn}
						className={cn(
							"w-full flex items-center justify-center gap-3",
							"px-6 py-3 rounded-xl text-base font-medium",
							"bg-gradient-to-r from-blue-600 to-blue-700",
							"text-white shadow-lg shadow-blue-900/20",
							"transition-all duration-200",
							"disabled:opacity-50 disabled:cursor-not-allowed",
							"active:shadow-sm"
						)}>
						<GoogleIcon className="w-5 h-5" />
						<span>
							{isSigningIn ? t("auth.cta.signing", currentLanguage) : t("auth.cta.continueGoogle", currentLanguage)}
						</span>
					</motion.button>
				</motion.div>
			</motion.div>
		</div>
	)

	return <AppLayout content={content} />
}
