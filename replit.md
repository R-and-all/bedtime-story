# Bedtime Stories Application

## Overview

This is a full-stack bedtime story generation application built with Express.js and React. The application uses AI to create personalized bedtime stories for children based on UK National Curriculum standards. It features character-driven storytelling, age-appropriate content, and story illustration generation.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server:

- **Frontend**: React with TypeScript, using Vite for development and building
- **Backend**: Express.js with TypeScript for API endpoints and server-side logic
- **Database**: PostgreSQL with Drizzle ORM for data persistence
- **AI Integration**: OpenAI API for story and illustration generation
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Development Environment**: Configured for Replit with hot reload support

## Key Components

### Frontend Architecture
- **React Router**: Using Wouter for client-side routing
- **State Management**: TanStack Query for server state and local state hooks
- **UI Components**: Comprehensive shadcn/ui component library with custom theming
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom CSS variables for theming

### Backend Architecture
- **Express Server**: RESTful API with middleware for logging and error handling
- **Database Layer**: Drizzle ORM with PostgreSQL for type-safe database operations
- **AI Services**: OpenAI integration for story generation and DALL-E for illustrations
- **Storage Interface**: Abstracted storage layer with in-memory fallback for development

### Database Schema
Three main tables:
- **stories**: Stores generated stories with metadata (title, content, characters, age, curriculum stage)
- **userPreferences**: User settings for personalization (default age, themes, illustration preferences)
- **characterSuggestions**: Character usage tracking for intelligent suggestions

## Data Flow

1. **Story Creation**: User fills form → validation → API request → OpenAI story generation → illustration generation → database storage
2. **Story Library**: Database query → story list display → individual story viewing
3. **User Preferences**: Settings form → preference updates → personalized defaults
4. **Character Suggestions**: Usage tracking → intelligent character recommendations

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM for database operations
- **openai**: AI service integration for content generation
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives

### Development Tools
- **vite**: Frontend build tool and development server
- **tsx**: TypeScript execution for development
- **esbuild**: Production build bundling
- **tailwindcss**: Utility-first CSS framework

### UK Curriculum Integration
The application implements age-appropriate content generation based on UK National Curriculum stages:
- **EYFS (0-4 years)**: Basic vocabulary and simple moral concepts
- **Key Stage 1 (5-7 years)**: Phonics-based vocabulary and friendship themes
- **Key Stage 2 (8-11 years)**: Complex vocabulary and deeper moral reasoning

## Deployment Strategy

The application is configured for Replit deployment with:
- **Development**: `npm run dev` starts both frontend and backend with hot reload
- **Production Build**: Vite builds frontend assets, esbuild bundles server code
- **Environment**: Node.js 20 with PostgreSQL 16 module
- **Port Configuration**: Server runs on port 5000, mapped to external port 80
- **Database**: Expects `DATABASE_URL` environment variable for PostgreSQL connection

The build process creates a `dist` directory with both client assets and server bundle for production deployment.

## Changelog

```
Changelog:
- June 27, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```