import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { storyGenerationSchema } from "@shared/schema";
import { generateBedtimeStory, generateBedtimeIllustration, suggestCharacters } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all stories
  app.get("/api/stories", async (req, res) => {
    try {
      const stories = await storage.getAllStories();
      res.json(stories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stories" });
    }
  });

  // Get single story
  app.get("/api/stories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const story = await storage.getStory(id);
      if (!story) {
        return res.status(404).json({ error: "Story not found" });
      }
      res.json(story);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch story" });
    }
  });

  // Generate new story
  app.post("/api/stories/generate", async (req, res) => {
    try {
      const validatedData = storyGenerationSchema.parse(req.body);
      
      // Generate story content
      const storyResult = await generateBedtimeStory(validatedData);
      
      // Generate illustration
      const illustration = await generateBedtimeIllustration(
        storyResult.title,
        validatedData.characters,
        validatedData.setting,
        validatedData.age
      );

      // Save to storage
      const story = await storage.createStory({
        title: storyResult.title,
        content: storyResult.content,
        characters: validatedData.characters,
        setting: validatedData.setting,
        age: validatedData.age,
        storyLength: validatedData.storyLength,
        moralTheme: storyResult.moral,
        illustrationUrl: illustration.url,
        curriculumStage: validatedData.age <= 4 ? "EYFS" : 
                        validatedData.age <= 7 ? "Key Stage 1" : 
                        validatedData.age <= 11 ? "Key Stage 2" : "Key Stage 3",
      });

      // Update character usage
      for (const character of validatedData.characters) {
        await storage.incrementCharacterUsage(character);
      }

      res.json({
        story,
        suggestedTitles: storyResult.suggestedTitles,
      });
    } catch (error) {
      console.error("Story generation error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to generate story" 
      });
    }
  });

  // Delete story
  app.delete("/api/stories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteStory(id);
      if (!deleted) {
        return res.status(404).json({ error: "Story not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete story" });
    }
  });

  // Get user preferences
  app.get("/api/preferences", async (req, res) => {
    try {
      const preferences = await storage.getUserPreferences();
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch preferences" });
    }
  });

  // Update user preferences
  app.put("/api/preferences", async (req, res) => {
    try {
      const preferences = await storage.updateUserPreferences(req.body);
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ error: "Failed to update preferences" });
    }
  });

  // Get character suggestions
  app.get("/api/characters", async (req, res) => {
    try {
      const characters = await storage.getCharacterSuggestions();
      res.json(characters);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch characters" });
    }
  });

  // Generate character suggestions
  app.post("/api/characters/suggest", async (req, res) => {
    try {
      const suggestions = await suggestCharacters();
      res.json({ characters: suggestions });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate character suggestions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
