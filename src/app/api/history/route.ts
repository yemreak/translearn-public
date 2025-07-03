import { createSupabaseServerClient } from "@/services/supabase/server"
import { TablesInsert, TablesUpdate } from "@/types/supabase"
import { 
	encryptHistoryData, 
	decryptHistoryData, 
	decryptHistoryArray 
} from "@/app/actions/history-encryption"

export async function POST(req: Request) {
	try {
		const userId = req.headers.get("x-user-id")
		if (!userId) throw new Error("Missing user id")

		const body = (await req.json()) as TablesInsert<'user_histories'>
		const now = new Date().toISOString()
		const formattedBody = {
			...body,
			created_at: now,
			updated_at: now,
			user_id: userId,
		}

		// Encrypt sensitive fields before storing
		const encryptedData = await encryptHistoryData(formattedBody)

		const supabaseServer = await createSupabaseServerClient()
		const { data, error } = await supabaseServer
			.from("user_histories")
			.insert(encryptedData)
			.select("*")
			.single()

		if (error) throw error
		if (!data) throw new Error("No data returned from insert")
		
		// Decrypt data before returning to client
		const decryptedData = await decryptHistoryData(data)
		return Response.json(decryptedData)
	} catch (error) {
		console.error("Error in POST /api/history:", error)
		return Response.json(
			{ error: error instanceof Error ? error.message : "Failed to create history entry" },
			{ status: 500 }
		)
	}
}

export async function GET(req: Request) {
	try {
		const userId = req.headers.get("x-user-id")
		if (!userId) throw new Error("Missing user id")

		const supabaseServer = await createSupabaseServerClient()
		const { data, error } = await supabaseServer
			.from("user_histories")
			.select("*")
			.eq("user_id", userId)
			.order("created_at", { ascending: false })

		if (error) throw error
		if (!data) return Response.json([])
		
		// Decrypt all history entries before returning
		const decryptedData = await decryptHistoryArray(data)
		return Response.json(decryptedData)
	} catch (error) {
		console.error("Error in GET /api/history:", error)
		return Response.json(
			{ error: error instanceof Error ? error.message : "Failed to fetch history" },
			{ status: 500 }
		)
	}
}

export async function PUT(req: Request) {
	try {
		const userId = req.headers.get("x-user-id")
		if (!userId) throw new Error("Missing user id")

		const body = (await req.json()) as TablesUpdate<'user_histories'> & { id: string }
		const { id, ...rest } = body
		const formattedBody = {
			...rest,
			updated_at: new Date().toISOString(),
		}

		// Encrypt sensitive fields before updating
		const encryptedData = await encryptHistoryData(formattedBody)

		const supabaseServer = await createSupabaseServerClient()
		const { error } = await supabaseServer
			.from("user_histories")
			.update(encryptedData)
			.eq("user_id", userId)
			.eq("id", id)

		if (error) throw error

		const { data: history, error: fetchError } = await supabaseServer
			.from("user_histories")
			.select("*")
			.eq("id", id)
			.single()

		if (fetchError) throw fetchError
		if (!history) throw new Error("No data returned from update")
		
		// Decrypt data before returning to client
		const decryptedData = await decryptHistoryData(history)
		return Response.json(decryptedData)
	} catch (error) {
		console.error("Error in PUT /api/history:", error)
		return Response.json(
			{ error: error instanceof Error ? error.message : "Failed to update history entry" },
			{ status: 500 }
		)
	}
}

export async function DELETE(req: Request) {
	const userId = req.headers.get("x-user-id")
	const { id } = await req.json()
	if (!userId || !id) throw new Error("Missing required fields")

	const supabaseServer = await createSupabaseServerClient()
	const { error } = await supabaseServer
		.from("user_histories")
		.delete()
		.eq("user_id", userId)
		.eq("id", id)

	if (error) throw error
	return Response.json({ success: true })
}
