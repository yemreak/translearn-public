import { t } from "@/app/lib/language"
import {
	FixPhraseRequest,
	FixPhraseResponse,
	NativeEchoRequest,
	NativeEchoResponse,
	SegmentateRequest,
	SegmentateResponse,
	TranscreateRequest,
	TranscreateResponse,
	TranscreateWithSegmentsRequest,
	TranscreateWithSegmentsResponse,
	TranscribeRequest,
	TranscribeResponse,
	TransliterateRequest,
	TransliterateResponse,
	TtsRequest,
	TtsResponse,
} from "@/app/types/ai"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export function useTranscribe() {
	return useMutation({
		mutationFn: async (
			data: TranscribeRequest
		): Promise<TranscribeResponse> => {
			try {
				const formData = new FormData()
				formData.append("audio", data.speech)
				formData.append("duration", data.duration.toString())
				if (data.language) formData.append("language", data.language)

				const res = await fetch("/api/transcribe", {
					method: "POST",
					body: formData,
				})

				if (!res.ok) throw new Error("Failed to transcribe")
				return await res.json()
			} catch (error) {
				toast.error(t("error.api.transcribe", "tr"))
				throw error
			}
		},
	})
}

export function useTranscreate() {
	return useMutation({
		mutationFn: async (
			data: TranscreateRequest
		): Promise<TranscreateResponse> => {
			try {
				const res = await fetch("/api/ai", {
					method: "POST",
					body: JSON.stringify({
						task: "transcreate",
						input: data,
					}),
					headers: { "Content-Type": "application/json" },
				})

				if (!res.ok) throw new Error("Failed to transcreate")
				return await res.json()
			} catch (error) {
				toast.error(t("error.api.transcreate", "tr"))
				throw error
			}
		},
	})
}

export function useTranscreateWithSegments() {
	return useMutation({
		mutationFn: async (
			data: TranscreateWithSegmentsRequest
		): Promise<TranscreateWithSegmentsResponse> => {
			try {
				const res = await fetch("/api/ai", {
					method: "POST",
					body: JSON.stringify({
						task: "transcreate_with_segments",
						input: data,
					}),
					headers: { "Content-Type": "application/json" },
				})

				if (!res.ok)
					throw new Error("Failed to transcreate with segments")
				return await res.json()
			} catch (error) {
				toast.error(t("error.api.segmentedTranslate", "tr"))
				throw error
			}
		},
	})
}

export function useTransliterate() {
	return useMutation({
		mutationFn: async (
			data: TransliterateRequest
		): Promise<TransliterateResponse> => {
			try {
				const res = await fetch("/api/ai", {
					method: "POST",
					body: JSON.stringify({
						task: "transliterate",
						input: data,
					}),
					headers: { "Content-Type": "application/json" },
				})

				if (!res.ok) throw new Error("Failed to transliterate")
				return await res.json()
			} catch (error) {
				toast.error(t("error.api.transliterate", "tr"))
				throw error
			}
		},
	})
}

export function useTts() {
	return useMutation({
		mutationFn: async (data: TtsRequest): Promise<TtsResponse> => {
			try {
				const res = await fetch("/api/tts", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				})

				if (!res.ok)
					throw new Error("Failed to convert text to speech")
				return await res.json()
			} catch (error) {
				toast.error(t("error.api.tts", "tr"))
				throw error
			}
		},
	})
}

export function useSegmentate() {
	return useMutation({
		mutationFn: async (
			data: SegmentateRequest
		): Promise<SegmentateResponse> => {
			try {
				const res = await fetch("/api/ai", {
					method: "POST",
					body: JSON.stringify({
						task: "segmentate",
						input: data,
					}),
					headers: { "Content-Type": "application/json" },
				})

				if (!res.ok) throw new Error("Failed to segmentate")
				return await res.json()
			} catch (error) {
				toast.error(t("error.api.segmentate", "tr"))
				throw error
			}
		},
	})
}

export function useFixPhrase() {
	return useMutation({
		mutationFn: async (
			data: FixPhraseRequest
		): Promise<FixPhraseResponse> => {
			try {
				const res = await fetch("/api/ai", {
					method: "POST",
					body: JSON.stringify({
						task: "fix_phrase",
						input: data,
					}),
					headers: { "Content-Type": "application/json" },
				})

				if (!res.ok) throw new Error("Failed to fix phrase")
				return await res.json()
			} catch (error) {
				toast.error(t("error.api.fixPhrase", "tr"))
				throw error
			}
		},
	})
}

export function useNativeEcho() {
	return useMutation({
		mutationFn: async (
			data: NativeEchoRequest
		): Promise<NativeEchoResponse> => {
			try {
				const res = await fetch("/api/ai", {
					method: "POST",
					body: JSON.stringify({
						task: "native_echo",
						input: data,
					}),
					headers: { "Content-Type": "application/json" },
				})

				if (!res.ok) throw new Error("Failed to native echo")
				return await res.json()
			} catch (error) {
				toast.error(t("error.api.nativeEcho", "tr"))
				throw error
			}
		},
	})
}
