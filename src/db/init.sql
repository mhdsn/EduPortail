CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  gender TEXT NOT NULL,
  dob DATE NOT NULL,
  phone TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'student',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fields (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS levels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS academic_years (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  year_range TEXT NOT NULL,
  is_active INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  
  -- Personal infos (could differ slightly from user profile or be updated)
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  gender TEXT NOT NULL,
  dob DATE NOT NULL,
  nationality TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,

  -- Academic infos
  last_diploma TEXT NOT NULL,
  previous_school TEXT NOT NULL,
  graduation_year TEXT NOT NULL,
  average_grade REAL NOT NULL,

  -- Choices
  field_id INTEGER,
  level_id INTEGER,
  academic_year TEXT,

  -- Documents
  photo_path TEXT,
  birth_certificate_path TEXT,
  diploma_path TEXT,
  transcript_path TEXT,
  id_card_path TEXT,

  status TEXT DEFAULT 'Brouillon', -- Brouillon, Soumis, En attente, Validé, Refusé
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (field_id) REFERENCES fields (id),
  FOREIGN KEY (level_id) REFERENCES levels (id)
  
);

CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  receipt_number TEXT NOT NULL,
  payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications (id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  is_read INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Seed basic data
INSERT INTO fields (name) SELECT 'Informatique' WHERE NOT EXISTS (SELECT 1 FROM fields WHERE name='Informatique');
INSERT INTO fields (name) SELECT 'Gestion' WHERE NOT EXISTS (SELECT 1 FROM fields WHERE name='Gestion');
INSERT INTO fields (name) SELECT 'Génie Civil' WHERE NOT EXISTS (SELECT 1 FROM fields WHERE name='Génie Civil');
INSERT INTO fields (name) SELECT 'Droit' WHERE NOT EXISTS (SELECT 1 FROM fields WHERE name='Droit');
INSERT INTO fields (name) SELECT 'Sciences Économiques' WHERE NOT EXISTS (SELECT 1 FROM fields WHERE name='Sciences Économiques');
INSERT INTO fields (name) SELECT 'Lettres Modernes' WHERE NOT EXISTS (SELECT 1 FROM fields WHERE name='Lettres Modernes');
INSERT INTO fields (name) SELECT 'Médecine' WHERE NOT EXISTS (SELECT 1 FROM fields WHERE name='Médecine');
INSERT INTO fields (name) SELECT 'Pharmacie' WHERE NOT EXISTS (SELECT 1 FROM fields WHERE name='Pharmacie');
INSERT INTO fields (name) SELECT 'Agronomie' WHERE NOT EXISTS (SELECT 1 FROM fields WHERE name='Agronomie');

INSERT INTO levels (name) SELECT 'Licence 1' WHERE NOT EXISTS (SELECT 1 FROM levels WHERE name='Licence 1');
INSERT INTO levels (name) SELECT 'Licence 2' WHERE NOT EXISTS (SELECT 1 FROM levels WHERE name='Licence 2');
INSERT INTO levels (name) SELECT 'Licence 3' WHERE NOT EXISTS (SELECT 1 FROM levels WHERE name='Licence 3');
INSERT INTO levels (name) SELECT 'Master 1' WHERE NOT EXISTS (SELECT 1 FROM levels WHERE name='Master 1');
INSERT INTO levels (name) SELECT 'Master 2' WHERE NOT EXISTS (SELECT 1 FROM levels WHERE name='Master 2');
INSERT INTO levels (name) SELECT 'Doctorat' WHERE NOT EXISTS (SELECT 1 FROM levels WHERE name='Doctorat');

INSERT INTO academic_years (year_range, is_active) SELECT '2024-2025', 1 WHERE NOT EXISTS (SELECT 1 FROM academic_years WHERE year_range='2024-2025');

-- Add an admin user (password: admin123)
-- Hash generated via bcrypt: $2a$10$Xm5Rj5O5/1R5Rj5O5/1R5O5/1R5O5/1R5O5/1R5O5/1R5O5/1R5O5 (placeholder, will use real in seed)
