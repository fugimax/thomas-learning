import yaml from 'js-yaml';
import { Story } from '../../types';

// Auto-discover all .yaml files in this directory (except TEMPLATE.yaml)
// This uses Vite's import.meta.glob feature for automatic file discovery
const storyFiles = import.meta.glob('./*.yaml', { query: '?raw', import: 'default', eager: true });

// Parse and load all stories
export const loadStories = (): Story[] => {
  const stories: Story[] = [];

  for (const [path, content] of Object.entries(storyFiles)) {
    // Skip the template file
    if (path.includes('TEMPLATE.yaml')) {
      continue;
    }

    try {
      const parsed = yaml.load(content as string) as Story;
      stories.push(parsed);
    } catch (error) {
      console.error(`Failed to parse story from ${path}:`, error);
    }
  }

  // Sort stories by ID for consistent ordering
  return stories.sort((a, b) => a.id.localeCompare(b.id));
};

// Get a specific story by ID
export const getStoryById = (id: string): Story | undefined => {
  const stories = loadStories();
  return stories.find(story => story.id === id);
};

// Get all available stories
export const getAllStories = (): Story[] => {
  return loadStories();
};
