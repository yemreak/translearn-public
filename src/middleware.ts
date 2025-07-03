import { NextResponse, type NextRequest } from "next/server"
import { updateSession } from "./services/supabase/middleware"

const publicPaths = ["/auth"]
const authPath = "/auth"
export const homePath = "/playground"

export async function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname
	const isPublicPath = publicPaths.some(publicPath =>
		path.startsWith(publicPath)
	)

	// Handle admin routes - only allow yemreak@icloud.com
	if (path.startsWith("/admin")) {
		const { user } = await updateSession(request)
		if (!user) return NextResponse.redirect(new URL(authPath, request.url))

		if (user.email !== "yemreak@icloud.com") {
			return NextResponse.redirect(new URL(homePath, request.url))
		}

		return NextResponse.next()
	}

	if (path === authPath) {
		const { user } = await updateSession(request)
		if (user) return NextResponse.redirect(new URL(homePath, request.url))
		return NextResponse.next()
	}

	if (isPublicPath) return NextResponse.next()

	const isApiPath = path.includes("/api/")
	if (isApiPath) {
		const { user } = await updateSession(request)
		if (!user)
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

		const requestHeaders = new Headers(request.headers)
		requestHeaders.set("x-user-id", user.id)
		return NextResponse.next({ request: { headers: requestHeaders } })
	}

	const { user, response } = await updateSession(request)
	if (!user) return NextResponse.redirect(new URL(authPath, request.url))

	return response
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - manifest.webmanifest (web manifest file)
		 * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
		 * - sw.js (service worker file)
		 * Feel free to modify this pattern to include more paths.
		 */
		"/((?!_not-found|_error|_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
		"/api/:path*",
		"/:path*/api/:path*",
	],
}
