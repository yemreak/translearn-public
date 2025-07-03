import { SupportedLanguageCode } from "@/app/types/common"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type UiState = {
	hasSeenGuidance: boolean
	isPrivateMode: boolean
	currentLanguage: SupportedLanguageCode
	targetLanguage: SupportedLanguageCode
	isPlaygroundWarningVisible: boolean
	isAiWarningDismissed: boolean
}

type UiActions = {
	setHasSeenGuidance: (value: boolean) => void
	setIsPrivateMode: (value: boolean) => void
	setCurrentLanguage: (value: SupportedLanguageCode) => void
	setTargetLanguage: (value: SupportedLanguageCode) => void
	hidePlaygroundWarning: () => void
	dismissAiWarning: () => void
}

type UiStore = UiState & UiActions

const initialState: UiState = {
	hasSeenGuidance: false,
	isPrivateMode: false,
	currentLanguage: "tr", // will be updated from user preferences
	targetLanguage: "en", // default target language
	isPlaygroundWarningVisible: true,
	isAiWarningDismissed: false,
}

// Keys to persist in localStorage
const persistentKeys: (keyof UiState)[] = [
	"hasSeenGuidance",
	"isPrivateMode",
	"currentLanguage",
	"targetLanguage",
	"isPlaygroundWarningVisible",
	"isAiWarningDismissed",
]

export const useUiStore = create<UiStore>()(
	persist(
		set => ({
			...initialState,
			setHasSeenGuidance: value => set({ hasSeenGuidance: value }),
			setIsPrivateMode: value => set({ isPrivateMode: value }),
			setCurrentLanguage: value => set({ currentLanguage: value }),
			setTargetLanguage: value => set({ targetLanguage: value }),
			hidePlaygroundWarning: () =>
				set({ isPlaygroundWarningVisible: false }),
			dismissAiWarning: () => set({ isAiWarningDismissed: true }),
		}),
		{
			name: "ui-store",
			storage: createJSONStorage(() => localStorage),
			partialize: state =>
				Object.fromEntries(
					persistentKeys.map(key => [key, state[key]])
				) as UiState,
			version: 1, // Add version for future migrations
		}
	)
)
