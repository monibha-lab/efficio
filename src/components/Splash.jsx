import { useState, useEffect } from 'react'

const QUOTES = [
  "Small steps every day lead to giant leaps over time.",
  "The secret of getting ahead is getting started.",
  "Focus on progress, not perfection.",
  "Every task completed is a victory worth celebrating.",
  "Discipline is choosing between what you want now and what you want most.",
  "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
  "Done is better than perfect.",
  "Your future self is watching. Make them proud.",
  "One day or day one — you decide.",
  "Consistency is the mother of mastery.",
  "Great things never come from comfort zones.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Push yourself, because no one else is going to do it for you.",
  "Dream it. Wish it. Do it.",
  "Success is the sum of small efforts repeated day in and day out.",
  "It always seems impossible until it's done.",
  "Don't watch the clock; do what it does. Keep going.",
  "The way to get started is to quit talking and begin doing.",
  "You don't have to be great to start, but you have to start to be great.",
  "Believe you can and you're halfway there.",
]

export default function Splash({ onDone }) {
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)])
  const [phase, setPhase] = useState('reveal') // reveal | show | fade
  const letters = 'EFFICIO'.split('')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('show'), 1400)
    const t2 = setTimeout(() => setPhase('fade'), 3400)
    const t3 = setTimeout(onDone, 3900)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream-100
                  transition-opacity duration-500 ${phase === 'fade' ? 'opacity-0' : 'opacity-100'}`}
      onClick={onDone}
    >
      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-sage-100 rounded-full opacity-40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-lavender-100 rounded-full opacity-40 blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="relative z-10 flex gap-1 mb-8">
        {letters.map((letter, i) => (
          <span
            key={i}
            className="font-heading font-800 text-5xl md:text-7xl text-sage-800"
            style={{
              opacity: 0,
              animation: `fadeUp 0.4s ease-out ${0.1 + i * 0.1}s forwards`,
              display: 'inline-block',
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Pixel-art underline */}
      <div
        className="w-32 h-1 mb-8 bg-sage-400 rounded-full"
        style={{
          opacity: 0,
          animation: 'fadeUp 0.4s ease-out 0.9s forwards',
        }}
      />

      {/* Tagline */}
      <p
        className="text-xs font-heading font-semibold tracking-widest text-sage-600 uppercase mb-10"
        style={{ opacity: 0, animation: 'fadeUp 0.4s ease-out 1.0s forwards' }}
      >
        Your productivity, gamified
      </p>

      {/* Quote */}
      <p
        className="max-w-sm text-center text-gray-500 text-sm leading-relaxed px-8"
        style={{ opacity: 0, animation: 'fadeUp 0.5s ease-out 1.3s forwards' }}
      >
        "{quote}"
      </p>

      {/* Skip hint */}
      <p
        className="absolute bottom-8 text-xs text-gray-300"
        style={{ opacity: 0, animation: 'fadeUp 0.3s ease-out 2s forwards' }}
      >
        tap to skip
      </p>
    </div>
  )
}
