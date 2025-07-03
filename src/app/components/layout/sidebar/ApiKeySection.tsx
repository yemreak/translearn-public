"use client"

import { useUserEnvironments, UserEnvironmentKey } from "@/hooks/user-environments"
import { EyeIcon, EyeSlashIcon, KeyIcon, CheckIcon, ExclamationTriangleIcon, ChevronDownIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

export function ApiKeySection() {
  const { hasKey, updateEnvironment } = useUserEnvironments()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [tempValue, setTempValue] = useState("")

  const keyInfo = {
    openai_key: {
      label: 'OpenAI',
      placeholder: 'sk-...',
      description: 'For transcription & AI',
      required: true,
      link: 'https://platform.openai.com/api-keys',
    },
    elevenlabs_key: {
      label: 'ElevenLabs',
      placeholder: 'xi-...',
      description: 'For text-to-speech',
      required: false,
      link: 'https://try.elevenlabs.io/x8c2orrd1adk',
    },
    elevenlabs_voice_id: {
      label: 'Voice ID',
      placeholder: 'abc123def456ghi789jk',
      description: 'Custom voice',
      required: false,
      link: 'https://try.elevenlabs.io/x8c2orrd1adk',
      showOnlyIf: 'elevenlabs_key',
    },
  }

  const requiredKeys = Object.entries(keyInfo)
    .filter(([, info]) => info.required)
    .map(([key]) => key)

  const configuredRequiredKeys = requiredKeys.filter(key => hasKey(key as UserEnvironmentKey))
  const hasAllRequired = configuredRequiredKeys.length === requiredKeys.length

  const handleSave = async (key: string) => {
    if (!tempValue) {
      toast.error('Please enter a value')
      return
    }

    try {
      await updateEnvironment.mutateAsync({
        key: key as UserEnvironmentKey,
        value: tempValue
      })
      toast.success(`${keyInfo[key as keyof typeof keyInfo].label} saved`)
      setEditingKey(null)
      setTempValue("")
    } catch {
      toast.error('Failed to save')
    }
  }

  const handleEdit = (key: string) => {
    setEditingKey(key)
    setTempValue("")
  }

  return (
    <div className="mx-4 rounded-lg bg-white/5 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <KeyIcon className="w-4 h-4 text-white/70" />
          <span className="text-sm font-medium text-white/90">API Keys</span>
          {hasAllRequired ? (
            <CheckIcon className="w-4 h-4 text-green-400" />
          ) : (
            <div className="flex items-center gap-1">
              <ExclamationTriangleIcon className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-amber-400">
                {configuredRequiredKeys.length}/{requiredKeys.length}
              </span>
            </div>
          )}
        </div>
        <ChevronDownIcon
          className={`w-4 h-4 text-white/50 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 pt-0 space-y-3">
              {Object.entries(keyInfo).map(([key, info]) => {
                if ('showOnlyIf' in info && info.showOnlyIf) {
                  const hasPrerequisite = hasKey(info.showOnlyIf as UserEnvironmentKey)
                  if (!hasPrerequisite) return null
                }

                const isConfigured = hasKey(key as UserEnvironmentKey)
                const isVoiceId = key.endsWith('_voice_id')
                const isEditing = editingKey === key

                return (
                  <div key={key} className={isVoiceId ? 'ml-4' : ''}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-white/80">
                          {info.label}
                        </span>
                        {info.required && <span className="text-red-400 text-xs">*</span>}
                        {isConfigured && <CheckIcon className="w-3 h-3 text-green-400" />}
                      </div>
                      <a
                        href={info.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        Get →
                      </a>
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="relative">
                          <input
                            type={showKeys[key] || isVoiceId ? 'text' : 'password'}
                            value={tempValue}
                            onChange={e => setTempValue(e.target.value)}
                            placeholder={info.placeholder}
                            className="w-full px-2 py-1 pr-8 text-xs rounded bg-black/30 border border-white/10 focus:border-purple-500 focus:outline-none"
                            autoFocus
                          />
                          {!isVoiceId && (
                            <button
                              type="button"
                              onClick={() => setShowKeys(prev => ({ ...prev, [key]: !prev[key] }))}
                              className="absolute right-1 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded"
                            >
                              {showKeys[key] ? (
                                <EyeSlashIcon className="w-3 h-3 text-white/50" />
                              ) : (
                                <EyeIcon className="w-3 h-3 text-white/50" />
                              )}
                            </button>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSave(key)}
                            disabled={updateEnvironment.isPending}
                            className="flex-1 px-2 py-1 text-xs bg-purple-600 hover:bg-purple-700 rounded transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingKey(null)
                              setTempValue("")
                            }}
                            className="flex-1 px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(key)}
                        className="w-full text-left px-2 py-1 text-xs rounded bg-black/30 hover:bg-black/40 transition-colors"
                      >
                        {isConfigured ? (
                          <span className="text-white/50">••••••••••••</span>
                        ) : (
                          <span className="text-white/40">Click to configure</span>
                        )}
                      </button>
                    )}

                    <p className="text-xs text-white/40 mt-1">{info.description}</p>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}