"use server"

import { LanguageCode } from "@/app/types/common"
import OpenAI from "openai"
import { zodResponseFormat } from "openai/helpers/zod.mjs"
import { z } from "zod"

export type GptModel = "gpt-4.1" | "gpt-4.1-mini"

export type AskGptRequest<T extends z.ZodSchema> = {
	model: GptModel
	content: string
	outputSchema: T
	outputSchemaName: string
	apiKey?: string
}

export async function askGpt<T extends z.ZodSchema>(
	request: AskGptRequest<T>
) {
	if (!request.apiKey) throw new Error("OpenAI API key not provided")
	const apiKey = request.apiKey

	const client = new OpenAI({ apiKey })
	const response = await client.chat.completions.create({
		model: request.model,
		messages: [{ role: "system", content: request.content }],
		response_format: zodResponseFormat(
			request.outputSchema,
			request.outputSchemaName
		),
	})

	if (!response.usage) throw new Error("No usage data from GPT")
	if (!response.choices[0].message.content)
		throw new Error("No response from GPT")

	return JSON.parse(response.choices[0].message.content) as T
}

export type TranscribeByWhisperRequest = {
	file: File
	language?: LanguageCode
	apiKey?: string
}
export async function transcribeByWhisper(
	request: TranscribeByWhisperRequest
) {
	if (!request.apiKey) throw new Error("OpenAI API key not provided")
	const apiKey = request.apiKey

	const client = new OpenAI({ apiKey })
	return client.audio.transcriptions.create({
		file: request.file,
		model: "whisper-1",
		language: request.language,
		response_format: "verbose_json",
		timestamp_granularities: ["word"],
	})
}
