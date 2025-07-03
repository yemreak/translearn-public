// src/config.ts
// Simple Next.js compatible configuration

// Client-safe config (NEXT_PUBLIC_ variables only)
export const clientConfig = {
	supabase: {
		url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
		anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	},
	app: {
		title: "TransLearn.ai",
		description:
			"Yapay zeka ve kendi sesinizle günlük hayatta anında kullanabileceğiniz İngilizce öğrenme platformu",
		url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
	},
	isDev: process.env.NODE_ENV !== "production",
}

// Server-only config (all environment variables)
export const serverConfig = {
	supabase: {
		url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
		serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
		anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	},
	telegram: {
		token: process.env.TELEGRAM_BOT_TOKEN!,
		webhookDomain: process.env.TELEGRAM_WEBHOOK_DOMAIN || "",
	},
	ai: {
		anthropic: process.env.ANTHROPIC_API_KEY || "",
		openai: process.env.OPENAI_API_KEY || "",
		elevenlabs: process.env.ELEVENLABS_API_KEY || "",
		elevenlabsPlanId: process.env.ELEVENLABS_PLAN_ID || "",
	},
	encryption: {
		key: process.env.ENCRYPTION_KEY!,
	},
	notion: {
		apiKey: process.env.NOTION_API_KEY || "",
		clientId: process.env.NOTION_CLIENT_ID || "",
		clientSecret: process.env.NOTION_CLIENT_SECRET || "",
		redirectUri: process.env.NOTION_REDIRECT_URI || "",
	},
	frontend: {
		domain: process.env.FRONTEND_DOMAIN || "https://clarityos.ai",
	},
	cron: {
		secret: process.env.CRON_SECRET || "",
	},
	isDev: process.env.NODE_ENV !== "production",
	port: parseInt(process.env.PORT || "3000"),
	app: clientConfig.app,
}

// Legacy exports
export const appTitle = serverConfig.app.title
export const appDescription = serverConfig.app.description
