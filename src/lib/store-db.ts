import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { CATEGORIES, PRODUCTS, type Category, type Product } from "@/lib/constants";
import type { ServerOrder } from "@/lib/server-orders";

interface StoreData {
  products: Product[];
  categories: Category[];
  orders: ServerOrder[];
  idempotency: Record<string, string>;
  manualIdempotency?: Record<string, string>;
  deliveryFees?: Record<string, number>;
}

let database: DatabaseSync | undefined;

function getDatabase() {
  if (database) return database;
  const path = resolve(/* turbopackIgnore: true */ process.env.MOMENTS_DB_PATH || ".data/store.sqlite");
  mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec(`
    PRAGMA busy_timeout = 5000;
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS store (id INTEGER PRIMARY KEY, data TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS admin_login (id INTEGER PRIMARY KEY, expires INTEGER NOT NULL, attempts INTEGER NOT NULL);
  `);
  db.prepare("INSERT OR IGNORE INTO store VALUES (1, ?)").run(
    JSON.stringify({ products: PRODUCTS, categories: CATEGORIES, orders: [], idempotency: {} }),
  );
  database = db;
  return db;
}

export function readStore(): StoreData {
  const row = getDatabase().prepare("SELECT data FROM store WHERE id = 1").get();
  const data = JSON.parse(row!.data as string) as StoreData;
  return { ...data, categories: data.categories ?? CATEGORIES.map((category) => ({ ...category })) };
}

export function updateStore<T>(update: (data: StoreData) => T): T {
  const db = getDatabase();
  db.exec("BEGIN IMMEDIATE");
  try {
    const data = readStore();
    const result = update(data);
    db.prepare("UPDATE store SET data = ? WHERE id = 1").run(JSON.stringify(data));
    db.exec("COMMIT");
    return result;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function allowLoginAttempt() {
  const now = Date.now();
  const row = getDatabase().prepare(`
    INSERT INTO admin_login VALUES (1, ?, 1)
    ON CONFLICT(id) DO UPDATE SET
      attempts = CASE WHEN expires <= ? THEN 1 ELSE attempts + 1 END,
      expires = CASE WHEN expires <= ? THEN excluded.expires ELSE expires END
    RETURNING attempts
  `).get(now + 60_000, now, now);
  return Number(row!.attempts) <= 12;
}
