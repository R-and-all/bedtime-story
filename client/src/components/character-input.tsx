import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Sparkles } from 'lucide-react';
import { useGenerateCharacterSuggestions, useCharacterSuggestions } from '@/hooks/use-stories';
import { getRecentCharacters, saveRecentCharacters } from '@/lib/storage';

interface CharacterInputProps {
  characters: string[];
  onChange: (characters: string[]) => void;
}

export function CharacterInput({ characters, onChange }: CharacterInputProps) {
  const [recentCharacters] = useState(() => getRecentCharacters());
  const { data: storedCharacters } = useCharacterSuggestions();
  const generateSuggestions = useGenerateCharacterSuggestions();

  const addCharacter = () => {
    if (characters.length < 5) {
      onChange([...characters, '']);
    }
  };

  const removeCharacter = (index: number) => {
    if (characters.length > 1) {
      const newCharacters = characters.filter((_, i) => i !== index);
      onChange(newCharacters);
    }
  };

  const updateCharacter = (index: number, value: string) => {
    const newCharacters = [...characters];
    newCharacters[index] = value;
    onChange(newCharacters);
    
    // Save to recent characters when user finishes typing
    if (value.trim()) {
      saveRecentCharacters([value.trim()]);
    }
  };

  const handleSuggestCharacters = async () => {
    try {
      const result = await generateSuggestions.mutateAsync();
      const suggestions = result.characters.slice(0, Math.min(5, characters.length));
      onChange(suggestions);
    } catch (error) {
      console.error('Failed to generate character suggestions:', error);
    }
  };

  const useRecentCharacter = (character: string) => {
    const emptyIndex = characters.findIndex(c => !c.trim());
    if (emptyIndex >= 0) {
      updateCharacter(emptyIndex, character);
    } else if (characters.length < 5) {
      onChange([...characters, character]);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[hsl(215,16%,28%)] flex items-center">
          <span className="w-8 h-8 bg-[hsl(248,84%,67%)] rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-sm">👥</span>
          </span>
          Characters (3-5 needed)
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSuggestCharacters}
          disabled={generateSuggestions.isPending}
          className="text-[hsl(248,84%,67%)]"
        >
          <Sparkles className="w-4 h-4 mr-1" />
          {generateSuggestions.isPending ? 'Generating...' : 'Suggest Characters'}
        </Button>
      </div>
      
      <div className="space-y-3">
        {characters.map((character, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              value={character}
              onChange={(e) => updateCharacter(index, e.target.value)}
              placeholder={`e.g., ${index === 0 ? 'A brave little mouse' : index === 1 ? 'A wise old owl' : 'A friendly dragon'}`}
              className="story-input flex-1"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeCharacter(index)}
              disabled={characters.length <= 1}
              className="w-10 h-10 text-gray-400 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
      
      {characters.length < 5 && (
        <Button
          variant="outline"
          onClick={addCharacter}
          className="mt-3 w-full border-dashed border-2 border-purple-200 hover:border-[hsl(248,84%,67%)] hover:bg-purple-50"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Another Character
        </Button>
      )}

      {/* Recent Characters */}
      {(recentCharacters.length > 0 || storedCharacters?.length > 0) && (
        <div className="mt-4">
          <p className="text-xs font-medium text-gray-500 mb-2">Recent Characters:</p>
          <div className="flex flex-wrap gap-2">
            {recentCharacters.slice(0, 8).map((character, index) => (
              <Button
                key={index}
                variant="secondary"
                size="sm"
                onClick={() => useRecentCharacter(character)}
                className="text-xs bg-purple-50 text-purple-700 hover:bg-purple-100"
              >
                {character}
              </Button>
            ))}
            {storedCharacters?.slice(0, 4).map((suggestion, index) => (
              <Button
                key={`stored-${index}`}
                variant="secondary"
                size="sm"
                onClick={() => useRecentCharacter(suggestion.character)}
                className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                {suggestion.character}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
