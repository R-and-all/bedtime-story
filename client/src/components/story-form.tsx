import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CharacterInput } from './character-input';
import { AgeSlider } from './age-slider';
import { useGenerateStory } from '@/hooks/use-stories';
import { StoryGenerationRequest } from '@shared/schema';
import { Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StoryFormProps {
  onStoryGenerated: (story: any) => void;
}

export function StoryForm({ onStoryGenerated }: StoryFormProps) {
  const [characters, setCharacters] = useState(['', '', '']);
  const [setting, setSetting] = useState('');
  const [age, setAge] = useState(5);
  const [storyLength, setStoryLength] = useState(5);
  const [moralTheme, setMoralTheme] = useState('');
  
  const generateStory = useGenerateStory();
  const { toast } = useToast();

  const handleSubmit = async () => {
    const validCharacters = characters.filter(c => c.trim());
    
    if (validCharacters.length < 3) {
      toast({
        title: "More characters needed",
        description: "Please add at least 3 characters for your story.",
        variant: "destructive",
      });
      return;
    }

    if (!setting.trim()) {
      toast({
        title: "Setting required", 
        description: "Please describe where your story takes place.",
        variant: "destructive",
      });
      return;
    }

    const request: StoryGenerationRequest = {
      characters: validCharacters,
      setting: setting.trim(),
      age,
      storyLength: storyLength === 5 ? "5min" : "10min",
      moralTheme: moralTheme === 'auto' ? undefined : moralTheme || undefined,
    };

    try {
      const result = await generateStory.mutateAsync(request);
      onStoryGenerated(result);
      toast({
        title: "Story created!",
        description: "Your bedtime story has been generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Story generation failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const popularSettings = [
    "Enchanted Forest",
    "Under the Sea", 
    "Space Adventure",
    "Fairy Tale Castle"
  ];

  return (
    <div className="space-y-8">
      {/* Quick Start Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-[hsl(45,96%,50%)] rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xl">✨</span>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-[hsl(215,16%,28%)] mb-2">Let's Create Your Story!</h2>
            <p className="text-gray-600 text-sm mb-4">Tell me about your characters and setting, choose your child's age, and I'll craft a perfect bedtime story with a lovely moral lesson.</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-purple-700 border border-purple-200">UK Curriculum Aligned</span>
              <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-purple-700 border border-purple-200">Classic Fables</span>
              <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-purple-700 border border-purple-200">Age Appropriate</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column: Story Setup */}
        <div className="space-y-6">
          <CharacterInput characters={characters} onChange={setCharacters} />

          {/* Setting Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-[hsl(215,16%,28%)] mb-4 flex items-center">
              <span className="w-8 h-8 bg-[hsl(249,84%,70%)] rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm">🏞️</span>
              </span>
              Setting & Scene
            </h3>
            
            <Textarea
              value={setting}
              onChange={(e) => setSetting(e.target.value)}
              placeholder="Describe where your story takes place... e.g., A magical forest with talking trees, An enchanted castle by the sea, A cosy village where animals can speak"
              className="story-input h-24 resize-none"
            />
            
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-500 mb-2">Popular Settings:</p>
              <div className="flex flex-wrap gap-2">
                {popularSettings.map((settingOption) => (
                  <Button
                    key={settingOption}
                    variant="secondary"
                    size="sm"
                    onClick={() => setSetting(settingOption)}
                    className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100"
                  >
                    {settingOption}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Story Options */}
        <div className="space-y-6">
          {/* Age & Complexity */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-[hsl(215,16%,28%)] mb-4 flex items-center">
              <span className="w-8 h-8 bg-[hsl(45,96%,50%)] rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm">🎯</span>
              </span>
              Child's Age & Language Level
            </h3>
            
            <AgeSlider value={age} onChange={setAge} />
          </div>

          {/* Story Length */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-[hsl(215,16%,28%)] mb-4 flex items-center">
              <span className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm">⏱️</span>
              </span>
              Story Length
            </h3>
            
            <RadioGroup value={storyLength.toString()} onValueChange={(value) => setStoryLength(parseInt(value))}>
              <div className="space-y-3">
                <Label className="flex items-center p-3 rounded-xl border-2 border-gray-200 hover:border-[hsl(248,84%,67%)] transition-colors cursor-pointer">
                  <RadioGroupItem value="5" className="text-[hsl(248,84%,67%)] mr-3" />
                  <div className="flex-1">
                    <p className="font-medium text-[hsl(215,16%,28%)]">5-Minute Story</p>
                    <p className="text-sm text-gray-500">Perfect for a quick settle-down</p>
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">~400 words</span>
                </Label>
                
                <Label className="flex items-center p-3 rounded-xl border-2 border-gray-200 hover:border-[hsl(248,84%,67%)] transition-colors cursor-pointer">
                  <RadioGroupItem value="10" className="text-[hsl(248,84%,67%)] mr-3" />
                  <div className="flex-1">
                    <p className="font-medium text-[hsl(215,16%,28%)]">10-Minute Story</p>
                    <p className="text-sm text-gray-500">Longer adventure for story time</p>
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">~800 words</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Moral Theme */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-[hsl(215,16%,28%)] mb-4 flex items-center">
              <span className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm">💖</span>
              </span>
              Moral Theme (Optional)
            </h3>
            
            <Select value={moralTheme} onValueChange={setMoralTheme}>
              <SelectTrigger className="story-input">
                <SelectValue placeholder="Let AI choose the best moral" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Let AI choose the best moral</SelectItem>
                <SelectItem value="kindness">Kindness & Compassion</SelectItem>
                <SelectItem value="honesty">Honesty & Truth</SelectItem>
                <SelectItem value="courage">Courage & Bravery</SelectItem>
                <SelectItem value="friendship">Friendship & Loyalty</SelectItem>
                <SelectItem value="perseverance">Perseverance & Hard Work</SelectItem>
                <SelectItem value="sharing">Sharing & Generosity</SelectItem>
                <SelectItem value="respect">Respect & Understanding</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <Button
          onClick={handleSubmit}
          disabled={generateStory.isPending}
          className="story-button-primary w-full"
        >
          {generateStory.isPending ? (
            <span className="flex items-center justify-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Creating Your Story...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>Create Our Bedtime Story</span>
            </span>
          )}
        </Button>
        <p className="text-center text-xs text-gray-500 mt-2">Stories are generated using AI and include beautiful illustrations</p>
      </div>
    </div>
  );
}
