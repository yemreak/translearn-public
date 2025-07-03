"use server"

import { decrypt, encrypt } from "@/lib/crypto"
import { createSupabaseServerClient } from "@/services/supabase/server"

export async function getUserApiKey(
	userId: string,
	key: string
): Promise<string | null> {
	const supabase = await createSupabaseServerClient()

	const { data, error } = await supabase
		.from("user_environments")
		.select("value")
		.eq("user_id", userId)
		.eq("key", key)
		.single()

	if (error || !data) return null

	// Decrypt the API key before returning
	try {
		const decrypted = decrypt(data.value) as {
			userId: string
			apiKey: string
		}
		// Verify userId matches for security
		if (decrypted.userId !== userId) {
			throw new Error("UserId mismatch")
		}
		return decrypted.apiKey
	} catch (error) {
		console.error("Error decrypting API key", error)
		// If decryption fails, return null
		return null
	}
}

export async function getUserApiKeys(
	userId: string
): Promise<Record<string, string>> {
	const supabase = await createSupabaseServerClient()

	const { data, error } = await supabase
		.from("user_environments")
		.select("key, value")
		.eq("user_id", userId)

	if (error || !data) return {}

	// Decrypt all values before returning
	return data.reduce(
		(
			acc: Record<string, string>,
			item: { key: string; value: string }
		) => {
			try {
				const decrypted = decrypt(item.value) as {
					userId: string
					apiKey: string
				}
				if (decrypted.userId === userId) {
					acc[item.key] = decrypted.apiKey
				}
			} catch {
				// Skip keys that fail to decrypt
			}
			return acc
		},
		{}
	)
}

export async function getUserApiKeyStatus(
	userId: string
): Promise<Record<string, boolean>> {
	const supabase = await createSupabaseServerClient()

	const { data, error } = await supabase
		.from("user_environments")
		.select("key")
		.eq("user_id", userId)

	if (error || !data) return {}

	// Only return which keys exist, not their values
	return data.reduce(
		(acc: Record<string, boolean>, item: { key: string }) => {
			acc[item.key] = true
			return acc
		},
		{}
	)
}

export async function saveUserApiKey(
	userId: string,
	key: string,
	value: string
): Promise<void> {
	// Validation based on key type
	if (key.endsWith("_voice_id")) {
		// Voice ID validation (optional field)
		if (value && value.length > 0) {
			if (value.length < 11 || value.length > 30) {
				throw new Error("Voice ID must be between 11-30 characters")
			}
			if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
				throw new Error("Voice ID contains invalid characters")
			}
		}
	} else {
		// API key validation
		if (!value || value.length < 20) {
			throw new Error("Invalid API key format")
		}
		if (key === "openai_key" && !value.startsWith("sk-")) {
			throw new Error("OpenAI API key must start with sk-")
		}
	}

	const supabase = await createSupabaseServerClient()

	// Encrypt the value before storing
	const encryptedValue = encrypt({
		apiKey: value,
		userId: userId,
	})

	const { error } = await supabase.from("user_environments").upsert({
		user_id: userId,
		key,
		value: encryptedValue,
		updated_at: new Date().toISOString(),
	})

	if (error) throw error
}

export async function deleteUserApiKey(
	userId: string,
	key: string
): Promise<void> {
	const supabase = await createSupabaseServerClient()

	const { error } = await supabase
		.from("user_environments")
		.delete()
		.eq("user_id", userId)
		.eq("key", key)

	if (error) throw error
}
