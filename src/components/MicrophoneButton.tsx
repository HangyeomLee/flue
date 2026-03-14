'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface MicrophoneButtonProps {
  sentence: string
  onSpeak?: () => void
}

function speak(text: string) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.rate = 0.85
  u.lang = 'en-US'
  window.speechSynthesis.speak(u)
}

export default function MicrophoneButton({ sentence, onSpeak }: MicrophoneButtonProps) {
  const [speaking, setSpeaking] = useState(false)

  const handlePress = () => {
    speak(sentence)
    setSpeaking(true)
    onSpeak?.()
    setTimeout(() => setSpeaking(false), 2000)
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={handlePress}
        className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-lg transition-all ${
          speaking
            ? 'bg-red-500 ring-4 ring-red-300 animate-pulse'
            : 'bg-primary'
        }`}
        aria-label="Tap to speak"
      >
        🎤
      </motion.button>
      <p className="text-sm font-semibold text-gray-600">
        {speaking ? 'Speaking...' : 'Tap to speak'}
      </p>
    </div>
  )
}
