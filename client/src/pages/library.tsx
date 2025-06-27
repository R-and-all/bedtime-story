import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useStories, useDeleteStory } from '@/hooks/use-stories';
import { StoryDisplay } from '@/components/story-display';
import { Story } from '@shared/schema';
import { formatDistanceToNow } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { generateStoryPDF } from '@/lib/pdf-generator';
import { Trash2, Download, BookOpen, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getCurriculumStageClass } from '@/lib/curriculum-data';

export default function Library() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [showStoryModal, setShowStoryModal] = useState(false);
  
  const { data: stories, isLoading } = useStories();
  const deleteStory = useDeleteStory();
  const { toast } = useToast();

  const handleReadStory = (story: Story) => {
    setSelectedStory(story);
    setShowStoryModal(true);
  };

  const handleDownloadPDF = async (story: Story) => {
    try {
      await generateStoryPDF(story);
      toast({
        title: "PDF Downloaded",
        description: `"${story.title}" has been saved as a PDF file.`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStory = async (story: Story) => {
    if (confirm(`Are you sure you want to delete "${story.title}"?`)) {
      try {
        await deleteStory.mutateAsync(story.id);
        toast({
          title: "Story Deleted",
          description: `"${story.title}" has been removed from your library.`,
        });
      } catch (error) {
        toast({
          title: "Delete Failed",
          description: "Unable to delete story. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const getIllustrationEmoji = (index: number) => {
    const emojis = ['🌙', '🦋', '🦊', '🌟', '🐻', '🦉', '🏰', '🌈', '🐰', '🦄'];
    return emojis[index % emojis.length];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[hsl(248,84%,67%)]" />
      </div>
    );
  }

  const savedStories = stories || [];
  const maxStories = 10;
  const emptySlots = Math.max(0, maxStories - savedStories.length);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[hsl(215,16%,28%)]">Your Story Library</h2>
          <p className="text-gray-600">Saved stories ready for bedtime reading</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">
            <span className="font-medium text-[hsl(248,84%,67%)]">{savedStories.length}</span> of {maxStories} stories saved
          </span>
          <div className="w-24 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[hsl(248,84%,67%)] h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(savedStories.length / maxStories) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Story Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedStories.map((story, index) => (
          <Card key={story.id} className="story-card">
            {/* Story thumbnail */}
            <div className="h-48 bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-6xl relative overflow-hidden">
              {story.illustrationUrl ? (
                <img
                  src={story.illustrationUrl}
                  alt={story.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to emoji if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling!.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="absolute inset-0 flex items-center justify-center text-6xl" style={{ display: story.illustrationUrl ? 'none' : 'flex' }}>
                {getIllustrationEmoji(index)}
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-[hsl(215,16%,28%)] line-clamp-1">{story.title}</h3>
              </div>
              
              <div className="flex items-center space-x-4 mb-3 text-xs text-gray-500">
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-[hsl(45,96%,50%)] rounded-full mr-1"></span>
                  Age {story.age}
                </span>
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-[hsl(248,84%,67%)] rounded-full mr-1"></span>
                  {story.storyLength} min
                </span>
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {story.content.split('\n\n')[0].slice(0, 100)}...
              </p>
              
              <div className="flex items-center justify-between mb-2">
                <span className={`curriculum-badge ${getCurriculumStageClass(story.curriculumStage)}`}>
                  {story.moralTheme || story.curriculumStage}
                </span>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleReadStory(story)}
                    className="bg-[hsl(248,84%,67%)] hover:bg-[hsl(248,84%,60%)] text-white"
                  >
                    <BookOpen className="w-3 h-3 mr-1" />
                    Read
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadPDF(story)}
                    className="text-gray-700 hover:bg-gray-100"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteStory(story)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center text-xs text-gray-400">
                <span>
                  Created: {story.createdAt ? formatDistanceToNow(new Date(story.createdAt), { 
                    addSuffix: true, 
                    locale: enGB 
                  }) : 'Recently'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Empty Slots */}
        {Array.from({ length: emptySlots }, (_, index) => (
          <div
            key={`empty-${index}`}
            className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center h-80 text-gray-400"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">📖</div>
              <p className="text-sm">Empty Story Slot</p>
              <p className="text-xs">Create a new story</p>
            </div>
          </div>
        ))}
      </div>

      {/* Library Actions */}
      {savedStories.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[hsl(215,16%,28%)]">Manage Your Stories</h3>
              <p className="text-sm text-gray-600">Download, share, or organise your bedtime collection</p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={async () => {
                  // Download all stories as separate PDFs
                  for (const story of savedStories) {
                    await handleDownloadPDF(story);
                  }
                }}
                className="text-[hsl(248,84%,67%)] hover:bg-purple-50"
              >
                Export All to PDF
              </Button>
            </div>
          </div>
        </div>
      )}

      <StoryDisplay
        story={selectedStory}
        open={showStoryModal}
        onOpenChange={setShowStoryModal}
      />
    </div>
  );
}
