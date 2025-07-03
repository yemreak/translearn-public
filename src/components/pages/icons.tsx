import {
	EmotionalMirroringIcon,
	GoogleIcon,
	HistoryIcon,
	LanguageIcon,
	LanguageMatchGameIcon,
	ListeningIcon,
	NewChatIcon,
	NotionIcon,
	PlayIcon,
	PrivacyIcon,
	PronunciationIcon,
	RealWorldContextIcon,
	RecordIcon,
	SearchIcon,
	SettingsIcon,
	SidebarIcon,
	SpeakingIcon,
	SubconsciousFlowIcon,
	SyncIcon,
	TranscriptionIcon,
	TranslationIcon,
	VocabularyIcon,
} from "@/components/icons"

type IconInfo = {
	name: string
	Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
	sizes?: { name: string; size: string }[]
	colors?: { name: string; color: string }[]
	description?: string
}

const icons: IconInfo[] = [
	{
		name: "Notion",
		Icon: NotionIcon,
		description: "Integration with Notion",
		sizes: [
			{ name: "Small", size: "w-4 h-4" },
			{ name: "Medium", size: "w-6 h-6" },
			{ name: "Large", size: "w-8 h-8" },
		],
	},
	{
		name: "NewChat",
		Icon: NewChatIcon,
		description: "Start a new conversation",
		colors: [
			{ name: "Default", color: "text-current" },
			{ name: "Primary", color: "text-primary" },
			{ name: "Secondary", color: "text-secondary" },
		],
	},
	{ name: "Sidebar", Icon: SidebarIcon, description: "Toggle sidebar" },
	{ name: "Record", Icon: RecordIcon, description: "Start recording" },
	{ name: "Play", Icon: PlayIcon, description: "Play audio" },
	{
		name: "Settings",
		Icon: SettingsIcon,
		description: "Configure settings",
	},
	{
		name: "PrivateShield",
		Icon: PrivacyIcon,
		description: "Privacy protection",
	},
	{ name: "Google", Icon: GoogleIcon, description: "Google integration" },
	{
		name: "Transcription",
		Icon: TranscriptionIcon,
		description: "Convert speech to text",
	},
	{ name: "Sync", Icon: SyncIcon, description: "Synchronize data" },
	{ name: "Privacy", Icon: PrivacyIcon, description: "Privacy settings" },
	{
		name: "EmotionalMirroring",
		Icon: EmotionalMirroringIcon,
		description: "Emotional response",
	},
	{
		name: "RealWorldContext",
		Icon: RealWorldContextIcon,
		description: "Real-world examples",
	},
	{
		name: "SubconsciousFlow",
		Icon: SubconsciousFlowIcon,
		description: "Learning flow",
	},
	{
		name: "Language",
		Icon: LanguageIcon,
		description: "Language selection",
	},
	{
		name: "Speaking",
		Icon: SpeakingIcon,
		description: "Speaking practice",
	},
	{
		name: "Listening",
		Icon: ListeningIcon,
		description: "Listening practice",
	},
	{
		name: "Pronunciation",
		Icon: PronunciationIcon,
		description: "Pronunciation guide",
	},
	{
		name: "Translation",
		Icon: TranslationIcon,
		description: "Text translation",
	},
	{
		name: "Vocabulary",
		Icon: VocabularyIcon,
		description: "Word learning",
	},
	{
		name: "LanguageMatchGame",
		Icon: LanguageMatchGameIcon,
		description: "Language games",
	},
	{ name: "History", Icon: HistoryIcon, description: "View history" },
	{ name: "Search", Icon: SearchIcon, description: "Search content" },
]

export default function IconsPage() {
	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-4">Icon Gallery</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{icons.map(({ name, Icon, sizes, colors, description }) => (
					<div
						key={name}
						className="p-4 border rounded-lg hover:bg-gray-50 transition-colors space-y-4">
						<div className="flex items-center gap-4">
							<Icon className="w-8 h-8" />
							<div>
								<h3 className="font-semibold">{name}</h3>
								<p className="text-sm text-gray-600">{description}</p>
							</div>
						</div>

						{sizes && (
							<div className="space-y-2">
								<h4 className="text-sm font-medium">Sizes</h4>
								<div className="flex gap-4">
									{sizes.map(({ name, size }) => (
										<div
											key={name}
											className="flex flex-col items-center gap-1">
											<Icon className={size} />
											<span className="text-xs text-gray-500">{name}</span>
										</div>
									))}
								</div>
							</div>
						)}

						{colors && (
							<div className="space-y-2">
								<h4 className="text-sm font-medium">Colors</h4>
								<div className="flex gap-4">
									{colors.map(({ name, color }) => (
										<div
											key={name}
											className="flex flex-col items-center gap-1">
											<Icon className={`w-6 h-6 ${color}`} />
											<span className="text-xs text-gray-500">{name}</span>
										</div>
									))}
								</div>
							</div>
						)}

						<div className="pt-2 text-sm text-gray-500">
							<code>{`<${name}Icon className="w-6 h-6" />`}</code>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
