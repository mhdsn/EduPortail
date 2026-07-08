import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import db from './src/db/index.js'; // Ensure .js extension for ESM

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-eduportail';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use('/uploads', express.static(uploadsDir));

  // --- Auth Middleware ---
  const authMiddleware = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token manquant' });
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: 'Token invalide' });
      req.user = user;
      next();
    });
  };

  const adminMiddleware = (req: any, res: any, next: any) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Accès refusé' });
    next();
  };

  // --- API Routes ---

  // Auth: Register
  app.post('/api/auth/register', (req, res) => {
    const { first_name, last_name, gender, dob, phone, email, password } = req.body;
    try {
      const hash = bcrypt.hashSync(password, 10);
      const stmt = db.prepare(`
        INSERT INTO users (first_name, last_name, gender, dob, phone, email, password, role)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'student')
      `);
      const info = stmt.run(first_name, last_name, gender, dob, phone, email, hash);
      res.json({ message: 'Compte créé avec succès', userId: info.lastInsertRowid });
    } catch (error: any) {
      if (error.message.includes('UNIQUE')) {
        res.status(400).json({ error: 'Cet email est déjà utilisé' });
      } else {
        res.status(500).json({ error: 'Erreur lors de la création du compte' });
      }
    }
  });

  // Auth: Login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign({ id: user.id, role: user.role, name: `${user.first_name} ${user.last_name}` }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, first_name: user.first_name, last_name: user.last_name, role: user.role } });
  });

  // Common: Get referentials
  app.get('/api/referentials', (req, res) => {
    const fields = db.prepare('SELECT * FROM fields').all();
    const levels = db.prepare('SELECT * FROM levels').all();
    const academicYears = db.prepare('SELECT * FROM academic_years WHERE is_active = 1').all();
    res.json({ fields, levels, academicYears });
  });

  // Student: Get profile & applications
  app.get('/api/student/dashboard', authMiddleware, (req: any, res) => {
    const user = db.prepare('SELECT id, first_name, last_name, email, phone FROM users WHERE id = ?').get(req.user.id);
    const applications = db.prepare(`
      SELECT a.*, f.name as field_name, l.name as level_name
      FROM applications a
      LEFT JOIN fields f ON a.field_id = f.id
      LEFT JOIN levels l ON a.level_id = l.id
      WHERE a.user_id = ?
    `).all(req.user.id);
    const notifications = db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    const payments = db.prepare(`
      SELECT p.* FROM payments p 
      JOIN applications a ON p.application_id = a.id 
      WHERE a.user_id = ?
    `).all(req.user.id);

    res.json({ user, applications, notifications, payments });
  });

  // Student: Create or update application (Uploads)
  app.post('/api/student/application', authMiddleware, upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'birth_certificate', maxCount: 1 },
    { name: 'diploma', maxCount: 1 },
    { name: 'transcript', maxCount: 1 },
    { name: 'id_card', maxCount: 1 }
  ]), (req: any, res) => {
    try {
      const {
      first_name, last_name, gender, dob, nationality, address, phone, email,
      last_diploma, previous_school, graduation_year, average_grade,
      field_id, level_id, academic_year
    } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    // Existing application?
    const existing = db.prepare('SELECT * FROM applications WHERE user_id = ?').get(req.user.id) as any;

    const getPath = (fieldname: string) => files?.[fieldname]?.[0]?.filename || (existing ? existing[fieldname + '_path'] : null);

    const data = [
      first_name, last_name, gender, dob, nationality, address, phone, email,
      last_diploma, previous_school, graduation_year, average_grade,
      field_id, level_id, academic_year,
      getPath('photo'), getPath('birth_certificate'), getPath('diploma'), getPath('transcript'), getPath('id_card'),
      'Soumis'
    ];

    if (existing) {
      db.prepare(`
        UPDATE applications SET 
          first_name=?, last_name=?, gender=?, dob=?, nationality=?, address=?, phone=?, email=?,
          last_diploma=?, previous_school=?, graduation_year=?, average_grade=?,
          field_id=?, level_id=?, academic_year=?,
          photo_path=?, birth_certificate_path=?, diploma_path=?, transcript_path=?, id_card_path=?,
          status=?, updated_at=CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(...data, existing.id);
    } else {
      db.prepare(`
        INSERT INTO applications (
          user_id, first_name, last_name, gender, dob, nationality, address, phone, email,
          last_diploma, previous_school, graduation_year, average_grade,
          field_id, level_id, academic_year,
          photo_path, birth_certificate_path, diploma_path, transcript_path, id_card_path, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(req.user.id, ...data);
    }

    db.prepare('INSERT INTO notifications (user_id, message) VALUES (?, ?)').run(req.user.id, 'Votre dossier a été soumis avec succès.');
    res.json({ message: 'Dossier soumis' });
    } catch (error: any) {
      console.error("Error submitting application:", error);
      res.status(500).json({ error: error.message || 'Erreur lors de la soumission du dossier' });
    }
  });

  // Student: Process Payment
  app.post('/api/student/payment', authMiddleware, (req: any, res) => {
    const { application_id, amount } = req.body;
    
    // Verify ownership
    const appRecord = db.prepare('SELECT id FROM applications WHERE id = ? AND user_id = ?').get(application_id, req.user.id);
    if (!appRecord) return res.status(403).json({ error: 'Dossier introuvable' });

    const receipt = 'REC-' + Date.now();
    db.prepare('INSERT INTO payments (application_id, amount, receipt_number) VALUES (?, ?, ?)')
      .run(application_id, amount, receipt);
    
    db.prepare('INSERT INTO notifications (user_id, message) VALUES (?, ?)').run(req.user.id, 'Paiement effectué avec succès. Reçu: ' + receipt);
    
    res.json({ message: 'Paiement réussi', receipt });
  });

  // Admin: Dashboard stats
  app.get('/api/admin/stats', authMiddleware, adminMiddleware, (req, res) => {
    const studentCount = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = "student"').get() as any;
    const appStats = db.prepare('SELECT status, COUNT(*) as count FROM applications GROUP BY status').all();
    const paymentsSum = db.prepare('SELECT SUM(amount) as total FROM payments').get() as any;
    
    const fieldsDist = db.prepare(`
      SELECT f.name, COUNT(a.id) as count 
      FROM fields f 
      LEFT JOIN applications a ON f.id = a.field_id 
      GROUP BY f.id
    `).all();

    const genderDist = db.prepare(`
      SELECT gender, COUNT(*) as count FROM applications GROUP BY gender
    `).all();

    const registrationsPerMonth = db.prepare(`
      SELECT strftime('%Y-%m', created_at) as month, COUNT(*) as count 
      FROM applications 
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY month ASC
      LIMIT 12
    `).all();

    res.json({
      students: studentCount.count,
      appStats,
      totalPayments: paymentsSum.total || 0,
      charts: { fieldsDist, genderDist, registrationsPerMonth }
    });
  });

  // Admin: Get applications
  app.get('/api/admin/applications', authMiddleware, adminMiddleware, (req, res) => {
    const applications = db.prepare(`
      SELECT a.*, u.email as user_email, f.name as field_name, l.name as level_name
      FROM applications a
      JOIN users u ON a.user_id = u.id
      LEFT JOIN fields f ON a.field_id = f.id
      LEFT JOIN levels l ON a.level_id = l.id
      ORDER BY a.created_at DESC
    `).all();
    res.json(applications);
  });

  // Admin: Update application status
  app.post('/api/admin/applications/:id/status', authMiddleware, adminMiddleware, (req, res) => {
    const { status } = req.body;
    const appId = req.params.id;
    
    db.prepare('UPDATE applications SET status = ? WHERE id = ?').run(status, appId);
    
    const appRecord = db.prepare('SELECT user_id FROM applications WHERE id = ?').get(appId) as any;
    if (appRecord) {
      db.prepare('INSERT INTO notifications (user_id, message) VALUES (?, ?)').run(appRecord.user_id, 'Le statut de votre dossier a changé : ' + status);
    }

    res.json({ message: 'Statut mis à jour' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
