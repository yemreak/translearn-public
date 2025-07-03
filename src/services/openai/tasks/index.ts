import {
	FixPhraseSchema,
	NativeEchoSchema,
	SegmentateSchema,
	TranscreateSchema,
	TranscreateWithSegmentsSchema,
	TransliterateSchema,
} from "@/app/schemas/ai"
import { GptModel } from "@/services/openai"
import { z } from "zod"

/**
 * @purpose Base instruction type that all instructions must follow
 */
type Instruction<Input, Output> = {
	task: string
	updated_at: string
	goal: string
	model?: GptModel
	input_format: Input
	output_format: Output
	frameworks: Record<string, string>
	examples: Record<string, { input: Input; output: Output }>
}

/**
 * @purpose All available instructions with their schemas and types
 * Add new instructions here in this format:
 *
 * taskName: {
 *   schema: Zod schema for output validation
 *   instruction: Instruction type with input/output
 * }
 */
export const INSTRUCTIONS = {
	transcreate: {
		outputSchema: TranscreateSchema.output,
		instruction: {} as Instruction<
			z.infer<typeof TranscreateSchema.input>,
			z.infer<typeof TranscreateSchema.output>
		>,
	},
	transcreate_with_segments: {
		outputSchema: TranscreateWithSegmentsSchema.output,
		instruction: {} as Instruction<
			z.infer<typeof TranscreateWithSegmentsSchema.input>,
			z.infer<typeof TranscreateWithSegmentsSchema.output>
		>,
	},
	transliterate: {
		outputSchema: TransliterateSchema.output,
		instruction: {} as Instruction<
			z.infer<typeof TransliterateSchema.input>,
			z.infer<typeof TransliterateSchema.output>
		>,
	},
	segmentate: {
		outputSchema: SegmentateSchema.output,
		instruction: {} as Instruction<
			z.infer<typeof SegmentateSchema.input>,
			z.infer<typeof SegmentateSchema.output>
		>,
	},
	fix_phrase: {
		outputSchema: FixPhraseSchema.output,
		instruction: {} as Instruction<
			z.infer<typeof FixPhraseSchema.input>,
			z.infer<typeof FixPhraseSchema.output>
		>,
	},
	native_echo: {
		outputSchema: NativeEchoSchema.output,
		instruction: {} as Instruction<
			z.infer<typeof NativeEchoSchema.input>,
			z.infer<typeof NativeEchoSchema.output>
		>,
	},
} as const

/**
 * @purpose Type-safe mapping of all available instructions
 */
export type InstructionMap = {
	[K in keyof typeof INSTRUCTIONS]: (typeof INSTRUCTIONS)[K]["instruction"]
}

/**
 * @purpose Helper type to extract input type from instruction
 */
export type InstructionInput<T extends keyof InstructionMap> =
	InstructionMap[T]["input_format"]

/**
 * @purpose Helper type to extract output type from instruction
 */
export type InstructionOutput<T extends keyof InstructionMap> =
	InstructionMap[T]["output_format"]

/**
 * @purpose Get the Zod schema for validating instruction outputs
 */
export function getOutputSchema<T extends keyof InstructionMap>(task: T) {
	return INSTRUCTIONS[task].outputSchema
}
