'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'

const ICONS = [
  { emoji: '🎨', label: 'See' },
  { emoji: '🔊', label: 'Hear' },
  { emoji: '💬', label: 'Speak' },
]

export default function WelcomePage() {
  const router = useRouter()

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center flex-1 px-8 py-12 min-h-screen gap-10"
      >
        {/* Icon trio */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-end justify-center gap-8"
        >
          {ICONS.map(({ emoji, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-6xl">{emoji}</span>
              <span className="text-sm font-semibold text-gray-500 tracking-wide">{label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Title block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Draw to Speak
          </h1>
          <p className="mt-3 text-base text-gray-400 font-medium">
            Learn English through pictures
          </p>
        </motion.div>

        {/* CTA button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.4, type: 'spring', stiffness: 200 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push('/learn')}
          className="bg-primary text-white rounded-2xl py-5 px-12 text-2xl font-bold shadow-lg w-full max-w-xs"
        >
          Start Learning
        </motion.button>

        {/* Subtle bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-xs text-gray-300 text-center"
        >
          No reading required &bull; Tap and listen
        </motion.p>
      </motion.div>
    </AppLayout>
  )
}
