interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRetake: () => void;
  onBackToStory: () => void;
}

export default function QuizResults({
  score,
  totalQuestions,
  onRetake,
  onBackToStory
}: QuizResultsProps) {
  const percentage = Math.round((score / totalQuestions) * 100);

  // Determine encouragement message based on score
  let message = '';
  if (percentage === 100) {
    message = "Perfect score! You're a true Charles M. Schulz expert!";
  } else if (percentage >= 80) {
    message = "Great job! You really know your Schulz facts!";
  } else if (percentage >= 60) {
    message = "Good work! You've learned a lot about Charles!";
  } else {
    message = "Nice try! Want to go through the story again?";
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6">
      <div className="bg-white border-4 border-black rounded-3xl p-8 max-w-2xl w-full">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Quiz Complete!
        </h2>

        {/* Score */}
        <div className="text-center mb-6">
          <div className="text-6xl md:text-7xl font-bold text-blue-500 mb-4">
            {score}/{totalQuestions}
          </div>
          <div className="text-2xl md:text-3xl mb-4">
            {percentage}% Correct
          </div>
        </div>

        {/* Encouragement message */}
        <div className="text-lg md:text-xl text-center mb-8">
          {message}
        </div>

        {/* Character image */}
        <div className="flex justify-center mb-8">
          <div className="border-4 border-black bg-white">
            <img
              src="/assets/character-images/peanuts-gang.png"
              alt="The Peanuts Gang"
              className="w-64 h-64 object-contain"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={onRetake}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full text-lg md:text-xl transition-colors"
          >
            Retake Quiz
          </button>
          <button
            onClick={onBackToStory}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-full text-lg md:text-xl transition-colors"
          >
            Back to Story
          </button>
        </div>
      </div>
    </main>
  );
}
