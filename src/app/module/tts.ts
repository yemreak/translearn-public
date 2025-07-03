"use server"
import { getUserApiKey } from "@/app/actions/user-environments"
import { TtsResponse } from "@/app/types/ai"
import {
	ElevenLabsTTSRequest,
	ttsElevenLabs,
} from "@/services/elevenlabs"

export async function tts(params: {
	text: string
	userId: string
	voiceId: string
}): Promise<TtsResponse> {
	const input: ElevenLabsTTSRequest = {
		text: params.text,
		model: "eleven_multilingual_v2",
		voiceId: params.voiceId,
		settings: {
			stability: 0.5,
			similarity_boost: 0.33,
			style: 0.2,
			use_speaker_boost: true,
		},
	}

	const userApiKey = await getUserApiKey(
		params.userId,
		"elevenlabs_key"
	)
	if (!userApiKey)
		throw new Error("ElevenLabs API key not configured")
	return (await ttsElevenLabs({
		...input,
		apiKey: userApiKey,
	})) as TtsResponse
}
