'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'

const TOPICS = [
  { id: 'doctor',  label: 'Doctor',  icon: '🏥' },
  { id: 'bus',     label: 'Bus',     icon: '🚌' },
  { id: 'school',  label: 'School',  icon: '🏫' },
  { id: 'grocery', label: 'Grocery', icon: '🛒' },
  { id: 'work',    label: 'Work',    icon: '💼' },
]

export default function TopicsPage() {
  const router = useRouter()

  return (
    <AppLayout>
      <div className="flex flex-col flex-1 px-5 pt-8 pb-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-1">
            Where are you going today?
          </p>
          <h1 className="text-3xl font-extrabold text-gray-900">Choose a topic</h1>
        </motion.div>

        {/* Grid — 2 columns, last card centred if odd */}
        <div className="grid grid-cols-2 gap-4 flex-1">
          {TOPICS.map(({ id, label, icon }, i) => {
            const isLastOdd = TOPICS.length % 2 !== 0 && i === TOPICS.length - 1
            return (
              <motion.button
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.35 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => router.push(`/lesson/${id}`)}
                className={`rounded-3xl shadow-md bg-white flex flex-col items-center justify-center p-6 gap-3 border border-gray-100 active:shadow-lg transition-shadow${
                  isLastOdd ? ' col-span-2 max-w-[calc(50%-0.5rem)] mx-auto w-full' : ''
                }`}
              >
                <span className="text-6xl">{icon}</span>
                <span className="text-xl font-bold text-gray-800">{label}</span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
