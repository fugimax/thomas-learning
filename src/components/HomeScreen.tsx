import { Story } from '../types';
import StorySelectionCard from './StorySelectionCard';

interface HomeScreenProps {
  stories: Story[];
  onSelectStory: (storyId: string) => void;
}

export default function HomeScreen({ stories, onSelectStory }: HomeScreenProps) {
  return (
    <div className="min-h-screen bg-yellow-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Thomas's Learning Adventures
          </h1>
          <p className="text-2xl text-gray-700">
            Choose a story to begin learning!
          </p>
        </header>

        {/* Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <StorySelectionCard
              key={story.id}
              story={story}
              onSelect={() => onSelectStory(story.id)}
            />
          ))}
        </div>

        {/* Empty state */}
        {stories.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-600">
              No stories available yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
