import {
	SegmentateSchema,
	TranscreateSchema,
	TranscreateWithSegmentsSchema,
	TransliterateSchema,
} from "@/app/schemas/ai"
import { z } from "zod"
import { Language, LanguageCode } from "./common"


export type TranscribeService = "elevenlabs.stt" | "deepgram.nova2"
export type AIService = "openai.gpt"
export type TTSService = "elevenlabs.tts"
export type STSService = "elevenlabs.sts"
export type Service =
	| TranscribeService
	| AIService
	| TTSService
	| STSService

export type TranscribeRequest = {
	/** @reason Not `audio` because we can only transcribe `speech` */
	speech: Blob
	/** @reason To track usage metrics */
	duration: number
	/** @reason To more accurately transcribe */
	language?: LanguageCode
}
export type TranscribeResponse = {
	language: Language
	duration: number
	text: string
}

export type TranscreateRequest = z.infer<typeof TranscreateSchema.input>
export type TranscreateResponse = z.infer<typeof TranscreateSchema.output>

export type TranscreateWithSegmentsRequest = z.infer<
	typeof TranscreateWithSegmentsSchema.input
>
export type TranscreateWithSegmentsResponse = z.infer<
	typeof TranscreateWithSegmentsSchema.output
>

export type TransliterateRequest = z.infer<typeof TransliterateSchema.input>
export type TransliterateResponse = z.infer<
	typeof TransliterateSchema.output
>

export type SegmentateRequest = z.infer<typeof SegmentateSchema.input>
export type SegmentateResponse = z.infer<typeof SegmentateSchema.output>

// --- Elevenlabs Types ---

export type TtsRequest = {
	text: string
}

export type TtsResponse = {
	audio_base64: string
	alignment: {
		characters: string[]
		character_start_times_seconds: number[]
		character_end_times_seconds: number[]
	}
	normalized_alignment: {
		characters: string[]
		character_start_times_seconds: number[]
		character_end_times_seconds: number[]
	}
}

export type StsRequest = {
	audioBase64: string
	duration: number
	voiceId: string
}
export type StsResponse = {
	audio_base64: string
}

export type PhraseCorrection = {
	o: string // original phrase
	n: string // new (corrected) phrase
	r: string // reason for correction
}

export type FixPhraseRequest = {
	text: string
}
export type FixPhraseResponse = {
	corrected_text: string
	diffs: PhraseCorrection[]
}

export type NativeEchoRequest = {
	text: string
	target_language: LanguageCode
}
export type NativeEchoResponse = {
	text: string
	segments: Array<{
		out: string
		lit: string
		in: string
	}>
}
