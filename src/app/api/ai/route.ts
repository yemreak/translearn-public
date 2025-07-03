import { ask } from "@/app/module/ai"

export async function POST(req: Request) {
	const userId = req.headers.get("x-user-id")
	if (!userId) throw new Error("Missing user id")

	const { task, input } = await req.json()
	if (!task || !input) throw new Error("Missing required fields")

	const data = await ask({ task, input, userId })
	if (!data) throw new Error("No response from AI")

	return Response.json(data)
}
