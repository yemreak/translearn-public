// src/lib/crypto.ts
// Tek görevi: Encryption/decryption utilities for sensitive data

/*
 * CRYPTO UTILITIES:
 *
 * AES-256-GCM encryption for all sensitive data:
 * - Conversations (agent mode)
 * - System resources (prompts, instructions)
 * - User ecosystems (contexts, anchors, memories)
 *
 * Format: iv:authTag:encrypted
 * - Human readable separator format
 * - Auth tag for integrity verification
 * - JSON serialization for any data type
 *
 * Key from ENCRYPTION_KEY env var (32 bytes hex)
 */

import { createCipheriv, createDecipheriv, randomBytes } from "crypto"

const ALGORITHM = "aes-256-gcm"
const SEPARATOR = ":"

const getKey = () => Buffer.from(process.env.ENCRYPTION_KEY!, "hex")

export const encrypt = (data: unknown): string => {
	const key = getKey()
	const iv = randomBytes(16)
	const cipher = createCipheriv(ALGORITHM, key, iv)

	// Any type → JSON → encrypted
	const content = JSON.stringify(data)
	let encrypted = cipher.update(content, "utf8", "hex")
	encrypted += cipher.final("hex")

	const authTag = cipher.getAuthTag()

	// Readable format: iv:authTag:encrypted
	return [
		iv.toString("hex"),
		authTag.toString("hex"),
		encrypted,
	].join(SEPARATOR)
}

export const decrypt = (encryptedData: string): unknown => {
	const key = getKey()
	const parts = encryptedData.split(SEPARATOR)

	if (parts.length !== 3) {
		throw new Error("Invalid encrypted data format")
	}

	const [ivHex, authTagHex, encrypted] = parts as [
		string,
		string,
		string
	]

	const iv = Buffer.from(ivHex, "hex")
	const authTag = Buffer.from(authTagHex, "hex")

	const decipher = createDecipheriv(ALGORITHM, key, iv)
	decipher.setAuthTag(authTag)

	let decrypted = decipher.update(encrypted, "hex", "utf8")
	decrypted += decipher.final("utf8")

	// JSON → original type
	return JSON.parse(decrypted)
}
