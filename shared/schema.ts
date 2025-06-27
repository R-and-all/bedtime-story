import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  characters: text("characters").array().notNull(),
  setting: text("setting").notNull(),
  age: integer("age").notNull(),
  storyLength: text("story_length").notNull(), // "5min" or "10min"
  moralTheme: text("moral_theme"),
  illustrationUrl: text("illustration_url"),
  curriculumStage: text("curriculum_stage").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  childName: text("child_name"),
  defaultAge: integer("default_age").default(5),
  preferredLength: integer("preferred_length").default(5),
  favouriteThemes: text("favourite_themes").array().default([]),
  languageEnrichment: boolean("language_enrichment").default(true),
  autoSave: boolean("auto_save").default(true),
  illustrationStyle: text("illustration_style").default("soft"),
});

export const characterSuggestions = pgTable("character_suggestions", {
  id: serial("id").primaryKey(),
  character: text("character").notNull(),
  usageCount: integer("usage_count").default(1),
});

export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
  createdAt: true,
});

export const insertPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
});

export const insertCharacterSchema = createInsertSchema(characterSuggestions).omit({
  id: true,
});

export type Story = typeof stories.$inferSelect;
export type InsertStory = z.infer<typeof insertStorySchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertPreferencesSchema>;
export type CharacterSuggestion = typeof characterSuggestions.$inferSelect;
export type InsertCharacterSuggestion = z.infer<typeof insertCharacterSchema>;

// Story generation request schema
export const storyGenerationSchema = z.object({
  characters: z.array(z.string()).min(3).max(5),
  setting: z.string().min(10),
  age: z.number().min(0).max(12),
  storyLength: z.union([z.literal("5min"), z.literal("10min")]),
  moralTheme: z.string().optional(),
});

export type StoryGenerationRequest = z.infer<typeof storyGenerationSchema>;
