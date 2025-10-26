interface QuizExplanationProps {
  isCorrect: boolean;
  explanation: string;
  onNext: () => void;
}

export default function QuizExplanation({
  isCorrect,
  explanation,
  onNext
}: QuizExplanationProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
      <div className="bg-white border-4 border-black rounded-3xl p-8 max-w-2xl w-full">
        {/* Result heading */}
        <div className={`text-3xl md:text-4xl font-bold text-center mb-6 ${
          isCorrect ? 'text-green-600' : 'text-red-600'
        }`}>
          {isCorrect ? '✓ Correct!' : '✗ Not quite!'}
        </div>

        {/* Explanation */}
        <div className="text-lg md:text-xl text-center mb-8">
          {explanation}
        </div>

        {/* Next button */}
        <div className="flex justify-center">
          <button
            onClick={onNext}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full text-lg md:text-xl transition-colors"
          >
            Next Question
          </button>
        </div>
      </div>
    </div>
  );
}
