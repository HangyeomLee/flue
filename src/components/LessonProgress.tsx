'use client'

import React from 'react'
import clsx from 'clsx'

interface LessonProgressProps {
  currentStep: number
  totalSteps: number
}

export default function LessonProgress({ currentStep, totalSteps }: LessonProgressProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-3">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={clsx(
            'rounded-full transition-all duration-300',
            i <= currentStep
              ? 'bg-primary w-3 h-3'
              : 'bg-gray-200 w-2.5 h-2.5'
          )}
        />
      ))}
    </div>
  )
}
