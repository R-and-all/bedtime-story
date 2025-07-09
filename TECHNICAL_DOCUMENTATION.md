# Bedtime Stories Application - Technical Documentation

## Overview
The Bedtime Stories Application is a full-stack web application that generates AI-powered, curriculum-aligned bedtime stories for children. Built with React/Vite frontend and Express.js backend, it integrates Google Gemini AI for story generation and supports PostgreSQL for data persistence.

## Project Structure

### Root Directory
```
├── client/                 # React frontend application
├── server/                 # Express.js backend application
├── shared/                 # Shared types and schemas
├── components.json         # shadcn/ui component configuration
├── drizzle.config.ts      # Drizzle ORM configuration
├── package.json           # Dependencies and scripts
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build configuration
└── replit.md             # Project documentation and changelog
```

### Frontend Structure (`client/`)
```
client/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── age-slider.tsx   # Age selection slider component
│   │   ├── character-input.tsx # Character input with suggestions
│   │   ├── story-display.tsx   # Story viewing modal
│   │   └── story-form.tsx      # Main story generation form
│   ├── hooks/
│   │   ├── use-local-storage.ts # Local storage utilities
│   │   ├── use-mobile.tsx      # Mobile detection hook
│   │   ├── use-stories.ts      # API integration hooks
│   │   └── use-toast.ts        # Toast notification system
│   ├── lib/
│   │   ├── curriculum-data.ts  # UK curriculum stage definitions
│   │   ├── pdf-generator.ts    # PDF export functionality
│   │   ├── queryClient.ts      # TanStack Query setup
│   │   ├── storage.ts          # Local storage helpers
│   │   └── utils.ts            # Utility functions
│   ├── pages/
│   │   ├── home.tsx           # Story generation page
│   │   ├── library.tsx        # Story library page
│   │   ├── settings.tsx       # User preferences page
│   │   └── not-found.tsx      # 404 page
│   ├── App.tsx               # Main application component
│   ├── index.css             # Global styles and CSS variables
│   └── main.tsx              # Application entry point
└── index.html               # HTML template
```

### Backend Structure (`server/`)
```
server/
├── services/
│   └── gemini.ts            # Google Gemini AI integration
├── db.ts                    # Database connection setup
├── index.ts                 # Express server entry point
├── routes.ts                # API route definitions
├── seed-db.ts               # Database seeding utilities
├── storage.ts               # Storage interface and implementations
└── vite.ts                  # Vite development server integration
```

### Shared (`shared/`)
```
shared/
└── schema.ts               # Database schema and type definitions
```

## Core Components & Interactions

### Frontend Architecture

#### React Components
- **App.tsx**: Root component with routing setup using Wouter
- **StoryForm**: Main form for story generation with character input, age selection, and settings
- **StoryDisplay**: Modal component for viewing generated stories
- **AgeSlider**: Custom slider component for age selection (0-12 years)
- **CharacterInput**: Dynamic character input with suggestion system

#### State Management
- **TanStack Query**: Server state management for API calls
- **Local Storage**: Client-side persistence for user preferences
- **React Hook Form**: Form state management with Zod validation

#### Data Flow
1. User inputs story parameters → Form validation → API request
2. Backend processes request → AI generation → Database storage
3. Response returns to frontend → UI updates → Local storage sync

### Backend Architecture

#### Express.js Server
- **index.ts**: Server setup with middleware, error handling, and route registration
- **routes.ts**: RESTful API endpoints for stories, characters, and preferences
- **storage.ts**: Abstracted storage layer with MemStorage and DatabaseStorage implementations

#### Storage Layer
```typescript
interface IStorage {
  // Stories
  getStory(id: number): Promise<Story | undefined>
  getAllStories(): Promise<Story[]>
  createStory(story: InsertStory): Promise<Story>
  deleteStory(id: number): Promise<boolean>
  
  // User Preferences
  getUserPreferences(): Promise<UserPreferences | undefined>
  updateUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>
  
  // Character Suggestions
  getCharacterSuggestions(): Promise<CharacterSuggestion[]>
  addCharacterSuggestion(character: InsertCharacterSuggestion): Promise<CharacterSuggestion>
  incrementCharacterUsage(character: string): Promise<void>
}
```

#### API Endpoints
- `GET /api/stories` - Retrieve all stories
- `POST /api/stories/generate` - Generate new story
- `DELETE /api/stories/:id` - Delete story
- `GET /api/characters` - Get character suggestions
- `POST /api/characters/suggest` - Generate character suggestions
- `GET /api/preferences` - Get user preferences
- `PUT /api/preferences` - Update user preferences

## Key Technologies & Their Implementation

### Google Gemini AI Integration

#### Configuration
```typescript
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
```

#### Story Generation
- **Model**: `gemini-2.5-flash` for story generation
- **Curriculum Integration**: Age-appropriate content based on UK National Curriculum stages
- **Moral Lessons**: Classic fables and ethical themes integration
- **UK English**: Proper spelling and terminology throughout

#### Character Suggestions
- **AI-powered**: Gemini generates diverse, age-appropriate character suggestions
- **Usage Tracking**: System learns from user selections to improve recommendations

### Database Integration (PostgreSQL + Drizzle ORM)

#### Database Schema
```typescript
// Stories table
export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  characters: text("characters").array().notNull(),
  age: integer("age").notNull(),
  setting: text("setting").notNull(),
  storyLength: text("story_length").notNull(),
  curriculumStage: text("curriculum_stage").notNull(),
  illustration: text("illustration"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User preferences
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  defaultAge: integer("default_age").default(7),
  preferredThemes: text("preferred_themes").array().default([]),
  illustrationStyle: text("illustration_style").default("watercolor"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Character suggestions tracking
export const characterSuggestions = pgTable("character_suggestions", {
  id: serial("id").primaryKey(),
  character: text("character").notNull().unique(),
  usageCount: integer("usage_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

#### Database Operations
- **Connection**: Neon PostgreSQL with serverless connection pooling
- **Migrations**: Drizzle Kit for schema management
- **Type Safety**: Full TypeScript integration with inferred types

### PDF Generation

#### Implementation
- **Library**: jsPDF for PDF creation
- **Features**: Story text formatting, illustration embedding, proper typography
- **Download**: Client-side PDF generation and download

```typescript
export async function generateStoryPDF(story: Story): Promise<void> {
  const pdf = new jsPDF();
  // PDF generation logic with proper formatting
}
```

## Environment Configuration

### Required Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# AI Services
GEMINI_API_KEY=your_gemini_api_key_here

# Database Connection Details (auto-populated by Replit)
PGHOST=your_postgres_host
PGPORT=5432
PGUSER=your_postgres_user
PGPASSWORD=your_postgres_password
PGDATABASE=your_database_name
```

### Development Setup
1. Install dependencies: `npm install`
2. Set up environment variables
3. Run development server: `npm run dev`
4. Push database schema: `npm run db:push`

## Design & Build Rationale

### Architecture Decisions

#### Frontend Technology Choices
- **React + Vite**: Fast development with hot module replacement
- **Wouter**: Lightweight routing (2KB vs React Router's 45KB)
- **TanStack Query**: Robust server state management with caching
- **shadcn/ui**: Accessible, customizable component library built on Radix UI
- **Tailwind CSS**: Utility-first styling for rapid development

#### Backend Technology Choices
- **Express.js**: Mature, lightweight web framework
- **TypeScript**: Type safety across the entire stack
- **Drizzle ORM**: Type-safe database operations with excellent TypeScript integration
- **Neon PostgreSQL**: Serverless PostgreSQL with excellent Replit integration

#### AI Integration Strategy
- **Google Gemini over OpenAI**: Cost-effective, multimodal capabilities
- **Curriculum Integration**: UK National Curriculum alignment for educational value
- **Moral Lessons**: Classic fables integration for character development

### Code Patterns

#### Storage Abstraction
```typescript
// Abstract interface allows switching between storage implementations
interface IStorage { ... }

// Current implementations
class MemStorage implements IStorage { ... }      // In-memory development
class DatabaseStorage implements IStorage { ... }  // PostgreSQL production
```

#### Type Safety
- **Shared Schema**: Single source of truth for data structures
- **Zod Integration**: Runtime validation matching TypeScript types
- **API Type Safety**: End-to-end type safety from database to frontend

#### Error Handling
- **Graceful Degradation**: Fallback to in-memory storage if database fails
- **User-Friendly Messages**: Clear error messages for API failures
- **Logging**: Comprehensive logging for debugging

## Current State Notes

### Operational Status
- **Primary Mode**: Currently running with in-memory storage (MemStorage)
- **Database Integration**: PostgreSQL code implemented but temporarily disabled
- **AI Integration**: Fully functional with Google Gemini API

### Known Issues & Considerations

#### Database Connection
- **Issue**: PostgreSQL endpoint showing "endpoint is disabled" error
- **Current Solution**: Temporarily using MemStorage for stability
- **Impact**: Stories don't persist between server restarts
- **Resolution**: Database integration code preserved and can be re-enabled

#### Performance Considerations
- **Story Generation**: 8-12 second response time for AI generation
- **Character Suggestions**: Cached for performance
- **PDF Generation**: Client-side processing may be slow for large stories

#### Scalability Notes
- **In-Memory Limitations**: Current setup limited to single server instance
- **Database Ready**: PostgreSQL integration ready for production scale
- **AI Rate Limits**: Google Gemini API rate limits may require request queuing

### Future Enhancements
- **Authentication**: User accounts for personalized story libraries
- **Image Generation**: Enhanced illustration capabilities
- **Audio Narration**: Text-to-speech integration
- **Mobile App**: React Native implementation
- **Advanced Analytics**: Story preferences and usage tracking

## Development Workflow

### Local Development
1. `npm run dev` - Starts both frontend and backend with hot reload
2. Database changes automatically reflected via Drizzle
3. TypeScript compilation errors prevent runtime issues

### Production Deployment
1. `npm run build` - Builds optimized frontend bundle
2. Express server serves both API and static files
3. PostgreSQL database required for persistence
4. Environment variables must be configured

### Testing Strategy
- **Type Safety**: TypeScript prevents many runtime errors
- **API Testing**: Can be tested via curl or REST client
- **UI Testing**: Manual testing with immediate feedback
- **Database Testing**: Separate test database recommended

This documentation provides a comprehensive technical overview of the bedtime stories application, covering architecture, implementation details, and operational considerations for both development and production environments.