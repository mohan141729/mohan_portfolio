const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Improved CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// SQLite DB setup
const dbPath = path.join(__dirname, 'portfolio.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Ensure tables are created before seeding

db.serialize(() => {
  // Create projects table if not exists
  const createProjectsTable = `
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    tech TEXT,
    featured INTEGER DEFAULT 0,
    live TEXT,
    github TEXT,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  `;
  db.run(createProjectsTable, (err) => {
    if (err) console.error('Error creating projects table:', err.message);
  });

  // Create admin table if not exists
  const createAdminTable = `
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  `;
  db.run(createAdminTable, (err) => {
    if (err) console.error('Error creating admin table:', err.message);
  });

  // Create skills table if not exists
  const createSkillsTable = `
  CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT,
    proficiency INTEGER DEFAULT 50,
    icon TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  `;
  db.run(createSkillsTable, (err) => {
    if (err) console.error('Error creating skills table:', err.message);
  });

  // Create certifications table if not exists
  const createCertificationsTable = `
  CREATE TABLE IF NOT EXISTS certifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    issuer TEXT,
    issue_date TEXT,
    expiry_date TEXT,
    credential_id TEXT,
    credential_url TEXT,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  `;
  db.run(createCertificationsTable, (err) => {
    if (err) console.error('Error creating certifications table:', err.message);
  });

  // Create contact messages table if not exists
  const createContactTable = `
  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  `;
  db.run(createContactTable, (err) => {
    if (err) console.error('Error creating contact table:', err.message);
  });

  // Create hero content table if not exists
  const createHeroTable = `
  CREATE TABLE IF NOT EXISTS hero_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    profile_image TEXT,
    background_image TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    welcome_text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  `;
  db.run(createHeroTable, (err) => {
    if (err) console.error('Error creating hero table:', err.message);
  });

  // Create about content table if not exists
  const createAboutTable = `
  CREATE TABLE IF NOT EXISTS about_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    journey_title TEXT NOT NULL,
    journey_points TEXT,
    education_title TEXT NOT NULL,
    education_items TEXT,
    strengths_title TEXT NOT NULL,
    strengths_list TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  `;
  db.run(createAboutTable, (err) => {
    if (err) console.error('Error creating about table:', err.message);
  });

  // Create contact info table if not exists
  const createContactInfoTable = `
  CREATE TABLE IF NOT EXISTS contact_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    location TEXT,
    email TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  `;
  db.run(createContactInfoTable, (err) => {
    if (err) console.error('Error creating contact info table:', err.message);
  });

  // Seed sample data if tables are empty
  const seedData = () => {
    // Seed admin user
    db.get('SELECT COUNT(*) as count FROM admins', (err, row) => {
      if (row.count === 0) {
        // Use environment variable if available, otherwise create new hash
        const passwordHash = process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync('admin123', 10);
        const stmt = db.prepare('INSERT INTO admins (email, password_hash) VALUES (?, ?)');
        stmt.run('admin@example.com', passwordHash);
        stmt.finalize();
        console.log('Seeded admin user.');
      }
    });

    // Seed projects
    db.get('SELECT COUNT(*) as count FROM projects', (err, row) => {
      if (row.count === 0) {
        const stmt = db.prepare('INSERT INTO projects (title, description, tech, featured, live, github) VALUES (?, ?, ?, ?, ?, ?)');
        stmt.run(
          'Learning Path Generator',
          'Full-stack AI-powered platform that generates personalized learning paths from Beginner to Advanced levels using Gemini API.',
          'React,Tailwind,Node.js,SQLite,Gemini API',
          1,
          '#',
          '#'
        );
        stmt.run(
          'Food Munch',
          'Mobile-first food listing website with responsive design and modern UI components.',
          'HTML,CSS,Bootstrap',
          0,
          '#',
          '#'
        );
        stmt.run(
          'Tourism Website',
          'Destination galleries with virtual tours, Bootstrap carousel, and embedded videos.',
          'HTML,CSS,Bootstrap,JavaScript',
          0,
          '#',
          '#'
        );
        stmt.finalize();
        console.log('Seeded sample projects.');
      }
    });

    // Seed skills
    db.get('SELECT COUNT(*) as count FROM skills', (err, row) => {
      if (row.count === 0) {
        const stmt = db.prepare('INSERT INTO skills (name, category, proficiency, icon) VALUES (?, ?, ?, ?)');
        const skills = [
          ['React', 'Frontend', 90, 'react'],
          ['Node.js', 'Backend', 85, 'nodejs'],
          ['JavaScript', 'Programming', 95, 'javascript'],
          ['Python', 'Programming', 80, 'python'],
          ['SQL', 'Database', 85, 'database'],
          ['Git', 'Tools', 90, 'git']
        ];
        skills.forEach(skill => stmt.run(skill));
        stmt.finalize();
        console.log('Seeded sample skills.');
      }
    });

    // Seed certifications
    db.get('SELECT COUNT(*) as count FROM certifications', (err, row) => {
      if (row.count === 0) {
        const stmt = db.prepare('INSERT INTO certifications (name, issuer, issue_date, credential_id) VALUES (?, ?, ?, ?)');
        stmt.run('Full Stack Web Development', 'Coursera', '2024-01-15', 'FSWD-2024-001');
        stmt.run('React Developer', 'Meta', '2024-03-20', 'REACT-2024-002');
        stmt.finalize();
        console.log('Seeded sample certifications.');
      }
    });

    // Seed hero content
    db.get('SELECT COUNT(*) as count FROM hero_content', (err, row) => {
      if (row.count === 0) {
        const stmt = db.prepare('INSERT INTO hero_content (name, title, subtitle, description, profile_image, background_image, github_url, linkedin_url, welcome_text) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        stmt.run(
          'Mohan D',
          'Full-Stack Developer | AI/ML Enthusiast',
          'Hi, I\'m Mohan D',
          'Passionate about creating innovative web solutions and exploring the frontiers of artificial intelligence. Currently building full-stack applications with modern technologies.',
          'https://res.cloudinary.com/dovmtmu7y/image/upload/v1751693333/drilldown_iq6iin.jpg',
          'https://res.cloudinary.com/dovmtmu7y/image/upload/v1751692323/hero-bg-CjdCbMYo_htrzjv.jpg',
          'https://github.com/mohan-d',
          'https://linkedin.com/in/mohan-d',
          'Welcome to my digital workspace'
        );
        stmt.finalize();
        console.log('Seeded hero content.');
      }
    });

    // Seed about content
    db.get('SELECT COUNT(*) as count FROM about_content', (err, row) => {
      if (row.count === 0) {
        const stmt = db.prepare('INSERT INTO about_content (journey_title, journey_points, education_title, education_items, strengths_title, strengths_list) VALUES (?, ?, ?, ?, ?, ?)');
        stmt.run(
          'My Journey',
          JSON.stringify([
            { point: 'Passion for Technology: My journey began with curiosity about how websites work, evolving into a deep appreciation for seamless user experiences and innovative solutions.' },
            { point: 'Continuous Learning: Currently pursuing NxtWave\'s full-stack certification, expanding expertise in React, Node.js, and exploring AI/ML integration.' },
            { point: 'Future Goals: Seeking opportunities to contribute to innovative projects that make real impact, building intuitive interfaces and robust backend systems.' }
          ]),
          'Education Timeline',
          JSON.stringify([
            { institution: 'ZP High School', details: '(10 CGPA)' },
            { institution: 'Viswa Bharathi Jr. College', details: '(95%)' },
            { institution: 'Sree Dattha', details: '(8.4 CGPA)' },
            { institution: 'NxtWave Full-Stack Certification', details: '(Ongoing)' }
          ]),
          'Core Strengths',
          JSON.stringify(['Problem Solving', 'Collaboration', 'Adaptability', 'Creativity'])
        );
        stmt.finalize();
        console.log('Seeded about content.');
      }
    });

    // Seed contact info
    db.get('SELECT COUNT(*) as count FROM contact_info', (err, row) => {
      if (row.count === 0) {
        const stmt = db.prepare('INSERT INTO contact_info (title, subtitle, description, location, email, github_url, linkedin_url) VALUES (?, ?, ?, ?, ?, ?, ?)');
        stmt.run(
          'Get In Touch',
          'Let\'s Connect',
          'I\'m passionate about creating innovative web solutions and exploring the frontiers of artificial intelligence. Currently building full-stack applications with modern technologies.',
          'Hyderabad, Telangana, India',
          'mohan.developer@gmail.com',
          'https://github.com/mohan-d',
          'https://linkedin.com/in/mohan-d'
        );
        stmt.finalize();
        console.log('Seeded contact info.');
      }
    });
  };
  seedData();
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.cookies.admin_token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// API endpoint: Get all projects
app.get('/api/projects', (req, res) => {
  db.all('SELECT * FROM projects ORDER BY featured DESC, created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      const projects = rows.map((p) => ({ ...p, tech: p.tech ? p.tech.split(',') : [] }));
      res.json(projects);
    }
  });
});

// API endpoint: Create new project (protected)
app.post('/api/projects', authenticateToken, upload.single('image'), (req, res) => {
  const { title, description, tech, featured, live, github } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  // If this project is featured, un-feature all others first
  const doInsert = () => {
    const stmt = db.prepare('INSERT INTO projects (title, description, tech, featured, live, github, image) VALUES (?, ?, ?, ?, ?, ?, ?)');
    stmt.run(title, description, tech, featured ? 1 : 0, live, github, image, function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ id: this.lastID, message: 'Project created successfully' });
      }
    });
    stmt.finalize();
  };

  if (featured && (featured === '1' || featured === 1 || featured === true)) {
    db.run('UPDATE projects SET featured = 0', [], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      doInsert();
    });
  } else {
    doInsert();
  }
});

// API endpoint: Update project (protected)
app.put('/api/projects/:id', authenticateToken, upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { title, description, tech, featured, live, github } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  let query = 'UPDATE projects SET title = ?, description = ?, tech = ?, featured = ?, live = ?, github = ?, updated_at = CURRENT_TIMESTAMP';
  let params = [title, description, tech, featured ? 1 : 0, live, github];

  if (image) {
    query += ', image = ?';
    params.push(image);
  }

  query += ' WHERE id = ?';
  params.push(id);

  // If this project is being set as featured, un-feature all others first
  const doUpdate = () => {
    db.run(query, params, function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'Project not found' });
      } else {
        res.json({ message: 'Project updated successfully' });
      }
    });
  };

  if (featured && (featured === '1' || featured === 1 || featured === true)) {
    db.run('UPDATE projects SET featured = 0 WHERE id != ?', [id], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      doUpdate();
    });
  } else {
    doUpdate();
  }
});

// API endpoint: Delete project (protected)
app.delete('/api/projects/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM projects WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Project not found' });
    } else {
      res.json({ message: 'Project deleted successfully' });
    }
  });
});

// API endpoint: Get all skills
app.get('/api/skills', (req, res) => {
  db.all('SELECT * FROM skills ORDER BY category, proficiency DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// API endpoint: Create skill (protected)
app.post('/api/skills', authenticateToken, (req, res) => {
  const { name, category, proficiency, icon } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Skill name is required' });
  }

  const stmt = db.prepare('INSERT INTO skills (name, category, proficiency, icon) VALUES (?, ?, ?, ?)');
  stmt.run(name, category, proficiency || 50, icon, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ id: this.lastID, message: 'Skill created successfully' });
    }
  });
  stmt.finalize();
});

// API endpoint: Update skill (protected)
app.put('/api/skills/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, category, proficiency, icon } = req.body;

  db.run('UPDATE skills SET name = ?, category = ?, proficiency = ?, icon = ? WHERE id = ?', 
    [name, category, proficiency, icon, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Skill not found' });
    } else {
      res.json({ message: 'Skill updated successfully' });
    }
  });
});

// API endpoint: Delete skill (protected)
app.delete('/api/skills/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM skills WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Skill not found' });
    } else {
      res.json({ message: 'Skill deleted successfully' });
    }
  });
});

// API endpoint: Get all certifications
app.get('/api/certifications', (req, res) => {
  db.all('SELECT * FROM certifications ORDER BY issue_date DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// API endpoint: Create certification (protected)
app.post('/api/certifications', authenticateToken, upload.single('image'), (req, res) => {
  const { name, issuer, issue_date, expiry_date, credential_id, credential_url } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !issuer) {
    return res.status(400).json({ error: 'Name and issuer are required' });
  }

  const stmt = db.prepare('INSERT INTO certifications (name, issuer, issue_date, expiry_date, credential_id, credential_url, image) VALUES (?, ?, ?, ?, ?, ?, ?)');
  stmt.run(name, issuer, issue_date, expiry_date, credential_id, credential_url, image, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ id: this.lastID, message: 'Certification created successfully' });
    }
  });
  stmt.finalize();
});

// API endpoint: Update certification (protected)
app.put('/api/certifications/:id', authenticateToken, upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { name, issuer, issue_date, expiry_date, credential_id, credential_url } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  let query = 'UPDATE certifications SET name = ?, issuer = ?, issue_date = ?, expiry_date = ?, credential_id = ?, credential_url = ?';
  let params = [name, issuer, issue_date, expiry_date, credential_id, credential_url];

  if (image) {
    query += ', image = ?';
    params.push(image);
  }

  query += ' WHERE id = ?';
  params.push(id);

  db.run(query, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Certification not found' });
    } else {
      res.json({ message: 'Certification updated successfully' });
    }
  });
});

// API endpoint: Delete certification (protected)
app.delete('/api/certifications/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM certifications WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Certification not found' });
    } else {
      res.json({ message: 'Certification deleted successfully' });
    }
  });
});

// API endpoint: Submit contact form
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const stmt = db.prepare('INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)');
  stmt.run(name, email, subject, message, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ message: 'Message sent successfully' });
    }
  });
  stmt.finalize();
});

// API endpoint: Get contact messages (protected)
app.get('/api/contact', authenticateToken, (req, res) => {
  db.all('SELECT * FROM contact_messages ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// API endpoint: Update message status (protected)
app.put('/api/contact/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.run('UPDATE contact_messages SET status = ? WHERE id = ?', [status, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Message not found' });
    } else {
      res.json({ message: 'Message status updated successfully' });
    }
  });
});

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

  console.log('Login attempt:', { email, password: password ? 'provided' : 'missing' });

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Query admin from database
  const query = 'SELECT * FROM admins WHERE email = ?';
  db.get(query, [email], (err, admin) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Authentication error' });
    }

    if (!admin) {
      console.log('Admin not found:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    bcrypt.compare(password, admin.password_hash, (err, isMatch) => {
      if (err) {
        console.error('Bcrypt error:', err);
        return res.status(500).json({ error: 'Authentication error' });
      }
      
      console.log('Password match:', isMatch);
      
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      
      // Create JWT
      const token = jwt.sign({ email: admin.email, id: admin.id }, jwtSecret, { expiresIn: '24h' });
      console.log('Login successful, token created');
      
      // Set cookie
      res.cookie('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
      
      res.json({ token, user: { email: admin.email, id: admin.id } });
    });
  });
});

// Add token verification endpoint
app.get('/api/admin/verify', (req, res) => {
  const token = req.cookies.admin_token || req.headers.authorization?.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    res.json({ email: decoded.email });
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Admin change password endpoint
app.put('/api/admin/change-password', authenticateToken, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }

  // Get admin from database
  db.get('SELECT * FROM admins WHERE email = ?', [req.user.email], (err, admin) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Verify current password
    bcrypt.compare(currentPassword, admin.password_hash, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'Authentication error' });
      }

      if (!isMatch) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      // Hash new password
      bcrypt.hash(newPassword, 10, (err, newHash) => {
        if (err) {
          return res.status(500).json({ error: 'Password hashing error' });
        }

        // Update password in database
        db.run('UPDATE admins SET password_hash = ? WHERE email = ?', [newHash, req.user.email], function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to update password' });
          }

          res.json({ message: 'Password updated successfully' });
        });
      });
    });
  });
});

// Admin change email endpoint
app.put('/api/admin/change-email', authenticateToken, (req, res) => {
  const { currentPassword, newEmail } = req.body;

  if (!currentPassword || !newEmail) {
    return res.status(400).json({ error: 'Current password and new email are required' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(newEmail)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Get admin from database
  db.get('SELECT * FROM admins WHERE email = ?', [req.user.email], (err, admin) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Verify current password
    bcrypt.compare(currentPassword, admin.password_hash, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'Authentication error' });
      }

      if (!isMatch) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      // Check if new email already exists
      db.get('SELECT id FROM admins WHERE email = ?', [newEmail], (err, existingAdmin) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (existingAdmin) {
          return res.status(400).json({ error: 'Email already exists' });
        }

        // Update email in database
        db.run('UPDATE admins SET email = ? WHERE email = ?', [newEmail, req.user.email], function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to update email' });
          }

          res.json({ message: 'Email updated successfully' });
        });
      });
    });
  });
});

// Resume upload configuration
const resumeUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(__dirname, 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, Word documents, and images are allowed'), false);
    }
  }
});

// Create resume table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS resumes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    size INTEGER NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Get resume endpoint (protected)
app.get('/api/resume', authenticateToken, (req, res) => {
  db.get('SELECT * FROM resumes ORDER BY uploaded_at DESC LIMIT 1', (err, resume) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!resume) {
      return res.status(404).json({ error: 'No resume found' });
    }
    
    res.json(resume);
  });
});

// Public resume endpoint
app.get('/api/public/resume', (req, res) => {
  db.get('SELECT * FROM resumes ORDER BY uploaded_at DESC LIMIT 1', (err, resume) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!resume) {
      return res.status(404).json({ error: 'No resume found' });
    }
    
    res.json(resume);
  });
});

// Upload resume endpoint
app.post('/api/resume', authenticateToken, resumeUpload.single('resume'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Delete existing resume
  db.run('DELETE FROM resumes', (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Insert new resume
    const stmt = db.prepare('INSERT INTO resumes (filename, file_path, size) VALUES (?, ?, ?)');
    stmt.run(req.file.originalname, `/uploads/${req.file.filename}`, req.file.size, function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ 
          id: this.lastID, 
          filename: req.file.originalname,
          file_path: `/uploads/${req.file.filename}`,
          size: req.file.size,
          message: 'Resume uploaded successfully' 
        });
      }
    });
    stmt.finalize();
  });
});

// Delete resume endpoint
app.delete('/api/resume', authenticateToken, (req, res) => {
  db.get('SELECT * FROM resumes ORDER BY uploaded_at DESC LIMIT 1', (err, resume) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!resume) {
      return res.status(404).json({ error: 'No resume found' });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, resume.file_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    db.run('DELETE FROM resumes WHERE id = ?', [resume.id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: 'Resume deleted successfully' });
      }
    });
  });
});

// Hero Content API endpoints

// Get hero content (public)
app.get('/api/public/hero', (req, res) => {
  db.get('SELECT * FROM hero_content ORDER BY created_at DESC LIMIT 1', (err, hero) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!hero) {
      return res.status(404).json({ error: 'No hero content found' });
    }
    
    res.json(hero);
  });
});

// Get hero content (protected)
app.get('/api/hero', authenticateToken, (req, res) => {
  db.get('SELECT * FROM hero_content ORDER BY created_at DESC LIMIT 1', (err, hero) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!hero) {
      return res.status(404).json({ error: 'No hero content found' });
    }
    
    res.json(hero);
  });
});

// Update hero content (protected)
app.put('/api/hero', authenticateToken, upload.fields([
  { name: 'profile_image', maxCount: 1 },
  { name: 'background_image', maxCount: 1 }
]), (req, res) => {
  const { name, title, subtitle, description, github_url, linkedin_url, welcome_text } = req.body;
  
  let query = 'UPDATE hero_content SET name = ?, title = ?, subtitle = ?, description = ?, github_url = ?, linkedin_url = ?, welcome_text = ?, updated_at = CURRENT_TIMESTAMP';
  let params = [name, title, subtitle, description, github_url, linkedin_url, welcome_text];

  if (req.files?.profile_image) {
    query += ', profile_image = ?';
    params.push(`http://localhost:4000/uploads/${req.files.profile_image[0].filename}`);
  }

  if (req.files?.background_image) {
    query += ', background_image = ?';
    params.push(`http://localhost:4000/uploads/${req.files.background_image[0].filename}`);
  }

  db.run(query, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: 'Hero content updated successfully' });
    }
  });
});

// About Content API endpoints

// Get about content (public)
app.get('/api/public/about', (req, res) => {
  db.get('SELECT * FROM about_content ORDER BY created_at DESC LIMIT 1', (err, about) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!about) {
      return res.status(404).json({ error: 'No about content found' });
    }
    
    // Parse JSON strings back to objects
    about.journey_points = JSON.parse(about.journey_points || '[]');
    about.education_items = JSON.parse(about.education_items || '[]');
    about.strengths_list = JSON.parse(about.strengths_list || '[]');
    
    res.json(about);
  });
});

// Get about content (protected)
app.get('/api/about', authenticateToken, (req, res) => {
  db.get('SELECT * FROM about_content ORDER BY created_at DESC LIMIT 1', (err, about) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!about) {
      return res.status(404).json({ error: 'No about content found' });
    }
    
    // Parse JSON strings back to objects
    about.journey_points = JSON.parse(about.journey_points || '[]');
    about.education_items = JSON.parse(about.education_items || '[]');
    about.strengths_list = JSON.parse(about.strengths_list || '[]');
    
    res.json(about);
  });
});

// Update about content (protected)
app.put('/api/about', authenticateToken, (req, res) => {
  const { journey_title, journey_points, education_title, education_items, strengths_title, strengths_list } = req.body;
  
  const stmt = db.prepare('UPDATE about_content SET journey_title = ?, journey_points = ?, education_title = ?, education_items = ?, strengths_title = ?, strengths_list = ?, updated_at = CURRENT_TIMESTAMP');
  stmt.run(
    journey_title,
    JSON.stringify(journey_points),
    education_title,
    JSON.stringify(education_items),
    strengths_title,
    JSON.stringify(strengths_list),
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: 'About content updated successfully' });
      }
    }
  );
  stmt.finalize();
});

// Contact Info API endpoints

// Get contact info (public)
app.get('/api/public/contact', (req, res) => {
  db.get('SELECT * FROM contact_info ORDER BY created_at DESC LIMIT 1', (err, contact) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!contact) {
      return res.status(404).json({ error: 'No contact info found' });
    }
    
    res.json(contact);
  });
});

// Get contact info (protected)
app.get('/api/contact-info', authenticateToken, (req, res) => {
  db.get('SELECT * FROM contact_info ORDER BY created_at DESC LIMIT 1', (err, contact) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!contact) {
      return res.status(404).json({ error: 'No contact info found' });
    }
    
    res.json(contact);
  });
});

// Update contact info (protected)
app.put('/api/contact-info', authenticateToken, (req, res) => {
  const { title, subtitle, description, location, email, github_url, linkedin_url } = req.body;
  
  const stmt = db.prepare('UPDATE contact_info SET title = ?, subtitle = ?, description = ?, location = ?, email = ?, github_url = ?, linkedin_url = ?, updated_at = CURRENT_TIMESTAMP');
  stmt.run(
    title,
    subtitle,
    description,
    location,
    email,
    github_url,
    linkedin_url,
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: 'Contact info updated successfully' });
      }
    }
  );
  stmt.finalize();
});

// Logout endpoint
app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('admin_token');
  res.json({ message: 'Logged out successfully' });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend build in production
const frontendBuildPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendBuildPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
}); 