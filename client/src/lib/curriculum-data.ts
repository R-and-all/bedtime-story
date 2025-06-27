export interface CurriculumLevel {
  stage: string;
  title: string;
  description: string;
  keySkills: string[];
  vocabularyLevel: string;
}

export const curriculumData: Record<number, CurriculumLevel> = {
  0: {
    stage: "EYFS",
    title: "Early Years (Ages 0-3)",
    description: "Simple words, basic communication, gentle moral concepts through actions.",
    keySkills: ["Basic vocabulary", "Simple sentences", "Listening skills"],
    vocabularyLevel: "foundational"
  },
  1: {
    stage: "EYFS", 
    title: "Early Years (Ages 0-3)",
    description: "Simple words, basic communication, gentle moral concepts through actions.",
    keySkills: ["Basic vocabulary", "Simple sentences", "Listening skills"],
    vocabularyLevel: "foundational"
  },
  2: {
    stage: "EYFS",
    title: "Early Years (Ages 0-3)", 
    description: "Simple words, basic communication, gentle moral concepts through actions.",
    keySkills: ["Basic vocabulary", "Simple sentences", "Listening skills"],
    vocabularyLevel: "foundational"
  },
  3: {
    stage: "EYFS",
    title: "Early Years (Ages 3-5)",
    description: "Foundation vocabulary, simple sentences, basic moral concepts about kindness.",
    keySkills: ["Phonics awareness", "Story comprehension", "Basic emotions"],
    vocabularyLevel: "developing"
  },
  4: {
    stage: "EYFS",
    title: "Early Years (Ages 3-5)",
    description: "Foundation vocabulary, simple sentences, basic moral concepts about kindness.",
    keySkills: ["Phonics awareness", "Story comprehension", "Basic emotions"],
    vocabularyLevel: "developing"
  },
  5: {
    stage: "Key Stage 1",
    title: "Key Stage 1 (Ages 5-7)",
    description: "Simple sentences, basic punctuation, phonics-based vocabulary with moral lessons about kindness and sharing.",
    keySkills: ["Phonics mastery", "Simple punctuation", "Character understanding"],
    vocabularyLevel: "expanding"
  },
  6: {
    stage: "Key Stage 1",
    title: "Key Stage 1 (Ages 5-7)",
    description: "Simple sentences, basic punctuation, phonics-based vocabulary with moral lessons about kindness and sharing.",
    keySkills: ["Reading fluency", "Writing basics", "Moral reasoning"],
    vocabularyLevel: "expanding"
  },
  7: {
    stage: "Key Stage 1",
    title: "Key Stage 1 (Ages 5-7)",
    description: "Developing fluency, age-appropriate academic vocabulary, understanding of figurative language basics.",
    keySkills: ["Independent reading", "Academic vocabulary", "Story structure"],
    vocabularyLevel: "academic foundation"
  },
  8: {
    stage: "Key Stage 2",
    title: "Key Stage 2 (Ages 7-11)",
    description: "Complex sentences, figurative language, advanced vocabulary with deeper moral reasoning.",
    keySkills: ["Figurative language", "Complex narratives", "Ethical understanding"],
    vocabularyLevel: "advanced"
  },
  9: {
    stage: "Key Stage 2",
    title: "Key Stage 2 (Ages 7-11)",
    description: "Complex sentences, figurative language, advanced vocabulary with deeper moral reasoning.",
    keySkills: ["Literary devices", "Character development", "Moral complexity"],
    vocabularyLevel: "advanced"
  },
  10: {
    stage: "Key Stage 2",
    title: "Key Stage 2 (Ages 7-11)",
    description: "Sophisticated vocabulary, nuanced meaning, preparation for secondary curriculum complexity.",
    keySkills: ["Advanced comprehension", "Nuanced themes", "Critical thinking"],
    vocabularyLevel: "sophisticated"
  },
  11: {
    stage: "Key Stage 2",
    title: "Key Stage 2 (Ages 7-11)",
    description: "Reading and writing sufficiently fluent for year 7, advanced moral and ethical reasoning.",
    keySkills: ["Secondary preparation", "Ethical reasoning", "Advanced literacy"],
    vocabularyLevel: "secondary ready"
  },
  12: {
    stage: "Key Stage 3",
    title: "Key Stage 3 (Ages 11-14)",
    description: "Standard English proficiency, conscious language control, complex moral and philosophical concepts.",
    keySkills: ["Standard English", "Philosophical thinking", "Advanced communication"],
    vocabularyLevel: "mature"
  }
};

export function getCurriculumStageClass(stage: string): string {
  switch (stage) {
    case "EYFS": return "eyfs";
    case "Key Stage 1": return "ks1";
    case "Key Stage 2": return "ks2";
    case "Key Stage 3": return "ks3";
    default: return "eyfs";
  }
}
