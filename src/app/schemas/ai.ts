import { z } from "zod"

// --- Common Schemas ---

export const LanguageSchema = z.enum([
	"en",
	"tr",
	"de",
	"sv",
	"ru",
	"es",
])

// --- GPT Schemas ---

export const TranscreateSchema = {
	input: z.object({
		text: z.string(),
		language: LanguageSchema,
	}),
	output: z.object({ text: z.string() }),
}

export const TranscreateWithSegmentsSchema = {
	input: z.object({
		text: z.string(),
		context: z.string().optional().describe("For accuracy"),
		language: LanguageSchema,
	}),
	output: z.object({
		text: z.string(),
		segments: z.array(z.object({ in: z.string(), out: z.string() })),
	}),
}

export const TransliterateSchema = {
	input: z.object({
		texts: z.array(z.string()),
	}),
	output: z.object({
		segments: z.array(z.object({ in: z.string(), lit: z.string() })),
	}),
}

export const SegmentateSchema = {
	input: z.object({
		text: z.string(),
	}),
	output: z.object({
		segments: z.array(z.array(z.string())),
	}),
}

export const FixPhraseSchema = {
	input: z.object({
		text: z.string(),
	}),
	output: z.object({
		corrected_text: z.string(),
		diffs: z.array(
			z.object({
				o: z.string(),
				n: z.string(),
				r: z.string(),
			})
		),
	}),
}

export const NativeEchoSchema = {
	input: z.object({
		text: z.string(),
		target_language: LanguageSchema,
	}),
	output: z.object({
		text: z.string(),
		segments: z.array(
			z.object({
				out: z.string(),
				lit: z.string(),
				in: z.string(),
			})
		),
	}),
}
