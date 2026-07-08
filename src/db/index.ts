import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : { rejectUnauthorized: false }
});

const db = {
  prepare: (sql) => {
    let count = 1;
    const pgSql = sql.replace(/\?/g, () => '$' + (count++));
    return {
      get: async (...args) => {
        const { rows } = await pool.query(pgSql, args);
        return rows[0];
      },
      all: async (...args) => {
        const { rows } = await pool.query(pgSql, args);
        return rows;
      },
      run: async (...args) => {
        await pool.query(pgSql, args);
        return {};
      }
    };
  },
  exec: async (sql) => {
    // Postgres doesn't easily run multiple statements separated by ';' via prepare if it has parameters,
    // but exec is just raw query
    await pool.query(sql);
  }
};

export const initializeDB = async () => {
  if (!process.env.DATABASE_URL) {
    console.log("No DATABASE_URL provided. Cannot initialize Postgres.");
    return;
  }
  
  // Read and execute schema
  const initSqlPath = path.join(process.cwd(), 'src', 'db', 'init.sql');
  const initSql = fs.readFileSync(initSqlPath, 'utf8');
  
  try {
    await db.exec(initSql);
    
    // Seed admin if not exists
    const checkAdmin = await db.prepare('SELECT id FROM users WHERE email = $1').get('admin@ecole.fr');
    if (!checkAdmin) {
      const hash = bcrypt.hashSync('admin123', 10);
      await db.prepare(`
        INSERT INTO users (first_name, last_name, gender, dob, phone, email, password, role)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `).run('Admin', 'Super', 'M', '1980-01-01', '0102030405', 'admin@ecole.fr', hash, 'admin');
    }
    console.log("Database initialized successfully");
  } catch (err) {
    console.error("DB Initialization error:", err);
  }
};

export default db;
