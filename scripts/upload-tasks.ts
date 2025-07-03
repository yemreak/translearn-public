import { createClient } from "@supabase/supabase-js"
import { readFileSync, readdirSync } from "fs"
import { join } from "path"
import { parse } from "yaml"
import { serverConfig } from "../src/config"

const TASKS_DIR = "src/services/openai/tasks"

// Check if environment variables are loaded
if (!serverConfig.supabase.url || !serverConfig.supabase.serviceRoleKey) {
	throw new Error("Missing required environment variables")
}

async function uploadTasks() {
	// Create Supabase client with service role
	const supabase = createClient(
		serverConfig.supabase.url,
		serverConfig.supabase.serviceRoleKey,
		{
			auth: { autoRefreshToken: false, persistSession: false },
		}
	)

	// Read all YAML files
	const files = readdirSync(TASKS_DIR).filter(f => f.endsWith(".yml"))

	for (const file of files) {
		const content = readFileSync(join(TASKS_DIR, file), "utf-8")
		const task = parse(content)

		// Upload to Supabase
		const { error } = await supabase
			.from("ai_tasks")
			.upsert({
				task: task.task,
				instruction: content,
			})
			.select()

		if (error) {
			console.error(`Error uploading ${file}:`, error)
		} else {
			console.log(`✅ Uploaded ${file}`)
		}
	}
}

uploadTasks().catch(console.error)
