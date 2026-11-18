# Dev Ladder

A bright, game-like academy for learning Python and JavaScript. Lessons, quests, and coding challenges award XP. Progress is stored in the browser until Supabase is connected.

**Live site:** [https://devladder.vercel.app](https://devladder.vercel.app)

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

3. In the Supabase SQL editor, run `supabase/all-in-one-setup.sql` for the complete schema.
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

## Learning planner

Open `/learning` from the dashboard or navigation for the rolling seven-day summary, guide practice coverage, mini-project workshop, and JSON backup download. Project work is saved explicitly on this device; checklists are self-assessed and award no XP. Backups are exports for your records; automatic restoration is not implemented.

The `/review` queue links to the exact missed question using `?question=N#practice`. Verified practice passes advance due reviews by 1, 3, 7, 14, then 30 days. Another failed attempt resets the interval. Early repeat passes do not advance the schedule. Guide practice and review data remain browser-local under the existing storage model.

Run `node scripts/test-learning.mjs` and `node scripts/test-grade-stream.mjs` for learning and grading regression checks. Typography uses system font stacks so production builds do not require Google Fonts access.

The development and build scripts use Webpack to avoid a Turbopack CSS-worker startup failure on this Windows setup.

## Developer lab

Open `/lab` from the dashboard, navigation, or learning planner.

- **Debug Detective:** six JavaScript bug investigations graded through the existing Wandbox sandbox. Test passes alone do not award lab completion: answer both concept questions and save a written reflection (30–2000 characters). Written reflections are retained, not semantically graded.
- **Code Time Machine:** three supported programs (positive-number sum, function calls, recursive factorial), editable bounded inputs, immutable variable/stack/output snapshots, stepping, rewind, and playback. It is not an arbitrary-code debugger.
- **Adaptive boss:** three debugging rounds ranked by missed guide concepts, failed lab submissions, and prior lab completions. Hints decrease with completed work in that concept. The roster and round are saved per browser player; replaying does not duplicate first-clear XP.
- **Project evolution:** a task tracker built in three sequential, tested milestones. Earlier source is carried into the next starter. The final task reducer can run in the portfolio demo.
- **Co-op:** signed-in pairs use private Supabase rooms, driver-only saves, reviewer feedback and role handoffs, five-second polling, seven-day room expiry, and optimistic revision checks. Unsaved drafts are preserved when a newer room revision arrives. A passing test preview is required by the UI before peer approval; peer review is not a credential or XP award.
- **Practice portfolio:** explicitly select completed records and optionally source, preview, and download a standalone HTML page. Source is excluded by default. The final project demo runs in a sandboxed iframe/worker with no network and a 1.5-second timeout. Exported evidence is learner-managed and is not independently signed or certified. No automatic hosting/publication occurs.

Solo evidence, failed-attempt counts, and boss progress use `devladder.lab.<player-id>.v1` browser storage and are included in learning backups. Lab editor drafts are also separated by player ID. These local records do not yet sync through `learning_state`.

For co-op, run **either** `supabase/developer-lab.sql` on an existing database **or** the updated `supabase/all-in-one-setup.sql`. No new secret environment variables are required. Co-op RPCs use explicit auth/role checks, a pinned search path, and revision-checked writes; direct authenticated table writes are not granted. Reference: [Supabase database functions](https://supabase.com/docs/guides/database/functions) and [PostgreSQL row locking](https://www.postgresql.org/docs/17/explicit-locking.html).

`npm test` runs learning, stream, and developer-lab regressions. Lab tests execute fixed reference fixtures locally to check integration with the grading harness; they do not replace a live two-account Supabase integration test. The SQL migration is supplied but not applied automatically to a remote database.

## Workspace UI and page tutorials

The internal workspace uses a scoped workbench design system using the original indigo/violet palette in `app/(play)/workspace.css`. It applies to the signed-in/demo workspace only; login, signup, password-reset, and public landing layouts retain their existing styling.

Desktop uses numbered Learn / Practice / Build / Reflect navigation groups instead of a sidebar. Below 1024px, a native-dialog navigation menu and a single five-item mobile bar replace it. Ctrl+K / Cmd+K opens quick page navigation. Every workspace route has a contextual page guide and a short, keyboard-accessible tutorial. `/help` contains the searchable user manual. Tutorial read status is stored per player on this browser; it does not award XP and needs no new database table.

Performance work removes the old continuously scrolling card lanes, duplicate cards, decorative workspace animation, and eager assistant loading. Guide lookup uses indexes, continuing a guide reads stored progress once, large catalog filtering uses a deferred query and mounts at most 60 rows per page, and co-op/presence polling pauses while the document is hidden. Workspace navigation does not eagerly prefetch every destination. These changes reduce unnecessary work; actual loading and grading times still depend on device, network, hosting, Supabase, and the external code sandbox.

For existing databases, the UI/tutorial changes require no SQL changes. The current complete setup remains `supabase/all-in-one-setup.sql`, including private learning storage and the Developer Lab co-op migration. This file is prepared for Supabase SQL Editor; it is not executed automatically.

Local preview builds can set `DEVLADDER_BUILD_DIR` to a separate directory such as `.next/ui-preview` to avoid disturbing an active development server. Keep the normal build environment for deployment. Local demo QA uses process-only blank Supabase settings and does not alter environment files or production authentication.
