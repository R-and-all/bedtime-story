import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePreferences, useUpdatePreferences } from '@/hooks/use-stories';
import { useToast } from '@/hooks/use-toast';
import { User, Palette, Save, HardDrive, Trash2 } from 'lucide-react';

export default function Settings() {
  const { data: preferences } = usePreferences();
  const updatePreferences = useUpdatePreferences();
  const { toast } = useToast();

  const [childName, setChildName] = useState('');
  const [defaultAge, setDefaultAge] = useState(5);
  const [preferredLength, setPreferredLength] = useState(5);
  const [favouriteThemes, setFavouriteThemes] = useState<string[]>([]);
  const [languageEnrichment, setLanguageEnrichment] = useState(true);
  const [includeClassicPhrases, setIncludeClassicPhrases] = useState(true);
  const [includeRhymes, setIncludeRhymes] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [rememberCharacters, setRememberCharacters] = useState(true);
  const [illustrationStyle, setIllustrationStyle] = useState('soft');
  const [generateIllustrations, setGenerateIllustrations] = useState(true);
  const [mutedColours, setMutedColours] = useState(true);

  useEffect(() => {
    if (preferences) {
      setChildName(preferences.childName || '');
      setDefaultAge(preferences.defaultAge || 5);
      setPreferredLength(preferences.preferredLength || 5);
      setFavouriteThemes(preferences.favouriteThemes || []);
      setLanguageEnrichment(preferences.languageEnrichment ?? true);
      setAutoSave(preferences.autoSave ?? true);
      setIllustrationStyle(preferences.illustrationStyle || 'soft');
    }
  }, [preferences]);

  const handleSaveSettings = async () => {
    try {
      await updatePreferences.mutateAsync({
        childName: childName || null,
        defaultAge,
        preferredLength,
        favouriteThemes,
        languageEnrichment,
        autoSave,
        illustrationStyle,
      });
      
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Unable to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all saved data? This cannot be undone.")) {
      localStorage.clear();
      toast({
        title: "Data Cleared",
        description: "All saved data has been removed from your browser.",
      });
    }
  };

  const themes = [
    { id: 'animals', label: 'Animals & Nature' },
    { id: 'fantasy', label: 'Princesses & Knights' },
    { id: 'space', label: 'Space & Adventure' },
    { id: 'magic', label: 'Magic & Fantasy' },
  ];

  const toggleTheme = (themeId: string) => {
    setFavouriteThemes(prev => 
      prev.includes(themeId) 
        ? prev.filter(id => id !== themeId)
        : [...prev, themeId]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[hsl(215,16%,28%)]">Settings & Preferences</h2>
        <p className="text-gray-600">Customise your bedtime story experience</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Child Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-[hsl(248,84%,67%)]" />
              Child Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="childName">Child's Name</Label>
              <Input
                id="childName"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="e.g., Emily"
                className="story-input"
              />
            </div>
            
            <div>
              <Label htmlFor="defaultAge">Default Age</Label>
              <Select value={defaultAge.toString()} onValueChange={(value) => setDefaultAge(parseInt(value))}>
                <SelectTrigger className="story-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 years old (EYFS)</SelectItem>
                  <SelectItem value="4">4 years old (EYFS)</SelectItem>
                  <SelectItem value="5">5 years old (Key Stage 1)</SelectItem>
                  <SelectItem value="6">6 years old (Key Stage 1)</SelectItem>
                  <SelectItem value="7">7 years old (Key Stage 1)</SelectItem>
                  <SelectItem value="8">8 years old (Key Stage 2)</SelectItem>
                  <SelectItem value="9">9 years old (Key Stage 2)</SelectItem>
                  <SelectItem value="10">10 years old (Key Stage 2)</SelectItem>
                  <SelectItem value="11">11 years old (Key Stage 2)</SelectItem>
                  <SelectItem value="12">12 years old (Key Stage 3)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Preferred Story Length</Label>
              <RadioGroup value={preferredLength.toString()} onValueChange={(value) => setPreferredLength(parseInt(value))}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5" id="length5" />
                  <Label htmlFor="length5">5-minute stories (default)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="10" id="length10" />
                  <Label htmlFor="length10">10-minute stories (default)</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Content Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="w-5 h-5 mr-2 text-[hsl(249,84%,70%)]" />
              Content Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Favourite Themes</Label>
              <div className="space-y-2 mt-2">
                {themes.map((theme) => (
                  <div key={theme.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={theme.id}
                      checked={favouriteThemes.includes(theme.id)}
                      onCheckedChange={() => toggleTheme(theme.id)}
                    />
                    <Label htmlFor={theme.id}>{theme.label}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label>Language Enrichment</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="languageEnrichment"
                    checked={languageEnrichment}
                    onCheckedChange={(checked) => setLanguageEnrichment(!!checked)}
                  />
                  <Label htmlFor="languageEnrichment">Include "older" vocabulary for learning</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="classicPhrases"
                    checked={includeClassicPhrases}
                    onCheckedChange={(checked) => setIncludeClassicPhrases(!!checked)}
                  />
                  <Label htmlFor="classicPhrases">Incorporate classic phrases</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rhymes"
                    checked={includeRhymes}
                    onCheckedChange={(checked) => setIncludeRhymes(!!checked)}
                  />
                  <Label htmlFor="rhymes">Include simple rhymes</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Story Storage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HardDrive className="w-5 h-5 mr-2 text-[hsl(45,96%,50%)]" />
              Story Storage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-[hsl(215,16%,28%)]">Stories Saved</p>
                <p className="text-sm text-gray-500">Local browser storage</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoSave">Auto-save generated stories</Label>
                <Checkbox
                  id="autoSave"
                  checked={autoSave}
                  onCheckedChange={(checked) => setAutoSave(!!checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="rememberCharacters">Remember character suggestions</Label>
                <Checkbox
                  id="rememberCharacters"
                  checked={rememberCharacters}
                  onCheckedChange={(checked) => setRememberCharacters(!!checked)}
                />
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={handleClearData}
              className="w-full text-red-700 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Saved Data
            </Button>
          </CardContent>
        </Card>

        {/* Illustrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="w-5 h-5 mr-2 text-emerald-500" />
              Illustrations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="illustrationStyle">Illustration Style</Label>
              <Select value={illustrationStyle} onValueChange={setIllustrationStyle}>
                <SelectTrigger className="story-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="soft">Soft & Dreamy (recommended for bedtime)</SelectItem>
                  <SelectItem value="watercolor">Watercolour Style</SelectItem>
                  <SelectItem value="cartoon">Friendly Cartoon</SelectItem>
                  <SelectItem value="storybook">Classic Storybook</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="generateIllustrations">Generate illustration with each story</Label>
                <Checkbox
                  id="generateIllustrations"
                  checked={generateIllustrations}
                  onCheckedChange={(checked) => setGenerateIllustrations(!!checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="mutedColours">Use muted colours for bedtime</Label>
                <Checkbox
                  id="mutedColours"
                  checked={mutedColours}
                  onCheckedChange={(checked) => setMutedColours(!!checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Settings */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[hsl(215,16%,28%)]">Save Your Preferences</h3>
              <p className="text-sm text-gray-600">Changes are saved automatically in your browser</p>
            </div>
            <Button
              onClick={handleSaveSettings}
              disabled={updatePreferences.isPending}
              className="story-button-primary"
            >
              <Save className="w-4 h-4 mr-2" />
              {updatePreferences.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
