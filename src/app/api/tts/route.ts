import { getUserApiKey } from "@/app/actions/user-environments"
import { extractUserId } from "@/app/lib/utils"
import { tts } from "@/app/module/tts"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
	const userId = extractUserId(request)
	const { text } = await request.json()

	// Get user's ElevenLabs API key
	const apiKey = await getUserApiKey(userId, 'elevenlabs_key')
	if (!apiKey) throw new Error("ElevenLabs API key not configured")

	// Get user's custom voice ID
	const voiceId = await getUserApiKey(userId, 'elevenlabs_voice_id')
	if (!voiceId) {
		throw new Error("Voice ID not configured. Please set your ElevenLabs voice ID in credentials.")
	}

	const result = await tts({
		text,
		userId,
		voiceId,
	})

	return NextResponse.json(result)
}
