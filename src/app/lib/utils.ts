import { type ClassValue, clsx } from "clsx"
import { NextRequest } from "next/server"
import { twMerge } from "tailwind-merge"

/**
 * @reason Merges tailwind classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function extractUserId(request: NextRequest) {
	const userId = request.headers.get("x-user-id")
	if (!userId) throw new Error("Missing user id")
	return userId
}
