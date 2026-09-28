# Dev-Ladder

A bright, game-like academy for learning Python and JavaScript. Lessons, quests, and coding challenges award XP. Progress is stored in the browser until Supabase is connected.

## Design

Dev Ladder uses a light, candy-colored arcade UI — level shields, rainbow XP bars, adventure-map learning paths, and a floating mobile dock. The code editor and console stay dark for readability while the rest of the app stays bright and playful.

## Scripts

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env.local` and set:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. In the Supabase SQL editor, run `supabase/schema.sql`.
4. Restart `npm run dev`.

Email/password auth then saves profiles, XP, streaks, and completions. The leaderboard reads the `profiles` table. Without those keys, the app stays in a browser demo and the leaderboard mixes your score with sample rivals.

If email confirmation is enabled in Supabase, sign-up asks the player to confirm before logging in.

## Code checks

Run and Submit call `POST /api/execute`, which runs code on the public [Wandbox](https://wandbox.org) sandbox. A check is marked passed only when that run matches the lesson or challenge. If the sandbox cannot be reached, the API returns an error and nothing is awarded.

## Adding a language

1. Add the language id in `lib/types.ts`.
2. Add worlds, chapters, and lessons beside `lib/curriculum/python.ts`.
3. Register them in `lib/curriculum/index.ts`.
4. Map the language to a Wandbox compiler in `lib/execute/sandbox.ts`.
