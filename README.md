# TransLearn AI

⚠️ **ARCHIVED PROJECT - NO LONGER MAINTAINED**

<div align="center">
  <img src="docs/images/CleanShot 2025-07-02 at 22.02.11@2x.png" alt="TransLearn AI Homepage" width="800"/>
</div>

## Overview

A language learning platform that transforms speech from native languages into English using AI. This is an experimental project to learn how to build AI-powered applications with good UX.

## What's Valuable in This Project

### 1. OpenAI Task Prompts

The project contains carefully crafted AI prompts in `/src/services/openai/tasks/`. These YAML files demonstrate effective prompt engineering with extensive examples that work better than instructions alone. Each task file shows real-world transcreation examples for multiple languages.

### 2. Development Instructions & Principles

The `/docs/` folder contains valuable documentation for AI-assisted development:

- **Design principles** for building user-friendly interfaces
- **Color guidelines** for consistent visual design
- **Mobile-first** development approach
- **Architecture patterns** and folder structure
- **Middleware** implementation examples

### 3. Well-Documented Codebase

- Functions include `@purpose` documentation explaining why they exist
- Database schema files in `/src/services/supabase/tables/` for easy database cloning
- Comprehensive type definitions throughout the project

## Features

### Voice Recording

<img src="docs/images/CleanShot 2025-07-02 at 22.05.12@2x.png" alt="Voice Recording Interface" width="400"/>

### Translation Interface

<img src="docs/images/CleanShot 2025-07-02 at 22.03.37@2x.png" alt="Translation Interface" width="800"/>

### Learning Interface

<img src="docs/images/CleanShot 2025-07-02 at 22.16.40@2x.png" alt="Interactive Learning" width="800"/>

### Mobile Views

<div align="center">
  <img src="docs/images/CleanShot 2025-07-02 at 22.05.08@2x.png" alt="Mobile Interface 1" width="300"/>
  <img src="docs/images/CleanShot 2025-07-02 at 22.05.15@2x.png" alt="Mobile Interface 2" width="300"/>
</div>

## Tech Stack

- Next.js 14, React, TypeScript, Tailwind CSS
- OpenAI GPT-4, Whisper, ElevenLabs
- Supabase (PostgreSQL)
- Deepgram, Web Audio API
- Vercel

## Environment Variables

Create a `.env` file with the following variables:

### Core Services

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)
- `SUPABASE_ADMIN_USER_ID` - Admin user ID for special operations

### AI Services

**Note:** This application now uses user-provided API keys for security. Users configure their own OpenAI and ElevenLabs API keys through the application interface. No environment variables needed for AI services.

- `DEEPGRAM_API_KEY` - Deepgram API key for speech recognition (if enabled)
- `ELEVENLABS_PLAN_ID` - Your ElevenLabs plan (starter/creator/pro)
- `ELEVENLABS_VOICE_ID` - Default voice ID
- `ELEVENLABS_TTS_MODEL_ID` - Text-to-speech model ID
- `ELEVENLABS_STS_MODEL_ID` - Speech-to-speech model ID

### Authentication

- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

### Optional Services

- `NOTION_CLIENT_ID` - Notion integration client ID
- `NOTION_CLIENT_SECRET` - Notion integration client secret
- `NOTION_REDIRECT_URI` - Notion OAuth redirect URI
- `TELEGRAM_BOT_TOKEN` - Telegram bot token (if using bot features)
- `TELEGRAM_ADMIN_USER_ID` - Telegram admin user ID
- `CRON_SECRET` - Secret key for cron job authentication

### Application Settings

- `NEXT_PUBLIC_APP_URL` - Your application URL (e.g., https://yourdomain.com)

## Database Setup

The project includes SQL schema files in `/src/services/supabase/tables/`. You can use these to set up your own Supabase database with the same structure.

## Screenshots

<img src="docs/images/CleanShot 2025-07-02 at 22.03.49@2x.png" alt="Desktop View 1" width="800"/>
<img src="docs/images/CleanShot 2025-07-02 at 22.04.01@2x.png" alt="Desktop View 2" width="800"/>
<img src="docs/images/CleanShot 2025-07-02 at 22.04.13@2x.png" alt="Features 1" width="800"/>
<img src="docs/images/CleanShot 2025-07-02 at 22.04.45@2x.png" alt="Features 2" width="800"/>
<img src="docs/images/CleanShot 2025-07-02 at 22.05.45@2x.png" alt="Learning Interface" width="800"/>
<img src="docs/images/CleanShot 2025-07-02 at 22.16.18@2x.png" alt="Practice Mode" width="800"/>
<img src="docs/images/CleanShot 2025-07-02 at 22.16.42@2x.png" alt="Settings" width="800"/>
<img src="docs/images/CleanShot 2025-07-02 at 22.16.54@2x.png" alt="Progress View" width="800"/>
<img src="docs/images/CleanShot 2025-07-02 at 22.17.11@2x.png" alt="Achievement View" width="800"/>

## License

This project is licensed under the Educational Use License - see the [LICENSE](LICENSE) file for details.

**For educational and non-commercial use only.**
