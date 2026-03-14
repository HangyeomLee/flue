'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import AudioButton from './AudioButton'
import type { ScenarioModule } from '@/data/scenarios'

interface SentenceCardProps {
  scenario: ScenarioModule
  onNext: () => void
}

function speak(text: string, rate = 0.85) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.rate = rate
  u.lang = 'en-US'
  window.speechSynthesis.speak(u)
}

export default function SentenceCard({ scenario, onNext }: SentenceCardProps) {
  const [practiced, setPracticed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => speak(scenario.sentenceAudio), 500)
    return () => clearTimeout(t)
  }, [scenario.sentenceAudio])

  const handlePractice = () => {
    speak(scenario.sentenceAudio)
    setPracticed(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6 px-4 pb-6 flex-1"
    >
      <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Full sentence</p>

      {/* Sentence card */}
      <div className="w-full bg-primary rounded-3xl p-8 flex flex-col items-center gap-4 shadow-lg">
        <p className="text-3xl font-bold text-white text-center leading-tight">
          {scenario.sentence}
        </p>
        <AudioButton text={scenario.sentenceAudio} size="lg" />
      </div>

      {/* Context hint */}
      <div className="w-full bg-amber-50 rounded-2xl p-4 flex items-center gap-4 border border-amber-200">
        <div className="text-4xl">{scenario.scenarioIcon}</div>
        <div>
          <p className="text-xs text-amber-600 uppercase tracking-wider font-medium">You can say this at:</p>
          <p className="text-xl font-bold text-amber-800">{scenario.scenarioLocation}</p>
        </div>
      </div>

      {/* Practice button */}
      <button
        onClick={handlePractice}
        className={`w-full rounded-2xl py-4 px-8 text-xl font-bold border-2 transition-all ${
          practiced
            ? 'bg-primary-light text-primary border-primary'
            : 'bg-white text-primary border-primary'
        }`}
      >
        {practiced ? '🔁 Practice Again' : '🎤 Practice Speaking'}
      </button>

      {practiced && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-primary font-semibold text-center"
        >
          Great practice! 🌟
        </motion.p>
      )}

      <div className="flex-1" />

      <button
        onClick={onNext}
        className="bg-primary text-white rounded-2xl py-4 px-8 text-xl font-bold w-full"
      >
        Try it out →
      </button>
    </motion.div>
  )
}
