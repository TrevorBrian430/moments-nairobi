import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { Pool } from "pg";
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

const seed: StoreData = { products: PRODUCTS, categories: CATEGORIES, orders: [], idempotency: {} };
let database: DatabaseSync | undefined;
let pool: Pool | undefined;
let initialization: Promise<void> | undefined;

function getPool() {
  if (pool) return pool;
  const connectionString = process.env.MOMENTS_NAIROBI_DATABASE_URL_POOLED
    || process.env.MOMENTS_NAIROBI_POSTGRES_URL
    || process.env.MOMENTS_NAIROBI_PRISMA_DATABASE_URL;
  if (!connectionString) {
    if (process.env.VERCEL === "1") {
      throw new Error("Set MOMENTS_NAIROBI_DATABASE_URL_POOLED for this Vercel deployment.");
    }
    return undefined;
  }
  pool = new Pool({ connectionString, max: 4, connectionTimeoutMillis: 5000 });
  pool.on("error", (error: NodeJS.ErrnoException) => {
    console.error("Idle Postgres connection error", error.code ?? error.name);
  });
  return pool;
}

async function initializePostgres(pool: Pool) {
  if (!initialization) {
    initialization = (async () => {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        await client.query("SELECT pg_advisory_xact_lock(1643990201)");
        await client.query(`
          CREATE TABLE IF NOT EXISTS moments_store (
            id INTEGER PRIMARY KEY, data JSONB NOT NULL
          );
          CREATE TABLE IF NOT EXISTS moments_admin_login (
            id INTEGER PRIMARY KEY, expires BIGINT NOT NULL, attempts INTEGER NOT NULL
          );
        `);
        await client.query(
          "INSERT INTO moments_store (id, data) VALUES (1, $1::jsonb) ON CONFLICT (id) DO NOTHING",
          [JSON.stringify(seed)],
        );
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK").catch(() => undefined);
        throw error;
      } finally {
        client.release();
      }
    })().catch((error) => {
      initialization = undefined;
      throw error;
    });
  }
  await initialization;
}

function getSqlite() {
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
  db.prepare("INSERT OR IGNORE INTO store VALUES (1, ?)").run(JSON.stringify(seed));
  database = db;
  return db;
}

function withCategories(data: StoreData): StoreData {
  return { ...data, categories: data.categories ?? CATEGORIES.map((category) => ({ ...category })) };
}

function readSqlite(db: DatabaseSync) {
  const row = db.prepare("SELECT data FROM store WHERE id = 1").get();
  return withCategories(JSON.parse(row!.data as string));
}

export async function readStore(): Promise<StoreData> {
  const pool = getPool();
  if (!pool) return readSqlite(getSqlite());
  await initializePostgres(pool);
  const { rows } = await pool.query<{ data: StoreData }>("SELECT data FROM moments_store WHERE id = 1");
  return withCategories(rows[0].data);
}

export async function updateStore<T>(update: (data: StoreData) => T): Promise<T> {
  const pool = getPool();
  if (pool) {
    await initializePostgres(pool);
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const { rows } = await client.query<{ data: StoreData }>(
        "SELECT data FROM moments_store WHERE id = 1 FOR UPDATE",
      );
      const data = withCategories(rows[0].data);
      const result = update(data);
      await client.query("UPDATE moments_store SET data = $1::jsonb WHERE id = 1", [JSON.stringify(data)]);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK").catch(() => undefined);
      throw error;
    } finally {
      client.release();
    }
  }

  const db = getSqlite();
  db.exec("BEGIN IMMEDIATE");
  try {
    const data = readSqlite(db);
    const result = update(data);
    db.prepare("UPDATE store SET data = ? WHERE id = 1").run(JSON.stringify(data));
    db.exec("COMMIT");
    return result;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export async function allowLoginAttempt() {
  const now = Date.now();
  const expires = now + 60_000;
  const pool = getPool();
  if (pool) {
    await initializePostgres(pool);
    const { rows } = await pool.query<{ attempts: number }>(`
      INSERT INTO moments_admin_login VALUES (1, $1, 1)
      ON CONFLICT(id) DO UPDATE SET
        attempts = CASE WHEN moments_admin_login.expires <= $2 THEN 1 ELSE moments_admin_login.attempts + 1 END,
        expires = CASE WHEN moments_admin_login.expires <= $2 THEN excluded.expires ELSE moments_admin_login.expires END
      RETURNING attempts
    `, [expires, now]);
    return rows[0].attempts <= 12;
  }
  const row = getSqlite().prepare(`
    INSERT INTO admin_login VALUES (1, ?, 1)
    ON CONFLICT(id) DO UPDATE SET
      attempts = CASE WHEN expires <= ? THEN 1 ELSE attempts + 1 END,
      expires = CASE WHEN expires <= ? THEN excluded.expires ELSE expires END
    RETURNING attempts
  `).get(expires, now, now);
  return Number(row!.attempts) <= 12;
}
