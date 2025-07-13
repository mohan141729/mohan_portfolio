const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

// 1. Import nodemailer at the top
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  secure: true,
  cloudinary_url: process.env.CLOUDINARY_URL
});
const streamifier = require('streamifier');

const app = express();
const PORT = process.env.PORT || 4000;

// Serve uploaded files PUBLICLY before any authentication middleware
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- CORS CONFIGURATION ---
// Allow requests from Vercel frontend and local dev, allow credentials (cookies)
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'https://mohan-portfolio-chi.vercel.app',
    'https://mohan-portfolio-5g5k.vercel.app'
  ];

console.log('CORS Configuration:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('ALLOWED_ORIGINS:', allowedOrigins);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (!isProduction) {
      // In development, allow all origins for easier testing
      return callback(null, true);
    }
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// Warn if JWT_SECRET is not set
if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET is not set in environment variables. Using default insecure secret!');
}

// File upload configuration
const upload = multer({ storage: multer.memoryStorage() });

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://techlearn2005:mohanPortfolio@mohanportfolio.otpcvr7.mongodb.net/portfolio';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB Atlas successfully!');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Mongoose Models
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  tech: [String],
  category: String, // <-- add this line
  featured: { type: Boolean, default: false },
  live: String,
  github: String,
  image: String,
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  proficiency: { type: Number, default: 50 }
}, { timestamps: true });

const Skill = mongoose.model('Skill', skillSchema);

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: String,
  issue_date: String,
  expiry_date: String,
  credential_id: String,
  credential_url: String,
  image: String,
}, { timestamps: true });

const Certification = mongoose.model('Certification', certificationSchema);

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: String,
  message: { type: String, required: true },
  status: { type: String, default: 'unread' },
}, { timestamps: true });

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

const heroContentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: String,
  description: String,
  profile_image: String,
  background_image: String,
  github_url: String,
  linkedin_url: String,
  welcome_text: String,
}, { timestamps: true });

const HeroContent = mongoose.model('HeroContent', heroContentSchema);

const aboutContentSchema = new mongoose.Schema({
  journey_title: { type: String, required: true },
  journey_points: [Object],
  education_title: { type: String, required: true },
  education_items: [Object],
  strengths_title: { type: String, required: true },
  strengths_list: [String],
}, { timestamps: true });

const AboutContent = mongoose.model('AboutContent', aboutContentSchema);

const contactInfoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: String,
  description: String,
  location: String,
  email: String,
  github_url: String,
  linkedin_url: String,
}, { timestamps: true });

const ContactInfo = mongoose.model('ContactInfo', contactInfoSchema);

const resumeSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  file_path: { type: String, required: true },
  size: { type: Number, required: true },
}, { timestamps: true });

const Resume = mongoose.model('Resume', resumeSchema);

// --- Project Rating Model ---
const ratingSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
});
const ProjectRating = mongoose.model('ProjectRating', ratingSchema);

// --- AI Tool Model ---
const aiToolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  order: { type: Number, default: 0 },
  iconImage: { type: String }, // URL or file path
}, { timestamps: true });
const AITool = mongoose.model('AITool', aiToolSchema);

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

// Helper function for buffer upload to Cloudinary
async function uploadBufferToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (result) resolve(result);
      else reject(error);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// (Move these endpoints here, after authenticateToken is defined)
// Stats endpoint for dashboard
app.get('/api/stats', authenticateToken, async (req, res) => {
  try {
    const stats = {};
    stats.projects = await Project.countDocuments();
    stats.skills = await Skill.countDocuments();
    stats.certifications = await Certification.countDocuments();
    stats.messages = await ContactMessage.countDocuments();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Tools endpoints
app.get('/api/ai-tools', async (req, res) => {
  try {
    const tools = await AITool.find().sort({ order: 1 });
    res.json(tools);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch AI tools' });
  }
});

// API endpoint: Get all projects
app.get('/api/projects', (req, res) => {
  Project.find().sort({ featured: -1, createdAt: -1 })
    .then(projects => {
      res.json(projects);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
  });
});

// API endpoint: Create new project (protected)
app.post('/api/projects', authenticateToken, upload.single('image'), async (req, res) => {
  console.log('PROJECT UPLOAD req.file:', req.file);
  console.log('PROJECT UPLOAD req.body:', req.body);
  let { title, description, tech, category, featured, live, github } = req.body;
  if (!category || !category.trim()) {
    category = 'uncategorized';
  } else {
    category = category.trim().toLowerCase();
  }

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const doInsert = async () => {
    try {
      let imageUrl = null;
      if (req.file) {
        const result = await uploadBufferToCloudinary(req.file.buffer, {
          resource_type: 'auto',
          folder: 'projects'
        });
        imageUrl = result.secure_url;
      }
      const newProject = new Project({
        title, description, tech, category, featured, live, github, image: imageUrl
      });
      const savedProject = await newProject.save();
      res.status(201).json({ id: savedProject._id, message: 'Project created successfully' });
    } catch (err) {
      console.error('Error uploading project image to Cloudinary:', err);
      res.status(500).json({ error: err.message });
    }
  };

  if (featured && (featured === '1' || featured === 1 || featured === true)) {
    Project.updateMany({ _id: { $ne: req.params.id } }, { $set: { featured: false } })
      .then(() => {
        doInsert();
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  } else {
    doInsert();
  }
});

// API endpoint: Update project (protected)
app.put('/api/projects/:id', authenticateToken, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  let { title, description, tech, category, featured, live, github } = req.body;
  console.log('PROJECT UPDATE req.body:', req.body);
  if (!category || !category.trim()) {
    category = 'uncategorized';
  } else {
    category = category.trim().toLowerCase();
  }
  console.log('PROJECT UPDATE normalized category:', category);
  let query = { title, description, tech, category, featured, live, github };
  if (req.file) {
    try {
      const result = await uploadBufferToCloudinary(req.file.buffer, {
        resource_type: 'auto',
        folder: 'projects'
      });
      query.image = result.secure_url;
    } catch (err) {
      console.error('Error uploading project image to Cloudinary:', err);
      res.status(500).json({ error: err.message });
      return;
    }
  }

  Project.findByIdAndUpdate(id, { $set: query, updatedAt: Date.now() })
    .then(project => {
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json({ message: 'Project updated successfully' });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// API endpoint: Delete project (protected)
app.delete('/api/projects/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  Project.findByIdAndDelete(id)
    .then(project => {
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json({ message: 'Project deleted successfully' });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
  });
});

// --- Project Ratings API ---
// POST /api/projects/:projectId/ratings
app.post('/api/projects/:projectId/ratings', async (req, res) => {
  try {
    const { rating } = req.body;
    const { projectId } = req.params;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be 1-5' });
    }
    const newRating = new ProjectRating({ projectId, rating });
    await newRating.save();
    res.status(201).json({ message: 'Rating submitted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

// GET /api/projects/:projectId/ratings
app.get('/api/projects/:projectId/ratings', async (req, res) => {
  try {
    const { projectId } = req.params;
    const ratings = await ProjectRating.find({ projectId });
    const count = ratings.length;
    const avg = count > 0 ? (ratings.reduce((sum, r) => sum + r.rating, 0) / count) : 0;
    res.json({ average: avg, count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

// API endpoint: Get all skills
app.get('/api/skills', (req, res) => {
  Skill.find().sort({ category: 1, proficiency: -1 })
    .then(skills => {
      res.json(skills);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
  });
});

// API endpoint: Create skill (protected)
app.post('/api/skills', authenticateToken, (req, res) => {
  const { name, category, proficiency } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Skill name is required' });
  }

  const newSkill = new Skill({
    name,
    category,
    proficiency: proficiency || 50
  });

  newSkill.save()
    .then(skill => {
      res.status(201).json({ id: skill._id, message: 'Skill created successfully' });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// API endpoint: Update skill (protected)
app.put('/api/skills/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, category, proficiency } = req.body;

  Skill.findByIdAndUpdate(id, { name, category, proficiency }, { new: true })
    .then(skill => {
      if (!skill) {
        return res.status(404).json({ error: 'Skill not found' });
      }
      res.json({ message: 'Skill updated successfully' });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// API endpoint: Delete skill (protected)
app.delete('/api/skills/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  Skill.findByIdAndDelete(id)
    .then(skill => {
      if (!skill) {
        return res.status(404).json({ error: 'Skill not found' });
      }
      res.json({ message: 'Skill deleted successfully' });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
  });
});

// API endpoint: Get all certifications
app.get('/api/certifications', (req, res) => {
  Certification.find().sort({ issue_date: -1 })
    .then(certifications => {
      res.json(certifications);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
  });
});

// API endpoint: Create certification (protected)
app.post('/api/certifications', authenticateToken, upload.single('image'), async (req, res) => {
  console.log('CERTIFICATION UPLOAD req.file:', req.file);
  console.log('CERTIFICATION UPLOAD req.body:', req.body);
  const { name, issuer, issue_date, expiry_date, credential_id, credential_url } = req.body;

  if (!name || !issuer) {
    return res.status(400).json({ error: 'Name and issuer are required' });
  }

  let imageUrl = null;
  if (req.file) {
    const result = await uploadBufferToCloudinary(req.file.buffer, { resource_type: 'auto', folder: 'certifications' });
    imageUrl = result.secure_url;
  }

  const newCertification = new Certification({
    name, issuer, issue_date, expiry_date, credential_id, credential_url, image: imageUrl
  });

  newCertification.save()
    .then(certification => {
      res.status(201).json({ id: certification._id, message: 'Certification created successfully' });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// API endpoint: Update certification (protected)
app.put('/api/certifications/:id', authenticateToken, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, issuer, issue_date, expiry_date, credential_id, credential_url } = req.body;

  let updateData = { name, issuer, issue_date, expiry_date, credential_id, credential_url };
  if (req.file) {
    try {
      const result = await uploadBufferToCloudinary(req.file.buffer, {
        resource_type: 'auto',
        folder: 'certifications'
      });
      updateData.image = result.secure_url;
    } catch (err) {
      console.error('Error uploading certification image to Cloudinary:', err);
      res.status(500).json({ error: err.message });
      return;
    }
  }

  Certification.findByIdAndUpdate(id, updateData, { new: true })
    .then(certification => {
      if (!certification) {
        return res.status(404).json({ error: 'Certification not found' });
      }
      res.json({ message: 'Certification updated successfully' });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// API endpoint: Delete certification (protected)
app.delete('/api/certifications/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  Certification.findByIdAndDelete(id)
    .then(certification => {
      if (!certification) {
        return res.status(404).json({ error: 'Certification not found' });
      }
      res.json({ message: 'Certification deleted successfully' });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
  });
});

// API endpoint: Submit contact form
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const newMessage = new ContactMessage({
    name, email, subject, message
  });

  newMessage.save()
    .then(message => {
      res.status(201).json({ message: 'Message sent successfully' });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
  });
});

// API endpoint: Get contact messages (protected)
app.get('/api/contact', authenticateToken, (req, res) => {
  ContactMessage.find().sort({ createdAt: -1 })
    .then(messages => {
      res.json(messages);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
  });
});

// API endpoint: Update message status (protected)
app.put('/api/contact/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  ContactMessage.findByIdAndUpdate(id, { status }, { new: true })
    .then(message => {
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }
      res.json({ message: 'Message status updated successfully' });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
  });
});

// API endpoint: Delete contact message (protected)
app.delete('/api/contact/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  ContactMessage.findByIdAndDelete(id)
    .then(message => {
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }
      res.json({ message: 'Message deleted successfully' });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// 2. Add the reply endpoint after contact endpoints
app.post('/api/contact/reply', authenticateToken, async (req, res) => {
  const { to, subject, message } = req.body;
  if (!to || !subject || !message) {
    return res.status(400).json({ error: 'To, subject, and message are required' });
  }
  try {
    // Configure transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    // Send mail
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text: message,
    });
    res.json({ message: 'Reply sent successfully' });
  } catch (err) {
    console.error('Error sending reply:', err);
    res.status(500).json({ error: 'Failed to send reply' });
  }
});

// --- Add root route to avoid 404 on backend root ---
app.get('/', (req, res) => {
  res.send('API is running');
});

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

  console.log('Login attempt:', { email, password: password ? 'provided' : 'missing' });

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  Admin.findOne({ email })
    .then(admin => {
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
        const token = jwt.sign({ email: admin.email, id: admin._id }, jwtSecret, { expiresIn: '7d' });
      console.log('Login successful, token created');
      
        // Set cookie
      const isProduction = process.env.NODE_ENV === 'production';
      res.cookie('admin_token', token, {
        httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
        
        res.json({ user: { email: admin.email, id: admin._id }, token });
    });
    })
    .catch(err => {
      console.error('Database error:', err);
      res.status(500).json({ error: 'Authentication error' });
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

  Admin.findOne({ email: req.user.email })
    .then(admin => {
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
          Admin.findOneAndUpdate({ email: req.user.email }, { password_hash: newHash })
            .then(() => {
          res.json({ message: 'Password updated successfully' });
            })
            .catch(err => {
              res.status(500).json({ error: 'Failed to update password' });
        });
      });
    });
    })
    .catch(err => {
      res.status(500).json({ error: 'Database error' });
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

  Admin.findOne({ email: req.user.email })
    .then(admin => {
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
        Admin.findOne({ email: newEmail })
          .then(existingAdmin => {
        if (existingAdmin) {
          return res.status(400).json({ error: 'Email already exists' });
        }

        // Update email in database
            Admin.findOneAndUpdate({ email: req.user.email }, { email: newEmail })
              .then(() => {
          res.json({ message: 'Email updated successfully' });
              })
              .catch(err => {
                res.status(500).json({ error: 'Failed to update email' });
        });
          })
          .catch(err => {
            res.status(500).json({ error: 'Database error' });
      });
    });
    })
    .catch(err => {
      res.status(500).json({ error: 'Database error' });
  });
});

// Resume upload configuration
const resumeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    // Use a unique filename (timestamp + original name)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'resume-' + uniqueSuffix + ext);
  }
});
const resumeUpload = multer({ storage: resumeStorage });

// Create resume table if not exists
// This section is no longer needed as resume functionality is not in the new schema.

// Get resume endpoint (protected)
app.get('/api/resume', authenticateToken, (req, res) => {
  Resume.findOne().sort({ createdAt: -1 })
    .then(resume => {
    if (!resume) {
      return res.status(404).json({ error: 'No resume found' });
    }
    res.json(resume);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
  });
});

// Public resume endpoint
app.get('/api/public/resume', (req, res) => {
  Resume.findOne().sort({ createdAt: -1 })
    .then(resume => {
    if (!resume) {
      return res.status(404).json({ error: 'No resume found' });
    }
    res.json(resume);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
  });
});

// Upload resume endpoint
app.post('/api/resume', authenticateToken, resumeUpload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Delete existing resume(s)
    await Resume.deleteMany({});

    // Insert new resume with local file path
    const newResume = new Resume({
      filename: req.file.originalname,
      file_path: '/uploads/' + req.file.filename, // Public URL path
      size: req.file.size
    });
    await newResume.save();

    res.status(201).json({
      id: newResume._id,
      filename: newResume.filename,
      file_path: newResume.file_path,
      size: newResume.size,
      message: 'Resume uploaded successfully'
    });
  } catch (err) {
    console.error('Error saving resume:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete resume endpoint
app.delete('/api/resume', authenticateToken, (req, res) => {
  Resume.findOne().sort({ createdAt: -1 })
    .then(resume => {
    if (!resume) {
      return res.status(404).json({ error: 'No resume found' });
    }

    // Delete file from filesystem
    // const filePath = path.join(__dirname, resume.file_path); // This line is no longer needed
    // if (fs.existsSync(filePath)) {
    //   fs.unlinkSync(filePath);
    // }

    // Delete from database
      return Resume.findByIdAndDelete(resume._id);
    })
    .then(() => {
        res.json({ message: 'Resume deleted successfully' });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
  });
});

// Hero Content API endpoints

// Get hero content (public)
app.get('/api/public/hero', (req, res) => {
  HeroContent.findOne().sort({ createdAt: -1 })
    .then(hero => {
    if (!hero) {
      return res.status(404).json({ error: 'No hero content found' });
    }
    res.json(hero);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
  });
});

// Get hero content (protected)
app.get('/api/hero', authenticateToken, (req, res) => {
  HeroContent.findOne().sort({ createdAt: -1 })
    .then(hero => {
    if (!hero) {
      return res.status(404).json({ error: 'No hero content found' });
    }
    res.json(hero);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
  });
});

// Update hero content (protected)
app.put('/api/hero', authenticateToken, upload.fields([
  { name: 'profile_image', maxCount: 1 },
  { name: 'background_image', maxCount: 1 }
]), async (req, res) => {
  const { name, title, subtitle, description, github_url, linkedin_url, welcome_text } = req.body;
  
  // Get the base URL dynamically
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['x-forwarded-host'] || req.get('host');
  const baseUrl = `${protocol}://${host}`;
  
  let updateData = { name, title, subtitle, description, github_url, linkedin_url, welcome_text };

  if (req.files?.profile_image) {
    try {
      const result = await uploadBufferToCloudinary(req.files.profile_image[0].buffer, {
        resource_type: 'auto',
        folder: 'hero'
      });
      updateData.profile_image = result.secure_url;
    } catch (err) {
      console.error('Error uploading profile image to Cloudinary:', err);
      res.status(500).json({ error: err.message });
      return;
    }
  }

  if (req.files?.background_image) {
    try {
      const result = await uploadBufferToCloudinary(req.files.background_image[0].buffer, {
        resource_type: 'auto',
        folder: 'hero'
      });
      updateData.background_image = result.secure_url;
    } catch (err) {
      console.error('Error uploading background image to Cloudinary:', err);
      res.status(500).json({ error: err.message });
      return;
    }
  }

  HeroContent.findOneAndUpdate({}, updateData, { new: true, upsert: true })
    .then(hero => {
      res.json({ message: 'Hero content updated successfully' });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
  });
});

// About Content API endpoints

// Get about content (public)
app.get('/api/public/about', (req, res) => {
  AboutContent.findOne().sort({ createdAt: -1 })
    .then(about => {
    if (!about) {
      return res.status(404).json({ error: 'No about content found' });
    }
    res.json(about);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
  });
});

// Get about content (protected)
app.get('/api/about', authenticateToken, (req, res) => {
  AboutContent.findOne().sort({ createdAt: -1 })
    .then(about => {
    if (!about) {
      return res.status(404).json({ error: 'No about content found' });
    }
    res.json(about);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
  });
});

// Update about content (protected)
app.put('/api/about', authenticateToken, (req, res) => {
  const { journey_title, journey_points, education_title, education_items, strengths_title, strengths_list } = req.body;
  
  AboutContent.findOneAndUpdate({}, {
    journey_title,
    journey_points,
    education_title,
    education_items,
    strengths_title,
    strengths_list
  }, { new: true, upsert: true })
    .then(about => {
        res.json({ message: 'About content updated successfully' });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// Contact Info API endpoints

// Get contact info (public)
app.get('/api/public/contact', (req, res) => {
  ContactInfo.findOne().sort({ createdAt: -1 })
    .then(contact => {
    if (!contact) {
      return res.status(404).json({ error: 'No contact info found' });
    }
    res.json(contact);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
  });
});

// Get contact info (protected)
app.get('/api/contact-info', authenticateToken, (req, res) => {
  ContactInfo.findOne().sort({ createdAt: -1 })
    .then(contact => {
    if (!contact) {
      return res.status(404).json({ error: 'No contact info found' });
    }
    res.json(contact);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
  });
});

// Update contact info (protected)
app.put('/api/contact-info', authenticateToken, (req, res) => {
  const { title, subtitle, description, location, email, github_url, linkedin_url } = req.body;
  
  ContactInfo.findOneAndUpdate({}, {
    title, subtitle, description, location, email, github_url, linkedin_url
  }, { new: true, upsert: true })
    .then(contact => {
        res.json({ message: 'Contact info updated successfully' });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// --- Add health check endpoint if not present ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Temporary endpoint to fix image URLs in production
app.post('/api/fix-image-urls', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  
  console.log('🔧 Fixing image URLs with base URL:', baseUrl);
  
  // Fix hero content
  // This section is no longer needed as hero content functionality is not in the new schema.
    
    // Fix projects
  // This section is no longer needed as project functionality is not in the new schema.
      
      // Fix certifications
  // This section is no longer needed as certification functionality is not in the new schema.
        
        res.json({ 
    message: 'Image URLs fix attempted (no image URLs to fix in new schema)',
    heroFixed: 0,
    totalFixed: 0
  });
});

// Logout endpoint
app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('admin_token');
  res.json({ message: 'Logged out successfully' });
});

// Serve uploaded AI tool images statically
app.use('/uploads/ai-tools', express.static(path.join(__dirname, 'uploads', 'ai-tools')));

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
}); 