interface Chapter {
  id: number;
  title: string;
}

interface TableOfContentsProps {
  chapters: Chapter[];
  isOpen: boolean;
  onClose: () => void;
  onSelectChapter: (chapterId: number) => void;
  onStartQuiz?: () => void;  // Optional - only if story has a quiz
}

export default function TableOfContents({
  chapters,
  isOpen,
  onClose,
  onSelectChapter,
  onStartQuiz,
}: TableOfContentsProps) {
  return (
    <>
      <div
        className={`toc-overlay fixed inset-0 bg-white z-50 overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? '' : '-translate-x-full'
        }`}
      >
        {/* TOC Header */}
        <div className="bg-yellow-300 border-b-4 border-black p-4 flex items-center gap-4">
          <button onClick={onClose} className="text-2xl font-bold">
            X
          </button>
          <h2 className="text-2xl md:text-3xl">TABLE OF CONTENTS</h2>
        </div>

        {/* TOC List */}
        <div className="divide-y-2 divide-black">
          {chapters.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => {
                onSelectChapter(chapter.id);
                onClose();
              }}
              className="w-full text-left p-6 hover:bg-gray-50 transition-colors"
            >
              <span className="text-xl md:text-2xl">
                {chapter.id} {chapter.title}
              </span>
            </button>
          ))}

          {/* Quiz Button - only show if quiz is available */}
          {onStartQuiz && (
            <button
              onClick={() => {
                onStartQuiz();
                onClose();
              }}
              className="w-full text-left p-6 bg-blue-100 hover:bg-blue-200 transition-colors border-t-2 border-black"
            >
              <span className="text-xl md:text-2xl font-bold">
                ⭐ QUIZ
              </span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
