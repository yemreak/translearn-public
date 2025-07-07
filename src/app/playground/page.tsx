"use client"

import { Sidebar } from "@/app/components/layout/sidebar"
import { AppLayout } from "@/app/layout/app-layout"
import { t } from "@/app/lib/language"
import { useUiStore } from "@/app/store/ui"
import { NativeEchoResponse, TranscribeResponse, TtsResponse } from "@/app/types/ai"
import { ClipboardIcon, SidebarIcon } from "@/components/icons"
import { GameSheet } from "@/components/ui/beta/game-sheet"
import { HistoryPanel } from "@/components/ui/beta/history-panel"
import { LanguageSwitcher } from "@/components/ui/beta/language-switcher"
import { LookupSheet } from "@/components/ui/beta/lookup-sheet"
import { ShareButton } from "@/components/ui/beta/share-button"
import { ShareSheet } from "@/components/ui/beta/share-sheet"
import { ClickableText, ClickableTextOnClick } from "@/components/ui/clickable-text"
import { ListeningButton } from "@/components/ui/e-buttons/listening"
import { SeekingButton } from "@/components/ui/e-buttons/seeking"
import { UnderstandingButton } from "@/components/ui/e-buttons/understanding"
import { TtsPlayer } from "@/components/ui/tts-player"
import { useNativeEcho, useTranscribe, useTts } from "@/hooks/ai"
import { useHistory } from "@/hooks/history"
import { usePreferences } from "@/hooks/preferences"
import { useRecorder } from "@/hooks/recorder"
import { useTtsPlayer } from "@/hooks/tts-player"
import { Tables } from "@/types/supabase"
import { useCallback, useMemo, useRef, useState } from "react"
import { toast } from "sonner"

import { cn } from "@/app/lib/utils"
import { Language, LanguageCode, SupportedLanguageCode } from "@/app/types/common"
import { ApiKeySetup } from "@/components/ui/api-key-setup"
import { useUserEnvironments } from "@/hooks/user-environments"
import {
	ArrowPathIcon,
	CheckCircleIcon,
	KeyIcon,
	PuzzlePieceIcon,
	SpeakerWaveIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline"
import { motion } from "framer-motion"
import { useEffect } from "react"
import { ProgressButton } from "../../components/ui/beta/progress-button"
import { AIWarning } from "./components/ai-warning"

// Format time like nature's cycles (minute:second)
const formatTime = (seconds: number) => {
	const mins = Math.floor(seconds / 60)
	const secs = Math.floor(seconds % 60)
	return `${mins}:${secs.toString().padStart(2, "0")}`
}

// Remove parenthetical content (background sounds) from text
const removeParentheticalContent = (text: string): string => {
	// Remove text within parentheses and any extra spaces
	return text
		.replace(/\s*\([^)]*\)\s*/g, " ")
		.trim()
		.replace(/\s+/g, " ")
}

// Character limits for different features
const GAME_MODE_CHAR_LIMIT = 100
const TTS_CHAR_LIMIT = 400

/**
 * @reason TranSpeech page - The sensory interface of our language processing center
 * Like a specialized neuron that handles both input and output
 */
export default function PlaygroundPage() {
	const preferences = usePreferences()
	const history = useHistory()

	// Persistent UI states from Zustand
	const {
		hasSeenGuidance,
		setHasSeenGuidance,
		isPrivateMode,
		currentLanguage,
		setCurrentLanguage,
	} = useUiStore()

	// Refs
	const historyId = useRef<string | undefined>(undefined)

	// UI States
	const [clipboardText, setClipboardText] = useState<string | undefined>(undefined)
	const [isClipboardLoading, setIsClipboardLoading] = useState<boolean>(false)
	const [isTransliterationVisible, setIsTransliterationVisible] = useState<boolean>(true)
	const [isDebugVisible, setIsDebugVisible] = useState<boolean>(false)
	const [lookupSpeed, setLookupSpeed] = useState<number>(1)

	// Consolidated processing state
	const [processingState, setProcessingState] = useState({
		transcribe: undefined as TranscribeResponse | undefined,
		nativeEcho: undefined as NativeEchoResponse | undefined,
		tts: undefined as TtsResponse | undefined,
	})

	// Shared TTS cache for both game mode and lookup sheet
	const [ttsCache, setTtsCache] = useState<Record<string, string>>({})

	// Memoized expensive operations
	const segmentData = useMemo(() => {
		if (!processingState.nativeEcho?.segments) return []

		// Calculate cumulative positions to handle repeated words correctly
		let currentPosition = 0
		const fullText = processingState.nativeEcho.text

		return processingState.nativeEcho.segments.map(segment => {
			// Find the segment text starting from current position
			const segmentText = segment.out
			const startIndex = fullText.indexOf(segmentText, currentPosition)

			if (startIndex === -1) {
				// Fallback: if not found, use current position
				const start = currentPosition
				const end = currentPosition + segmentText.length
				currentPosition = end
				return { start, end, text: segmentText }
			}

			// Update current position to end of this segment
			const start = startIndex
			const end = startIndex + segmentText.length
			currentPosition = end

			return { start, end, text: segmentText }
		})
	}, [processingState.nativeEcho])

	const transliterationText = useMemo(() => {
		return processingState.nativeEcho?.segments?.map(s => s.lit).join(" ") || ""
	}, [processingState.nativeEcho?.segments])

	// Game state
	const [gameState, setGameState] = useState({
		isOpen: false,
		speed: 0.8,
		segments: undefined as { in: string; out: string; lit?: string }[] | undefined,
		text: "",
		isLoading: false,
	})

	// Feature hooks
	const recorder = useRecorder()
	const tts = useTtsPlayer(
		processingState.tts?.audio_base64 && processingState.tts?.alignment
			? {
					audio_base64: processingState.tts.audio_base64,
					alignment: processingState.tts.alignment,
			  }
			: undefined
	)

	// API Key Management
	const { hasOpenAI, isLoading: isLoadingKeys } = useUserEnvironments()
	const [showApiKeySetup, setShowApiKeySetup] = useState(false)

	// Mutations
	const transcribeMutation = useTranscribe()
	const nativeEchoMutation = useNativeEcho()
	const ttsMutation = useTts()

	const handleTtsResponse = useCallback(
		async (result: TtsResponse) => {
			if (!historyId.current) return

			setProcessingState(prev => ({
				...prev,
				tts: result,
			}))
			if (!isPrivateMode) {
				await history.update({
					id: historyId.current,
					tts_audio_base64: result.audio_base64,
					tts_alignment: result.alignment,
				})
			}
		},
		[isPrivateMode, history]
	)

	const handleTts = useCallback(async () => {
		if (!processingState.nativeEcho?.text) return

		// Voice check removed - using user's own API keys now

		const result = await ttsMutation.mutateAsync({
			text: removeParentheticalContent(processingState.nativeEcho.text),
		})

		if (result) {
			await handleTtsResponse(result)
		}
	}, [processingState.nativeEcho?.text, ttsMutation, handleTtsResponse])

	const handleReset = useCallback(() => {
		setProcessingState({
			transcribe: undefined,
			nativeEcho: undefined,
			tts: undefined,
		})
		setTtsCache({}) // Clear shared TTS cache
		setGameState(prev => ({
			...prev,
			isOpen: false,
			segments: undefined,
			text: "",
			isLoading: false,
		}))
	}, [])

	const handleStartRecording = useCallback(async () => {
		if (!preferences?.target_language) return
		if (!hasSeenGuidance) {
			setHasSeenGuidance(true)
		}

		try {
			handleReset()
			await recorder.start()
		} catch {
			toast.error(t("error.api.transcribe", currentLanguage))
			handleReset()
		}
	}, [
		preferences?.target_language,
		hasSeenGuidance,
		setHasSeenGuidance,
		handleReset,
		recorder,
		currentLanguage,
	])

	const handleStopRecording = async () => {
		if (!preferences?.target_language) return

		try {
			const result = await recorder.stop()
			if (!result) throw new Error("Failed to stop recording")

			const transcribeResult = await transcribeMutation.mutateAsync({
				speech: result.blob,
				duration: result.duration,
				language: currentLanguage,
			})

			setProcessingState(prev => ({
				...prev,
				transcribe: transcribeResult,
			}))

			if (!isPrivateMode) {
				const historyItem = await history.add({
					source_language: currentLanguage as LanguageCode,
					target_language: preferences?.target_language as LanguageCode,
					duration: result.duration,
					transcription: transcribeResult.text,
					segments: [],
					transcreation: "",
					transcribe_segments: [],
					transliteration: "",
					tts_alignment: null,
					tts_audio_base64: null,
				})
				historyId.current = historyItem.id
			}

			if (transcribeResult.text) {
				const nativeEchoResult = await nativeEchoMutation.mutateAsync({
					text: transcribeResult.text,
					target_language: preferences?.target_language as LanguageCode,
				})

				// Native echo provides everything we need in one call
				setProcessingState(prev => ({
					...prev,
					nativeEcho: nativeEchoResult,
				}))

				if (!isPrivateMode && historyId.current) {
					await history.update({
						id: historyId.current,
						transcreation: nativeEchoResult.text,
						segments: nativeEchoResult.segments,
					})
				}
			}
		} catch {
			toast.error(t("error.api.transcribe", currentLanguage))
			handleReset()
		}
	}

	const handleCancelRecording = useCallback(async () => {
		await recorder.stop()
		handleReset()
	}, [recorder, handleReset])

	const handleGameMode = useCallback(async () => {
		if (!preferences?.target_language || !processingState.transcribe?.text) return
		if (processingState.transcribe.text.length > 100) return

		// Voice check removed - using user's own API keys now

		setGameState(prev => ({ ...prev, isLoading: true }))

		const result = await nativeEchoMutation.mutateAsync({
			text: processingState.transcribe.text,
			target_language: preferences?.target_language as LanguageCode,
		})

		const uniqueTargets = Array.from(new Set(result.segments.map(s => s.out)))
		const allCached = uniqueTargets.every(text => ttsCache[text])

		if (!allCached) {
			const newCacheEntries: Record<string, string> = {}

			await Promise.all(
				uniqueTargets
					.filter(text => !ttsCache[text])
					.map(async text => {
						try {
							// Using user's own API key for TTS
							const ttsResult = await ttsMutation.mutateAsync({
								text: removeParentheticalContent(text),
							})
							newCacheEntries[text] = ttsResult.audio_base64
						} catch {
							toast.error("Failed to generate speech")
						}
					})
			)

			// Update shared cache
			setTtsCache(prev => ({
				...prev,
				...newCacheEntries,
			}))
		}

		setGameState({
			segments: result.segments,
			text: result.text,
			isOpen: true,
			isLoading: false,
			speed: gameState.speed,
		})
	}, [
		preferences?.target_language,
		processingState.transcribe?.text,
		gameState.speed,
		nativeEchoMutation,
		ttsMutation,
		ttsCache,
	])

	const handleRestoreHistory = (item: Tables<"user_histories">) => {
		if (!item) return

		// Reset current state
		handleReset()

		// Restore transcribe response
		if (item.transcription) {
			setProcessingState(prev => ({
				...prev,
				transcribe: {
					text: item.transcription,
					language: item.source_language as Language,
					duration: item.duration || 0,
				},
			}))
		}

		// Restore native echo response
		if (item.transcreation) {
			// Create native echo response from history data
			const historySegments =
				(item.segments as {
					in: string
					out: string
					lit?: string
				}[]) || []
			setProcessingState(prev => ({
				...prev,
				nativeEcho: {
					text: item.transcreation!, // We check for truthy above, so it's safe to assert non-null
					segments: historySegments.map(segment => ({
						...segment,
						lit: segment.lit || "", // Provide empty string if lit is missing from history
					})),
				},
			}))

			// Native echo provides segments automatically - no background generation needed
		}

		// Native echo handles transliteration automatically - no separate restoration needed

		// Restore TTS response if exists
		if (item.tts_audio_base64 && item.tts_alignment) {
			setProcessingState(prev => ({
				...prev,
				tts: {
					audio_base64: item.tts_audio_base64 as string,
					alignment: item.tts_alignment as {
						characters: string[]
						character_start_times_seconds: number[]
						character_end_times_seconds: number[]
					},
					normalized_alignment: item.tts_alignment as {
						characters: string[]
						character_start_times_seconds: number[]
						character_end_times_seconds: number[]
					},
				},
			}))
		}

		// Set history ID for updates
		historyId.current = item.id

		// Scroll to top after a short delay to ensure content is rendered
		setTimeout(() => {
			window.scrollTo({ top: 0, behavior: "smooth" })
		}, 100)
	}

	const handleClipboardPaste = async () => {
		try {
			if (clipboardText) {
				// Process the confirmed text for transcreation
				setIsClipboardLoading(true)
				const text = clipboardText
				setClipboardText(undefined)

				// Auto native echo
				const nativeEchoResult = await nativeEchoMutation.mutateAsync({
					text,
					target_language: preferences?.target_language as LanguageCode,
				})

				setProcessingState(prev => ({
					...prev,
					nativeEcho: nativeEchoResult,
				}))

				// Skip history update in private mode
				if (!isPrivateMode && historyId.current) {
					await history.update({
						id: historyId.current,
						transcreation: nativeEchoResult.text,
						segments: nativeEchoResult.segments,
					})
				}
				setIsClipboardLoading(false)
			} else {
				// Read from clipboard
				const text = await navigator.clipboard.readText()
				if (!text) return
				setClipboardText(text)

				// Clear all states before starting new flow
				handleReset()

				// Set transcribe response as if it came from voice
				setProcessingState(prev => ({
					...prev,
					transcribe: {
						text,
						language: currentLanguage as Language,
						duration: 0,
					},
				}))

				// Skip history in private mode
				if (!isPrivateMode) {
					const historyItem = await history.add({
						source_language: currentLanguage as LanguageCode,
						target_language: preferences?.target_language as LanguageCode,
						transcription: text,
						duration: 0,
						segments: [],
						transcreation: "",
						transcribe_segments: [],
						transliteration: "",
						tts_alignment: null,
						tts_audio_base64: null,
					})
					historyId.current = historyItem.id
				}
			}
		} catch {
			setClipboardText(undefined)
			setIsClipboardLoading(false)
			toast.error("Failed to process clipboard text")
		}
	}

	// Only UI/UX related refs and states
	const contentRef = useRef<HTMLDivElement>(null)
	const transcribeTextRef = useRef<HTMLDivElement>(null)
	const footerButtonRef = useRef<HTMLDivElement>(null)

	// Only UI/UX states
	const [isHistoryOpen, setIsHistoryOpen] = useState(false)
	const [isShareSheetOpen, setIsShareSheetOpen] = useState(false)
	const [isPanelVisible, setIsPanelVisible] = useState(false)
	const [isLookupOpen, setIsLookupOpen] = useState(false)
	const [selectedSegment, setSelectedSegment] = useState<{
		text: string
		translation?: string
		transliteration?: string
		segments?: Array<{ in: string; out: string }>
	}>()

	const handleSeek = useCallback(
		(charIndex: number, shouldPlay = false) => {
			if (!processingState.tts?.alignment?.character_start_times_seconds) return

			tts.controls.seek(
				processingState.tts.alignment.character_start_times_seconds[charIndex]
			)
			tts.state.currentIndex = charIndex

			if (shouldPlay) {
				tts.controls.play()
			}
		},
		[
			processingState.tts?.alignment?.character_start_times_seconds,
			tts.controls,
			tts.state,
		]
	)

	const onTransCreationClick: ClickableTextOnClick = useCallback(
		info => {
			// If audio is playing, seek to the position
			if (
				tts.state.isPlaying &&
				processingState.tts?.alignment?.character_start_times_seconds
			) {
				handleSeek(info.charIndex)
				return
			}

			// Get the clicked segment
			const clickedSegment = processingState.nativeEcho?.segments?.find(
				segment => info.segment.text === segment.out
			)

			if (clickedSegment) {
				// Open sheet with the segment data
				setSelectedSegment({
					text: clickedSegment.out,
					translation: clickedSegment.in,
				})
				setIsLookupOpen(true)

				// Get transliteration for the segment - native echo provides it directly
				setSelectedSegment(prev => ({
					...prev!,
					transliteration: clickedSegment?.lit,
				}))
			}
		},
		[
			tts.state.isPlaying,
			processingState.tts?.alignment?.character_start_times_seconds,
			processingState.nativeEcho?.segments,
			handleSeek,
		]
	)

	const handleLookupTts = async (speed: number) => {
		if (!selectedSegment?.text) return

		const text = selectedSegment.text

		// Check if we already have this in cache
		if (ttsCache[text]) {
			// Use cached audio
			const audio = new Audio(`data:audio/mp3;base64,${ttsCache[text]}`)
			audio.playbackRate = speed
			audio.play()
			return
		}

		// Generate new TTS and cache it
		try {
			const result = await ttsMutation.mutateAsync({
				text: removeParentheticalContent(text),
			})

			// Update cache
			setTtsCache(prev => ({
				...prev,
				[text]: result.audio_base64,
			}))

			// Play audio
			const audio = new Audio(`data:audio/mp3;base64,${result.audio_base64}`)
			audio.playbackRate = speed
			audio.play()
		} catch {
			// Error handling is already done by the mutation
		}
	}

	const onTransliterationClick: ClickableTextOnClick = useCallback(
		info => {
			// If audio is playing, seek to the position
			if (
				tts.state.isPlaying &&
				processingState.tts?.alignment?.character_start_times_seconds
			) {
				handleSeek(info.charIndex)
				return
			}

			// If audio exists but not playing, start playing from clicked position
			if (processingState.tts?.alignment?.character_start_times_seconds) {
				handleSeek(info.charIndex, true)
			}
		},
		[
			tts.state.isPlaying,
			processingState.tts?.alignment?.character_start_times_seconds,
			handleSeek,
		]
	)

	// Keyboard navigation and accessibility
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Space bar for recording (when focused on recording button)
			if (
				e.code === "Space" &&
				!recorder.isRecording &&
				document.activeElement === footerButtonRef.current
			) {
				e.preventDefault()
				handleStartRecording()
			}
			// Escape to cancel recording
			if (e.key === "Escape" && recorder.isRecording) {
				handleCancelRecording()
			}
			// Ctrl+Enter for TTS
			if (e.ctrlKey && e.key === "Enter" && processingState.nativeEcho?.text) {
				e.preventDefault()
				handleTts()
			}
		}

		document.addEventListener("keydown", handleKeyDown)
		return () => document.removeEventListener("keydown", handleKeyDown)
	}, [
		recorder.isRecording,
		processingState.nativeEcho?.text,
		handleStartRecording,
		handleCancelRecording,
		handleTts,
	])

	// Only UI/UX effects
	useEffect(() => {
		const handleClickOutside = () => {
			if (!isClipboardLoading) {
				setClipboardText(undefined)
			}
		}

		if (clipboardText) {
			document.addEventListener("click", handleClickOutside)
		}

		return () => {
			document.removeEventListener("click", handleClickOutside)
		}
	}, [clipboardText, isClipboardLoading, setClipboardText])

	// Prevent undefined language usage
	if (!currentLanguage) return null

	const getButton = () => {
		if (recorder.isLoading) return <UnderstandingButton color="red" />
		if (recorder.isRecording)
			return (
				<ListeningButton
					color="red"
					amplitude={recorder.amplitude}
					onClick={handleStopRecording}
				/>
			)
		if (transcribeMutation.isPending) return <UnderstandingButton color="gray" />
		if (nativeEchoMutation.isPending) return <UnderstandingButton color="orange" />
		if (ttsMutation.isPending) return <UnderstandingButton color="purple" />

		return (
			<div ref={footerButtonRef} tabIndex={0}>
				<SeekingButton color="red" onClick={handleStartRecording} />
			</div>
		)
	}

	const getDescription = () => {
		if (recorder.isRecording) return t("description.stopRecording", currentLanguage)
		if (transcribeMutation.isPending) return t("description.processing", currentLanguage)
		if (nativeEchoMutation.isPending) return t("description.crafting", currentLanguage)
		if (ttsMutation.isPending) return t("description.generating", currentLanguage)
		return t("description.start", currentLanguage)
	}

	const getContent = () => {
		// Show API key setup prompt if no OpenAI key
		if (!isLoadingKeys && !hasOpenAI) {
			return (
				<div ref={contentRef} className="space-y-8">
					<div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-in fade-in slide-in-from-bottom duration-700">
						<div className="p-4 rounded-full bg-amber-500/20">
							<KeyIcon className="w-12 h-12 text-amber-400" />
						</div>
						<div className="text-center space-y-2">
							<h2 className="text-xl font-medium text-white">
								{t("apiKey.required", currentLanguage)}
							</h2>
							<p className="text-white/70 max-w-sm">
								To use TransLearn, you need to configure your API keys. Your keys are
								encrypted and never shared.
							</p>
						</div>
						<button
							onClick={() => setShowApiKeySetup(true)}
							className="px-6 py-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors">
							Configure API Keys
						</button>
					</div>
				</div>
			)
		}

		return (
			<div ref={contentRef} className="space-y-8">
				<AIWarning language={currentLanguage} />

				{/* Empty State Guidance - Inspired by Apple's first-time UX */}
				{!hasSeenGuidance &&
					!processingState.transcribe?.text &&
					!recorder.isRecording &&
					!transcribeMutation.isPending && (
						<div className="flex flex-col items-center justify-center min-h-[40vh] space-y-6 animate-in fade-in slide-in-from-bottom duration-700">
							{/* Flowing Arrow Animation */}
							<div className="flex flex-col items-center space-y-12">
								<p className="text-white/70 text-center text-lg max-w-xs">
									{t("content.start", currentLanguage)}
								</p>
								<motion.div
									animate={{
										y: [0, 30, 0],
										opacity: [0.5, 1, 0.5],
										scale: [1, 1.1, 1],
									}}
									transition={{
										duration: 2.5,
										ease: "easeInOut",
										repeat: Infinity,
									}}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="48"
										height="48"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.5"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="text-white/50">
										<path d="M12 5v14" />
										<path d="m19 12-7 7-7-7" />
									</svg>
								</motion.div>
							</div>
						</div>
					)}

				<div className="space-y-4">
					{processingState.transcribe?.text && !recorder.isRecording && (
						<>
							<div className="space-y-4">
								{/* Original Text */}
								<div ref={transcribeTextRef} className="mb-3">
									<ClickableText
										text={processingState.transcribe.text}
										segments={[
											{
												start: 0,
												end: processingState.transcribe.text.length,
												text: processingState.transcribe.text,
											},
										]}
										className="text-lg font-medium text-white/90"
									/>
								</div>

								{/* Translation */}
								{processingState.nativeEcho?.text && (
									<div className="mb-2">
										<ClickableText
											text={removeParentheticalContent(processingState.nativeEcho.text)}
											segments={
												segmentData.length > 0
													? segmentData.map(segment => ({
															...segment,
															text: removeParentheticalContent(segment.text),
													  }))
													: [
															{
																start: 0,
																end: removeParentheticalContent(
																	processingState.nativeEcho.text
																).length,
																text: removeParentheticalContent(
																	processingState.nativeEcho.text
																),
															},
													  ]
											}
											highlightSegments={!!processingState.nativeEcho.segments}
											highlightIndex={
												tts.state.currentIndex > 0 && processingState.tts?.alignment
													? tts.state.currentIndex
													: undefined
											}
											className="text-base text-white/70 hover:text-white/90 transition-colors cursor-pointer"
											onClick={onTransCreationClick}
										/>
									</div>
								)}

								{/* Transliteration */}
								{processingState.nativeEcho?.segments && (
									<div className="space-y-2">
										<button
											onClick={() =>
												setIsTransliterationVisible(!isTransliterationVisible)
											}
											className="flex items-center gap-2 text-xs text-white/60 hover:text-white/80 transition-colors"
											aria-expanded={isTransliterationVisible}
											aria-controls="transliteration-content"
											aria-label="Toggle pronunciation display">
											<span>Pronunciation</span>
											<svg
												className={cn(
													"w-4 h-4 transition-transform duration-200",
													isTransliterationVisible ? "rotate-180" : ""
												)}
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												aria-hidden="true">
												<path d="M6 9l6 6 6-6" />
											</svg>
										</button>

										{isTransliterationVisible && (
											<div
												id="transliteration-content"
												className="animate-in slide-in-from-top-2 fade-in duration-200">
												<ClickableText
													text={transliterationText}
													segments={[
														{
															start: 0,
															end: transliterationText.length,
															text: transliterationText,
														},
													]}
													highlightIndex={
														tts.state.currentIndex > 0 && processingState.tts?.alignment
															? tts.state.currentIndex
															: undefined
													}
													className="text-sm font-mono text-white/50 tracking-wide hover:text-white/70 transition-colors cursor-pointer px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10"
													onClick={onTransliterationClick}
												/>
											</div>
										)}
									</div>
								)}

								{/* Debug Section */}
								{processingState.nativeEcho && (
									<div className="space-y-2">
										<button
											onClick={() => setIsDebugVisible(!isDebugVisible)}
											className="flex items-center gap-2 text-xs text-orange-400/60 hover:text-orange-400/80 transition-colors"
											aria-expanded={isDebugVisible}
											aria-controls="debug-content"
											aria-label="Toggle debug information">
											<span>Debug Response</span>
											<svg
												className={cn(
													"w-4 h-4 transition-transform duration-200",
													isDebugVisible ? "rotate-180" : ""
												)}
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												aria-hidden="true">
												<path d="M6 9l6 6 6-6" />
											</svg>
										</button>

										{isDebugVisible && (
											<div
												id="debug-content"
												className="animate-in slide-in-from-top-2 fade-in duration-200">
												<div className="bg-black/40 border border-orange-500/20 rounded-lg p-3 max-h-48 overflow-auto">
													<pre className="text-xs text-orange-300/70 font-mono whitespace-pre-wrap break-words">
														{JSON.stringify(processingState.nativeEcho, null, 2)}
													</pre>
												</div>
											</div>
										)}
									</div>
								)}
							</div>

							{processingState.tts?.audio_base64 && (
								<TtsPlayer
									isPlaying={tts.state.isPlaying}
									currentTime={tts.state.currentTime}
									duration={tts.state.duration}
									speed={tts.state.speed}
									onPlayPause={
										tts.state.isPlaying ? tts.controls.pause : tts.controls.play
									}
									onSeek={time => tts.controls.seek(time)}
									onSpeedChange={speed => tts.controls.setSpeed(speed)}
									speeds={[0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2]}
									seekStep={0.7}
								/>
							)}
						</>
					)}

					{processingState.nativeEcho?.text && !processingState.tts?.audio_base64 && (
						<ProgressButton
							nature="foreground"
							color="purple"
							isLoading={ttsMutation.isPending}
							loadingText={t("action.tts", currentLanguage)}
							onClick={handleTts}
							disabled={
								removeParentheticalContent(processingState.nativeEcho.text).length >
								TTS_CHAR_LIMIT
							}>
							<div className="flex items-center justify-center gap-2">
								<SpeakerWaveIcon className="w-5 h-5" />
								<span className="text-white/70">
									{removeParentheticalContent(processingState.nativeEcho.text).length >
									TTS_CHAR_LIMIT
										? t("content.textTooLong", currentLanguage)
										: t("content.listen", currentLanguage)}
								</span>
							</div>
						</ProgressButton>
					)}

					{/* Game Mode Button */}
					{processingState.transcribe?.text && (
						<ProgressButton
							nature="foreground"
							color="pink"
							isLoading={gameState.isLoading}
							loadingText={t("action.gamifying", currentLanguage)}
							onClick={handleGameMode}
							disabled={processingState.transcribe.text.length > GAME_MODE_CHAR_LIMIT}>
							<div className="flex items-center justify-center gap-2">
								<PuzzlePieceIcon className="w-5 h-5" />
								<span className="text-white/70">
									{processingState.transcribe.text.length > GAME_MODE_CHAR_LIMIT
										? t("content.textTooLong", currentLanguage)
										: t("content.gameMode", currentLanguage)}
								</span>
							</div>
						</ProgressButton>
					)}

					{/* Share Button */}
					{processingState.transcribe?.text && !recorder.isRecording && (
						<>
							<div className="flex justify-center items-center gap-4">
								<ShareButton onClick={() => setIsShareSheetOpen(true)} type="ios" />
							</div>
						</>
					)}

					{(recorder.isRecording || transcribeMutation.isPending) && (
						<div className="animate-pulse space-y-4">
							<div className="h-24 bg-white/5 rounded-lg flex items-center justify-center">
								<div className="space-y-2 text-center">
									<p className="text-white/70 text-lg">
										{recorder.isLoading
											? t("content.wait", currentLanguage)
											: recorder.isRecording
											? t("content.listening", currentLanguage)
											: t("content.converting", currentLanguage)}
									</p>
									<p className="text-white/50 text-sm">
										{recorder.isRecording ? (
											<>
												{t("content.tapMic", currentLanguage)}
												<br />
												<span className="text-white/30">
													{formatTime(recorder.duration)}
												</span>
											</>
										) : (
											t("content.wait", currentLanguage)
										)}
									</p>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Screen reader announcements */}
				<div id="sr-announcements" className="sr-only" aria-live="polite" role="status">
					{recorder.isRecording && "Recording started"}
					{transcribeMutation.isPending && "Processing speech"}
					{nativeEchoMutation.isPending && "Generating translation"}
					{ttsMutation.isPending && "Creating audio"}
					{processingState.tts && "Audio ready for playback"}
				</div>

				{/* Instructions for screen readers */}
				<div id="recording-instructions" className="sr-only">
					{recorder.isRecording
						? "Recording in progress. Click to stop recording or press Escape to cancel."
						: "Click to start recording your voice. Microphone access required. You can also press Space when focused."}
				</div>
				<div id="tts-char-limit" className="sr-only">
					Maximum {TTS_CHAR_LIMIT} characters allowed for audio generation
				</div>
				<div id="game-mode-char-limit" className="sr-only">
					Maximum {GAME_MODE_CHAR_LIMIT} characters allowed for game mode
				</div>

				{/* History Panel */}
				{history.items && history.items.length > 0 && (
					<div
						className={cn(
							"space-y-2",
							isPrivateMode && "opacity-30 pointer-events-none select-none"
						)}>
						<HistoryPanel
							items={history.items}
							onRestore={handleRestoreHistory}
							isPanelVisible={isPanelVisible}
							onPanelVisibilityChange={setIsPanelVisible}
							language={currentLanguage}
							onDelete={history.delete}
							onLoadMore={history.fetch}
							isLoading={history.isLoading}
						/>
					</div>
				)}
			</div>
		)
	}

	return (
		<>
			<AppLayout
				header={{
					left: {
						content: (
							<button
								onClick={() => setIsHistoryOpen(true)}
								className="p-2 rounded-lg hover:bg-white/10 active:bg-white/5">
								<SidebarIcon className="w-6 h-6 text-white/70" />
							</button>
						),
					},
					middle: {
						content: (
							<div className="relative">
								<span
									className={cn(
										"text-white/70 transition-opacity duration-300",
										isPrivateMode && "text-white/40"
									)}>
									TranSpeech
								</span>
							</div>
						),
					},
					right: {
						content: (
							<div className="flex items-center gap-2">
								<button
									onClick={() => setShowApiKeySetup(true)}
									className={cn(
										"p-2 rounded-lg hover:bg-white/10 active:bg-white/5 relative",
										!hasOpenAI && "animate-pulse"
									)}>
									<KeyIcon className="w-6 h-6 text-white/70" />
									{!hasOpenAI && (
										<div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full" />
									)}
								</button>
							</div>
						),
					},
				}}
				content={getContent()}
				footer={{
					left: {
						content: (
							<div className="flex items-center gap-2">
								<div className="relative">
									<button
										onClick={e => {
											e.stopPropagation() // Prevent click outside handler
											if (recorder.isRecording) {
												handleCancelRecording()
											} else {
												handleClipboardPaste()
											}
										}}
										className={cn(
											"p-2 rounded-lg transition-all duration-300",
											recorder.isRecording
												? "bg-red-500/20 hover:bg-red-500/30 active:bg-red-500/10"
												: clipboardText
												? "bg-green-500/20 hover:bg-green-500/30 active:bg-green-500/10"
												: "hover:bg-white/10 active:bg-white/5",
											isClipboardLoading && "opacity-50 pointer-events-none"
										)}>
										{isClipboardLoading ? (
											<ArrowPathIcon className="w-6 h-6 text-white/70 animate-spin" />
										) : recorder.isRecording ? (
											<XMarkIcon className="w-6 h-6 text-red-500" />
										) : clipboardText ? (
											<CheckCircleIcon className="w-6 h-6 text-green-500" />
										) : (
											<ClipboardIcon className="w-6 h-6 text-white/70" />
										)}
									</button>
									{clipboardText && !isClipboardLoading && !recorder.isRecording && (
										<div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-black/90 backdrop-blur-md border border-white/10 whitespace-nowrap">
											<p className="text-xs text-white/70">
												{t("content.confirmClipboard", currentLanguage)}
											</p>
										</div>
									)}
								</div>
							</div>
						),
					},
					middle: {
						content: getButton(),
						description: getDescription(),
					},
					right: {
						content: !transcribeMutation.isPending && (
							<LanguageSwitcher
								value={currentLanguage}
								onChange={(newLanguage: LanguageCode) => {
									// Update UI store
									setCurrentLanguage(newLanguage as SupportedLanguageCode)

									// Also update the preferences in database
									if (preferences?.update) {
										preferences.update({
											source_language: newLanguage as SupportedLanguageCode,
										})
									}
								}}
							/>
						),
					},
				}}
			/>

			<Sidebar isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
			<ShareSheet
				isOpen={isShareSheetOpen}
				onClose={() => setIsShareSheetOpen(false)}
				content={{
					original: processingState.transcribe?.text,
					translation: processingState.nativeEcho?.text
						? removeParentheticalContent(processingState.nativeEcho.text)
						: undefined,
					transliteration: transliterationText,
					audio_base64: processingState.tts?.audio_base64,
				}}
			/>
			<LookupSheet
				isOpen={isLookupOpen}
				onClose={() => {
					setIsLookupOpen(false)
					setSelectedSegment(undefined)
				}}
				selectedText={selectedSegment?.text || ""}
				translation={selectedSegment?.translation}
				transliteration={selectedSegment?.transliteration}
				segments={selectedSegment?.segments}
				onTtsClick={handleLookupTts}
				speed={lookupSpeed}
				onSpeedChange={setLookupSpeed}
				isTransliterationLoading={false}
				isTranslationLoading={nativeEchoMutation.isPending}
				isTtsLoading={ttsMutation.isPending}
			/>
			<GameSheet
				isOpen={gameState.isOpen}
				onClose={() => setGameState(prev => ({ ...prev, isOpen: false }))}
				texts={{
					in: processingState.transcribe?.text || "",
					out: gameState.text ? removeParentheticalContent(gameState.text) : "",
					lit: transliterationText,
				}}
				segments={gameState.segments}
				speed={gameState.speed}
				onSpeedChange={speed => setGameState(prev => ({ ...prev, speed }))}
				language={currentLanguage}
				onComplete={() => setGameState(prev => ({ ...prev, isOpen: false }))}
				onItemClick={async item => {
					if (item.type === "source") return

					// Check shared cache first
					if (!ttsCache[item.text]) {
						// Using user's own API key for TTS
						const ttsResult = await ttsMutation.mutateAsync({
							text: removeParentheticalContent(item.text),
						})

						// Update shared cache
						setTtsCache(prev => ({
							...prev,
							[item.text]: ttsResult.audio_base64,
						}))
					}

					// Create audio element and play
					const audio = new Audio(`data:audio/mp3;base64,${ttsCache[item.text]}`)
					audio.playbackRate = gameState.speed
					audio.play()
				}}
				isLoading={gameState.isLoading}
			/>

			{/* API Key Setup Modal */}
			<ApiKeySetup open={showApiKeySetup} onOpenChange={setShowApiKeySetup} />
		</>
	)
}
