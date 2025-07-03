import { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "TransLearn",
		short_name: "TransLearn",
		description: "Yapay zeka destekli dil öğrenme platformu",
		start_url: "/",

		// PWA temel özellikleri
		display: "standalone",
		background_color: "#000000",
		theme_color: "#000000",

		// Apple PWA desteği için özel alanlar
		display_override: ["standalone", "browser"],
		scope: "/",
		categories: ["education", "productivity"],

		// Native app tercihi
		prefer_related_applications: false,

		// Apple için özel icon desteği
		icons: [
			{
				src: "/icons/192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/icons/512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],

		// Apple splash screen desteği
		screenshots: [
			{
				src: "/images/splash-dark.png", // layout.tsx'deki startupImage ile aynı
				sizes: "1170x2532",
				type: "image/png",
				label: "TransLearn Dark Mode",
			},
		],

		// layout.tsx'deki viewport ayarlarına uygun
		orientation: "portrait",
	}
}
