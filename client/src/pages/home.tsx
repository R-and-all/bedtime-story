import { useState } from 'react';
import { StoryForm } from '@/components/story-form';
import { StoryDisplay } from '@/components/story-display';

export default function Home() {
  const [generatedStory, setGeneratedStory] = useState<any>(null);
  const [showStoryModal, setShowStoryModal] = useState(false);

  const handleStoryGenerated = (result: any) => {
    setGeneratedStory(result.story);
    setShowStoryModal(true);
  };

  return (
    <div className="space-y-8">
      <StoryForm onStoryGenerated={handleStoryGenerated} />
      
      <StoryDisplay
        story={generatedStory}
        open={showStoryModal}
        onOpenChange={setShowStoryModal}
      />
    </div>
  );
}
