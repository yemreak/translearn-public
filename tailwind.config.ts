import scrollbarHide from "tailwind-scrollbar-hide"
import type { Config } from "tailwindcss"

export default {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	safelist: [
		{
			// e-button icin gerekli `bg-{color}-500` gibi renkleri kullanmak icin
			pattern:
				/(bg|text|border|ring|shadow|from|to)-(red|blue|green|yellow|purple|pink|orange|white|gray|dark)/,
			variants: ["hover", "active", "focus", "disabled", "group-hover"],
		},
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-quicksand)"],
			},
			spacing: {
				"safe-top": "var(--safe-area-top)",
				"safe-bottom": "var(--safe-area-bottom)",
				"safe-left": "var(--safe-area-left)",
				"safe-right": "var(--safe-area-right)",
			},
			padding: {
				safe: "env(safe-area-inset-bottom)",
			},
			fontSize: {
				xs: ["0.75rem", { lineHeight: "1.125rem" }], // 13px
				sm: ["0.875rem", { lineHeight: "1.25rem" }], // 15px
				base: ["1rem", { lineHeight: "1.5rem" }], // 17px
				lg: ["1.125rem", { lineHeight: "1.75rem" }], // 19px
				xl: ["1.25rem", { lineHeight: "1.75rem" }], // 21px
			},
			keyframes: {
				glow: {
					"0%, 100%": {
						textShadow: "0 0 4px rgb(var(--color-blue) / 0.5)",
					},
					"50%": {
						textShadow: "0 0 16px rgb(var(--color-purple) / 0.8)",
					},
				},
				seekingPulse: {
					"0%, 100%": {
						transform: "scale(1)",
						boxShadow: "0 0 30px var(--tw-shadow-color)",
					},
					"50%": {
						transform: "scale(1.08)",
						boxShadow: "0 0 50px var(--tw-shadow-color)",
					},
				},
				seekingBounce: {
					"0%, 100%": {
						transform: "translateY(0) rotate(0deg)",
					},
					"25%": {
						transform: "translateY(-6px) rotate(-2deg)",
					},
					"75%": {
						transform: "translateY(-6px) rotate(2deg)",
					},
				},
				seekingGlow: {
					"0%, 100%": {
						opacity: "0.6",
						transform: "scale(1)",
					},
					"50%": {
						opacity: "1",
						transform: "scale(1.05)",
					},
				},
				seekingOrbit: {
					"0%": {
						transform: "rotate(0deg) translateX(2px) rotate(0deg)",
					},
					"100%": {
						transform: "rotate(360deg) translateX(2px) rotate(-360deg)",
					},
				},
				/**
				 * Understanding Pulse
				 * - Subtle outer ring pulsing
				 * - Indicates active concentration
				 * - Similar to a person's focused state
				 */
				understandingPulse: {
					"0%, 100%": {
						opacity: "0.3",
						transform: "scale(1)",
						boxShadow: "0 0 10px var(--tw-shadow-color)",
					},
					"50%": {
						opacity: "0.5",
						transform: "scale(1.02)",
						boxShadow: "0 0 20px var(--tw-shadow-color)",
					},
				},
				/**
				 * Understanding Synapse Flash
				 * - Inner glow pulsing
				 * - Shows neural activity and processing intensity
				 * - Mimics brain synapses firing during comprehension
				 */
				understandingSynapseFlash: {
					"0%, 100%": {
						opacity: "0.3",
						transform: "scale(0.96)",
						boxShadow: "inset 0 0 40px var(--tw-shadow-color)",
					},
					"50%": {
						opacity: "0.5",
						transform: "scale(1)",
						boxShadow: "inset 0 0 80px var(--tw-shadow-color)",
					},
				},
				/**
				 * Understanding Cognitive Rotate
				 * - Rotating dashed circles in opposite directions
				 * - Represents active mental processing
				 * - Like gears turning in the mind during understanding
				 */
				understandingCognitiveRotate: {
					"0%": { transform: "rotate(0deg)" },
					"100%": { transform: "rotate(360deg)" },
				},
				/**
				 * Completion Indicator (fadeIn)
				 * - Two vertical lines that appear when processing completes
				 * - Shows successful understanding
				 * - Like a person nodding in comprehension
				 */
				understandingFadeIn: {
					from: { opacity: "0", transform: "scale(0.8)" },
					to: { opacity: "0.8", transform: "scale(1)" },
				},
				/**
				 * Listening Attentive Pulse
				 * - Subtle outer ring pulsing
				 * - Indicates active concentration
				 * - Similar to a person's focused state
				 */
				listeningAttentivePulse: {
					"0%, 100%": {
						transform: "scale(1)",
						opacity: "0.3",
					},
					"50%": {
						transform: "scale(0.9)",
						opacity: "0.35",
					},
				},
				/**
				 * Listening Wave Inward
				 * - Contracting rings that move inward
				 * - Represents sound waves being received
				 * - Mimics how we focus on incoming sound
				 */
				listeningWaveInward: {
					"0%": {
						transform: "scale(1.3)",
						opacity: "0.35",
					},
					"50%": {
						transform: "scale(1.1)",
						opacity: "0.35",
					},
					"100%": {
						transform: "scale(0.8)",
						opacity: "0.2",
					},
				},
				listeningNod: {
					"0%, 100%": {
						transform: "translateY(0) scale(0.95)",
					},
					"50%": {
						transform: "translateY(1px) scale(0.95)",
					},
				},
				listeningFocusGlow: {
					"0%, 100%": {
						boxShadow: "inset 0 0 10px var(--tw-shadow-color)",
						opacity: "0.3",
					},
					"50%": {
						boxShadow: "inset 0 0 20px var(--tw-shadow-color)",
						opacity: "0.45",
					},
				},
				speakingWaveOutward: {
					"0%": {
						transform: "scale(1)",
						opacity: "0.4",
					},
					"100%": {
						transform: "scale(1.8)",
						opacity: "0",
					},
				},
				speakingActivePulse: {
					"0%, 100%": {
						transform: "scale(1)",
						opacity: "0.8",
					},
					"50%": {
						transform: "scale(1.03)",
						opacity: "0.9",
					},
				},
				speakingExpressionGlow: {
					"0%, 100%": {
						boxShadow: "0 0 15px var(--tw-shadow-color)",
					},
					"50%": {
						boxShadow: "0 0 25px var(--tw-shadow-color)",
					},
				},
				"fade-in": {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				"slide-up": {
					"0%": { transform: "translateY(10px)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" },
				},
				gradient: {
					"0%": { backgroundPosition: "0% 50%" },
					"100%": { backgroundPosition: "200% 50%" },
				},
				highlight: {
					"0%": {
						backgroundColor: "rgba(255, 255, 255, 0.2)",
						transform: "scale(1.02)",
					},
					"100%": {
						backgroundColor: "transparent",
						transform: "scale(1)",
					},
				},
			},
			animation: {
				glow: "glow 2s ease-in-out infinite",
				seekingPulse: "seekingPulse 2s ease-in-out infinite",
				seekingBounce: "seekingBounce 3s ease-in-out infinite",
				seekingGlow: "seekingGlow 2s ease-in-out infinite",
				seekingOrbit: "seekingOrbit 3s linear infinite",
				seekingOrbitReverse: "seekingOrbit 2s linear infinite reverse",
				understandingPulse: "understandingPulse 2s ease-in-out infinite",
				understandingSynapseFlash:
					"understandingSynapseFlash 2s ease-in-out infinite",
				understandingCognitiveRotate:
					"understandingCognitiveRotate 4s linear infinite",
				understandingCognitiveRotateReverse:
					"understandingCognitiveRotate 3s linear infinite reverse",
				understandingFadeIn: "understandingFadeIn 0.3s ease-out forwards",
				understandingGlow: "understandingGlow 2s ease-in-out infinite",
				thinkingPulse: "thinkingPulse 3s ease-in-out infinite",
				listeningAttentivePulse:
					"listeningAttentivePulse 3s ease-in-out infinite",
				listeningWaveInward: "listeningWaveInward 3s ease-in infinite",
				listeningWaveInwardDelayed:
					"listeningWaveInward 3s ease-in infinite 0.6s",
				listeningNod: "listeningNod 3s ease-in-out infinite",
				listeningFocusGlow: "listeningFocusGlow 4s ease-in-out infinite",
				speakingWaveOutward: "speakingWaveOutward 2s ease-out infinite",
				speakingActivePulse: "speakingActivePulse 2s ease-in-out infinite",
				speakingExpressionGlow:
					"speakingExpressionGlow 3s ease-in-out infinite",
				"fade-in": "fade-in 0.5s ease-out",
				"slide-up": "slide-up 0.5s ease-out forwards",
				pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
				highlight: "highlight 1.5s ease-out",
			},
		},
	},
	plugins: [scrollbarHide],
} satisfies Config
