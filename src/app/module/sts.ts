import { StsRequest, StsResponse } from "@/app/types/ai"
import {
	ElevenLabsSTSRequest,
	stsElevenLabs,
} from "@/services/elevenlabs"

export async function sts(
	request: StsRequest & { userId: string }
): Promise<StsResponse> {
	const input: ElevenLabsSTSRequest = {
		model: "eleven_multilingual_sts_v2",
		voiceId: request.voiceId,
		audioBase64: request.audioBase64,
		settings: {
			stability: 0.5,
			similarity_boost: 0.33,
			style: 0.2,
			use_speaker_boost: true,
		},
	}
	const audioBuffer = await stsElevenLabs(input)
	return { audio_base64: Buffer.from(audioBuffer).toString("base64") }
}
