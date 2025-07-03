/**
 * @reason Converts a blob to a base64 string for database storage
 */
export function blobToBase64(blob: Blob) {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => {
			const base64 = reader.result as string
			// Remove data:audio/xxx;base64, prefix
			resolve(base64.split(",")[1])
		}
		reader.onerror = reject
		reader.readAsDataURL(blob)
	})
}

/**
 * @reason Process audio file to get base64 and duration
 */
export async function processAudioFile(
	file: File,
	options = { maxSize: 10 * 1024 * 1024 } // 10MB default
): Promise<{
	base64: string
	duration: number
}> {
	// Check file size
	if (file.size > options.maxSize) {
		throw new Error(
			`File too large (max ${options.maxSize / 1024 / 1024}MB)`
		)
	}

	// Convert File to base64
	const base64 = await new Promise<string>((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => {
			if (typeof reader.result === "string") {
				// Remove data URL prefix
				const base64 = reader.result.split(",")[1]
				resolve(base64)
			} else {
				reject(new Error("Failed to read file as base64"))
			}
		}
		reader.onerror = reject
		reader.readAsDataURL(file)
	})

	// Get audio duration
	const duration = await new Promise<number>((resolve, reject) => {
		const audio = new Audio()
		audio.onloadedmetadata = () => resolve(audio.duration)
		audio.onerror = reject
		audio.src = URL.createObjectURL(file)
	})

	return { base64, duration }
}

/**
 * @reason Create audio URL from base64 string
 */
export function createAudioUrl(base64: string) {
	return `data:audio/mp3;base64,${base64}`
}
