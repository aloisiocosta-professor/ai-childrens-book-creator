import pg from "pg";
const { Pool } = pg;

export function createStore(config = process.env) {
  const memory = new Map();
  if (!config.DATABASE_URL) {
    return {
      persistent: false,
      async initialize() {},
      async save(book) { memory.set(book.id, structuredClone(book)); },
      async get(id) { return structuredClone(memory.get(id) || null); }
    };
  }
  const pool = new Pool({
    connectionString: config.DATABASE_URL,
    ssl: config.DATABASE_SSL === "false" ? false : { rejectUnauthorized: true },
    max: 5
  });
  return {
    persistent: true,
    async initialize() {
      await pool.query(`CREATE TABLE IF NOT EXISTS books (
        id UUID PRIMARY KEY,
        payload JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`);
    },
    async save(book) {
      await pool.query(
        "INSERT INTO books (id, payload) VALUES ($1, $2::jsonb) ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()",
        [book.id, JSON.stringify(book)]
      );
    },
    async get(id) {
      const { rows } = await pool.query("SELECT payload FROM books WHERE id = $1", [id]);
      return rows[0]?.payload || null;
    },
    async close() { await pool.end(); }
  };
}
