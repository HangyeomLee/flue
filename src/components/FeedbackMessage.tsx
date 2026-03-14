'use client'

import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface FeedbackMessageProps {
  message: string
  type: 'success' | 'encourage'
}

export default function FeedbackMessage({ message, type }: FeedbackMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={clsx(
        'rounded-2xl p-4 flex items-center gap-3 shadow-md',
        type === 'success' ? 'bg-primary-light border border-primary' : 'bg-amber-50 border border-amber-300'
      )}
    >
      <span className="text-3xl">{type === 'success' ? '🌟' : '👏'}</span>
      <p className={clsx(
        'font-semibold text-base',
        type === 'success' ? 'text-primary' : 'text-amber-700'
      )}>
        {message}
      </p>
    </motion.div>
  )
}
