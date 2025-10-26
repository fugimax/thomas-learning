import { QuizQuestion } from '../types';

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (selectedIndex: number) => void;
  currentQuestionNumber: number;
  totalQuestions: number;
}

export default function QuizCard({
  question,
  onAnswer,
  currentQuestionNumber,
  totalQuestions
}: QuizCardProps) {
  const letters = ['A', 'B', 'C', 'D'];

  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6 gap-4">
      {/* Question count */}
      <div className="text-xl md:text-2xl font-bold">
        Question {currentQuestionNumber} of {totalQuestions}
      </div>

      {/* Thought bubble and Woodstock container */}
      <div className="relative w-full max-w-2xl flex items-start gap-4">
        {/* Thought Bubble */}
        <div className="flex-1 relative bg-white border-4 border-black rounded-full px-8 py-8 text-center thought-bubble">
          <p className="text-lg md:text-xl font-bold">{question.question}</p>
        </div>

        {/* Character Image - positioned to the right */}
        <div className="flex-shrink-0 mt-12">
          <img
            src={question.characterImage}
            alt={question.characterName}
            className="w-24 h-24 object-contain"
          />
        </div>
      </div>

      {/* Answer Options */}
      <div className="w-full max-w-2xl space-y-4 mt-2">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(index)}
            className="w-full bg-white border-4 border-black p-4 text-left text-lg md:text-xl hover:bg-gray-100 transition-colors"
          >
            <span className="font-bold">{letters[index]}.</span> {option}
          </button>
        ))}
      </div>
    </main>
  );
}
