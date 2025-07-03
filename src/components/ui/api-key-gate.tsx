"use client"

import { useEffect, useState } from "react"
import { useUserEnvironments } from "@/hooks/user-environments"
import { useUiStore } from "@/app/store/ui"
import { t } from "@/app/lib/language"
import { ApiKeySetup } from "./api-key-setup"
import { KeyIcon } from "@heroicons/react/24/outline"
import { Button } from "./button"

interface ApiKeyGateProps {
  children: React.ReactNode
  requiredKeys?: ('openai_key' | 'elevenlabs_key')[]
}

export function ApiKeyGate({ 
  children, 
  requiredKeys = ['openai_key']
}: ApiKeyGateProps) {
  const { hasOpenAI, hasElevenLabs, isLoading } = useUserEnvironments()
  const [showSetup, setShowSetup] = useState(false)
  const currentLanguage = useUiStore(state => state.currentLanguage)

  // Check if all required keys are present
  const hasRequiredKeys = requiredKeys.every(key => {
    switch (key) {
      case 'openai_key': return hasOpenAI
      case 'elevenlabs_key': return hasElevenLabs
      default: return false
    }
  })

  // Auto-show setup if missing required keys
  useEffect(() => {
    if (!isLoading && !hasRequiredKeys) {
      setShowSetup(true)
    }
  }, [isLoading, hasRequiredKeys])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-pulse text-white/50">
          {t("apikey.gate.loading", currentLanguage)}
        </div>
      </div>
    )
  }

  if (!hasRequiredKeys) {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-32 gap-4">
          <div className="p-3 rounded-lg bg-amber-500/20">
            <KeyIcon className="w-8 h-8 text-amber-400" />
          </div>
          <p className="text-white/70 text-center">
            {t("apikey.gate.required", currentLanguage)}
          </p>
          <Button onClick={() => setShowSetup(true)} size="sm">
            {t("apikey.gate.configure", currentLanguage)}
          </Button>
        </div>
        <ApiKeySetup 
          open={showSetup} 
          onOpenChange={setShowSetup}
          requiredKeys={requiredKeys}
        />
      </>
    )
  }

  return <>{children}</>
}