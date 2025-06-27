import { GoogleGenAI } from "@google/genai";
import { StoryGenerationRequest } from "@shared/schema";

// Using Google Gemini for story generation as requested by the user
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

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
  3: { stage: "EYFS", vocabularyLevel: "basic", sentenceComplexity: "very simple", moralReasoningLevel: "concrete actions", readingLevel: "pre-reading" },
  4: { stage: "EYFS", vocabularyLevel: "expanding", sentenceComplexity: "simple", moralReasoningLevel: "basic right/wrong", readingLevel: "emergent reading" },
  5: { stage: "KS1", vocabularyLevel: "phonics-based", sentenceComplexity: "simple with conjunctions", moralReasoningLevel: "friendship and sharing", readingLevel: "beginning reading" },
  6: { stage: "KS1", vocabularyLevel: "phonics-based", sentenceComplexity: "simple with conjunctions", moralReasoningLevel: "friendship and sharing", readingLevel: "developing reading" },
  7: { stage: "KS1", vocabularyLevel: "expanding", sentenceComplexity: "compound sentences", moralReasoningLevel: "empathy and kindness", readingLevel: "fluent reading" },
  8: { stage: "KS2", vocabularyLevel: "complex", sentenceComplexity: "complex sentences", moralReasoningLevel: "deeper moral reasoning", readingLevel: "advanced reading" },
  9: { stage: "KS2", vocabularyLevel: "complex", sentenceComplexity: "complex sentences", moralReasoningLevel: "deeper moral reasoning", readingLevel: "advanced reading" },
  10: { stage: "KS2", vocabularyLevel: "sophisticated", sentenceComplexity: "varied sentence structures", moralReasoningLevel: "ethical thinking", readingLevel: "proficient reading" },
  11: { stage: "KS2", vocabularyLevel: "sophisticated", sentenceComplexity: "varied sentence structures", moralReasoningLevel: "ethical thinking", readingLevel: "proficient reading" },
  12: { stage: "KS3", vocabularyLevel: "advanced", sentenceComplexity: "complex varied structures", moralReasoningLevel: "abstract moral concepts", readingLevel: "mature reading" }
};

export async function generateBedtimeStory(request: StoryGenerationRequest): Promise<{
  title: string;
  content: string;
  moral: string;
  suggestedTitles: string[];
}> {
  const curriculum = curriculumMapping[request.age] || curriculumMapping[5];
  const wordCount = request.storyLength === "5min" ? 400 : 800;

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
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
      config: {
        temperature: 0.8,
        maxOutputTokens: 2000,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
            moral: { type: "string" },
            suggestedTitles: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["title", "content", "moral", "suggestedTitles"]
        }
      }
    });

    if (!response.text) {
      throw new Error("No response from Gemini API");
    }
    const result = JSON.parse(response.text);
    return result;
  } catch (error) {
    console.error("Story generation failed:", error);
    // Return a sample story for development
    return {
      title: `The Adventures of ${request.characters[0]}`,
      content: `Once upon a time, in ${request.setting}, there lived ${request.characters.join(", ")}. They discovered the importance of ${request.moralTheme || "friendship and kindness"}. Through their adventure, they learned valuable lessons about helping others and being brave. The End.`,
      moral: request.moralTheme || "The importance of friendship and kindness",
      suggestedTitles: [
        `The Tale of ${request.characters[0]}`,
        `Adventures in ${request.setting}`,
        `The Story of Friendship`
      ]
    };
  }
}

export async function generateBedtimeIllustration(storyTitle: string, characters: string[], setting: string, age: number): Promise<{ url: string }> {
  const style = age <= 5 ? "soft watercolor children's book illustration" : "gentle storybook illustration";
  
  const prompt = `Create a ${style} for a bedtime story titled "${storyTitle}". 
Scene: ${setting} featuring ${characters.join(", ")}. 
Style: Soft, muted colours perfect for bedtime, dreamy and calming atmosphere, child-friendly and non-scary, warm lighting suggesting evening or magical twilight. 
Art style: Gentle, rounded shapes, pastel colour palette, cozy and reassuring mood.`;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: prompt,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      }
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No image generated");
    }

    const content = candidates[0].content;
    if (!content || !content.parts) {
      throw new Error("No content in response");
    }

    for (const part of content.parts) {
      if (part.inlineData && part.inlineData.data) {
        const imageData = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        return { url: imageData };
      }
    }

    throw new Error("No image data found in response");
  } catch (error) {
    throw new Error(`Failed to generate illustration: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function suggestCharacters(): Promise<string[]> {
  const prompt = `Generate 12 creative, diverse characters suitable for children's bedtime stories. Include a mix of:
- Animals (domestic and woodland creatures)
- Fantasy characters (fairies, dragons, etc.)
- Human characters (children, adults in various professions)
- Magical beings
- Each character should be described in 3-5 words

Please respond with JSON in this format:
{
  "characters": ["Character 1", "Character 2", ...]
}`;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
      config: {
        temperature: 0.9,
        maxOutputTokens: 1000,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            characters: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["characters"]
        }
      }
    });

    if (!response.text) {
      throw new Error("No response from Gemini API for character suggestions");
    }
    const result = JSON.parse(response.text);
    return result.characters || [];
  } catch (error) {
    console.error("Character generation failed:", error);
    // Return fallback characters
    return [
      "A curious little rabbit",
      "A wise old owl",
      "A friendly dragon",
      "A brave young knight",
      "A magical fairy",
      "A sleepy bear",
      "A clever fox",
      "A kind grandmother",
      "A playful puppy",
      "A gentle giant",
      "A singing bird",
      "A helpful mouse"
    ];
  }
}