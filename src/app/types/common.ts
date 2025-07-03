import { z } from "zod"
import { LanguageSchema } from "../schemas/ai"

export type LanguageCode = z.infer<typeof LanguageSchema>
export const SupportedLanguageSchemas = z.enum([
	"tr",
	"en",
	"ru",
	"de",
	"sv",
	"es",
])
export type SupportedLanguageCode = z.infer<
	typeof SupportedLanguageSchemas
>
export type Language =
	| "turkish"
	| "english"
	| "russian"
	| "german"
	| "swedish"
	| "spanish"
