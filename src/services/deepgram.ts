import { Language, LanguageCode } from "@/app/types/common"

export type DeepgramModel = "nova-2"


export type DeepgramRequest = {
	duration: number
	model: DeepgramModel
	language?: LanguageCode
	speech: Buffer
	apiKey?: string
}

export async function transcibeByDeepgram(request: DeepgramRequest) {
	if (!request.apiKey) throw new Error('Deepgram API key not configured')
	
	const response = await fetch(
		"https://api.deepgram.com/v1/listen?" +
			new URLSearchParams({
				model: request.model,
				smart_format: "true",
				detect_language: "true",
				...(request.language && { language: request.language }),
			}),
		{
			method: "POST",
			headers: {
				Authorization: `Token ${request.apiKey}`,
				"Content-Type": "audio/mp3",
			},
			body: request.speech,
		}
	)

	if (!response.ok) {
		throw new Error(`Deepgram error: ${response.statusText}`)
	}

	const result = await response.json()

	return {
		text: result.results.channels[0].alternatives[0].transcript,
		language: result.results.channels[0].detected_language,
		duration: result.metadata.duration,
	} as {
		text: string
		language: Language
		duration: number
	}
}
