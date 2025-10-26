import SpeechBubble from './SpeechBubble';

interface StoryCardProps {
  text: string;
  characterImage: string;
  characterName: string;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  isLastCard: boolean;
  onStartOver: () => void;
  onTakeQuiz?: () => void;  // Optional - only if story has a quiz
}

export default function StoryCard({
  text,
  characterImage,
  characterName,
  onPrevious,
  onNext,
  hasPrevious,
  isLastCard,
  onStartOver,
  onTakeQuiz,
}: StoryCardProps) {
  return (
    <main className="relative min-h-[calc(100vh-80px)]">
      {/* Content area with padding for buttons */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6 pb-24 gap-2">
        {/* Speech Bubble */}
        <SpeechBubble text={text} />

        {/* Character Image Box */}
        <div className="bg-white border-4 border-black">
          <img
            src={characterImage}
            alt={characterName}
            className="w-64 h-64 md:w-80 md:h-80 object-contain"
          />
        </div>
      </div>

      {/* Navigation Buttons - fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 flex gap-4 justify-center p-4 bg-yellow-100">
        {isLastCard ? (
          // Last card - show "Start Over" and optionally "Take Quiz" buttons
          <>
            <button
              onClick={onStartOver}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full text-lg md:text-xl transition-colors"
            >
              Start Over
            </button>
            {onTakeQuiz && (
              <button
                onClick={onTakeQuiz}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg md:text-xl transition-colors"
              >
                Take Quiz
              </button>
            )}
          </>
        ) : (
          // Normal navigation - show "Previous" and "Next" buttons
          <>
            {hasPrevious && (
              <button
                onClick={onPrevious}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full text-lg md:text-xl transition-colors"
              >
                Previous
              </button>
            )}
            <button
              onClick={onNext}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full text-lg md:text-xl transition-colors"
            >
              Next
            </button>
          </>
        )}
      </div>
    </main>
  );
}
