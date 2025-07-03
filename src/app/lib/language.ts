import { SIDEBAR_LANGUAGE } from "../components/layout/sidebar/language"
import { PLAYGROUND_LANGUAGE } from "../playground/language"
import { AUTH_LANGUAGE } from "../auth/language"
import { SupportedLanguageCode } from "../types/common"

// Merge all language objects
export const LANGUAGE = {
	...SIDEBAR_LANGUAGE,
	...PLAYGROUND_LANGUAGE,
	...AUTH_LANGUAGE,
} as const

// Add these new translations to the existing object
export const COMMON_LANGUAGE = {
	// ... existing translations ...

	// Settings translations
	"settings.title.en": "Settings",
	"settings.title.tr": "Ayarlar",
	"settings.title.de": "Einstellungen",
	"settings.title.sv": "Inställningar",
	"settings.title.ru": "Настройки",
	"settings.title.es": "Configuración",
	"settings.description.en": "Manage your account and preferences",
	"settings.description.tr": "Hesabınızı ve tercihlerinizi yönetin",
	"settings.description.de": "Verwalten Sie Ihr Konto und Ihre Einstellungen",
	"settings.description.sv": "Hantera ditt konto och inställningar",
	"settings.description.ru": "Управляйте своей учетной записью и настройками",
	"settings.description.es": "Administra tu cuenta y preferencias",
	"settings.user.anonymous.en": "Anonymous User",
	"settings.user.anonymous.tr": "Anonim Kullanıcı",
	"settings.user.anonymous.de": "Anonymer Benutzer",
	"settings.user.anonymous.sv": "Anonym användare",
	"settings.user.anonymous.ru": "Анонимный пользователь",
	"settings.user.anonymous.es": "Usuario anónimo",

	// Delete account translations
	"settings.deleteAccount.tr": "Hesabımı Sil",
	"settings.deleteAccount.en": "Delete My Account",
	"settings.deleteAccount.title.tr":
		"Hesabını Silmek İstediğine Emin Misin?",
	"settings.deleteAccount.title.en":
		"Are You Sure You Want to Delete Your Account?",
	"settings.deleteAccount.warning.tr":
		"Bu işlem hesabınızı ve tüm verilerinizi kalıcı olarak silecektir.",
	"settings.deleteAccount.warning.en":
		"This action will permanently delete your account and all your data.",
	"settings.deleteAccount.permanent.tr":
		"Bu işlem geri alınamaz ve tüm verileriniz silinecektir.",
	"settings.deleteAccount.permanent.en":
		"This action cannot be undone and all your data will be deleted.",
	"settings.deleteAccount.confirm.tr":
		"Silme işlemini onaylamak için 'DELETE' yazın",
	"settings.deleteAccount.confirm.en":
		"Type 'DELETE' to confirm deletion",
	"settings.deleteAccount.button.tr": "Hesabımı Sil",
	"settings.deleteAccount.button.en": "Delete My Account",
	"common.cancel.tr": "İptal",
	"common.cancel.en": "Cancel",
	"common.processing.tr": "İşleniyor...",
	"common.processing.en": "Processing...",
} as const

// Type definitions
export type LangKey = keyof (typeof TRANSLATIONS)["tr"]
type LangString = `${LangKey}.${SupportedLanguageCode}`

// Combine all language objects
export const TRANSLATIONS = {
	tr: Object.fromEntries(
		Object.entries({
			...PLAYGROUND_LANGUAGE,
			...COMMON_LANGUAGE,
			...SIDEBAR_LANGUAGE,
			...AUTH_LANGUAGE,
		}).filter(([key]) => key.endsWith(".tr"))
	) as Record<string, string>,
	en: Object.fromEntries(
		Object.entries({
			...PLAYGROUND_LANGUAGE,
			...COMMON_LANGUAGE,
			...SIDEBAR_LANGUAGE,
			...AUTH_LANGUAGE,
		}).filter(([key]) => key.endsWith(".en"))
	) as Record<string, string>,
} as const

// Type-safe translation function
export const t = (
	key: LangKey,
	lang: SupportedLanguageCode
): string => {
	const fullKey = `${key}.${lang}` as LangString
	const value = LANGUAGE[fullKey as keyof typeof LANGUAGE]

	if (!value) {
		// check if en version exists
		const enValue = LANGUAGE[`${key}.en` as keyof typeof LANGUAGE]
		if (enValue) {
			console.warn(`Missing translation: ${fullKey}`)
			return enValue
		}
		console.warn(`Missing translation: ${fullKey}`)
		return key
	}

	return value
}

// Type-safe interpolation function
export const i = (
	key: LangKey,
	lang: SupportedLanguageCode,
	values: Record<string, string>
): string => {
	let text = t(key, lang)

	Object.entries(values).forEach(([key, value]) => {
		text = text.replace(`{${key}}`, value)
	})

	return text
}

// Get all translations for a key
export const getAll = (
	key: LangKey
): Record<SupportedLanguageCode, string> => ({
	tr: t(key, "tr"),
	en: t(key, "en"),
	ru: t(key, "ru"),
	de: t(key, "de"),
	sv: t(key, "sv"),
	es: t(key, "es"),
})

// Check if key exists
export const has = (key: LangKey): boolean => {
	return `${key}.tr` in LANGUAGE || `${key}.en` in LANGUAGE
}

// Usage:
// import { t, i } from "@/language"
// t("title", "tr") -> "TransLearn AI"
// i("navigation.sections.empty", "tr", { query: "test" }) -> 'Aradığınız "test" ile ilgili bir şey bulunamadı'
