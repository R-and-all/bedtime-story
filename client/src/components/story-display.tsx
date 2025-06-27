import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Story } from '@shared/schema';
import { Download } from 'lucide-react';
import { generateStoryPDF } from '@/lib/pdf-generator';
import { useToast } from '@/hooks/use-toast';

interface StoryDisplayProps {
  story: Story | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StoryDisplay({ story, open, onOpenChange }: StoryDisplayProps) {
  const { toast } = useToast();

  const handleDownloadPDF = async () => {
    if (!story) return;
    
    try {
      await generateStoryPDF(story);
      toast({
        title: "PDF Downloaded",
        description: "Your story has been saved as a PDF file.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!story) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-[hsl(215,16%,28%)]">
              {story.title}
            </DialogTitle>
            <Button
              onClick={handleDownloadPDF}
              className="text-[hsl(248,84%,67%)] hover:bg-purple-50"
              variant="outline"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          {/* Story illustration */}
          {story.illustrationUrl && (
            <div className="mb-6">
              <img
                src={story.illustrationUrl}
                alt="Story illustration"
                className="w-full h-64 object-cover rounded-xl"
                onError={(e) => {
                  // Hide image if it fails to load
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          
          {/* Story content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-[hsl(215,16%,28%)] leading-relaxed space-y-4">
              {story.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            
            {story.moralTheme && (
              <div className="mt-8 p-4 bg-purple-50 rounded-xl border border-purple-200">
                <h4 className="font-semibold text-[hsl(215,16%,28%)] mb-2">Tonight's Lesson</h4>
                <p className="text-sm text-purple-700">{story.moralTheme}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
