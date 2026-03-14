# FLUE — Learn English Through Pictures

**FLUE** is a visual and oral-first English language learning app designed for Rohingya learners. It teaches practical, survival-level English phrases through a multi-sensory, mobile-first experience that combines drawing, listening, speaking, and real-world video role-play — without requiring literacy in any language.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Learning Flow](#learning-flow)
- [Scenarios & Vocabulary](#scenarios--vocabulary)
- [Technical Deep Dive](#technical-deep-dive)
- [Design System](#design-system)

---

## Overview

Rohingya refugees often need to communicate in English in high-stakes real-world situations — clinics, bus stops, schools, workplaces. Traditional text-based language apps are inaccessible to people with low literacy. FLUE takes a different approach:

- **No reading required** to start learning
- Rohingya translations provided in both romanized and Arabic script
- Words are learned through drawing (visual memory), listening (audio), and speaking (speech recognition)
- Real-world scenarios are practiced through video dialogues

---

## Key Features

### 6-Step Learning Progression
Each vocabulary topic takes the learner through a structured sequence:

| Step | Name | What Happens |
|------|------|--------------|
| 1 | **Word** | Introduced to the English word with audio + Rohingya translation |
| 2 | **Draw** | Draws the word on a canvas to create a visual memory anchor |
| 3 | **Phrase** | Word expands into a useful phrase; learner listens and repeats |
| 4 | **Pattern** | Fill-in-the-blank grammar exercise with 3 multiple-choice options |
| 5 | **Sentence** | Full sentence in real-world context; learner speaks it aloud |
| 6 | **Situation** | Video role-play: watch a prompt, speak a response, see the answer |

### Speech Recognition
- Real-time feedback using the browser's Web Speech Recognition API
- Configurable similarity thresholds per step (0.5 → 0.75 as difficulty increases)
- Focus word detection: key words must appear in the user's response
- Interim transcript display while speaking
- Graceful fallback when no input is detected

### Drawing Canvas
- Full-featured HTML5 canvas with color picker, eraser, and brush size slider
- High-DPI rendering (respects `devicePixelRatio`)
- Mock recognition validates that the user attempted to draw

### Video Dialogue (Situation Step)
- Plays a prompt video (a character asks a question)
- User speaks their response while microphone records
- Plays answer video if the response is correct
- Includes a demo skip button for testing

### Navigation
- **Horizontal swipe / arrow keys**: Move between the 6 learning steps
- **Vertical swipe / arrow keys**: Cycle through vocabulary topics
- Reels-style infinite scroll feel on mobile
- Step progress indicators and completion checkmarks

### Onboarding
- First-time popup explaining the swipe-based navigation
- Auto-dismisses; can be re-triggered

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3.4 |
| Animations | Framer Motion 11 |
| Speech Input | Web Speech Recognition API |
| Speech Output | Web Speech Synthesis API |
| Drawing | HTML5 Canvas API |
| Runtime | Node.js (no external AI/ML APIs) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Chromium-based browser (Chrome, Edge) for full Web Speech API support

### Installation

```bash
git clone <repo-url>
cd draw-to-speak
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
draw-to-speak/
├── public/
│   └── videos/                    # Video assets for role-play scenarios
│       ├── doctor-prompt.mov
│       ├── doctor-answer.mov
│       ├── bus-prompt.mov
│       └── bus-answer.mov
├── src/
│   ├── app/
│   │   ├── page.tsx               # Welcome / landing page
│   │   ├── learn/page.tsx         # Main learning interface
│   │   ├── lesson/[topic]/page.tsx # Dynamic lesson routes
│   │   ├── topics/page.tsx        # Topics listing
│   │   ├── layout.tsx             # Root layout with metadata
│   │   └── globals.css            # Global styles
│   ├── components/
│   │   ├── AppLayout.tsx          # Mobile-optimized max-width wrapper
│   │   ├── DrawingCanvas.tsx      # Canvas + toolbar
│   │   ├── WordCard.tsx           # Vocabulary introduction card
│   │   ├── PhraseCard.tsx         # Phrase expansion card
│   │   ├── PatternBuilder.tsx     # Fill-in-the-blank exercise
│   │   ├── SentenceCard.tsx       # Full sentence practice
│   │   ├── VideoDialogue.tsx      # Video role-play component
│   │   ├── SpeakAndCheck.tsx      # Reusable speech recognition widget
│   │   ├── AudioButton.tsx        # Dual-speed audio playback
│   │   ├── MicrophoneButton.tsx   # State-driven mic button
│   │   ├── FlueLogo.tsx           # App branding
│   │   ├── OnboardingPopup.tsx    # First-time user overlay
│   │   └── LessonProgress.tsx     # Progress tracker
│   ├── data/
│   │   ├── scenarios.ts           # 5 learning scenarios with all content
│   │   └── vocabulary.ts          # 12 vocabulary items
│   └── lib/
│       ├── useSpeechRecognition.ts  # Custom speech recognition hook
│       ├── speak.ts                 # Text-to-speech utility
│       ├── mockDrawingRecognition.ts # Drawing validation mock
│       └── mockSpeechFeedback.ts    # Speech feedback mock
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Learning Flow

### Step 1 — Word
The learner sees a reference emoji and the English word. Audio plays automatically. A Rohingya translation is shown in both romanized text and Arabic script. The learner must speak the word and pass a pronunciation similarity check (threshold: 0.5) to advance.

### Step 2 — Draw
The learner draws the word on a canvas. This creates a personal visual memory anchor. A color picker (black/red/blue), eraser, clear button, and brush size slider are available. Mock drawing recognition checks whether strokes exist and passes ~70% of attempts to simulate a realistic challenge.

### Step 3 — Phrase
The word animates into a useful phrase (e.g., `doctor` → `need doctor`). The learner can play the audio at normal speed or half speed (🐢). Rohingya translation is included. Speech recognition validates the phrase with a 0.5 threshold.

### Step 4 — Pattern
A fill-in-the-blank template (e.g., `I need ___`) is presented with 3 multiple-choice answers. Selecting an option plays its audio. The learner then speaks the completed sentence. Threshold: 0.6.

### Step 5 — Sentence
The full sentence is shown with scenario context (e.g., `🏥 Clinic`). The learner speaks the complete sentence. Threshold: 0.75 with focus-word enforcement — the most demanding step before role-play.

### Step 6 — Situation (Video Dialogue)
A two-phase video experience:
1. **Prompt phase**: A video character asks a question (e.g., `"How can I help you?"`)
2. **Speak phase**: The learner speaks their response into the microphone. A real-time transcript is shown. Pressing "Done ✓" submits.
3. **Answer phase**: If the response is correct, the answer video plays. If not, the learner can retry.

---

## Scenarios & Vocabulary

### 5 Learning Scenarios

| Scenario | Key Phrase | Context |
|----------|-----------|---------|
| Doctor | "I need a doctor" | 🏥 Clinic |
| Bus | "Where is the bus stop?" | 🚌 Street |
| School | "My child is sick" | 🏫 School |
| Grocery | "I need food" | 🛒 Market |
| Work | "I work at a store" | 💼 Workplace |

### 12 Vocabulary Items
doctor, bus, school, water, food, child, book, phone, bag, work, teacher, help

---

## Technical Deep Dive

### Speech Recognition (`useSpeechRecognition.ts`)
- Uses `webkitSpeechRecognition` or `SpeechRecognition` (standard)
- Continuous interim results for live transcript display
- Similarity scoring: word-level matching normalized by target length
- Focus word detection: at least one key word must appear in user speech
- Timeout: requires 600ms+ of speech input before accepting
- No-input callback triggered when the user does not speak

### Text-to-Speech (`speak.ts`)
Voice prioritization order:
1. Google US English
2. Microsoft Aria / Jenny / Guy
3. Apple Samantha (macOS)
4. Any en-US regional variant

Speech rates: `0.85x` for English clarity, `1.0x` for Rohingya.

### Drawing Canvas (`DrawingCanvas.tsx`)
- High-DPI canvas: scales by `window.devicePixelRatio`
- Smooth strokes with `lineJoin: round` and `lineCap: round`
- Eraser is 3× the current brush width
- Brush size: 2–20px via range slider

### Gesture & Navigation
Touch swipe detection with:
- Minimum distance: 45px
- Minimum velocity: 250px/s
- Direction lock: horizontal vs. vertical determined by first dominant axis
- Keyboard: left/right arrows for steps, up/down for topics

### Animations (Framer Motion)
- Card transitions: 420px directional slide (left/right for steps, top/bottom for topics)
- Duration: 0.32s with `tween` easing
- Staggered entrance animations for UI elements
- Microphone button pulses red while listening

---

## Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#2E7D5E` | Buttons, active states, progress |
| `primary-light` | `#E8F5EE` | Card backgrounds, highlights |
| `accent` | `#F4A261` | Warnings, slow-speech button |
| `soft` | `#F8F9FA` | Page backgrounds |

### Layout
- Max width: **428px** (mobile-first, single-column)
- Full viewport height
- Portrait orientation optimized
- No horizontal scrolling

### Typography
- System font stack via Tailwind defaults
- Rohingya Arabic script rendered with `font-arabic` class (right-to-left)

---

## Hackathon Context

FLUE was built as a hackathon project targeting English language accessibility for Rohingya refugees. The design decisions prioritize:

1. **Literacy-independence**: Audio-first, visual-first — no reading required to begin
2. **Mobile accessibility**: Works on low-end Android phones in portrait mode
3. **Offline potential**: No external APIs; all logic runs in the browser
4. **Culturally grounded scenarios**: Phrases chosen for real survival needs (medical, transport, food, work)

---

## License

Private — hackathon project.
