'use client'

import { use, useState } from 'react'
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

export default function LessonPage({
  params,
}: {
  params: Promise<{ topic: string }>
}) {
  const { topic } = use(params)
  const router = useRouter()

  const scenario = SCENARIOS.find(s => s.id === topic)
  const [stepIndex, setStepIndex] = useState(0)
  const [finished, setFinished] = useState(false)

  const currentStep = STEPS[stepIndex]

  if (!scenario) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center flex-1 gap-6 px-6">
          <span className="text-6xl">😕</span>
          <p className="text-xl font-bold text-gray-700">Topic not found</p>
          <button
            onClick={() => router.push('/topics')}
            className="bg-primary text-white rounded-2xl py-3 px-8 font-bold text-lg"
          >
            Back to Topics
          </button>
        </div>
      </AppLayout>
    )
  }

  const vocab = VOCABULARY.find(v => v.id === scenario.vocabId)
  const referenceEmoji = vocab?.referenceEmoji ?? scenario.topicIcon

  const advance = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(i => i + 1)
    }
  }

  const handleFinished = () => {
    setFinished(true)
  }

  if (finished) {
    return (
      <AppLayout>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center flex-1 gap-8 px-8 py-12 min-h-screen"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-8xl"
          >
            🎉
          </motion.span>
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900">Well done!</h2>
            <p className="mt-2 text-lg text-gray-500">
              You learned to say:
            </p>
            <p className="mt-3 text-2xl font-bold text-primary bg-primary-light rounded-2xl px-6 py-3">
              {scenario.sentence}
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => { setStepIndex(0); setFinished(false) }}
              className="bg-primary-light text-primary rounded-2xl py-4 px-8 text-xl font-bold w-full border-2 border-primary"
            >
              🔁 Practice Again
            </button>
            <button
              onClick={() => router.push('/topics')}
              className="bg-primary text-white rounded-2xl py-4 px-8 text-xl font-bold w-full"
            >
              Choose Another Topic
            </button>
          </div>
        </motion.div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      {/* Top bar: back button + step label + progress */}
      <div className="flex items-center px-4 pt-4 pb-1 gap-3">
        <button
          onClick={() => router.push('/topics')}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-lg text-gray-600 flex-shrink-0"
          aria-label="Back to topics"
        >
          ←
        </button>

        <div className="flex-1">
          <LessonProgress currentStep={stepIndex} totalSteps={STEPS.length} />
        </div>

        <div className="w-20 text-right">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {scenario.topicIcon} {scenario.topicLabel}
          </span>
        </div>
      </div>

      {/* Step label */}
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

      {/* Step content — slides in from right */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="flex flex-col flex-1"
          >
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
          </motion.div>
        </AnimatePresence>
      </div>
    </AppLayout>
  )
}
