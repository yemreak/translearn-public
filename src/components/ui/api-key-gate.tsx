"use client"

import { useEffect, useState } from "react"
import { useUserEnvironments } from "@/hooks/user-environments"
import { ApiKeySetup } from "./api-key-setup"
import { KeyIcon } from "@heroicons/react/24/outline"
import { Button } from "./button"

interface ApiKeyGateProps {
  children: React.ReactNode
  requiredKeys?: ('openai_key' | 'elevenlabs_key')[]
  feature?: string
}

export function ApiKeyGate({ 
  children, 
  requiredKeys = ['openai_key'],
  feature = "this feature"
}: ApiKeyGateProps) {
  const { hasOpenAI, hasElevenLabs, isLoading } = useUserEnvironments()
  const [showSetup, setShowSetup] = useState(false)

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
        <div className="animate-pulse text-white/50">Loading...</div>
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
            API keys required to use {feature}
          </p>
          <Button onClick={() => setShowSetup(true)} size="sm">
            Configure API Keys
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