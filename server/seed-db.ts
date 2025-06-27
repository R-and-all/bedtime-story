import { db } from "./db";
import { characterSuggestions } from "@shared/schema";

const initialCharacters = [
  "A brave little mouse",
  "A wise old owl",
  "A friendly dragon",
  "A curious rabbit",
  "A kind fairy",
  "A sleepy bear",
  "A clever fox",
  "A helpful hedgehog",
  "A singing bird",
  "A gentle giant",
  "A playful kitten",
  "A magical unicorn"
];

export async function seedDatabase() {
  try {
    // Check if characters already exist
    const existingCharacters = await db.select().from(characterSuggestions);
    
    if (existingCharacters.length === 0) {
      console.log("Seeding database with initial character suggestions...");
      
      for (const character of initialCharacters) {
        await db.insert(characterSuggestions).values({
          character,
          usageCount: Math.floor(Math.random() * 5) + 1
        });
      }
      
      console.log("Database seeded successfully!");
    } else {
      console.log("Database already contains character suggestions.");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}