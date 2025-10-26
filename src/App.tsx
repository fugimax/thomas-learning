import { useState, useEffect } from 'react';
import Header from './components/Header';
import StoryCard from './components/StoryCard';
import TableOfContents from './components/TableOfContents';
import QuizCard from './components/QuizCard';
import QuizExplanation from './components/QuizExplanation';
import QuizResults from './components/QuizResults';
import { chapters } from './data/chapters';
import { quizQuestions } from './data/quizQuestions';
import { QuizQuestion } from './types';

const STORAGE_KEY = 'schulz-app-progress';

interface Progress {
  chapterIndex: number;
  cardIndex: number;
}

function App() {
  // Load progress from localStorage on mount
  const [currentChapterIndex, setCurrentChapterIndex] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const progress: Progress = JSON.parse(stored);
        return progress.chapterIndex;
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
    return 0;
  });

  const [currentCardIndex, setCurrentCardIndex] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const progress: Progress = JSON.parse(stored);
        return progress.cardIndex;
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
    return 0;
  });

  const [tocOpen, setTocOpen] = useState(false);

  // Quiz state
  const [quizMode, setQuizMode] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    try {
      const progress: Progress = {
        chapterIndex: currentChapterIndex,
        cardIndex: currentCardIndex
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }, [currentChapterIndex, currentCardIndex]);

  const currentChapter = chapters[currentChapterIndex];
  const currentCard = currentChapter.cards[currentCardIndex];
  const totalCards = currentChapter.cards.length;

  const hasPrevious = currentChapterIndex > 0 || currentCardIndex > 0;
  const isLastCard = currentChapterIndex === chapters.length - 1 && currentCardIndex === totalCards - 1;

  const handleNext = () => {
    if (currentCardIndex < totalCards - 1) {
      // Next card in same chapter
      setCurrentCardIndex(currentCardIndex + 1);
    } else if (currentChapterIndex < chapters.length - 1) {
      // Next chapter
      setCurrentChapterIndex(currentChapterIndex + 1);
      setCurrentCardIndex(0);
    }
  };

  const handleStartOver = () => {
    setCurrentChapterIndex(0);
    setCurrentCardIndex(0);
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      // Previous card in same chapter
      setCurrentCardIndex(currentCardIndex - 1);
    } else if (currentChapterIndex > 0) {
      // Previous chapter (last card)
      setCurrentChapterIndex(currentChapterIndex - 1);
      setCurrentCardIndex(chapters[currentChapterIndex - 1].cards.length - 1);
    }
  };

  const handleSelectChapter = (chapterId: number) => {
    // Find chapter index (chapters have id 1-8, but array is 0-7)
    const chapterIndex = chapters.findIndex(ch => ch.id === chapterId);
    if (chapterIndex !== -1) {
      setCurrentChapterIndex(chapterIndex);
      setCurrentCardIndex(0);
      // Exit quiz mode when selecting a chapter
      setQuizMode(false);
      setQuizComplete(false);
    }
  };

  // Quiz handlers
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleStartQuiz = () => {
    const shuffled = shuffleArray(quizQuestions);
    setShuffledQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizMode(true);
    setQuizComplete(false);
    setShowExplanation(false);
    setTocOpen(false);
  };

  const handleAnswer = (selectedIndex: number) => {
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const isCorrect = selectedIndex === currentQuestion.correctIndex;

    if (isCorrect) {
      setScore(score + 1);
    }

    setLastAnswerCorrect(isCorrect);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);

    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizComplete(true);
    }
  };

  const handleBackToStory = () => {
    setQuizMode(false);
    setQuizComplete(false);
    setCurrentQuestionIndex(0);
    setScore(0);
  };

  return (
    <div className="bg-yellow-100 min-h-screen">
      <Header
        chapterTitle={quizMode ? 'QUIZ' : currentChapter.title}
        onMenuClick={() => setTocOpen(true)}
      />

      <TableOfContents
        chapters={chapters}
        isOpen={tocOpen}
        onClose={() => setTocOpen(false)}
        onSelectChapter={handleSelectChapter}
        onStartQuiz={handleStartQuiz}
      />

      {quizMode ? (
        // Quiz mode
        quizComplete ? (
          <QuizResults
            score={score}
            totalQuestions={shuffledQuestions.length}
            onRetake={handleStartQuiz}
            onBackToStory={handleBackToStory}
          />
        ) : (
          <>
            <QuizCard
              question={shuffledQuestions[currentQuestionIndex]}
              onAnswer={handleAnswer}
              currentQuestionNumber={currentQuestionIndex + 1}
              totalQuestions={shuffledQuestions.length}
            />
            {showExplanation && (
              <QuizExplanation
                isCorrect={lastAnswerCorrect}
                explanation={shuffledQuestions[currentQuestionIndex].explanation}
                onNext={handleNextQuestion}
              />
            )}
          </>
        )
      ) : (
        // Story mode
        <StoryCard
          text={currentCard.text}
          characterImage={currentCard.characterImage}
          characterName={currentCard.characterName}
          onNext={handleNext}
          onPrevious={handlePrevious}
          hasPrevious={hasPrevious}
          isLastCard={isLastCard}
          onStartOver={handleStartOver}
          onTakeQuiz={handleStartQuiz}
        />
      )}
    </div>
  );
}

export default App
