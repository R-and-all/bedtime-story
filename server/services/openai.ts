import OpenAI from "openai";
import { StoryGenerationRequest } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

interface CurriculumData {
  stage: string;
  vocabularyLevel: string;
  sentenceComplexity: string;
  moralReasoningLevel: string;
  readingLevel: string;
}

const curriculumMapping: Record<number, CurriculumData> = {
  0: { stage: "EYFS", vocabularyLevel: "basic", sentenceComplexity: "very simple", moralReasoningLevel: "concrete actions", readingLevel: "pre-reading" },
  1: { stage: "EYFS", vocabularyLevel: "basic", sentenceComplexity: "very simple", moralReasoningLevel: "concrete actions", readingLevel: "pre-reading" },
  2: { stage: "EYFS", vocabularyLevel: "basic", sentenceComplexity: "very simple", moralReasoningLevel: "concrete actions", readingLevel: "pre-reading" },
  3: { stage: "EYFS", vocabularyLevel: "foundation", sentenceComplexity: "simple", moralReasoningLevel: "basic kindness", readingLevel: "early phonics" },
  4: { stage: "EYFS", vocabularyLevel: "foundation", sentenceComplexity: "simple", moralReasoningLevel: "basic kindness", readingLevel: "developing phonics" },
  5: { stage: "Key Stage 1", vocabularyLevel: "phonics-based", sentenceComplexity: "simple with basic punctuation", moralReasoningLevel: "sharing and kindness", readingLevel: "independent reading" },
  6: { stage: "Key Stage 1", vocabularyLevel: "expanding", sentenceComplexity: "simple with varied punctuation", moralReasoningLevel: "friendship and cooperation", readingLevel: "fluent reading" },
  7: { stage: "Key Stage 1", vocabularyLevel: "age-appropriate academic", sentenceComplexity: "developing complexity", moralReasoningLevel: "basic figurative understanding", readingLevel: "confident reading" },
  8: { stage: "Key Stage 2", vocabularyLevel: "figurative language introduction", sentenceComplexity: "complex sentences", moralReasoningLevel: "deeper moral reasoning", readingLevel: "advanced reading" },
  9: { stage: "Key Stage 2", vocabularyLevel: "advanced vocabulary", sentenceComplexity: "varied sentence structures", moralReasoningLevel: "ethical understanding", readingLevel: "sophisticated reading" },
  10: { stage: "Key Stage 2", vocabularyLevel: "sophisticated", sentenceComplexity: "nuanced expression", moralReasoningLevel: "complex moral concepts", readingLevel: "secondary preparation" },
  11: { stage: "Key Stage 2", vocabularyLevel: "secondary preparation", sentenceComplexity: "advanced structures", moralReasoningLevel: "ethical reasoning", readingLevel: "year 7 ready" },
  12: { stage: "Key Stage 3", vocabularyLevel: "standard English proficiency", sentenceComplexity: "conscious language control", moralReasoningLevel: "philosophical concepts", readingLevel: "advanced secondary" },
};

export async function generateBedtimeStory(request: StoryGenerationRequest): Promise<{
  title: string;
  content: string;
  moral: string;
  suggestedTitles: string[];
}> {
  const curriculum = curriculumMapping[request.age];
  const wordCount = request.storyLength === 5 ? 400 : 800;

  const prompt = `Create a bedtime story for a ${request.age}-year-old child following UK National Curriculum ${curriculum.stage} standards.

STORY REQUIREMENTS:
- Characters: ${request.characters.join(", ")}
- Setting: ${request.setting}
- Length: Approximately ${wordCount} words for a ${request.storyLength}-minute reading time
- Moral theme: ${request.moralTheme || "Choose an age-appropriate moral lesson"}

UK CURRICULUM ALIGNMENT (${curriculum.stage}):
- Vocabulary level: ${curriculum.vocabularyLevel}
- Sentence complexity: ${curriculum.sentenceComplexity}
- Moral reasoning: ${curriculum.moralReasoningLevel}
- Reading level: ${curriculum.readingLevel}

LANGUAGE REQUIREMENTS:
- Use proper UK English spelling (colour, realise, centre, behaviour, etc.)
- Include age-appropriate "older" vocabulary for enrichment
- Incorporate classic fable-style moral lessons
- Use Standard English with appropriate complexity for age
- Bedtime-appropriate tone (calming, reassuring, positive ending)

STORY STRUCTURE:
- Begin with "Once upon a time" or similar classic opening
- Include all specified characters meaningfully
- Set the story in the described setting
- Build to a gentle conflict or challenge
- Resolve with the moral lesson naturally integrated
- End with a peaceful, satisfying conclusion
- Include "The End" at the finish

Please respond with JSON in this exact format:
{
  "title": "Generated story title",
  "content": "Full story text with proper UK spelling and age-appropriate language",
  "moral": "The moral lesson explained simply",
  "suggestedTitles": ["Alternative title 1", "Alternative title 2", "Alternative title 3"]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    throw new Error(`Failed to generate story: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateBedtimeIllustration(storyTitle: string, characters: string[], setting: string, age: number): Promise<{ url: string }> {
  const style = age <= 5 ? "soft watercolor children's book illustration" : "gentle storybook illustration";
  
  const prompt = `Create a ${style} for a bedtime story titled "${storyTitle}". 
Scene: ${setting} featuring ${characters.join(", ")}. 
Style: Soft, muted colours perfect for bedtime, dreamy and calming atmosphere, child-friendly and non-scary, warm lighting suggesting evening or magical twilight. 
Art style: Gentle, rounded shapes, pastel colour palette, cozy and reassuring mood.`;

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return { url: response.data[0].url || "" };
  } catch (error) {
    throw new Error(`Failed to generate illustration: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function suggestCharacters(): Promise<string[]> {
  const prompt = `Generate 5 creative character suggestions for children's bedtime stories. 
Each should be:
- Child-friendly and non-scary
- Suitable for bedtime stories
- Include the article (A/An) and descriptive adjective
- Mix of animals, fantasy creatures, and gentle characters

Examples: "A brave little hedgehog", "A wise old tortoise", "A magical singing bird"

Respond with JSON:
{
  "characters": ["character 1", "character 2", "character 3", "character 4", "character 5"]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.9,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.characters || [];
  } catch (error) {
    throw new Error(`Failed to generate character suggestions: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
