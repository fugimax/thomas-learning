import { useState } from 'react';
import Header from './components/Header';
import StoryCard from './components/StoryCard';
import TableOfContents from './components/TableOfContents';
import QuizCard from './components/QuizCard';
import QuizExplanation from './components/QuizExplanation';
import QuizResults from './components/QuizResults';
import HomeScreen from './components/HomeScreen';
import { getAllStories, getStoryById } from './data/stories';
import { QuizQuestion } from './types';

function App() {
  // Story selection state
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);

  // Quiz state
  const [quizMode, setQuizMode] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  // Load all stories and get current story
  const allStories = getAllStories();
  const currentStory = selectedStoryId ? getStoryById(selectedStoryId) : null;

  // Handler for selecting a story from home screen
  const handleSelectStory = (storyId: string) => {
    setSelectedStoryId(storyId);
    setCurrentChapterIndex(0);
    setCurrentCardIndex(0);
    setQuizMode(false);
    setQuizComplete(false);
  };

  // Handler for returning to home screen
  const handleBackToHome = () => {
    setSelectedStoryId(null);
    setCurrentChapterIndex(0);
    setCurrentCardIndex(0);
    setQuizMode(false);
    setQuizComplete(false);
  };

  // Show home screen if no story is selected
  if (!currentStory) {
    return (
      <HomeScreen
        stories={allStories}
        onSelectStory={handleSelectStory}
      />
    );
  }

  const currentChapter = currentStory.chapters[currentChapterIndex];
  const currentCard = currentChapter.cards[currentCardIndex];
  const totalCards = currentChapter.cards.length;

  const hasPrevious = currentChapterIndex > 0 || currentCardIndex > 0;
  const isLastCard = currentChapterIndex === currentStory.chapters.length - 1 && currentCardIndex === totalCards - 1;

  const handleNext = () => {
    if (currentCardIndex < totalCards - 1) {
      // Next card in same chapter
      setCurrentCardIndex(currentCardIndex + 1);
    } else if (currentChapterIndex < currentStory.chapters.length - 1) {
      // Next chapter
      setCurrentChapterIndex(currentChapterIndex + 1);
      setCurrentCardIndex(0);
    }
  };

  const handleStartOver = () => {
    handleBackToHome();
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      // Previous card in same chapter
      setCurrentCardIndex(currentCardIndex - 1);
    } else if (currentChapterIndex > 0) {
      // Previous chapter (last card)
      setCurrentChapterIndex(currentChapterIndex - 1);
      setCurrentCardIndex(currentStory.chapters[currentChapterIndex - 1].cards.length - 1);
    }
  };

  const handleSelectChapter = (chapterId: number) => {
    // Find chapter index
    const chapterIndex = currentStory.chapters.findIndex(ch => ch.id === chapterId);
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
    // Only start quiz if the story has quiz questions
    if (!currentStory.quiz || currentStory.quiz.length === 0) {
      return;
    }

    const shuffled = shuffleArray(currentStory.quiz);
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
        chapters={currentStory.chapters}
        isOpen={tocOpen}
        onClose={() => setTocOpen(false)}
        onSelectChapter={handleSelectChapter}
        onStartQuiz={currentStory.quiz && currentStory.quiz.length > 0 ? handleStartQuiz : undefined}
        onBackToStories={handleBackToHome}
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
          onTakeQuiz={currentStory.quiz && currentStory.quiz.length > 0 ? handleStartQuiz : undefined}
        />
      )}
    </div>
  );
}

export default App
