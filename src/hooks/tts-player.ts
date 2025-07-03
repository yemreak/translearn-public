import { TtsResponse } from "@/app/types/ai"
import { useEffect, useRef, useState } from "react"

export function useTtsPlayer(props?: {
	audio_base64?: string
	alignment?: TtsResponse["alignment"]
}) {
	const [state, setState] = useState<{
		isPlaying: boolean
		currentTime: number
		duration: number
		speed: number
		currentIndex: number
	}>({
		isPlaying: false,
		currentTime: 0,
		duration: 0,
		speed: 1,
		currentIndex: 0,
	})

	const audioRef = useRef<HTMLAudioElement | null>(null)

	// Initialize audio element
	useEffect(() => {
		if (!props?.audio_base64) return

		audioRef.current = new Audio(
			props.audio_base64.startsWith("data:")
				? props.audio_base64
				: `data:audio/mpeg;base64,${props.audio_base64}`
		)
		audioRef.current.playbackRate = state.speed

		const handleEnded = () => {
			setState(prev => ({
				...prev,
				isPlaying: false,
				currentTime: 0,
				currentIndex: 0,
			}))
		}

		const handleTimeUpdate = () => {
			if (!props.alignment) return
			const time = audioRef.current?.currentTime || 0
			const index = props.alignment.character_start_times_seconds.findIndex(
				t => t >= time
			)

			setState(prev => ({
				...prev,
				currentTime: time,
				duration: audioRef.current?.duration || 0,
				currentIndex: index > 0 ? index : 0,
			}))
		}

		audioRef.current.addEventListener("ended", handleEnded)
		audioRef.current.addEventListener("timeupdate", handleTimeUpdate)

		return () => {
			if (audioRef.current) {
				audioRef.current.removeEventListener("ended", handleEnded)
				audioRef.current.removeEventListener("timeupdate", handleTimeUpdate)
				audioRef.current.pause()
			}
		}
	}, [props?.audio_base64, props?.alignment, state.speed])

	const controls = {
		play: async () => {
			if (!audioRef.current) return
			await audioRef.current.play()
			setState(prev => ({ ...prev, isPlaying: true }))
		},
		pause: () => {
			if (!audioRef.current) return
			audioRef.current.pause()
			setState(prev => ({ ...prev, isPlaying: false }))
		},
		setSpeed: (speed: number) => {
			if (!audioRef.current) return
			audioRef.current.playbackRate = speed
			setState(prev => ({ ...prev, speed }))
		},
		seek: (time: number) => {
			if (!audioRef.current) return
			audioRef.current.currentTime = time
		},
	}

	return {
		state,
		controls,
	}
}
