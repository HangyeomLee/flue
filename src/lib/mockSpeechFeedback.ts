const POSITIVE = ['Great job! 👏', 'Well done! 🌟', 'Excellent! ✨', 'Perfect! 🎉']

export function mockSpeechFeedback(): string {
  return POSITIVE[Math.floor(Math.random() * POSITIVE.length)]
}
