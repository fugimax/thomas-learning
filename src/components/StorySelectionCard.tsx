import { Story } from '../types';

interface StorySelectionCardProps {
  story: Story;
  onSelect: () => void;
}

export default function StorySelectionCard({ story, onSelect }: StorySelectionCardProps) {
  return (
    <button
      onClick={onSelect}
      className="bg-white rounded-lg border-4 border-black shadow-lg p-6 hover:scale-105 transition-transform transform active:scale-95 text-left w-full"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Thumbnail */}
        <div className="w-full aspect-square rounded-lg overflow-hidden border-2 border-black">
          <img
            src={story.thumbnail}
            alt={story.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900">
          {story.title}
        </h2>

        {/* Description */}
        <p className="text-lg text-gray-700 text-center">
          {story.description}
        </p>

        {/* Start Button */}
        <div className="mt-2 bg-blue-500 text-white px-6 py-3 rounded-full font-bold text-xl border-4 border-black shadow-md">
          Start Learning!
        </div>
      </div>
    </button>
  );
}
