# Adding New Stories to Thomas's Learning App

This guide explains how to add new stories to the app. Stories are automatically discovered from YAML files, making it easy to add new content!

## Quick Start

To add a new story:

1. Create a new YAML file in `src/data/stories/`
2. Add your story assets to `public/assets/{story-id}/`
3. Restart the dev server
4. Your story will automatically appear on the home screen!

## Step-by-Step Guide

### Step 1: Create the Story YAML File

Copy the template file as a starting point:

```bash
cp src/data/stories/TEMPLATE.yaml src/data/stories/my-story.yaml
```

### Step 2: Define Your Story

Edit your YAML file with the following structure:

```yaml
# Story metadata
id: my-story-id
title: "My Story Title"
description: "A short description shown on the home screen"
thumbnail: "/assets/my-story-id/thumbnail.png"

# Story chapters
chapters:
  - id: 1
    title: "CHAPTER ONE"
    cards:
      - id: "card-1"
        text: "Your story text here..."
        characterImage: "/assets/my-story-id/character1.png"
        characterName: "Character Name"

      - id: "card-2"
        text: "More story content..."
        characterImage: "/assets/my-story-id/character2.png"
        characterName: "Another Character"

  - id: 2
    title: "CHAPTER TWO"
    cards:
      - id: "card-3"
        text: "Chapter 2 content..."
        characterImage: "/assets/my-story-id/character1.png"
        characterName: "Character Name"

# Optional: Quiz questions
quiz:
  - id: "q1"
    question: "What is the question?"
    options:
      - "Option A"
      - "Option B"
      - "Option C"
      - "Option D"
    correctIndex: 0  # 0 = first option, 1 = second, etc.
    explanation: "Explanation of the correct answer"
    characterImage: "/assets/my-story-id/quiz-character.png"
    characterName: "Quiz Character"
```

### Step 3: Add Story Assets

Create a directory for your story assets:

```bash
mkdir -p public/assets/my-story-id
```

Add your images:
- `thumbnail.png` - Shown on the home screen (recommended: 400x400px)
- Character images - Shown with each story card
- Quiz images (optional) - Shown with quiz questions

### Step 4: Test Your Story

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:5173

3. Your story should appear on the home screen!

## YAML Structure Reference

### Required Fields

- `id` (string): Unique identifier (lowercase, no spaces)
- `title` (string): Story title shown on home screen and in the app
- `description` (string): Brief description for the home screen
- `thumbnail` (string): Path to thumbnail image
- `chapters` (array): List of chapters (see below)

### Chapter Structure

Each chapter contains:
- `id` (number): Chapter number (1, 2, 3, etc.)
- `title` (string): Chapter title shown at the top
- `cards` (array): List of story cards

### Card Structure

Each card contains:
- `id` (string): Unique card identifier
- `text` (string): Story text displayed in speech bubble
- `characterImage` (string): Path to character/photo image
- `characterName` (string): Name of character (for accessibility)

### Quiz Structure (Optional)

Remove the entire `quiz` section if you don't want a quiz.

Each quiz question contains:
- `id` (string): Unique question identifier
- `question` (string): The question text
- `options` (array of strings): 4 answer options
- `correctIndex` (number): Index of correct answer (0-3)
- `explanation` (string): Explanation shown after answering
- `characterImage` (string): Character image for this question
- `characterName` (string): Character name

## Tips for Writing Stories

### Writing for Thomas (Age 5-6)

- **Keep sentences short**: 10-15 words max
- **Use simple words**: Avoid complex vocabulary
- **Make it conversational**: Write like you're talking to him
- **Break it up**: Use multiple cards instead of long paragraphs
- **Add excitement**: Use exclamation points and engaging language!

### Story Structure

- **3-5 cards per chapter** works well
- **5-8 chapters total** for a complete story
- **Start with "hook"**: Grab attention in the first card
- **End with celebration**: Make the last card rewarding

### Images

- **Use clear, simple images**: Not too busy or cluttered
- **Consistent style**: Keep visual style similar throughout
- **Appropriate size**: 400x400px or larger recommended
- **Formats**: PNG with transparency works best

### Quizzes (Optional)

- **10-20 questions** is a good range
- **Mix difficulty**: Start easy, get harder
- **Clear explanations**: Help Thomas learn from mistakes
- **Positive tone**: Encourage learning, not punishment

## Examples

### Example 1: Simple Story (No Quiz)

```yaml
id: dinosaurs
title: "Dinosaur Adventure"
description: "Learn about amazing dinosaurs!"
thumbnail: "/assets/dinosaurs/thumbnail.png"

chapters:
  - id: 1
    title: "MEET THE DINOSAURS"
    cards:
      - id: "intro-1"
        text: "Millions of years ago, giant creatures called dinosaurs lived on Earth!"
        characterImage: "/assets/dinosaurs/trex.png"
        characterName: "T-Rex"
```

### Example 2: Story with Quiz

```yaml
id: space
title: "Journey to Space"
description: "Explore the solar system!"
thumbnail: "/assets/space/thumbnail.png"

chapters:
  - id: 1
    title: "THE SOLAR SYSTEM"
    cards:
      - id: "planets-1"
        text: "Our solar system has 8 planets that orbit around the Sun!"
        characterImage: "/assets/space/planets.png"
        characterName: "The Planets"

quiz:
  - id: "q1"
    question: "How many planets are in our solar system?"
    options:
      - "6 planets"
      - "8 planets"
      - "10 planets"
      - "12 planets"
    correctIndex: 1
    explanation: "There are 8 planets in our solar system!"
    characterImage: "/assets/space/astronaut.png"
    characterName: "Astronaut"
```

## Troubleshooting

### Story Not Appearing

1. Check that your YAML file is in `src/data/stories/`
2. Check that your file name ends with `.yaml`
3. Check that your file is NOT named `TEMPLATE.yaml`
4. Restart the dev server: `npm run dev`
5. Check browser console for errors

### Images Not Loading

1. Verify images are in `public/assets/{story-id}/`
2. Check that paths in YAML match actual file names
3. Check file extensions match (`.png`, `.jpg`, etc.)
4. Try hard refresh in browser (Cmd+Shift+R or Ctrl+Shift+R)

### YAML Parse Errors

- Check indentation (use 2 spaces, not tabs)
- Check that all strings are quoted if they contain special characters
- Verify all required fields are present
- Use a YAML validator online if needed

## Need Help?

- Look at `src/data/stories/schulz.yaml` for a complete example
- Check `src/data/stories/TEMPLATE.yaml` for field explanations
- Test in small increments (add one chapter at a time)

Happy storytelling! 📚✨
