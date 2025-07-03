"use server"

import { getUserApiKey } from "@/app/actions/user-environments"
import {
	TranscribeRequest,
	TranscribeResponse,
	TranscribeService,
} from "@/app/types/ai"
import {
	DeepgramRequest,
	transcibeByDeepgram,
} from "@/services/deepgram"
import { sttElevenLabs } from "@/services/elevenlabs"

export async function transcibe(
	request: TranscribeRequest & {
		userId: string
		service: TranscribeService
	}
): Promise<TranscribeResponse> {
	if (request.service === "elevenlabs.stt") {
		const file = new File([request.speech], "audio.wav")
		const input = {
			model: "scribe_v1" as const,
			duration: request.duration,
		}
		const userApiKey = await getUserApiKey(
			request.userId,
			"elevenlabs_key"
		)
		if (!userApiKey)
			throw new Error("ElevenLabs API key not configured")

		const response = await sttElevenLabs({
			file,
			model: input.model,
			apiKey: userApiKey,
		})
		return {
			text: response.text,
			language: response.language,
			duration: response.duration,
		} as TranscribeResponse
	}

	if (request.service === "deepgram.nova2") {
		const input: Omit<DeepgramRequest, "speech"> = {
			duration: request.duration,
			model: "nova-2",
			language: request.language,
		}

		const response = await transcibeByDeepgram({
			speech: Buffer.from(await request.speech.arrayBuffer()),
			...input,
		})
		return {
			text: response.text,
			language: response.language,
			duration: response.duration,
		} as TranscribeResponse
	}

	throw new Error("Invalid service")
}
