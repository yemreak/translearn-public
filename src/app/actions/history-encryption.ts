"use server"

import { decrypt, encrypt } from "@/lib/crypto"
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase"

// Define which fields should be encrypted
const ENCRYPTED_FIELDS = [
	"transcription",
	"transcreation",
	"transliteration",
	"segments",
	"transcribe_segments",
	"tts_alignment",
	"tts_audio_base64",
] as const

type EncryptedField = (typeof ENCRYPTED_FIELDS)[number]

// Type for encrypted history data stored in DB
type EncryptedHistoryData = Omit<
	Tables<"user_histories">,
	EncryptedField
> & {
	[K in EncryptedField]: string | null
}

// Type for decrypted history data used in app
type DecryptedHistoryData = Tables<"user_histories">

/**
 * Encrypts sensitive fields in history data
 * @param data History data with plain text sensitive fields
 * @returns History data with encrypted sensitive fields
 */
export async function encryptHistoryData(
	data:
		| TablesInsert<"user_histories">
		| TablesUpdate<"user_histories">
): Promise<Partial<EncryptedHistoryData>> {
	const encrypted: Record<string, unknown> = { ...data }

	// Encrypt each sensitive field if it exists and is not null
	for (const field of ENCRYPTED_FIELDS) {
		if (
			field in data &&
			data[field as keyof typeof data] !== null &&
			data[field as keyof typeof data] !== undefined
		) {
			try {
				// Store the encrypted value along with metadata
				encrypted[field] = encrypt({
					value: data[field as keyof typeof data],
					field: field,
					encryptedAt: new Date().toISOString(),
				})
			} catch (error) {
				console.error(`Error encrypting field ${field}:`, error)
				throw new Error(`Failed to encrypt ${field}`)
			}
		}
	}

	return encrypted
}

/**
 * Decrypts sensitive fields in history data
 * @param data History data with encrypted sensitive fields
 * @returns History data with decrypted sensitive fields
 */
export async function decryptHistoryData(
	data: EncryptedHistoryData
): Promise<DecryptedHistoryData> {
	const decrypted: Record<string, unknown> = { ...data }

	// Decrypt each sensitive field if it exists and is not null
	for (const field of ENCRYPTED_FIELDS) {
		if (
			field in data &&
			data[field] !== null &&
			data[field] !== undefined
		) {
			try {
				const encryptedValue = data[field]
				if (
					typeof encryptedValue === "string" &&
					encryptedValue.includes(":")
				) {
					// Decrypt and extract the original value
					const decryptedData = decrypt(encryptedValue) as {
						value: unknown
						field: string
						encryptedAt: string
					}

					// Verify the field matches (for additional security)
					if (decryptedData.field !== field) {
						throw new Error(
							`Field mismatch: expected ${field}, got ${decryptedData.field}`
						)
					}

					decrypted[field] = decryptedData.value
				} else {
					// If not encrypted format, keep as is (for backward compatibility)
					decrypted[field] = data[field]
				}
			} catch (error) {
				console.error(`Error decrypting field ${field}:`, error)
				// Keep the field as null if decryption fails
				decrypted[field] = null
			}
		}
	}

	return decrypted as DecryptedHistoryData
}

/**
 * Encrypts sensitive fields for an array of history data
 * @param array Array of history data with plain text sensitive fields
 * @returns Array of history data with encrypted sensitive fields
 */
export async function encryptHistoryArray(
	array: (
		| TablesInsert<"user_histories">
		| TablesUpdate<"user_histories">
	)[]
): Promise<Partial<EncryptedHistoryData>[]> {
	return Promise.all(array.map(item => encryptHistoryData(item)))
}

/**
 * Decrypts sensitive fields for an array of history data
 * @param array Array of history data with encrypted sensitive fields
 * @returns Array of history data with decrypted sensitive fields
 */
export async function decryptHistoryArray(
	array: EncryptedHistoryData[]
): Promise<DecryptedHistoryData[]> {
	return Promise.all(array.map(item => decryptHistoryData(item)))
}

/**
 * Helper to check if a value is in encrypted format
 * @param value The value to check
 * @returns True if the value appears to be encrypted
 */
export async function isEncrypted(
	value: string | null | undefined
): Promise<boolean> {
	if (!value || typeof value !== "string") return false

	// Check if value follows our encryption format: iv:authTag:encrypted
	const parts = value.split(":")
	return (
		parts.length === 3 &&
		parts.every(part => /^[a-f0-9]+$/i.test(part))
	)
}

/**
 * Helper to safely get a decrypted field value
 * @param data The history data
 * @param field The field to get
 * @returns The decrypted value or null if not available
 */
export async function getDecryptedField(
	data: Partial<EncryptedHistoryData>,
	field: EncryptedField
): Promise<unknown | null> {
	const value = data[field]
	if (!value) return null

	try {
		if (await isEncrypted(value)) {
			const decrypted = decrypt(value) as {
				value: unknown
				field: string
			}
			return decrypted.value
		}
		return value
	} catch {
		return null
	}
}
