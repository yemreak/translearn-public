import { cn } from "@/app/lib/utils"
import { AnalyticsProvider } from "@/app/providers/analytics-provider"
import { QueryProvider } from "@/app/providers/query-provider"
import { appDescription, appTitle } from "@/config"
import type { Metadata, Viewport } from "next"
import { Quicksand } from "next/font/google"
import "./globals.css"

const quicksand = Quicksand({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	variable: "--font-quicksand",
	display: "swap",
	preload: true,
})

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	minimumScale: 1,
	userScalable: false,
	viewportFit: "cover",
	themeColor: "#000000",
}

export const metadata: Metadata = {
	metadataBase: new URL("https://translearn.ai"),
	title: {
		default: appTitle,
		template: "%s | TransLearn",
	},
	description: appDescription,
	applicationName: appTitle,
	appleWebApp: {
		capable: true,
		statusBarStyle: "black-translucent",
		title: "TransLearn",
		startupImage: "/images/splash-dark.png",
	},
	robots: { index: true, follow: true },
	creator: "yemreak",
	publisher: "TransLearn",
	generator: "Next.js",
	keywords: [
		"Yapay Zeka",
		"Dil Öğrenme",
		"İngilizce",
		"Türkçe",
		"Eğitim",
		"Çeviri",
		"Anında",
		"Kendi Sesimle",
		"Günlük Hayat",
	],
	category: "education",
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" className="dark">
			<head>
				<link
					href="https://fonts.googleapis.com/icon?family=Material+Icons"
					rel="stylesheet"
				/>
			</head>
			<body
				className={cn(
					// Font ve genel stil
					quicksand.variable,
					"font-sans antialiased font-bold",

					// Dokunmatik ve scroll ayarları
					"touch-pan-y touch-manipulation",
					"overscroll-none", // iOS rubber-band etkisini engeller
					"overflow-y-auto", // Dikey scroll'u aktif eder

					// Görsel tema
					"bg-black text-white",
					"dark:bg-black dark:text-white",

					// Yerleşim ayarları
					"flex flex-col",
					"min-h-screen",
					"w-full",
					"scroll-smooth",
					"scrollbar-hide"
				)}>
				<QueryProvider>
					<AnalyticsProvider>{children}</AnalyticsProvider>
				</QueryProvider>
			</body>
		</html>
	)
}
