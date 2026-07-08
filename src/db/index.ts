import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbFile = path.join(process.cwd(), 'school.db');
const db = new Database(dbFile);

// Enable WAL for performance
db.pragma('journal_mode = WAL');

// Read and execute schema
const initSqlPath = path.join(process.cwd(), 'src', 'db', 'init.sql');
const initSql = fs.readFileSync(initSqlPath, 'utf8');
db.exec(initSql);

// Seed admin if not exists
const checkAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@ecole.fr');
if (!checkAdmin) {
    const hash = bcrypt.hashSync('admin123', 10);
    const insertAdmin = db.prepare(`
        INSERT INTO users (first_name, last_name, gender, dob, phone, email, password, role)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertAdmin.run('Admin', 'Super', 'M', '1980-01-01', '0102030405', 'admin@ecole.fr', hash, 'admin');
}

export default db;
