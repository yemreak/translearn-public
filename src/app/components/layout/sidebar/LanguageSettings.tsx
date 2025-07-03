import { t } from "@/app/lib/language"
import { useUiStore } from "@/app/store/ui"
import {
	SupportedLanguageCode,
	SupportedLanguageSchemas,
} from "@/app/types/common"
import { usePreferences } from "@/hooks/preferences"
import { LanguageIcon } from "@heroicons/react/24/outline"

/**
 * ### Purpose
 * Allow users to configure interface language and language learning settings
 *
 * ### Use-case
 * _"Uygulamanın dilini ve öğrenmek istediğim dil kombinasyonlarını ayarlamak istiyorum."_
 */
export function LanguageSettings({
	lang,
}: {
	lang: SupportedLanguageCode
}) {
	const {
		currentLanguage,
		targetLanguage,
		setCurrentLanguage,
		setTargetLanguage,
	} = useUiStore()

	const preferences = usePreferences()

	// Get all available languages from enum
	const availableLanguages = Object.values(
		SupportedLanguageSchemas.enum
	)

	// Handle UI language change
	const handleUiLanguageChange = (
		newLanguage: SupportedLanguageCode
	) => {
		setCurrentLanguage(newLanguage)

		// Update preferences if available
		if (preferences?.update) {
			preferences.update({ source_language: newLanguage })
		}
	}

	// Handle target language change
	const handleTargetLanguageChange = (
		newLanguage: SupportedLanguageCode
	) => {
		setTargetLanguage(newLanguage)

		// Update preferences if available
		if (preferences?.update) {
			preferences.update({ target_language: newLanguage })
		}
	}

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2 text-white/90">
				<LanguageIcon className="w-5 h-5" />
				<h3 className="text-sm font-medium">
					{t("sidebar.language.title", lang)}
				</h3>
			</div>

			<div className="space-y-3 pl-7">
				{/* Interface Language Selector */}
				<div className="space-y-1">
					<label className="block text-xs text-white/70">
						{t("sidebar.language.ui.label", lang)}
					</label>
					<select
						value={currentLanguage}
						onChange={e =>
							handleUiLanguageChange(
								e.target.value as SupportedLanguageCode
							)
						}
						className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/90 focus:ring-1 focus:ring-purple-500 focus:border-purple-500">
						{availableLanguages.map(langCode => (
							<option key={`ui-${langCode}`} value={langCode}>
								{t(`language.${langCode}`, lang)}
							</option>
						))}
					</select>
				</div>

				{/* Target Language Selector */}
				<div className="space-y-1">
					<label className="block text-xs text-white/70">
						{t("sidebar.language.target.label", lang)}
					</label>
					<select
						value={targetLanguage}
						onChange={e =>
							handleTargetLanguageChange(
								e.target.value as SupportedLanguageCode
							)
						}
						className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/90 focus:ring-1 focus:ring-purple-500 focus:border-purple-500">
						{availableLanguages.map(langCode => (
							<option key={`target-${langCode}`} value={langCode}>
								{t(`language.${langCode}`, lang)}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	)
}
