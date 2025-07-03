"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { UserEnvironmentKey, useUserEnvironments } from "@/hooks/user-environments"
import { EyeIcon, EyeSlashIcon, KeyIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import { toast } from "sonner"

interface ApiKeySetupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  requiredKeys?: UserEnvironmentKey[]
}

export function ApiKeySetup({ open, onOpenChange }: ApiKeySetupProps) {
  const { hasKey, updateEnvironment } = useUserEnvironments()
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [keys, setKeys] = useState<Record<string, string>>({
    openai_key: '',
    elevenlabs_key: '',
    elevenlabs_voice_id: '',
  })

  const keyInfo = {
    openai_key: {
      label: 'OpenAI API Key',
      placeholder: 'sk-...',
      description: 'Required for transcription and AI features',
      required: true,
      link: 'https://platform.openai.com/api-keys',
    },
    elevenlabs_key: {
      label: 'ElevenLabs API Key',
      placeholder: 'xi-...',
      description: 'For high-quality text-to-speech',
      required: false,
      link: 'https://elevenlabs.io/api',
    },
    elevenlabs_voice_id: {
      label: 'ElevenLabs Voice ID',
      placeholder: 'abc123def456ghi789jk',
      description: 'Optional: Use your custom ElevenLabs voice for text-to-speech',
      required: false,
      link: 'https://elevenlabs.io/voice-library',
      showOnlyIf: 'elevenlabs_key',
    },
  }

  const handleSave = async () => {
    try {
      const updates = Object.entries(keys)
        .filter(([, value]) => {
          // Only update if user entered something
          return !!value
        })
        .map(([key, value]) => updateEnvironment.mutateAsync({
          key: key as UserEnvironmentKey,
          value
        }))

      if (updates.length === 0) {
        toast.error('No changes to save')
        return
      }

      await Promise.all(updates)
      toast.success('API keys saved successfully')
      onOpenChange(false)
    } catch (error) {
      toast.error(`Failed to save API keys: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const toggleShowKey = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <KeyIcon className="w-5 h-5" />
            API Configuration
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <p className="text-sm text-amber-200">
              TransLearn requires your own API keys to function. Your keys are encrypted and never shared.
            </p>
          </div>

          {Object.entries(keyInfo).map(([key, info]) => {
            // Skip conditional fields if their prerequisite isn't met
            if ('showOnlyIf' in info && info.showOnlyIf) {
              // Check both local state and saved value
              const hasPrerequisite = keys[info.showOnlyIf] || hasKey(info.showOnlyIf as UserEnvironmentKey)
              if (!hasPrerequisite) {
                return null
              }
            }

            const isVoiceId = key.endsWith('_voice_id')
            const containerClass = isVoiceId
              ? "space-y-2 ml-4 pl-4 border-l-2 border-white/10"
              : "space-y-2"

            return (
              <div key={key} className={containerClass}>
                <div className="flex items-center justify-between">
                  <label className={`text-sm font-medium flex items-center gap-2 ${
                    isVoiceId ? 'text-white/70' : ''
                  }`}>
                    {info.label}
                    {info.required && <span className="text-red-500 ml-1">*</span>}
                    {hasKey(key as UserEnvironmentKey) && (
                      <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                        Configured
                      </span>
                    )}
                    {isVoiceId && !hasKey(key as UserEnvironmentKey) && (
                      <span className="text-xs px-2 py-1 bg-white/10 text-white/50 rounded">
                        Optional
                      </span>
                    )}
                  </label>
                  <a
                    href={info.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    {isVoiceId ? 'Find Voice ID →' : 'Get API Key →'}
                  </a>
                </div>

                <div className="relative">
                  <input
                    type={showKeys[key] || isVoiceId ? 'text' : 'password'}
                    value={keys[key]}
                    onChange={e => setKeys(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={hasKey(key as UserEnvironmentKey) ? '••••••••••••' : info.placeholder}
                    className={`w-full px-3 py-2 ${isVoiceId ? 'pr-3' : 'pr-10'} rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none`}
                  />
                  {!isVoiceId && (
                    <button
                      type="button"
                      onClick={() => toggleShowKey(key)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded"
                    >
                      {showKeys[key] ? (
                        <EyeSlashIcon className="w-4 h-4 text-white/50" />
                      ) : (
                        <EyeIcon className="w-4 h-4 text-white/50" />
                      )}
                    </button>
                  )}
                </div>

                <p className="text-xs text-white/50">{info.description}</p>
              </div>
            )
          })}

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={!keys.openai_key || updateEnvironment.isPending}
              className="flex-1"
            >
              {updateEnvironment.isPending ? 'Saving...' : 'Save Keys'}
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              variant="ghost"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
  }