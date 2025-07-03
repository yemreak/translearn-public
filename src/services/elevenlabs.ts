/**
 * Voice limitation: https://help.elevenlabs.io/hc/en-us/articles/18142871021713-Is-there-a-limit-on-how-many-times-I-can-edit-add-voices
 */
"use server"

import { serverConfig } from "@/config"

const API_URL = "https://api.elevenlabs.io/v1"

// Helper to get API key - users must provide their own
function getApiKey(userKey?: string): string {
	if (!userKey) throw new Error("ElevenLabs API key not provided")
	return userKey
}

export type TTSModel = "eleven_multilingual_v2" | "eleven_turbo_v2"
export type STSModel = "eleven_multilingual_sts_v2"
export type STTModel = "scribe_v1"

const OUTPUT_FORMAT = {
	starter: "mp3_44100_128",
	creator: "mp3_44100_192",
	pro: "mp3_44100_192",
}[serverConfig.ai.elevenlabsPlanId]




export type ElevenLabsTTSRequest = {
	text: string
	model: TTSModel
	voiceId: string
	settings: {
		stability: number
		similarity_boost: number
		style: number
		use_speaker_boost: boolean
	}
	apiKey?: string
}
export async function ttsElevenLabs(request: ElevenLabsTTSRequest) {
	const response = await fetch(
		`${API_URL}/text-to-speech/${request.voiceId}/with-timestamps?output_format=${OUTPUT_FORMAT}`,
		{
			method: "POST",
			headers: {
				"xi-api-key": getApiKey(request.apiKey),
				"Content-Type": "application/json",
				Accept: "audio/mpeg",
			},
			body: JSON.stringify({
				text: request.text,
				model_id: request.model,
				voice_settings: request.settings,
			}),
		}
	)

	const json = await response.json()
	if (!response.ok)
		throw new Error(`Text to speech failed: ${JSON.stringify(json)}`)

	// Parse response data
	const data = json as {
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

	return {
		alignment: data.alignment,
		normalized_alignment: data.normalized_alignment,
		audio_base64: data.audio_base64,
	}
}

export type ElevenLabsSTSRequest = {
	model: STSModel
	audioBase64: string
	voiceId: string
	settings: {
		stability: number
		similarity_boost: number
		style: number
		use_speaker_boost: boolean
	}
	apiKey?: string
}
export async function stsElevenLabs(request: ElevenLabsSTSRequest) {
	const formData = new FormData()
	formData.append(
		"audio",
		new Blob([Buffer.from(request.audioBase64, "base64")], {
			type: "audio/mpeg",
		})
	)
	formData.append("model_id", request.model)
	formData.append("voice_settings", JSON.stringify(request.settings))

	const response = await fetch(
		`${API_URL}/speech-to-speech/${request.voiceId}?output_format=${OUTPUT_FORMAT}`,
		{
			method: "POST",
			headers: { "xi-api-key": getApiKey(request.apiKey) },
			body: formData,
		}
	)

	if (!response.ok) {
		const data = await response.json()
		throw new Error(
			`Speech to speech failed: ${JSON.stringify(data)}`
		)
	}

	return response.arrayBuffer()
}

export type ElevenLabsSTTRequest = {
	file: File | Blob
	model: STTModel
	apiKey?: string
}

export async function sttElevenLabs(request: ElevenLabsSTTRequest) {
	const formData = new FormData()
	formData.append("file", request.file)
	formData.append("model_id", request.model)

	const response = await fetch(`${API_URL}/speech-to-text`, {
		method: "POST",
		headers: {
			"xi-api-key": getApiKey(request.apiKey),
		},
		body: formData,
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(`ElevenLabs STT error: ${JSON.stringify(error)}`)
	}

	const json = await response.json()
	return {
		text: json.text,
		language: json.language_code,
		duration: json.duration || 0, // ElevenLabs might not provide duration
		words: json.words,
		language_probability: json.language_probability,
	} as {
		text: string
		language: string
		duration: number
		words?: Array<{
			text: string
			type: string
			start: number
			end: number
			speaker_id?: string
			characters?: Array<{
				text: string
				start: number
				end: number
			}>
		}>
		language_probability?: number
	}
}
