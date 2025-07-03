import { transcibe } from "@/app/module/transcribe"
import { LanguageCode } from "@/app/types/common"

function parseTimeString(timeStr: string): number {
	// Handle "00:04" format
	const [minutes, seconds] = timeStr.split(":").map(Number)
	return minutes * 60 + seconds
}

async function convertToMp3(blob: Blob): Promise<Blob> {
	throw new Error("Not implemented yet", { cause: blob })
}

export async function POST(req: Request) {
	// Middleware tarafından eklenen user ID'yi al
	const userId = req.headers.get("x-user-id")
	if (!userId) throw new Error("Missing user id")

	// Support both FormData and raw binary for Apple Shortcuts
	const contentType = req.headers.get("content-type") || ""

	let audioBlob: Blob
	let duration: number
	let language: LanguageCode | undefined
	let service: "whisper" | "deepgram" | undefined

	if (contentType.includes("multipart/form-data")) {
		// Handle standard FormData
		const formData = await req.formData()
		audioBlob = formData.get("audio") as Blob
		const rawDuration = formData.get("duration") as string
		// Handle both formats: "00:04" and number
		duration = rawDuration.includes(":")
			? parseTimeString(rawDuration)
			: Number(rawDuration)
		language = (formData.get("language") as LanguageCode) ?? undefined
		service = formData.get("service") as "whisper" | "deepgram"
	} else {
		// Handle Apple Shortcuts raw binary
		const originalBlob = await req.blob()
		try {
			audioBlob = await convertToMp3(originalBlob)
		} catch (error) {
			throw new Error(`Audio conversion failed: ${error}`)
		}

		const rawDuration = req.headers.get("x-duration") || "0"
		duration = rawDuration.includes(":")
			? parseTimeString(rawDuration)
			: Number(rawDuration)
		language = (req.headers.get("x-language") as LanguageCode) ?? undefined
		service = req.headers.get("x-service") as "whisper" | "deepgram"
	}

	if (!audioBlob || !duration) {
		throw new Error("Missing required fields")
	}

	const result = await transcibe({
		speech: audioBlob,
		service: service === "deepgram" ? "deepgram.nova2" : "elevenlabs.stt",
		duration,
		userId,
		language,
	})

	if (!result) throw new Error("No response from transcription service")
	return Response.json(result)
}
