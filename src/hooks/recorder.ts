/**
 * @reason Simple audio recorder with minimal cognitive load and Whisper optimizations
 * - Uses native MediaRecorder API with iOS-specific handling
 * - Atomic state management (everything lives in its own world)
 * - Just records and provides blob
 * - Throws errors instead of handling (ADHD approach)
 * - Optimized for Whisper: 16kHz, mono, 16-bit PCM
 */
import { useCallback, useEffect, useRef, useState } from "react"

export function useRecorder() {
	// Atomic states - everything lives in its own world like nature
	const [isRecording, setIsRecording] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [amplitude, setAmplitude] = useState(0)
	const [duration, setDuration] = useState(0)

	// Technical refs - implementation details
	const mediaRecorder = useRef<MediaRecorder | null>(null)
	const stream = useRef<MediaStream | null>(null)
	const startTime = useRef<number>(0)
	const chunks = useRef<Blob[]>([])
	const audioContext = useRef<AudioContext | null>(null)
	const analyser = useRef<AnalyserNode | null>(null)
	const animationFrame = useRef<number | null>(null)
	const isAnalysisSetup = useRef<boolean>(false)
	const dataArray = useRef<Uint8Array | null>(null)

	// Get supported MIME type for iOS and other browsers
	const getSupportedMimeType = useCallback(() => {
		const types = [
			"audio/wav", // PCM for Whisper
			"audio/mp4; codecs=mp4a.40.2", // iOS fallback
			"audio/webm; codecs=opus", // Modern browsers
		]
		return types.find(type => MediaRecorder.isTypeSupported(type))
	}, [])

	// Cleanup function to stop everything
	const cleanup = useCallback(() => {
		if (mediaRecorder.current?.state === "recording") {
			mediaRecorder.current.stop()
		}
		mediaRecorder.current = null

		if (stream.current) {
			stream.current.getTracks().forEach(track => track.stop())
			stream.current = null
		}

		if (animationFrame.current) {
			cancelAnimationFrame(animationFrame.current)
			animationFrame.current = null
		}

		if (audioContext.current?.state === "running") {
			audioContext.current.close().catch(console.error)
		}
		audioContext.current = null
		analyser.current = null
		dataArray.current = null
		isAnalysisSetup.current = false

		chunks.current = []
		startTime.current = 0
		setIsRecording(false)
		setIsLoading(false)
		setAmplitude(0)
		setDuration(0)
	}, [])

	// Update amplitude in real-time with optimized calculations
	const updateAmplitude = useCallback(() => {
		if (!analyser.current || !dataArray.current) return

		analyser.current.getByteFrequencyData(dataArray.current)

		let sum = 0
		for (let i = 0; i < dataArray.current.length; i++) {
			sum += dataArray.current[i]
		}
		const average = sum / dataArray.current.length
		setAmplitude((average / 255) * 4)

		animationFrame.current = requestAnimationFrame(updateAmplitude)
	}, [])

	// Update duration in real-time
	const updateDuration = useCallback(() => {
		if (!startTime.current || !isRecording) return

		setDuration(Math.round((Date.now() - startTime.current) / 1000))
		requestAnimationFrame(updateDuration)
	}, [isRecording])

	// Setup audio analysis lazily with optimized buffer allocation
	const setupAudioAnalysis = useCallback(async () => {
		if (!stream.current || isAnalysisSetup.current) return

		try {
			audioContext.current = new AudioContext()
			analyser.current = audioContext.current.createAnalyser()
			const source = audioContext.current.createMediaStreamSource(
				stream.current
			)
			source.connect(analyser.current)
			analyser.current.fftSize = 256

			// Allocate buffer once and reuse
			dataArray.current = new Uint8Array(analyser.current.frequencyBinCount)
			isAnalysisSetup.current = true

			if (isRecording) updateAmplitude()
		} catch (error) {
			console.error("Audio analysis setup failed:", error)
		}
	}, [isRecording, updateAmplitude])

	// Watch recording state changes
	useEffect(() => {
		if (!isRecording) return

		updateDuration() // Start duration updates
		setupAudioAnalysis() // Setup analysis after recording starts
	}, [isRecording, setupAudioAnalysis, updateDuration])

	// Stop recording and return audio blob and duration
	const stop = useCallback(async (): Promise<
		| {
				blob: Blob
				duration: number
		  }
		| undefined
	> => {
		if (!mediaRecorder.current) return undefined

		return new Promise(resolve => {
			if (!mediaRecorder.current) return resolve(undefined)

			mediaRecorder.current.onstop = () => {
				const mimeType = getSupportedMimeType()

				// Filter out empty chunks and merge with early return
				const validChunks = chunks.current.filter(chunk => chunk.size > 0)
				if (validChunks.length === 0) return resolve(undefined)

				const audioBlob = new Blob(validChunks, { type: mimeType })
				const duration = Math.round((Date.now() - startTime.current) / 1000)
				cleanup()
				resolve({ blob: audioBlob, duration })
			}

			mediaRecorder.current.stop()
		})
	}, [cleanup, getSupportedMimeType])

	// Handle visibility change for Safari
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.hidden && isRecording) {
				// Just stop recording, keep resources
				if (mediaRecorder.current?.state === "recording") {
					mediaRecorder.current.stop()
				}
				setIsRecording(false)
			}
		}

		document.addEventListener("visibilitychange", handleVisibilityChange)
		return () =>
			document.removeEventListener(
				"visibilitychange",
				handleVisibilityChange
			)
	}, [isRecording])

	// Start recording with optimized chunk size
	const start = useCallback(async () => {
		try {
			setIsLoading(true)

			// Minimal cleanup
			if (mediaRecorder.current?.state === "recording") {
				mediaRecorder.current.stop()
			}
			chunks.current = []

			// Reuse existing stream if possible
			if (!stream.current) {
				const constraints = {
					audio: {
						channelCount: 1, // Mono for Whisper
						sampleRate: 44100, // Higher sample rate for better quality
						echoCancellation: true,
						noiseSuppression: true,
						autoGainControl: true, // Enable auto gain control
						// iOS specific optimizations
						...(navigator.userAgent.includes("iPhone") ||
						navigator.userAgent.includes("iPad")
							? {
									sampleSize: 16,
									latency: 0.01,
							  }
							: {}),
					},
				}

				stream.current = await navigator.mediaDevices.getUserMedia(
					constraints
				)
			}

			// Setup recorder immediately
			const mimeType = getSupportedMimeType()
			if (!mimeType) throw new Error("No supported MIME type found")

			mediaRecorder.current = new MediaRecorder(stream.current, {
				mimeType,
				audioBitsPerSecond: 128000, // Higher bitrate for better quality
			})

			let isFirstChunk = true
			mediaRecorder.current.ondataavailable = e => {
				if (e.data.size > 0) {
					chunks.current.push(e.data)
					if (isFirstChunk) {
						isFirstChunk = false
						setIsLoading(false)
					}
				}
			}

			// Start recording with optimized chunk size
			startTime.current = Date.now()
			mediaRecorder.current.start(500) // Increased from 250ms for better performance
			setIsRecording(true)
		} catch (error) {
			cleanup()
			throw error
		}
	}, [cleanup, getSupportedMimeType])

	// Enhanced cleanup on unmount
	useEffect(() => {
		return () => {
			// Component unmount olduğunda tüm referansları temizleyelim
			chunks.current = []
			startTime.current = 0
			audioContext.current = null
			analyser.current = null
			dataArray.current = null
			mediaRecorder.current = null
			stream.current = null
			cleanup()
		}
	}, [cleanup])

	// Expose current state and methods
	return {
		isRecording,
		isLoading,
		amplitude,
		duration,
		start,
		stop,
		stream: stream.current,
	}
}
