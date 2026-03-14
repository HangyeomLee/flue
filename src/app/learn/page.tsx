'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

import AppLayout from '@/components/AppLayout'
import LessonProgress from '@/components/LessonProgress'
import DrawingCanvas from '@/components/DrawingCanvas'
import WordCard from '@/components/WordCard'
import PhraseCard from '@/components/PhraseCard'
import PatternBuilder from '@/components/PatternBuilder'
import SentenceCard from '@/components/SentenceCard'
import ScenarioDialogue from '@/components/ScenarioDialogue'

import { SCENARIOS } from '@/data/scenarios'
import { VOCABULARY } from '@/data/vocabulary'

type Step = 'draw' | 'word' | 'phrase' | 'pattern' | 'sentence' | 'situation'
const STEPS: Step[] = ['draw', 'word', 'phrase', 'pattern', 'sentence', 'situation']

const STEP_LABELS: Record<Step, string> = {
  draw:      'Draw',
  word:      'Word',
  phrase:    'Phrase',
  pattern:   'Pattern',
  sentence:  'Sentence',
  situation: 'Practice',
}

export default function LearnPage() {
  const router = useRouter()
  const [wordIndex, setWordIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [finished, setFinished] = useState(false)
  const [slideDir, setSlideDir] = useState(1) // 1 = forward, -1 = backward

  const scenario = SCENARIOS[wordIndex]
  const vocab = VOCABULARY.find(v => v.id === scenario.vocabId)
  const referenceEmoji = vocab?.referenceEmoji ?? scenario.topicIcon
  const currentStep = STEPS[stepIndex]

  const advance = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(i => i + 1)
    }
  }

  const handleFinished = () => setFinished(true)

  const goToWord = (newIndex: number) => {
    setSlideDir(newIndex > wordIndex ? 1 : -1)
    setWordIndex(newIndex)
    setStepIndex(0)
    setFinished(false)
  }

  const isFirst = wordIndex === 0
  const isLast = wordIndex === SCENARIOS.length - 1

  return (
    <AppLayout>
      {/* ── Top bar ── */}
      <div className="flex items-center px-4 pt-4 pb-1 gap-3">
        <button
          onClick={() => router.push('/')}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-lg text-gray-600 flex-shrink-0"
          aria-label="Back to home"
        >
          ←
        </button>

        <div className="flex-1">
          {!finished && (
            <LessonProgress currentStep={stepIndex} totalSteps={STEPS.length} />
          )}
        </div>

        <div className="flex items-center gap-1">
          <span className="text-xs font-semibold text-gray-400 tabular-nums">
            {wordIndex + 1} / {SCENARIOS.length}
          </span>
          <span className="text-base">{scenario.topicIcon}</span>
        </div>
      </div>

      {/* ── Step pill row ── */}
      {!finished && (
        <div className="px-5 pb-3">
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <span
                key={s}
                className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${
                  i === stepIndex
                    ? 'bg-primary text-white'
                    : i < stepIndex
                    ? 'bg-primary-light text-primary'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {STEP_LABELS[s]}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Card content ── */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${wordIndex}-${finished ? 'done' : currentStep}`}
            initial={{ opacity: 0, x: slideDir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: slideDir * -30 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="flex flex-col flex-1"
          >
            {finished ? (
              /* ── Completion state (inline, not full-screen takeover) ── */
              <div className="flex flex-col items-center justify-center flex-1 gap-6 px-8 py-10">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 220 }}
                  className="text-8xl"
                >
                  🎉
                </motion.span>
                <div className="text-center">
                  <h2 className="text-3xl font-extrabold text-gray-900">Well done!</h2>
                  <p className="mt-2 text-base text-gray-500">You learned to say:</p>
                  <p className="mt-3 text-xl font-bold text-primary bg-primary-light rounded-2xl px-5 py-3">
                    {scenario.sentence}
                  </p>
                </div>
                <button
                  onClick={() => { setStepIndex(0); setFinished(false) }}
                  className="bg-primary-light text-primary rounded-2xl py-3 px-8 text-lg font-bold w-full border-2 border-primary"
                >
                  🔁 Practice Again
                </button>
              </div>
            ) : (
              /* ── Active lesson steps ── */
              <>
                {currentStep === 'draw' && (
                  <DrawingCanvas
                    word={scenario.word}
                    referenceEmoji={referenceEmoji}
                    onComplete={advance}
                  />
                )}
                {currentStep === 'word' && (
                  <WordCard scenario={scenario} onNext={advance} />
                )}
                {currentStep === 'phrase' && (
                  <PhraseCard scenario={scenario} onNext={advance} />
                )}
                {currentStep === 'pattern' && (
                  <PatternBuilder scenario={scenario} onNext={advance} />
                )}
                {currentStep === 'sentence' && (
                  <SentenceCard scenario={scenario} onNext={advance} />
                )}
                {currentStep === 'situation' && (
                  <ScenarioDialogue scenario={scenario} onComplete={handleFinished} />
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Word navigation ── */}
      <div className="flex gap-3 px-4 py-4 border-t border-gray-100 bg-white">
        <button
          onClick={() => goToWord(wordIndex - 1)}
          disabled={isFirst}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-bold border-2 transition-all
            disabled:opacity-30 disabled:cursor-not-allowed
            bg-white text-gray-700 border-gray-200 active:scale-95
            enabled:hover:border-primary enabled:hover:text-primary"
        >
          ← Prev Word
        </button>

        <button
          onClick={() => goToWord(wordIndex + 1)}
          disabled={isLast}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-bold border-2 transition-all
            disabled:opacity-30 disabled:cursor-not-allowed
            bg-primary text-white border-primary active:scale-95
            enabled:hover:bg-primary/90"
        >
          Next Word →
        </button>
      </div>
    </AppLayout>
  )
}
