import type { GuideLesson, GuideTopicId } from "@/lib/guides/types";

type DbProfile = {
  id: GuideTopicId;
  name: string;
  kind: "sql" | "document" | "platform";
  what: string;
  usedFor: string[];
  connect: string;
  createExample: string;
  selectExample: string;
  insertExample: string;
  joinExample?: string;
  special: string;
};

function buildDatabaseCourse(cfg: DbProfile): GuideLesson[] {
  const { id, name } = cfg;
  const isSql = cfg.kind === "sql" || cfg.id === "mysql" || cfg.id === "postgresql" || cfg.id === "sqlite" || cfg.id === "supabase";
  const isMongo = cfg.id === "mongodb";

  return [
    {
      slug: "what-is-a-database",
      topicId: id,
      title: "What is a database?",
      summary: "Why apps need databases and how data is stored.",
      minutes: 8,
      order: 1,
      blocks: [
        { type: "p", text: "A database stores data that must survive after you close the app — users, scores, posts, orders. Without it, everything resets when the page reloads." },
        { type: "p", text: `${name}: ${cfg.what}` },
        { type: "p", text: `Used for: ${cfg.usedFor.join(", ")}.` },
        { type: "ul", items: [
          "SQL databases — tables with rows and columns (MySQL, PostgreSQL, SQLite)",
          "Document databases — flexible JSON-like records (MongoDB)",
          "Platforms — database + auth + APIs together (Supabase)",
        ] },
        { type: "p", text: "Think of a database like a digital filing cabinet. Your app reads and writes files (records) through queries." },
      ],
    },
    {
      slug: "tables-and-structure",
      topicId: id,
      title: isMongo ? "Collections and documents" : "Tables, rows, and columns",
      summary: isMongo ? "How MongoDB organizes data." : "How relational data is organized.",
      minutes: 10,
      order: 2,
      blocks: isMongo
        ? [
            { type: "p", text: "MongoDB stores documents (like JSON objects) inside collections. A collection is similar to a table, but each document can have slightly different fields." },
            { type: "code", caption: "Example document", code: '{\n  "_id": "abc123",\n  "username": "alex",\n  "level": 5,\n  "badges": ["starter", "streak-7"]\n}' },
            { type: "p", text: "Good for apps that change shape often — user profiles, product catalogs, game saves." },
          ]
        : [
            { type: "p", text: "A table is like a spreadsheet. Columns are fields (name, email, xp). Each row is one record (one user)." },
            { type: "p", text: "Primary key — a unique ID for each row. Foreign key — links rows between tables (user_id in a scores table)." },
            { type: "code", caption: "users table (concept)", code: "| id | username | xp  |\n|----|----------|-----|\n| 1  | alex     | 120 |\n| 2  | sam      | 85  |" },
            { type: "p", text: "Plan tables before coding. Ask: what things exist? How do they relate?" },
          ],
    },
    {
      slug: "creating-data",
      topicId: id,
      title: "Creating tables or collections",
      summary: "Set up where your data lives.",
      minutes: 11,
      order: 3,
      blocks: [
        { type: "p", text: "Before inserting data, you define structure. SQL uses CREATE TABLE. MongoDB creates collections automatically when you insert." },
        { type: "code", caption: "Create structure", code: cfg.createExample },
        { type: "p", text: cfg.special },
      ],
    },
    {
      slug: "reading-data",
      topicId: id,
      title: "Reading data (SELECT / find)",
      summary: "Fetch the records you need.",
      minutes: 12,
      order: 4,
      blocks: [
        { type: "p", text: "Apps read data constantly: show profile, load leaderboard, search products. Queries filter what comes back." },
        { type: "code", caption: "Read examples", code: cfg.selectExample },
        {
          type: "ul",
          items: isMongo
            ? ["filter — match documents", "sort — order results", "limit — only get N documents", "Index fields you query often"]
            : cfg.kind === "platform"
              ? [".select() — choose columns", ".eq() / filters — match rows", ".order() — sort results", "Use indexes on columns you search often"]
              : ["WHERE — filter rows", "ORDER BY — sort results", "LIMIT — only get N rows", "Use indexes on columns you search often"],
        },
      ],
    },
    {
      slug: "writing-data",
      topicId: id,
      title: "Insert, update, and delete",
      summary: "Add, change, and remove records safely.",
      minutes: 12,
      order: 5,
      blocks: [
        {
          type: "p",
          text: isMongo
            ? "insertOne adds documents. updateOne and updateMany change fields. deleteOne removes them. Double-check your filter — a broad filter can change more than you intend."
            : cfg.kind === "platform"
              ? "Use insert or upsert to add records, update to change them, and delete to remove them. Under the hood this is still SQL — always double-check filters before bulk changes."
              : "INSERT adds new rows. UPDATE changes existing ones. DELETE removes them. Always double-check your WHERE clause — a missing WHERE can wipe a whole table.",
        },
        { type: "code", caption: "Write examples", code: cfg.insertExample },
        { type: "p", text: "In real apps, use transactions when multiple writes must succeed together (transfer coins between two users)." },
      ],
    },
    {
      slug: "relationships",
      topicId: id,
      title: isMongo ? "Embedding vs referencing" : "Relationships and JOINs",
      summary: "Connect related data together.",
      minutes: 13,
      order: 6,
      blocks: isMongo
        ? [
            { type: "p", text: "Embed data inside a document when it's always loaded together (address inside user). Reference by ID when data is large or shared (user_id in posts)." },
            { type: "code", caption: "Reference pattern", code: '// Post document\n{\n  "title": "Hello",\n  "authorId": "user_abc123"\n}\n\n// Load author separately\ndb.users.findOne({ _id: "user_abc123" })' },
          ]
        : [
            { type: "p", text: "Real data is connected: users have many posts. SQL uses JOIN to combine tables in one query." },
            { type: "code", caption: "JOIN example", code: cfg.joinExample ?? "SELECT users.username, scores.points\nFROM users\nJOIN scores ON scores.user_id = users.id\nWHERE scores.points > 100;" },
            { type: "p", text: "One-to-many: one user, many lessons completed. Many-to-many: students and classes (needs a link table)." },
          ],
    },
    {
      slug: "connecting-from-code",
      topicId: id,
      title: "Connect from your app",
      summary: "How programs talk to the database.",
      minutes: 11,
      order: 7,
      blocks: [
        { type: "p", text: "Your app does not store passwords in code on GitHub. Use environment variables (.env) for connection strings." },
        { type: "code", caption: "Connection pattern", code: cfg.connect },
        { type: "ul", items: [
          "Never expose database passwords in the browser",
          "Use an ORM or query builder when possible",
          "Validate user input before queries (prevent SQL injection)",
        ] },
      ],
    },
    {
      slug: "production-tips",
      topicId: id,
      title: "Best practices & next steps",
      summary: "Backups, security, and growing your skills.",
      minutes: 9,
      order: 8,
      blocks: [
        { type: "p", text: "Databases hold your users' data. Treat them with care." },
        { type: "ul", items: [
          "Back up regularly — automated daily snapshots in production",
          "Use least privilege — app account should not be admin",
          "Index columns you filter and sort on",
          "Test queries on small data before running on millions of rows",
          "Learn EXPLAIN / query plans when things get slow",
        ] },
        { type: "p", text: `You now understand ${name} at a beginner level. Practice by building a small app: todo list, quiz scores, or user profiles with real storage.` },
      ],
    },
  ];
}

const DATABASE_PROFILES: DbProfile[] = [
  {
    id: "sql",
    name: "SQL",
    kind: "sql",
    what: "The standard language for talking to relational databases. Same ideas work in MySQL, PostgreSQL, and SQLite.",
    usedFor: ["any app with structured data", "reports", "analytics", "banking and e-commerce"],
    connect: '-- SQL runs inside your database tool or app driver\n-- Example (conceptual):\nconst rows = await db.query(\n  "SELECT * FROM users WHERE id = $1",\n  [userId]\n);',
    createExample: "CREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  username VARCHAR(50) NOT NULL,\n  xp INTEGER DEFAULT 0,\n  created_at TIMESTAMP DEFAULT NOW()\n);",
    selectExample: "SELECT username, xp\nFROM users\nWHERE xp > 100\nORDER BY xp DESC\nLIMIT 10;",
    insertExample: "INSERT INTO users (username, xp) VALUES ('alex', 50);\n\nUPDATE users SET xp = xp + 10 WHERE username = 'alex';\n\nDELETE FROM users WHERE id = 99;",
    joinExample: "SELECT users.username, lessons.title\nFROM users\nJOIN completions ON completions.user_id = users.id\nJOIN lessons ON lessons.id = completions.lesson_id;",
    special: "SQL is declarative — you describe what you want, the database figures out how to get it.",
  },
  {
    id: "mysql",
    name: "MySQL",
    kind: "sql",
    what: "The world's most popular open-source SQL database. Powers WordPress, many PHP apps, and countless websites.",
    usedFor: ["websites", "WordPress", "LAMP stack (Linux, Apache, MySQL, PHP)"],
    connect: "const mysql = require('mysql2/promise');\n\nconst pool = mysql.createPool({\n  host: process.env.DB_HOST,\n  user: process.env.DB_USER,\n  password: process.env.DB_PASS,\n  database: 'codequest'\n});\n\nconst [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);",
    createExample: "CREATE TABLE players (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  username VARCHAR(32) NOT NULL UNIQUE,\n  xp INT DEFAULT 0\n) ENGINE=InnoDB;",
    selectExample: "SELECT username, xp FROM players ORDER BY xp DESC LIMIT 20;",
    insertExample: "INSERT INTO players (username) VALUES ('newbie');\nUPDATE players SET xp = xp + 25 WHERE id = 1;",
    joinExample: "SELECT p.username, COUNT(c.id) AS lessons_done\nFROM players p\nLEFT JOIN completions c ON c.player_id = p.id\nGROUP BY p.id;",
    special: "MySQL uses AUTO_INCREMENT for IDs. Use InnoDB for foreign keys and transactions.",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    kind: "sql",
    what: "A powerful open-source SQL database with advanced features — JSON columns, full-text search, and strict data integrity.",
    usedFor: ["startups", "SaaS products", "geographic data", "complex queries"],
    connect: "import pg from 'pg';\n\nconst pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });\nconst result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);",
    createExample: "CREATE TABLE profiles (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  username TEXT NOT NULL UNIQUE,\n  meta JSONB DEFAULT '{}'::jsonb\n);",
    selectExample: "SELECT username, meta->>'rank' AS rank\nFROM profiles\nWHERE (meta->>'level')::int >= 5;",
    insertExample: "INSERT INTO profiles (username) VALUES ('alex');\nUPDATE profiles SET meta = jsonb_set(meta, '{xp}', '100') WHERE username = 'alex';",
    joinExample: "SELECT u.username, s.streak\nFROM profiles u\nINNER JOIN streaks s ON s.user_id = u.id;",
    special: "PostgreSQL is what Supabase uses under the hood. Great default for new projects.",
  },
  {
    id: "sqlite",
    name: "SQLite",
    kind: "sql",
    what: "A full SQL database stored in a single file on disk. No server to install — perfect for learning and small apps.",
    usedFor: ["mobile apps", "browser extensions", "prototypes", "offline-first tools"],
    connect: "import Database from 'better-sqlite3';\n\nconst db = new Database('app.db');\nconst user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);",
    createExample: "CREATE TABLE IF NOT EXISTS notes (\n  id INTEGER PRIMARY KEY AUTOINCREMENT,\n  title TEXT NOT NULL,\n  body TEXT\n);",
    selectExample: "SELECT * FROM notes WHERE title LIKE '%study%' ORDER BY id DESC;",
    insertExample: "INSERT INTO notes (title, body) VALUES ('Day 1', 'Learned SQL');\nDELETE FROM notes WHERE id = 3;",
    special: "SQLite is serverless — your app reads/writes the file directly. One writer at a time.",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    kind: "document",
    what: "A NoSQL database that stores BSON documents (like JSON). Flexible schema — great for fast-moving apps.",
    usedFor: ["content feeds", "catalogs", "IoT data", "MEAN/MERN stacks"],
    connect: "import { MongoClient } from 'mongodb';\n\nconst client = new MongoClient(process.env.MONGO_URL);\nconst db = client.db('codequest');\nconst user = await db.collection('users').findOne({ _id: id });",
    createExample: "// Collections are created on first insert\ndb.users.insertOne({\n  username: 'alex',\n  xp: 0,\n  badges: []\n});",
    selectExample: "db.users.find({ xp: { $gte: 100 } })\n  .sort({ xp: -1 })\n  .limit(10);",
    insertExample: "db.users.updateOne(\n  { username: 'alex' },\n  { $inc: { xp: 10 } }\n);\n\ndb.users.deleteOne({ username: 'old_account' });",
    special: "Use $set, $inc, $push operators to update parts of a document without replacing the whole thing.",
  },
  {
    id: "supabase",
    name: "Supabase",
    kind: "platform",
    what: "Open-source Firebase alternative. Gives you PostgreSQL, authentication, file storage, and auto-generated APIs.",
    usedFor: ["web and mobile apps", "user login", "real-time features", "CodeQuest account sync"],
    connect: "import { createClient } from '@supabase/supabase-js';\n\nconst supabase = createClient(\n  process.env.NEXT_PUBLIC_SUPABASE_URL,\n  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY\n);\n\nconst { data } = await supabase\n  .from('profiles')\n  .select('username, xp')\n  .eq('id', userId);",
    createExample: "-- In Supabase SQL editor:\nCREATE TABLE profiles (\n  id UUID REFERENCES auth.users PRIMARY KEY,\n  username TEXT UNIQUE,\n  xp INT DEFAULT 0\n);\n\n-- Enable Row Level Security (RLS)\nALTER TABLE profiles ENABLE ROW LEVEL SECURITY;",
    selectExample: "// From JavaScript — no raw SQL needed\nconst { data, error } = await supabase\n  .from('profiles')\n  .select('*')\n  .order('xp', { ascending: false });",
    insertExample: "const { error } = await supabase\n  .from('profiles')\n  .upsert({ id: user.id, username: 'alex', xp: 50 });",
    joinExample: "const { data } = await supabase\n  .from('completions')\n  .select('*, lessons(title)')\n  .eq('user_id', userId);",
    special: "CodeQuest uses Supabase when you sign up — your XP and progress can sync across devices. In demo mode, data stays in the browser only.",
  },
];

export const generatedDatabaseGuides: GuideLesson[] = DATABASE_PROFILES.flatMap(buildDatabaseCourse);
