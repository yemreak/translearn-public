"use server"

import { getUserApiKey } from "@/app/actions/user-environments"
import { serverConfig } from "@/config"
import { askGpt, AskGptRequest, GptModel } from "@/services/openai"
import {
	getOutputSchema,
	InstructionInput,
	InstructionMap,
	InstructionOutput,
} from "@/services/openai/tasks"
import { createSupabaseServiceRoleClient } from "@/services/supabase/server"
import { readFile } from "fs/promises"

import { join } from "path"
import { parse } from "yaml"

/**
 * @purpose Manage AI task templates with version control
 *
 * @example
 * // Store task template
 * await createTask({
 *   name: "transcribe",
 *   instruction: "Convert audio to text with timestamps...",
 * })
 *
 * // Fetch latest task template
 * const template = await fetchTask("transcribe")
 */
export type Task = {
	/** @purpose Unique identifier for the task template */
	name: string
	/** @purpose Template content with placeholders */
	instruction: string
	/** @purpose Track template versions */
	updated_at: string
	/** @purpose Record creation time */
	created_at: string
}

/** @purpose Get latest version of task template */
async function fetchTask(name: string): Promise<Task> {
	if (serverConfig.isDev) {
		const content = await readFile(
			join(process.cwd(), `src/services/openai/tasks/${name}.yml`)
		)
		return {
			name,
			instruction: content.toString(),
			updated_at: new Date().toISOString(),
			created_at: new Date().toISOString(),
		}
	}

	const supabaseServiceRole = await createSupabaseServiceRoleClient()
	const { data, error } = await supabaseServiceRole
		.from("ai_tasks")
		.select("*")
		.eq("task", name)
		.single()

	if (error) throw error
	return data
}

export type AskRequest<T extends keyof InstructionMap> = {
	task: T
	input: InstructionInput<T>
	model?: GptModel
	userId: string
}

/**
 * @reason Ask GPT with a specific instruction and get a structured response
 */
export async function ask<T extends keyof InstructionMap>(
	request: AskRequest<T>
): Promise<InstructionOutput<T>> {
	const task = await fetchTask(request.task)
	const instruction = parse(task.instruction) as InstructionMap[T]
	instruction.input_format = request.input
	const outputSchema = getOutputSchema(request.task)
	const input: Omit<
		AskGptRequest<typeof outputSchema>,
		"outputSchema"
	> = {
		model: request.model ?? instruction.model ?? "gpt-4.1-mini",
		content: JSON.stringify(instruction),
		outputSchemaName: request.task,
	}

	const userApiKey = await getUserApiKey(request.userId, "openai_key")
	const result = (await askGpt({
		...input,
		outputSchema,
		apiKey: userApiKey || undefined,
	})) as unknown as InstructionOutput<T>

	return result
}
