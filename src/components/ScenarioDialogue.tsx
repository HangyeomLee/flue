'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FeedbackMessage from './FeedbackMessage'
import MicrophoneButton from './MicrophoneButton'
import type { ScenarioModule } from '@/data/scenarios'

interface ScenarioDialogueProps {
  scenario: ScenarioModule
  onComplete: () => void
}

function speak(text: string, rate = 0.85) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.rate = rate
  u.lang = 'en-US'
  window.speechSynthesis.speak(u)
}

export default function ScenarioDialogue({ scenario, onComplete }: ScenarioDialogueProps) {
  const [turn, setTurn] = useState<'prompt' | 'answer' | 'feedback'>('prompt')
  const [practiceCount, setPracticeCount] = useState(0)

  useEffect(() => {
    if (turn === 'prompt') {
      const t = setTimeout(() => speak(scenario.dialoguePrompt), 600)
      return () => clearTimeout(t)
    }
  }, [turn, scenario.dialoguePrompt])

  const handleAnswer = () => {
    speak(scenario.dialogueExpected)
    setTurn('feedback')
  }

  const handlePracticeAgain = () => {
    setPracticeCount(c => c + 1)
    setTurn('prompt')
    setTimeout(() => setTurn('answer'), 800)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 px-4 pb-6 flex-1"
    >
      {/* Location header */}
      <div className="bg-gray-800 rounded-2xl p-4 flex items-center gap-3">
        <span className="text-3xl">{scenario.scenarioIcon}</span>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Location</p>
          <p className="text-white font-bold text-lg">{scenario.scenarioLocation}</p>
        </div>
        <span className="ml-auto text-xs text-gray-400 font-medium">Situation Practice</span>
      </div>

      {/* Dialogue area */}
      <div className="flex flex-col gap-4 flex-1">
        {/* AI prompt bubble */}
        <div className="flex items-end gap-2">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl flex-shrink-0">
            {scenario.scenarioIcon}
          </div>
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-100 rounded-2xl rounded-bl-sm p-4 max-w-[75%]"
          >
            <p className="text-gray-800 text-lg font-medium">{scenario.dialoguePrompt}</p>
            <button
              onClick={() => speak(scenario.dialoguePrompt)}
              className="text-gray-400 text-xs mt-1 hover:text-gray-600"
            >
              🔊 hear again
            </button>
          </motion.div>
        </div>

        {/* User response area */}
        <AnimatePresence mode="wait">
          {turn === 'prompt' && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-end mt-2"
            >
              <button
                onClick={() => setTurn('answer')}
                className="bg-primary-light text-primary rounded-2xl rounded-br-sm px-5 py-3 font-semibold border-2 border-dashed border-primary"
              >
                Tap to respond →
              </button>
            </motion.div>
          )}

          {turn === 'answer' && (
            <motion.div
              key="answer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-end gap-3"
            >
              {/* Sentence card to tap */}
              <div className="bg-primary-light rounded-2xl rounded-br-sm p-4 max-w-[80%] border-2 border-primary">
                <p className="text-primary font-bold text-lg">{scenario.dialogueExpected}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-gray-400 text-sm">Tap 🎤 to say it</p>
                <MicrophoneButton sentence={scenario.dialogueExpected} onSpeak={handleAnswer} />
              </div>
            </motion.div>
          )}

          {turn === 'feedback' && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-3"
            >
              {/* User bubble */}
              <div className="flex justify-end">
                <div className="bg-primary rounded-2xl rounded-br-sm p-4 max-w-[80%]">
                  <p className="text-white font-bold text-lg">{scenario.dialogueExpected}</p>
                </div>
              </div>
              {/* Feedback */}
              <FeedbackMessage message={scenario.dialogueFeedback} type="success" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      {turn === 'feedback' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-3 mt-2"
        >
          {practiceCount < 2 && (
            <button
              onClick={handlePracticeAgain}
              className="bg-primary-light text-primary rounded-2xl py-3 px-6 font-bold text-lg border-2 border-primary"
            >
              🔁 Practice Again
            </button>
          )}
          <button
            onClick={onComplete}
            className="bg-primary text-white rounded-2xl py-4 px-8 text-xl font-bold w-full"
          >
            Finish Lesson 🎉
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}
