# Schulz Learning App Implementation Plan

> **For Claude:** Use `${SUPERPOWERS_SKILLS_ROOT}/skills/collaboration/executing-plans/SKILL.md` to implement this plan task-by-task.

**Goal:** Build an interactive, mobile-friendly web app that teaches a 5-year-old about Charles M. Schulz through a story-based journey guided by Peanuts characters.

**Architecture:** React SPA with chapter-based navigation, animated character guides using Framer Motion, localStorage for progress tracking, and a table of contents for chapter jumping. Content is broken into bite-sized cards (3-5 per chapter) appropriate for a 510L reading level.

**Tech Stack:** React 18, TypeScript, Vite, Framer Motion, Tailwind CSS, Cloudflare Pages (deployed via wrangler)

---

## Task 1: Project Setup & Configuration

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `.gitignore`
- Create: `index.html`
- Create: `wrangler.toml`

**Step 1: Initialize Vite React TypeScript project**

Run:
```bash
npm create vite@latest . -- --template react-ts
```

Expected: Vite scaffolds React + TypeScript project in current directory

**Step 2: Install dependencies**

Run:
```bash
npm install framer-motion
npm install -D tailwindcss postcss autoprefixer
npm install -D @cloudflare/workers-types
npx tailwindcss init -p
```

Expected: All packages installed successfully

**Step 3: Configure Tailwind CSS**

Edit `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'peanuts-yellow': '#FDB813',
        'peanuts-orange': '#F26522',
        'peanuts-red': '#ED1C24',
        'peanuts-blue': '#00A9E0',
        'peanuts-brown': '#6D4C3D',
        'charlie-yellow': '#F5E050',
        'charlie-black': '#1a1a1a',
        'snoopy-white': '#FFFFFF',
        'snoopy-black': '#000000',
      },
      fontFamily: {
        'peanuts': ['Peanuts', 'Comic Sans MS', 'cursive'],
        'body': ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}
```

**Step 4: Add Peanuts font to CSS**

Create `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@font-face {
  font-family: 'Peanuts';
  src: url('/assets/peanuts-font.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

body {
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, #FDB813 0%, #F5E050 100%);
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}
```

**Step 5: Configure TypeScript**

Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Step 6: Update Vite config for path aliases**

Edit `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
})
```

**Step 7: Create Cloudflare Pages config**

Create `wrangler.toml`:
```toml
name = "schulz-learning-app"
compatibility_date = "2024-01-01"

[site]
bucket = "./dist"

[[pages]]
name = "schulz-learning-app"
```

**Step 8: Update .gitignore**

Create/update `.gitignore`:
```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Cloudflare
.dev.vars
wrangler.toml.bak
```

**Step 9: Organize existing assets**

Run:
```bash
mkdir -p public/assets/character-images
mkdir -p public/assets/schulz-photos
mv assets/character-images/* public/assets/character-images/
mv assets/schulz-photos/* public/assets/schulz-photos/
mv assets/peanuts-font.woff2 public/assets/
```

Expected: All assets moved to public directory for Vite to serve

**Step 10: Test dev server**

Run:
```bash
npm run dev
```

Expected: Vite dev server starts on http://localhost:5173

**Step 11: Initial commit (if git repo)**

Note: This directory is not currently a git repo. Skip this step or initialize git first:
```bash
git init
git add .
git commit -m "chore: initial project setup with Vite, React, TypeScript, Tailwind"
```

---

## Task 2: Type Definitions & Data Structures

**Files:**
- Create: `src/types/index.ts`
- Create: `src/data/chapters.ts`

**Step 1: Create TypeScript type definitions**

Create `src/types/index.ts`:
```typescript
export interface ChapterCard {
  id: string;
  text: string;
  character?: string; // Character image to show
  photo?: string; // Schulz photo to show
  animation?: 'bounce' | 'slide' | 'fade' | 'wiggle' | 'sparkle';
}

export interface Chapter {
  id: number;
  title: string;
  guideCharacter: string; // Path to character image
  cards: ChapterCard[];
  celebrationType?: 'confetti' | 'parade' | 'sparkle';
}

export interface AppState {
  currentChapter: number;
  visitedChapters: Set<number>;
  tocOpen: boolean;
}

export type CharacterName =
  | 'charlie-brown'
  | 'snoopy'
  | 'snoopy-author'
  | 'lucy'
  | 'linus'
  | 'sally'
  | 'woodstock'
  | 'peanuts-gang';
```

**Step 2: Create chapter data structure**

Create `src/data/chapters.ts`:
```typescript
import { Chapter } from '@/types';

export const chapters: Chapter[] = [
  // Chapter 0: Welcome
  {
    id: 0,
    title: "Meet Good Ol' Sparky",
    guideCharacter: '/assets/character-images/Snoopy.png',
    cards: [
      {
        id: 'welcome-1',
        text: "Hi there! I'm Snoopy, and this is my friend Charlie Brown. We want to tell you about someone very special!",
        character: '/assets/character-images/Snoopy.png',
        animation: 'bounce'
      },
      {
        id: 'welcome-2',
        text: "This is the story of Sparky - the man who created us! Everything you see in Peanuts came from his real life.",
        character: '/assets/character-images/CharlieBrown.png',
        animation: 'slide'
      },
      {
        id: 'welcome-3',
        text: "All the characters, all the stories, all the feelings - they all came from real people and real things that happened to Sparky!",
        character: '/assets/character-images/Snoopy.png',
        animation: 'wiggle'
      },
      {
        id: 'welcome-4',
        text: "Ready to learn about the amazing man who drew us? Let's go!",
        character: '/assets/character-images/CharlieBrown.png',
        animation: 'bounce'
      }
    ]
  },

  // Chapter 1: Baby Sparky Gets His Name
  {
    id: 1,
    title: "Baby Sparky Gets His Name",
    guideCharacter: '/assets/character-images/Sally.png',
    cards: [
      {
        id: 'ch1-1',
        text: "Charles M. Schulz was born on November 26, 1922, in Minneapolis, Minnesota. He was just a tiny baby!",
        character: '/assets/character-images/Sally.png',
        photo: '/assets/schulz-photos/child-schulz.png',
        animation: 'bounce'
      },
      {
        id: 'ch1-2',
        text: "When he was only two days old, his uncle looked at him and said, 'Let's call him Sparky!' The name came from a horse in a comic strip!",
        character: '/assets/character-images/Sally.png',
        animation: 'wiggle'
      },
      {
        id: 'ch1-3',
        text: "Everyone called him Sparky his whole life - even when he became world-famous! Isn't that sweet?",
        character: '/assets/character-images/Sally.png',
        animation: 'bounce'
      },
      {
        id: 'ch1-4',
        text: "Sparky's dad was named Carl, and he was a barber. Every Sunday morning, Carl and little Sparky would sit together and read comic strips from the newspaper. They loved it!",
        character: '/assets/character-images/Sally.png',
        animation: 'slide'
      }
    ]
  },

  // Chapter 2: Spike - The Amazing Dog!
  {
    id: 2,
    title: "Spike - The Amazing Dog!",
    guideCharacter: '/assets/character-images/Snoopy.png',
    cards: [
      {
        id: 'ch2-1',
        text: "When Sparky was a boy, he had the most amazing dog named Spike! Spike was black and white, just like me.",
        character: '/assets/character-images/Snoopy.png',
        photo: '/assets/schulz-photos/young-schulz.png',
        animation: 'bounce'
      },
      {
        id: 'ch2-2',
        text: "Spike was SO smart - he understood 50 different words! He could do the coolest tricks too.",
        character: '/assets/character-images/Snoopy.png',
        animation: 'wiggle'
      },
      {
        id: 'ch2-3',
        text: "Spike would ring the doorbell when he wanted to come inside! He loved car rides so much that honking the horn was the only way to get him to come home!",
        character: '/assets/character-images/Snoopy.png',
        animation: 'bounce'
      },
      {
        id: 'ch2-4',
        text: "When Sparky was just 15 years old, he drew a picture of Spike that was published in a magazine! This was his very first published drawing ever!",
        character: '/assets/character-images/Snoopy.png',
        animation: 'sparkle'
      },
      {
        id: 'ch2-5',
        text: "Years later, Sparky created ME based on Spike! I'm Spike's legacy! Woof!",
        character: '/assets/character-images/Snoopy.png',
        animation: 'bounce'
      }
    ]
  },

  // Chapter 3: Never Give Up!
  {
    id: 3,
    title: "Never Give Up!",
    guideCharacter: '/assets/character-images/CharlieBrown.png',
    cards: [
      {
        id: 'ch3-1',
        text: "When Sparky was in kindergarten, his teacher gave everyone paper and crayons to draw. She looked at Sparky's drawing and said something amazing...",
        character: '/assets/character-images/CharlieBrown.png',
        animation: 'slide'
      },
      {
        id: 'ch3-2',
        text: "She said: 'Someday, Charles, you're going to be an artist!' Sparky never forgot those words!",
        character: '/assets/character-images/CharlieBrown.png',
        animation: 'sparkle'
      },
      {
        id: 'ch3-3',
        text: "But school got harder. Sparky failed some classes. His high school yearbook even rejected his drawings. He felt sad and left out.",
        character: '/assets/character-images/CharlieBrown.png',
        animation: 'fade'
      },
      {
        id: 'ch3-4',
        text: "Even Disney said no when he tried to work there! But Sparky never gave up on his dream of being a cartoonist.",
        character: '/assets/character-images/CharlieBrown.png',
        animation: 'slide'
      },
      {
        id: 'ch3-5',
        text: "Sparky went to the Army when he was 20 and was far from home. He felt lonely. Later, he put all those feelings into me - Charlie Brown!",
        character: '/assets/character-images/CharlieBrown.png',
        animation: 'bounce'
      }
    ]
  },

  // Chapter 4: Creating Peanuts
  {
    id: 4,
    title: "Creating Peanuts",
    guideCharacter: '/assets/character-images/Snoopy-Author.png',
    cards: [
      {
        id: 'ch4-1',
        text: "After the Army, Sparky kept practicing his drawing. He took his best cartoons to a newspaper company in New York. They loved it!",
        character: '/assets/character-images/Snoopy-Author.png',
        photo: '/assets/schulz-photos/schulz-with-characters.png',
        animation: 'bounce'
      },
      {
        id: 'ch4-2',
        text: "On October 2, 1950, the very first Peanuts comic strip appeared in 7 newspapers. Sparky was 27 years old!",
        character: '/assets/character-images/Snoopy-Author.png',
        animation: 'sparkle'
      },
      {
        id: 'ch4-3',
        text: "But here's a funny secret - Sparky HATED the name 'Peanuts'! He wanted to call it 'Good Old Charlie Brown' instead. He complained about the name his whole life!",
        character: '/assets/character-images/Snoopy-Author.png',
        animation: 'wiggle'
      },
      {
        id: 'ch4-4',
        text: "Sparky drew Peanuts for 50 years - from 1950 to 2000. He drew 17,897 comic strips, and every single one by himself!",
        character: '/assets/character-images/Snoopy-Author.png',
        animation: 'bounce'
      },
      {
        id: 'ch4-5',
        text: "By the end, Peanuts appeared in over 2,600 newspapers in 75 countries! About 355 million people read it every day - that's more people than live in the whole United States!",
        character: '/assets/character-images/Snoopy-Author.png',
        animation: 'sparkle'
      }
    ]
  },

  // Chapter 5: The Real Peanuts Gang
  {
    id: 5,
    title: "The Real Peanuts Gang",
    guideCharacter: '/assets/character-images/CharlieBrown.png',
    celebrationType: 'parade',
    cards: [
      {
        id: 'ch5-1',
        text: "Now here's the most special part - almost every character in Peanuts was based on a REAL person from Sparky's life!",
        character: '/assets/character-images/CharlieBrown.png',
        animation: 'bounce'
      },
      {
        id: 'ch5-2',
        text: "I'm Charlie Brown! I was based on Sparky himself. Everything he felt - being shy, feeling lonely, worrying a lot - he put into me!",
        character: '/assets/character-images/CharlieBrown.png',
        animation: 'slide'
      },
      {
        id: 'ch5-3',
        text: "I'm Snoopy! Remember Spike, the amazing dog? That's me! Sparky's mom even suggested the name 'Snoopy'!",
        character: '/assets/character-images/Snoopy.png',
        animation: 'bounce'
      },
      {
        id: 'ch5-4',
        text: "I'm Lucy! I was based on a woman named Louanne who Sparky played card games with. She acted in unusual, memorable ways!",
        character: '/assets/character-images/Lucy.png',
        animation: 'wiggle'
      },
      {
        id: 'ch5-5',
        text: "I'm Linus! I was named after Sparky's friend Linus Maurer, who was also a cartoonist. My security blanket came from watching Sparky's own kids!",
        character: '/assets/character-images/Linus.png',
        animation: 'slide'
      },
      {
        id: 'ch5-6',
        text: "I'm Franklin! I joined the gang in 1968. A teacher wrote Sparky a letter asking for a character who looked like me. Sparky said yes right away!",
        character: '/assets/character-images/Franklin.png',
        animation: 'bounce'
      },
      {
        id: 'ch5-7',
        text: "The Little Red-Haired Girl that Charlie Brown likes? She was based on someone Sparky liked when he was young. Even though it made him sad, he put that real feeling in the comic!",
        character: '/assets/character-images/CharlieBrown.png',
        animation: 'fade'
      }
    ]
  },

  // Chapter 6: Sparky's Amazing Life
  {
    id: 6,
    title: "Sparky's Amazing Life",
    guideCharacter: '/assets/character-images/Snoopy.png',
    cards: [
      {
        id: 'ch6-1',
        text: "Sparky worked SO hard! He drew 7 hours a day, 5 days a week, for 50 years. He only took ONE vacation in all that time!",
        character: '/assets/character-images/Snoopy.png',
        photo: '/assets/schulz-photos/old-schulz.png',
        animation: 'bounce'
      },
      {
        id: 'ch6-2',
        text: "Sparky LOVED ice skating and hockey! When the local ice rink closed, he used his own money to build a new one for everyone in town to use!",
        character: '/assets/character-images/Snoopy-BeagleScouts.png',
        animation: 'slide'
      },
      {
        id: 'ch6-3',
        text: "Guess what? Charlie Brown and I went to the MOON! In 1969, NASA named their space modules 'Charlie Brown' and 'Snoopy'!",
        character: '/assets/character-images/Snoopy.png',
        animation: 'sparkle'
      },
      {
        id: 'ch6-4',
        text: "Sparky won Emmy awards for our TV shows, got a star on the Hollywood Walk of Fame, and became world-famous!",
        character: '/assets/character-images/CharlieBrown.png',
        animation: 'bounce'
      },
      {
        id: 'ch6-5',
        text: "But you know what Sparky was most proud of? His medal from being a soldier in World War II. He kept it on his wall his whole life!",
        character: '/assets/character-images/Snoopy.png',
        animation: 'fade'
      },
      {
        id: 'ch6-6',
        text: "Sparky drew comics until he was 77 years old. His very last comic strip came out on February 13, 2000. He never stopped doing what he loved!",
        character: '/assets/character-images/Snoopy-Author.png',
        animation: 'slide'
      }
    ]
  },

  // Chapter 7: Celebration
  {
    id: 7,
    title: "You're Ready!",
    guideCharacter: '/assets/character-images/peanuts-gang.png',
    celebrationType: 'confetti',
    cards: [
      {
        id: 'celebrate-1',
        text: "Now you know all about Good Ol' Sparky - Charles M. Schulz!",
        character: '/assets/character-images/peanuts-gang.png',
        animation: 'bounce'
      },
      {
        id: 'celebrate-2',
        text: "He turned his real life into art that made millions of people smile. His dog Spike became Snoopy. His feelings became Charlie Brown. His friends became all of us!",
        character: '/assets/character-images/peanuts-gang.png',
        animation: 'sparkle'
      },
      {
        id: 'celebrate-3',
        text: "Just like Charlie Brown, Sparky never gave up - even when things were hard. That's what made him amazing!",
        character: '/assets/character-images/peanuts-gang.png',
        animation: 'bounce'
      },
      {
        id: 'celebrate-4',
        text: "You're ready for Halloween! Good grief, you're going to be great!",
        character: '/assets/character-images/peanuts-gang.png',
        animation: 'sparkle'
      }
    ]
  }
];

export const getChapterById = (id: number): Chapter | undefined => {
  return chapters.find(chapter => chapter.id === id);
};

export const getTotalChapters = (): number => {
  return chapters.length;
};
```

**Step 3: Verify TypeScript compilation**

Run:
```bash
npm run build
```

Expected: TypeScript compiles without errors

---

## Task 3: Core Components - StoryCard

**Files:**
- Create: `src/components/StoryCard.tsx`
- Create: `src/components/SpeechBubble.tsx`

**Step 1: Create SpeechBubble component**

Create `src/components/SpeechBubble.tsx`:
```typescript
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SpeechBubbleProps {
  children: ReactNode;
  direction?: 'left' | 'right';
}

export const SpeechBubble = ({ children, direction = 'left' }: SpeechBubbleProps) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: 0.2
      }}
      className={`
        relative bg-white rounded-3xl px-6 py-4 shadow-lg
        border-4 border-charlie-black max-w-2xl
        ${direction === 'left' ? 'ml-4' : 'mr-4'}
      `}
    >
      <div className="text-lg md:text-xl leading-relaxed font-body text-charlie-black">
        {children}
      </div>

      {/* Speech bubble tail */}
      <div
        className={`
          absolute bottom-0 w-0 h-0
          border-l-[20px] border-l-transparent
          border-r-[20px] border-r-transparent
          border-t-[30px] border-t-white
          ${direction === 'left' ? 'left-8' : 'right-8'}
        `}
        style={{
          transform: 'translateY(100%) rotate(0deg)',
          filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,0.2))'
        }}
      />
      <div
        className={`
          absolute bottom-0 w-0 h-0
          border-l-[24px] border-l-transparent
          border-r-[24px] border-r-transparent
          border-t-[34px] border-t-charlie-black
          ${direction === 'left' ? 'left-7' : 'right-7'}
        `}
        style={{
          transform: 'translateY(100%) rotate(0deg)',
          zIndex: -1
        }}
      />
    </motion.div>
  );
};
```

**Step 2: Create StoryCard component**

Create `src/components/StoryCard.tsx`:
```typescript
import { motion, AnimatePresence } from 'framer-motion';
import { ChapterCard } from '@/types';
import { SpeechBubble } from './SpeechBubble';

interface StoryCardProps {
  card: ChapterCard;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
  cardIndex: number;
  totalCards: number;
}

const animationVariants = {
  bounce: {
    y: [0, -20, 0],
    transition: { duration: 0.6, repeat: 2 }
  },
  slide: {
    x: [-100, 0],
    opacity: [0, 1],
    transition: { duration: 0.5 }
  },
  fade: {
    opacity: [0, 1],
    transition: { duration: 0.8 }
  },
  wiggle: {
    rotate: [-5, 5, -5, 5, 0],
    transition: { duration: 0.8 }
  },
  sparkle: {
    scale: [0.8, 1.1, 1],
    rotate: [0, 5, -5, 0],
    transition: { duration: 0.6 }
  }
};

export const StoryCard = ({
  card,
  onNext,
  onPrevious,
  isFirst,
  isLast,
  cardIndex,
  totalCards
}: StoryCardProps) => {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-4 md:p-8">
      {/* Progress indicator */}
      <div className="w-full max-w-4xl mb-4">
        <div className="flex justify-between items-center text-sm text-charlie-black/70">
          <span>Card {cardIndex + 1} of {totalCards}</span>
          <div className="flex gap-2">
            {Array.from({ length: totalCards }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === cardIndex ? 'bg-peanuts-orange' : 'bg-charlie-black/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl gap-6">
        <AnimatePresence mode="wait">
          {/* Character image */}
          {card.character && (
            <motion.img
              key={`char-${card.id}`}
              src={card.character}
              alt="Character"
              className="w-48 h-48 md:w-64 md:h-64 object-contain"
              variants={animationVariants}
              animate={card.animation || 'fade'}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
            />
          )}

          {/* Photo */}
          {card.photo && (
            <motion.img
              key={`photo-${card.id}`}
              src={card.photo}
              alt="Schulz photo"
              className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-lg border-4 border-charlie-black shadow-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>

        {/* Speech bubble with text */}
        <SpeechBubble>
          {card.text}
        </SpeechBubble>
      </div>

      {/* Navigation buttons */}
      <div className="w-full max-w-4xl flex justify-between items-center mt-8">
        <button
          onClick={onPrevious}
          disabled={isFirst}
          className={`
            px-6 py-3 rounded-full font-peanuts text-xl
            border-4 border-charlie-black shadow-lg
            transition-all transform hover:scale-105
            ${isFirst
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-peanuts-blue text-white hover:bg-peanuts-blue/90'
            }
          `}
        >
          ← Back
        </button>

        <button
          onClick={onNext}
          className="
            px-8 py-3 rounded-full font-peanuts text-xl
            bg-peanuts-orange text-white border-4 border-charlie-black
            shadow-lg transition-all transform hover:scale-105
            hover:bg-peanuts-orange/90
          "
        >
          {isLast ? "Next Chapter →" : "Next →"}
        </button>
      </div>
    </div>
  );
};
```

**Step 3: Test StoryCard component**

Create a temporary test in `src/App.tsx`:
```typescript
import { StoryCard } from '@/components/StoryCard';
import { ChapterCard } from '@/types';

const testCard: ChapterCard = {
  id: 'test-1',
  text: 'This is a test card with Snoopy!',
  character: '/assets/character-images/Snoopy.png',
  animation: 'bounce'
};

function App() {
  return (
    <StoryCard
      card={testCard}
      onNext={() => console.log('Next')}
      onPrevious={() => console.log('Previous')}
      isFirst={true}
      isLast={false}
      cardIndex={0}
      totalCards={4}
    />
  );
}

export default App;
```

Run:
```bash
npm run dev
```

Expected: StoryCard renders with speech bubble, character image animates

---

## Task 4: Core Components - TableOfContents

**Files:**
- Create: `src/components/TableOfContents.tsx`
- Create: `src/components/ChapterIcon.tsx`

**Step 1: Create ChapterIcon component**

Create `src/components/ChapterIcon.tsx`:
```typescript
interface ChapterIconProps {
  chapterNumber: number;
  isVisited: boolean;
  isActive: boolean;
}

export const ChapterIcon = ({ chapterNumber, isVisited, isActive }: ChapterIconProps) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`
          w-10 h-10 rounded-full flex items-center justify-center
          font-peanuts text-lg border-3 border-charlie-black
          ${isActive ? 'bg-peanuts-orange text-white' :
            isVisited ? 'bg-peanuts-yellow text-charlie-black' :
            'bg-white text-charlie-black/50'}
        `}
      >
        {chapterNumber}
      </div>
      {isVisited && !isActive && (
        <span className="text-peanuts-blue text-xl">✓</span>
      )}
    </div>
  );
};
```

**Step 2: Create TableOfContents component**

Create `src/components/TableOfContents.tsx`:
```typescript
import { motion, AnimatePresence } from 'framer-motion';
import { Chapter } from '@/types';
import { ChapterIcon } from './ChapterIcon';

interface TableOfContentsProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
  currentChapter: number;
  visitedChapters: Set<number>;
  onSelectChapter: (chapterId: number) => void;
}

export const TableOfContents = ({
  isOpen,
  onClose,
  chapters,
  currentChapter,
  visitedChapters,
  onSelectChapter
}: TableOfContentsProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-charlie-black/50 z-40"
          />

          {/* TOC Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-charlie-yellow border-l-8 border-charlie-black shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-peanuts text-3xl text-charlie-black">
                  Chapters
                </h2>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-peanuts-red text-white font-bold text-xl hover:bg-peanuts-red/90 transition-colors"
                  aria-label="Close table of contents"
                >
                  ✕
                </button>
              </div>

              {/* Chapter list */}
              <div className="space-y-3">
                {chapters.map((chapter) => (
                  <motion.button
                    key={chapter.id}
                    onClick={() => {
                      onSelectChapter(chapter.id);
                      onClose();
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      w-full p-4 rounded-lg border-4 border-charlie-black
                      flex items-center gap-4 transition-all
                      ${currentChapter === chapter.id
                        ? 'bg-peanuts-orange text-white shadow-lg'
                        : 'bg-white text-charlie-black hover:bg-peanuts-yellow/50'}
                    `}
                  >
                    <ChapterIcon
                      chapterNumber={chapter.id}
                      isVisited={visitedChapters.has(chapter.id)}
                      isActive={currentChapter === chapter.id}
                    />

                    <div className="flex-1 text-left">
                      <div className={`font-peanuts text-lg ${
                        currentChapter === chapter.id ? 'text-white' : 'text-charlie-black'
                      }`}>
                        {chapter.title}
                      </div>
                    </div>

                    {/* Preview character image */}
                    <img
                      src={chapter.guideCharacter}
                      alt={chapter.title}
                      className="w-12 h-12 object-contain"
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
```

**Step 3: Test TableOfContents**

Update `src/App.tsx`:
```typescript
import { useState } from 'react';
import { TableOfContents } from '@/components/TableOfContents';
import { chapters } from '@/data/chapters';

function App() {
  const [tocOpen, setTocOpen] = useState(true);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [visitedChapters] = useState(new Set([0, 1, 2]));

  return (
    <div className="min-h-screen">
      <button
        onClick={() => setTocOpen(true)}
        className="fixed top-4 right-4 z-30 px-4 py-2 bg-peanuts-blue text-white rounded-full font-peanuts"
      >
        Menu
      </button>

      <TableOfContents
        isOpen={tocOpen}
        onClose={() => setTocOpen(false)}
        chapters={chapters}
        currentChapter={currentChapter}
        visitedChapters={visitedChapters}
        onSelectChapter={setCurrentChapter}
      />
    </div>
  );
}

export default App;
```

Run:
```bash
npm run dev
```

Expected: Clicking menu button opens TOC panel with all chapters

---

## Task 5: Core Components - ChapterView

**Files:**
- Create: `src/components/ChapterView.tsx`
- Create: `src/components/ConfettiEffect.tsx`

**Step 1: Create ConfettiEffect component**

Create `src/components/ConfettiEffect.tsx`:
```typescript
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Confetti {
  id: number;
  x: number;
  color: string;
  delay: number;
}

export const ConfettiEffect = () => {
  const [confetti, setConfetti] = useState<Confetti[]>([]);

  useEffect(() => {
    const colors = ['#FDB813', '#F26522', '#ED1C24', '#00A9E0', '#F5E050'];
    const pieces: Confetti[] = [];

    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5
      });
    }

    setConfetti(pieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ y: -20, opacity: 1 }}
          animate={{
            y: window.innerHeight + 20,
            rotate: 360 * 3,
            opacity: 0
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: piece.delay,
            ease: 'easeIn'
          }}
          style={{
            position: 'absolute',
            left: `${piece.x}%`,
            width: '10px',
            height: '10px',
            backgroundColor: piece.color,
            borderRadius: '2px'
          }}
        />
      ))}
    </div>
  );
};
```

**Step 2: Create ChapterView component**

Create `src/components/ChapterView.tsx`:
```typescript
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chapter } from '@/types';
import { StoryCard } from './StoryCard';
import { ConfettiEffect } from './ConfettiEffect';

interface ChapterViewProps {
  chapter: Chapter;
  onChapterComplete: () => void;
  onBack: () => void;
}

export const ChapterView = ({ chapter, onChapterComplete, onBack }: ChapterViewProps) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const currentCard = chapter.cards[currentCardIndex];
  const isFirstCard = currentCardIndex === 0;
  const isLastCard = currentCardIndex === chapter.cards.length - 1;

  useEffect(() => {
    setCurrentCardIndex(0);
    setShowConfetti(false);
  }, [chapter.id]);

  const handleNext = () => {
    if (isLastCard) {
      if (chapter.celebrationType === 'confetti') {
        setShowConfetti(true);
        setTimeout(() => {
          onChapterComplete();
        }, 2000);
      } else {
        onChapterComplete();
      }
    } else {
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (isFirstCard) {
      onBack();
    } else {
      setCurrentCardIndex(prev => prev - 1);
    }
  };

  return (
    <div className="relative">
      {showConfetti && <ConfettiEffect />}

      {/* Chapter Title Bar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 bg-peanuts-red text-white py-4 px-6 z-20 border-b-4 border-charlie-black"
      >
        <h1 className="font-peanuts text-2xl md:text-3xl text-center">
          {chapter.title}
        </h1>
      </motion.div>

      {/* Main content with top padding for fixed header */}
      <div className="pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <StoryCard
              card={currentCard}
              onNext={handleNext}
              onPrevious={handlePrevious}
              isFirst={isFirstCard && chapter.id === 0}
              isLast={isLastCard}
              cardIndex={currentCardIndex}
              totalCards={chapter.cards.length}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
```

**Step 3: Test ChapterView**

Update `src/App.tsx`:
```typescript
import { ChapterView } from '@/components/ChapterView';
import { chapters } from '@/data/chapters';

function App() {
  return (
    <ChapterView
      chapter={chapters[0]}
      onChapterComplete={() => console.log('Chapter complete')}
      onBack={() => console.log('Back')}
    />
  );
}

export default App;
```

Run:
```bash
npm run dev
```

Expected: Full chapter view with title bar, card navigation, animations

---

## Task 6: State Management & App Logic

**Files:**
- Create: `src/hooks/useAppState.ts`
- Create: `src/utils/localStorage.ts`

**Step 1: Create localStorage utilities**

Create `src/utils/localStorage.ts`:
```typescript
const STORAGE_KEY = 'schulz-app-state';

export interface StoredState {
  currentChapter: number;
  visitedChapters: number[];
}

export const loadState = (): StoredState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load state:', error);
    return null;
  }
};

export const saveState = (state: StoredState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state:', error);
  }
};

export const clearState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear state:', error);
  }
};
```

**Step 2: Create useAppState hook**

Create `src/hooks/useAppState.ts`:
```typescript
import { useState, useEffect } from 'react';
import { loadState, saveState, StoredState } from '@/utils/localStorage';

export const useAppState = () => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [visitedChapters, setVisitedChapters] = useState<Set<number>>(new Set([0]));
  const [tocOpen, setTocOpen] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const stored = loadState();
    if (stored) {
      setCurrentChapter(stored.currentChapter);
      setVisitedChapters(new Set(stored.visitedChapters));
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    const state: StoredState = {
      currentChapter,
      visitedChapters: Array.from(visitedChapters)
    };
    saveState(state);
  }, [currentChapter, visitedChapters]);

  const goToChapter = (chapterId: number) => {
    setCurrentChapter(chapterId);
    setVisitedChapters(prev => new Set([...prev, chapterId]));
  };

  const nextChapter = () => {
    const next = currentChapter + 1;
    goToChapter(next);
  };

  const previousChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  const openTOC = () => setTocOpen(true);
  const closeTOC = () => setTocOpen(false);

  return {
    currentChapter,
    visitedChapters,
    tocOpen,
    goToChapter,
    nextChapter,
    previousChapter,
    openTOC,
    closeTOC
  };
};
```

**Step 3: Test state persistence**

Create temporary test in `src/App.tsx`:
```typescript
import { useAppState } from '@/hooks/useAppState';

function App() {
  const { currentChapter, visitedChapters, goToChapter } = useAppState();

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Current Chapter: {currentChapter}</h1>
      <p className="mb-4">Visited: {Array.from(visitedChapters).join(', ')}</p>

      <div className="space-x-2">
        <button
          onClick={() => goToChapter(0)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Chapter 0
        </button>
        <button
          onClick={() => goToChapter(3)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Chapter 3
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-600">
        Refresh the page - state should persist!
      </p>
    </div>
  );
}

export default App;
```

Run:
```bash
npm run dev
```

Expected: Clicking buttons updates chapter, refreshing page preserves state

---

## Task 7: Main App Assembly

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`

**Step 1: Create main App component**

Update `src/App.tsx`:
```typescript
import { ChapterView } from '@/components/ChapterView';
import { TableOfContents } from '@/components/TableOfContents';
import { useAppState } from '@/hooks/useAppState';
import { chapters, getTotalChapters } from '@/data/chapters';

function App() {
  const {
    currentChapter,
    visitedChapters,
    tocOpen,
    goToChapter,
    nextChapter,
    previousChapter,
    openTOC,
    closeTOC
  } = useAppState();

  const currentChapterData = chapters[currentChapter];
  const totalChapters = getTotalChapters();

  if (!currentChapterData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-peanuts text-2xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* TOC Menu Button */}
      <button
        onClick={openTOC}
        className="
          fixed top-4 right-4 z-30
          w-14 h-14 rounded-full
          bg-peanuts-blue text-white
          border-4 border-charlie-black
          shadow-lg font-bold text-2xl
          hover:bg-peanuts-blue/90
          transition-all transform hover:scale-110
        "
        aria-label="Open table of contents"
      >
        ☰
      </button>

      {/* Table of Contents */}
      <TableOfContents
        isOpen={tocOpen}
        onClose={closeTOC}
        chapters={chapters}
        currentChapter={currentChapter}
        visitedChapters={visitedChapters}
        onSelectChapter={goToChapter}
      />

      {/* Main Chapter Content */}
      <ChapterView
        key={currentChapter}
        chapter={currentChapterData}
        onChapterComplete={() => {
          if (currentChapter < totalChapters - 1) {
            nextChapter();
          }
        }}
        onBack={previousChapter}
      />
    </div>
  );
}

export default App;
```

**Step 2: Update main.tsx**

Update `src/main.tsx`:
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**Step 3: Update index.html**

Update `index.html`:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Learn about Charles M. Schulz, the creator of Peanuts" />
    <meta name="theme-color" content="#FDB813" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <title>Meet Sparky - The Story of Charles M. Schulz</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Step 4: Test full app**

Run:
```bash
npm run dev
```

Expected: Full app works with chapter navigation, TOC, state persistence

**Step 5: Test on mobile viewport**

In browser dev tools, switch to mobile viewport (iPhone/iPad)

Expected: App is responsive, touch-friendly buttons, readable text

---

## Task 8: Build & Deploy to Cloudflare Pages

**Files:**
- Create: `.node-version`
- Update: `package.json` (add deploy script)

**Step 1: Add Node version specification**

Create `.node-version`:
```
20
```

**Step 2: Add deploy script to package.json**

Add to `package.json` scripts section:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy": "npm run build && wrangler pages deploy dist"
  }
}
```

**Step 3: Install wrangler CLI**

Run:
```bash
npm install -D wrangler
```

**Step 4: Build production version**

Run:
```bash
npm run build
```

Expected: Production files in `dist/` directory

**Step 5: Test production build locally**

Run:
```bash
npm run preview
```

Expected: Production build runs locally on http://localhost:4173

**Step 6: Deploy to Cloudflare Pages**

Run:
```bash
npm run deploy
```

Expected: Wrangler prompts for Cloudflare login, uploads files, provides URL

**Step 7: Test deployed version**

Open the provided Cloudflare Pages URL in browser and on mobile device

Expected: App works on live URL, all assets load correctly

**Step 8: Set up automatic deployments (optional)**

In Cloudflare Pages dashboard:
1. Connect to Git repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Enable automatic deployments on push

---

## Task 9: Polish & Optimizations

**Files:**
- Create: `src/components/LoadingSpinner.tsx`
- Modify: `src/App.tsx`
- Create: `public/favicon.ico`

**Step 1: Add loading states**

Create `src/components/LoadingSpinner.tsx`:
```typescript
import { motion } from 'framer-motion';

export const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-20 h-20"
      >
        <img
          src="/assets/character-images/Snoopy.png"
          alt="Loading"
          className="w-full h-full object-contain"
        />
      </motion.div>
      <p className="font-peanuts text-2xl text-charlie-black">
        Loading...
      </p>
    </div>
  );
};
```

**Step 2: Add image preloading for smoother transitions**

Create `src/utils/preloadImages.ts`:
```typescript
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadChapterImages = async (chapterCards: any[]) => {
  const imageSources = chapterCards
    .flatMap(card => [card.character, card.photo])
    .filter(Boolean);

  await Promise.all(imageSources.map(src => preloadImage(src)));
};
```

**Step 3: Optimize images**

Run:
```bash
# Install image optimization tool
npm install -D vite-plugin-imagemin
```

Update `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import viteImagemin from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    react(),
    viteImagemin({
      gifsicle: { optimizationLevel: 3 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.8, 0.9], speed: 4 },
      svgo: { plugins: [{ name: 'removeViewBox', active: false }] }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
})
```

**Step 4: Add error boundaries**

Create `src/components/ErrorBoundary.tsx`:
```typescript
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
          <img
            src="/assets/character-images/CharlieBrown.png"
            alt="Charlie Brown"
            className="w-48 h-48 mb-4"
          />
          <h1 className="font-peanuts text-3xl text-charlie-black mb-4">
            Good Grief!
          </h1>
          <p className="font-body text-lg mb-4">
            Something went wrong. Please refresh the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-peanuts-orange text-white rounded-full font-peanuts text-xl border-4 border-charlie-black"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

Update `src/main.tsx`:
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ErrorBoundary } from '@/components/ErrorBoundary'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
```

**Step 5: Add accessibility improvements**

Update `src/components/StoryCard.tsx` to add ARIA labels:
```typescript
// Add to navigation buttons
aria-label="Go to previous card"
aria-label="Go to next card"

// Add role to speech bubble
role="article"
aria-live="polite"
```

**Step 6: Final build and test**

Run:
```bash
npm run build
npm run preview
```

Expected: Optimized production build, images compressed, no console logs

**Step 7: Test accessibility**

Run Lighthouse audit in Chrome DevTools

Expected:
- Performance: >90
- Accessibility: >90
- Best Practices: >90
- SEO: >90

**Step 8: Deploy final version**

Run:
```bash
npm run deploy
```

Expected: Final optimized version deployed to Cloudflare Pages

---

## Task 10: Final Testing & Documentation

**Files:**
- Create: `README.md`
- Create: `TESTING.md`

**Step 1: Create comprehensive README**

Create `README.md`:
```markdown
# Meet Sparky - The Story of Charles M. Schulz

An interactive web app designed to help a 5-year-old learn about Charles M. Schulz, the creator of Peanuts, through a fun story-based journey guided by the Peanuts characters.

## Features

- 📖 8 interactive chapters telling Schulz's life story
- 🎨 Animated Peanuts characters as guides
- 📱 Mobile-friendly, optimized for iPad and phone
- 🎯 Table of contents for easy navigation
- 💾 Progress automatically saved to browser
- 🎭 Age-appropriate content (510L reading level)
- ✨ Smooth animations and transitions

## Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Framer Motion (animations)
- Cloudflare Pages (hosting)

## Development

### Prerequisites
- Node.js 20+
- npm

### Setup
\`\`\`bash
npm install
\`\`\`

### Development Server
\`\`\`bash
npm run dev
\`\`\`

Open http://localhost:5173

### Build for Production
\`\`\`bash
npm run build
\`\`\`

### Preview Production Build
\`\`\`bash
npm run preview
\`\`\`

### Deploy to Cloudflare Pages
\`\`\`bash
npm run deploy
\`\`\`

## Project Structure

\`\`\`
src/
├── components/        # React components
│   ├── ChapterView.tsx
│   ├── StoryCard.tsx
│   ├── TableOfContents.tsx
│   └── ...
├── data/             # Chapter content
│   └── chapters.ts
├── hooks/            # Custom React hooks
│   └── useAppState.ts
├── types/            # TypeScript definitions
│   └── index.ts
├── utils/            # Helper functions
│   └── localStorage.ts
└── App.tsx           # Main app component

public/
└── assets/
    ├── character-images/   # Peanuts character PNGs
    ├── schulz-photos/      # Schulz life photos
    └── peanuts-font.woff2  # Custom font
\`\`\`

## Content Structure

Each chapter contains:
- Title and guide character
- 3-5 story cards with text and images
- Animations and transitions
- Character dialogue in speech bubbles

Content is appropriate for a 5-year-old with advanced reading skills (510L).

## Browser Support

- Safari (iOS 14+)
- Chrome (mobile and desktop)
- Firefox (mobile and desktop)
- Edge

## License

Personal/Educational use only. Peanuts characters © Peanuts Worldwide LLC.
\`\`\`

**Step 2: Create testing checklist**

Create `TESTING.md`:
```markdown
# Testing Checklist

## Before Deployment

### Functionality
- [ ] All 8 chapters load correctly
- [ ] Navigation buttons work (next/previous)
- [ ] Table of Contents opens and closes
- [ ] Can jump to any chapter from TOC
- [ ] Progress saves to localStorage
- [ ] Progress persists after page refresh
- [ ] All character images load
- [ ] All Schulz photos load
- [ ] Peanuts font loads correctly

### Animations
- [ ] Character entrance animations play
- [ ] Speech bubbles pop in smoothly
- [ ] Page transitions are smooth
- [ ] Confetti plays on final chapter
- [ ] No janky or laggy animations

### Mobile/Tablet Testing
- [ ] Test on iPad (Safari)
- [ ] Test on iPhone (Safari)
- [ ] Test on Android tablet (Chrome)
- [ ] Touch targets are large enough
- [ ] Text is readable on small screens
- [ ] Images scale properly
- [ ] Horizontal orientation works

### Content Review
- [ ] All text is age-appropriate
- [ ] No sensitive content (razor blades, etc.)
- [ ] Spelling and grammar correct
- [ ] Facts are accurate
- [ ] Story flow makes sense

### Performance
- [ ] Initial load < 3 seconds
- [ ] Chapter transitions < 500ms
- [ ] Images optimized
- [ ] No console errors
- [ ] Lighthouse score >90

### Accessibility
- [ ] Can navigate with keyboard
- [ ] Screen reader compatible
- [ ] Color contrast passes WCAG AA
- [ ] All images have alt text
- [ ] Focus indicators visible

## User Testing

### With Your Son
- [ ] Can he navigate independently?
- [ ] Does he understand the content?
- [ ] Is the pacing right?
- [ ] Are the animations engaging?
- [ ] Can he use the Table of Contents?
- [ ] Does he enjoy the experience?

### Feedback Questions
- What was your favorite chapter?
- What did you learn about Sparky?
- Was anything confusing?
- Would you want to read it again?
\`\`\`

**Step 3: Test on actual devices**

Test checklist:
1. Open deployed URL on iPad
2. Open deployed URL on iPhone
3. Test all navigation
4. Test TOC
5. Verify animations
6. Check reading level appropriateness

**Step 4: Create quick reference guide**

Add to `README.md`:
```markdown
## Quick Reference for Parent

### Resetting Progress
Open browser console and run:
\`\`\`javascript
localStorage.clear()
location.reload()
\`\`\`

### Jumping to Specific Chapter
Use the menu button (☰) in top-right corner

### Offline Usage
After first visit, app works offline (service worker caches assets)

### Printing/Sharing
Share the Cloudflare Pages URL with teachers or family
\`\`\`

**Step 5: Final deployment verification**

1. Deploy final version
2. Test deployed URL on all devices
3. Share URL with one adult tester for feedback
4. Make any final adjustments
5. Lock version for use

---

## Post-Implementation Notes

### Future Enhancements (Optional)
- Add audio narration for each card
- Add quiz mode to test knowledge
- Add printable certificate of completion
- Add social sharing (with parent permission)
- Add more interactive elements (tap to reveal facts)
- Add "read to me" mode with voiceover

### Maintenance
- Update chapter content if needed
- Add new photos or character images
- Adjust reading level based on child's progress
- Monitor analytics (if added)

### Support
For issues or questions, refer to this implementation plan or create a GitHub issue.

---

**Plan Complete!**

This plan provides step-by-step instructions to build a complete, polished web app for teaching about Charles M. Schulz. Each task is broken into bite-sized steps with exact file paths, complete code, and expected outcomes.
