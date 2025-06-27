import { stories, userPreferences, characterSuggestions, type Story, type InsertStory, type UserPreferences, type InsertUserPreferences, type CharacterSuggestion, type InsertCharacterSuggestion } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Stories
  getStory(id: number): Promise<Story | undefined>;
  getAllStories(): Promise<Story[]>;
  createStory(story: InsertStory): Promise<Story>;
  deleteStory(id: number): Promise<boolean>;
  
  // User Preferences
  getUserPreferences(): Promise<UserPreferences | undefined>;
  updateUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  
  // Character Suggestions
  getCharacterSuggestions(): Promise<CharacterSuggestion[]>;
  addCharacterSuggestion(character: InsertCharacterSuggestion): Promise<CharacterSuggestion>;
  incrementCharacterUsage(character: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private stories: Map<number, Story>;
  private preferences: UserPreferences | undefined;
  private characters: Map<number, CharacterSuggestion>;
  private currentStoryId: number;
  private currentCharacterId: number;

  constructor() {
    this.stories = new Map();
    this.characters = new Map();
    this.currentStoryId = 1;
    this.currentCharacterId = 1;
    
    // Initialize with default preferences
    this.preferences = {
      id: 1,
      childName: null,
      defaultAge: 5,
      preferredLength: 5,
      favouriteThemes: ["animals", "magic", "friendship"],
      languageEnrichment: true,
      autoSave: true,
      illustrationStyle: "soft",
    };

    // Initialize with some character suggestions
    this.seedCharacterSuggestions();
  }

  private seedCharacterSuggestions() {
    const defaultCharacters = [
      "A brave little mouse",
      "A wise old owl",
      "A friendly dragon",
      "A curious rabbit",
      "A helpful badger",
      "A gentle giant",
      "A magical fairy",
      "A clever fox",
      "A kind elephant",
      "A playful dolphin",
      "A mysterious cat",
      "A loyal dog"
    ];

    defaultCharacters.forEach(character => {
      const suggestion: CharacterSuggestion = {
        id: this.currentCharacterId++,
        character,
        usageCount: 0,
      };
      this.characters.set(suggestion.id, suggestion);
    });
  }

  async getStory(id: number): Promise<Story | undefined> {
    return this.stories.get(id);
  }

  async getAllStories(): Promise<Story[]> {
    return Array.from(this.stories.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const id = this.currentStoryId++;
    const story: Story = {
      ...insertStory,
      id,
      createdAt: new Date(),
      moralTheme: insertStory.moralTheme || null,
      illustrationUrl: insertStory.illustrationUrl || null,
    };
    this.stories.set(id, story);
    return story;
  }

  async deleteStory(id: number): Promise<boolean> {
    return this.stories.delete(id);
  }

  async getUserPreferences(): Promise<UserPreferences | undefined> {
    return this.preferences;
  }

  async updateUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    this.preferences = {
      id: 1,
      childName: preferences.childName || null,
      defaultAge: preferences.defaultAge || null,
      preferredLength: preferences.preferredLength || null,
      favouriteThemes: preferences.favouriteThemes || null,
      languageEnrichment: preferences.languageEnrichment ?? null,
      autoSave: preferences.autoSave ?? null,
      illustrationStyle: preferences.illustrationStyle || null,
    };
    return this.preferences;
  }

  async getCharacterSuggestions(): Promise<CharacterSuggestion[]> {
    return Array.from(this.characters.values()).sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
  }

  async addCharacterSuggestion(character: InsertCharacterSuggestion): Promise<CharacterSuggestion> {
    const id = this.currentCharacterId++;
    const suggestion: CharacterSuggestion = {
      id,
      character: character.character,
      usageCount: character.usageCount || 1,
    };
    this.characters.set(id, suggestion);
    return suggestion;
  }

  async incrementCharacterUsage(character: string): Promise<void> {
    const existing = Array.from(this.characters.values()).find(c => c.character === character);
    if (existing) {
      existing.usageCount = (existing.usageCount ?? 0) + 1;
    } else {
      await this.addCharacterSuggestion({ character, usageCount: 1 });
    }
  }
}

// Database Storage implementation
export class DatabaseStorage implements IStorage {
  async getStory(id: number): Promise<Story | undefined> {
    const [story] = await db.select().from(stories).where(eq(stories.id, id));
    return story || undefined;
  }

  async getAllStories(): Promise<Story[]> {
    return await db.select().from(stories).orderBy(stories.id);
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const [story] = await db
      .insert(stories)
      .values(insertStory)
      .returning();
    return story;
  }

  async deleteStory(id: number): Promise<boolean> {
    const result = await db.delete(stories).where(eq(stories.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getUserPreferences(): Promise<UserPreferences | undefined> {
    const [prefs] = await db.select().from(userPreferences).limit(1);
    return prefs || undefined;
  }

  async updateUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    // Check if preferences exist
    const existing = await this.getUserPreferences();
    
    if (existing) {
      const [updated] = await db
        .update(userPreferences)
        .set(preferences)
        .where(eq(userPreferences.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(userPreferences)
        .values(preferences)
        .returning();
      return created;
    }
  }

  async getCharacterSuggestions(): Promise<CharacterSuggestion[]> {
    return await db
      .select()
      .from(characterSuggestions)
      .orderBy(characterSuggestions.usageCount);
  }

  async addCharacterSuggestion(character: InsertCharacterSuggestion): Promise<CharacterSuggestion> {
    const [suggestion] = await db
      .insert(characterSuggestions)
      .values(character)
      .returning();
    return suggestion;
  }

  async incrementCharacterUsage(character: string): Promise<void> {
    const existing = await db
      .select()
      .from(characterSuggestions)
      .where(eq(characterSuggestions.character, character))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(characterSuggestions)
        .set({ usageCount: (existing[0].usageCount ?? 0) + 1 })
        .where(eq(characterSuggestions.id, existing[0].id));
    } else {
      await this.addCharacterSuggestion({ character, usageCount: 1 });
    }
  }
}

export const storage = new DatabaseStorage();
