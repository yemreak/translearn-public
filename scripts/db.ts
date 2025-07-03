#!/usr/bin/env tsx

/**
 * Database CLI - Supabase management without dashboard context switching
 *
 * PAIN SOLVED: No more opening Supabase dashboard to execute SQL or check data
 *
 * AI AGENT USAGE GUIDE:
 *
 * When user says "check database" or "see what tables exist":
 * → npm run db tables
 *
 * When user says "execute SQL files" or "set up database":
 * → npm run db exec all → Copy each SQL file to Supabase SQL Editor
 *
 * When user says "show me data from [table]":
 * → npm run db show [table_name]
 *
 * When user says "add/insert data to database":
 * × npm run db insert [table] '[json]' → Shows preview, requires CONFIRM_INSERT
 *
 * When user says "update/change database record":
 * × npm run db update [table] [id] '[json]' → Shows before/after, requires CONFIRM_UPDATE
 *
 * When user says "delete database record":
 * × npm run db delete [table] [id] → Shows what will be deleted, requires CONFIRM_DELETE_PERMANENT
 *
 * When user reports "table doesn't exist":
 * → npm run db exec [table_name].sql → Get SQL to create missing table
 *
 * COMMANDS:
 * READ (Safe):
 * - tables              → List all tables with row counts (✓ created, × missing)
 * - show <table>        → Display table data (first 10 rows) in console.table format
 * - exec <file|all>     → Show SQL content to copy/paste into Supabase
 * - help                → Show command help
 *
 * WRITE (Require Verification):
 * - insert <table> <json>     → Insert new record (shows preview + requires CONFIRM_INSERT)
 * - update <table> <id> <json> → Update record (shows before/after + requires CONFIRM_UPDATE)
 * - delete <table> <id>       → Delete record (shows what will be deleted + requires CONFIRM_DELETE_PERMANENT)
 *
 * SAFETY: All write operations show EXACTLY what will change and require typing exact confirmation phrases
 *
 * SQL FILES AUTO-DISCOVERED FROM:
 * - src/services/supabase/triggers/   → Database triggers (executed first)
 * - src/services/supabase/functions/  → SQL functions (executed second)
 * - src/services/supabase/tables/     → Table definitions (executed last)
 * - database/                        → Additional schemas
 *
 * EXECUTION ORDER: triggers → functions → tables (dependency order)
 *
 * ENVIRONMENT REQUIREMENTS:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js"
import { promises as fs } from "fs"
import path from "path"
import { serverConfig } from "../src/config"

const SUPABASE_URL = serverConfig.supabase.url
const SUPABASE_SERVICE_ROLE_KEY = serverConfig.supabase.serviceRoleKey

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
	console.error("× Missing Supabase environment variables")
	process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// SQL directories
const SQL_DIRS = [
	"src/services/supabase/triggers",
	"src/services/supabase/functions",
	"src/services/supabase/tables",
	"database",
]

async function findSQLFiles(): Promise<string[]> {
	const files: string[] = []

	for (const dir of SQL_DIRS) {
		try {
			const entries = await fs.readdir(dir, { withFileTypes: true })
			for (const entry of entries) {
				if (entry.isFile() && entry.name.endsWith(".sql")) {
					files.push(path.join(dir, entry.name))
				}
			}
		} catch (error) {
			// Directory doesn't exist, skip
		}
	}

	return files
}

async function showTables() {
	console.log("→ Checking tables...")

	const sqlFiles = await findSQLFiles()
	const tableNames = sqlFiles
		.filter(f => f.includes("/tables/"))
		.map(f => path.basename(f, ".sql"))

	console.log("\n→ Tables:")
	for (const name of tableNames) {
		try {
			const { count } = await supabase
				.from(name)
				.select("*", { count: "exact", head: true })
			console.log(`  ✓ ${name} (${count} rows)`)
		} catch (error) {
			console.log(`  × ${name} (not created)`)
		}
	}
}

async function showTableData(tableName: string) {
	console.log(`→ Fetching ${tableName}...`)

	try {
		const { data, error } = await supabase
			.from(tableName)
			.select("*")
			.limit(10)

		if (error) throw error

		console.log(`\n→ ${tableName} (showing first 10 rows):`)
		console.table(data)
	} catch (error) {
		console.error(`× Error: ${(error as Error).message}`)
	}
}

async function execSQL(filename: string) {
	const sqlFiles = await findSQLFiles()

	if (filename === "all") {
		console.log(`\n→ Found ${sqlFiles.length} SQL files`)
		console.log("→ Copy and paste these in Supabase SQL Editor:")
		console.log(`  ${SUPABASE_URL}/project/_/sql\n`)

		const sorted = sqlFiles.sort((a, b) => {
			if (a.includes("trigger")) return -1
			if (b.includes("trigger")) return 1
			if (a.includes("function")) return -1
			if (b.includes("function")) return 1
			return 0
		})

		sorted.forEach((file, i) => {
			console.log(`${i + 1}. ${file}`)
		})
		return
	}

	const file = sqlFiles.find(f => f.includes(filename))
	if (!file) {
		console.error(`× File not found: ${filename}`)
		console.log("→ Available files:")
		sqlFiles.forEach(f => console.log(`  ${path.basename(f)}`))
		return
	}

	const sql = await fs.readFile(file, "utf-8")
	console.log(`\n→ Content of ${file}:`)
	console.log("→ Copy this to Supabase SQL Editor:")
	console.log(`  ${SUPABASE_URL}/project/_/sql\n`)
	console.log(sql)
}

// SAFE MODIFICATION COMMANDS - REQUIRE VERIFICATION

async function safeInsert(table: string, data: string) {
	console.log("× DATABASE MODIFICATION REQUESTED")
	console.log(`→ Table: ${table}`)
	console.log(`→ Operation: INSERT`)
	console.log(`→ Data: ${data}`)

	// Parse and validate data
	let parsedData
	try {
		parsedData = JSON.parse(data)
	} catch (error) {
		console.error("× Invalid JSON data")
		return
	}

	console.log("\n→ PREVIEW OF CHANGE:")
	console.table([parsedData])

	console.log("\n× VERIFICATION REQUIRED")
	console.log(
		"→ This will INSERT new data into your production database"
	)
	console.log("→ Type exactly 'CONFIRM_INSERT' to proceed:")

	const readline = require("readline").createInterface({
		input: process.stdin,
		output: process.stdout,
	})

	readline.question("", async (answer: string) => {
		if (answer === "CONFIRM_INSERT") {
			try {
				const { data: result, error } = await supabase
					.from(table)
					.insert(parsedData)
					.select()

				if (error) throw error

				console.log("\n✓ INSERT completed successfully")
				console.table(result)
			} catch (error) {
				console.error(
					`\n× INSERT failed: ${(error as Error).message}`
				)
			}
		} else {
			console.log("\n× INSERT cancelled - verification failed")
		}
		readline.close()
	})
}

async function safeUpdate(table: string, id: string, data: string) {
	console.log("× DATABASE MODIFICATION REQUESTED")
	console.log(`→ Table: ${table}`)
	console.log(`→ Operation: UPDATE`)
	console.log(`→ Record ID: ${id}`)
	console.log(`→ New data: ${data}`)

	// Parse and validate data
	let parsedData
	try {
		parsedData = JSON.parse(data)
	} catch (error) {
		console.error("× Invalid JSON data")
		return
	}

	// Show current record
	try {
		const { data: current } = await supabase
			.from(table)
			.select("*")
			.eq("id", id)
			.single()

		console.log("\n→ CURRENT RECORD:")
		console.table([current])

		console.log("\n→ PROPOSED CHANGES:")
		console.table([parsedData])
	} catch (error) {
		console.error(`× Cannot find record with id: ${id}`)
		return
	}

	console.log("\n× VERIFICATION REQUIRED")
	console.log("→ This will UPDATE data in your production database")
	console.log("→ Type exactly 'CONFIRM_UPDATE' to proceed:")

	const readline = require("readline").createInterface({
		input: process.stdin,
		output: process.stdout,
	})

	readline.question("", async (answer: string) => {
		if (answer === "CONFIRM_UPDATE") {
			try {
				const { data: result, error } = await supabase
					.from(table)
					.update(parsedData)
					.eq("id", id)
					.select()

				if (error) throw error

				console.log("\n✓ UPDATE completed successfully")
				console.table(result)
			} catch (error) {
				console.error(
					`\n× UPDATE failed: ${(error as Error).message}`
				)
			}
		} else {
			console.log("\n× UPDATE cancelled - verification failed")
		}
		readline.close()
	})
}

async function safeDelete(table: string, id: string) {
	console.log("× DANGEROUS DATABASE MODIFICATION REQUESTED")
	console.log(`→ Table: ${table}`)
	console.log(`→ Operation: DELETE`)
	console.log(`→ Record ID: ${id}`)

	// Show record to be deleted
	try {
		const { data: current } = await supabase
			.from(table)
			.select("*")
			.eq("id", id)
			.single()

		console.log("\n→ RECORD TO BE DELETED:")
		console.table([current])
	} catch (error) {
		console.error(`× Cannot find record with id: ${id}`)
		return
	}

	console.log("\n× STRICT VERIFICATION REQUIRED")
	console.log(
		"→ This will PERMANENTLY DELETE data from your production database"
	)
	console.log("→ Type exactly 'CONFIRM_DELETE_PERMANENT' to proceed:")

	const readline = require("readline").createInterface({
		input: process.stdin,
		output: process.stdout,
	})

	readline.question("", async (answer: string) => {
		if (answer === "CONFIRM_DELETE_PERMANENT") {
			try {
				const { error } = await supabase
					.from(table)
					.delete()
					.eq("id", id)

				if (error) throw error

				console.log("\n✓ DELETE completed successfully")
				console.log("→ Record has been permanently removed")
			} catch (error) {
				console.error(
					`\n× DELETE failed: ${(error as Error).message}`
				)
			}
		} else {
			console.log("\n× DELETE cancelled - verification failed")
		}
		readline.close()
	})
}

// Main
async function main() {
	const [command, arg] = process.argv.slice(2)

	if (!command || command === "help") {
		console.log(
			"Database CLI - Manage Supabase without dashboard context switching"
		)
		console.log("\n→ READ COMMANDS (Safe):")
		console.log(
			"  tables              → List all tables with row counts"
		)
		console.log(
			"  show <table>        → Show table data (first 10 rows)"
		)
		console.log(
			"  exec <file|all>     → Show SQL files to copy/paste"
		)

		console.log("\n× WRITE COMMANDS (Require Verification):")
		console.log(
			"  insert <table> <json>     → Insert new record (shows preview)"
		)
		console.log(
			"  update <table> <id> <json> → Update record (shows before/after)"
		)
		console.log(
			"  delete <table> <id>       → Delete record (shows what will be deleted)"
		)

		console.log("\n→ AI AGENT PATTERNS:")
		console.log(
			"  User: 'check database'          → npm run db tables"
		)
		console.log(
			"  User: 'show service metrics'    → npm run db show service_metrics"
		)
		console.log(
			"  User: 'execute SQL files'       → npm run db exec all"
		)
		console.log(
			"  User: 'table missing'           → npm run db exec [table].sql"
		)

		console.log("\n× MODIFICATION PATTERNS (Require verification):")
		console.log(
			"  User: 'add new record'          → npm run db insert [table] '[json]'"
		)
		console.log(
			"  User: 'update record'           → npm run db update [table] [id] '[json]'"
		)
		console.log(
			"  User: 'delete record'           → npm run db delete [table] [id]"
		)

		console.log("\n× VERIFICATION SYSTEM:")
		console.log("  → Shows preview of exact changes before execution")
		console.log("  → Requires typing exact confirmation phrases")
		console.log("  → INSERT: 'CONFIRM_INSERT'")
		console.log("  → UPDATE: 'CONFIRM_UPDATE'")
		console.log("  → DELETE: 'CONFIRM_DELETE_PERMANENT'")

		console.log("\n↑ SETUP WORKFLOW:")
		console.log(
			"  1. npm run db exec all → Lists SQL files in execution order"
		)
		console.log("  2. Copy/paste each file to Supabase SQL Editor")
		console.log(`     ${SUPABASE_URL}/project/_/sql`)
		console.log("  3. npm run db tables → Verify all tables created")

		return
	}

	switch (command) {
		case "tables":
			await showTables()
			break
		case "show":
			if (!arg) {
				console.error("× Specify table name")
				return
			}
			await showTableData(arg)
			break
		case "exec":
			if (!arg) {
				console.error("× Specify file or 'all'")
				return
			}
			await execSQL(arg)
			break

		// SAFE MODIFICATION COMMANDS
		case "insert":
			const insertTable = process.argv[3]
			const insertData = process.argv[4]
			if (!insertTable || !insertData) {
				console.error("× Usage: npm run db insert <table> <json>")
				console.log(
					'× Example: npm run db insert ai_tasks \'{"task":"test"}\''
				)
				return
			}
			await safeInsert(insertTable, insertData)
			break

		case "update":
			const updateTable = process.argv[3]
			const updateId = process.argv[4]
			const updateData = process.argv[5]
			if (!updateTable || !updateId || !updateData) {
				console.error(
					"× Usage: npm run db update <table> <id> <json>"
				)
				console.log(
					"× Example: npm run db update service_metrics abc123 '{\"status\":\"completed\"}'"
				)
				return
			}
			await safeUpdate(updateTable, updateId, updateData)
			break

		case "delete":
			const deleteTable = process.argv[3]
			const deleteId = process.argv[4]
			if (!deleteTable || !deleteId) {
				console.error("× Usage: npm run db delete <table> <id>")
				console.log(
					"× Example: npm run db delete service_metrics abc123"
				)
				return
			}
			await safeDelete(deleteTable, deleteId)
			break

		default:
			console.error(`× Unknown command: ${command}`)
			console.log("→ Run 'npm run db help' to see available commands")
	}
}

main().catch(console.error)
