const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

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
  process.exit(1);
});

// Mongoose Models
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  tech: [String],
  featured: { type: Boolean, default: false },
  live: String,
  github: String,
  image: String,
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  proficiency: { type: Number, default: 50 },
  icon: String,
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

async function seedData() {
  try {
    console.log('Starting database seeding...');

    // Seed admin user
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const passwordHash = process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync('admin123', 10);
      await Admin.create({
        email: 'admin@example.com',
        password_hash: passwordHash
      });
      console.log('✅ Seeded admin user.');
    } else {
      console.log('ℹ️  Admin user already exists.');
    }

    // Seed projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.create([
        {
          title: 'Learning Path Generator',
          description: 'Full-stack AI-powered platform that generates personalized learning paths from Beginner to Advanced levels using Gemini API.',
          tech: ['React', 'Tailwind', 'Node.js', 'SQLite', 'Gemini API'],
          category: 'Fullstack',
          featured: true,
          live: '#',
          github: '#'
        },
        {
          title: 'Food Munch',
          description: 'Mobile-first food listing website with responsive design and modern UI components.',
          tech: ['HTML', 'CSS', 'Bootstrap'],
          category: 'Frontend',
          featured: false,
          live: '#',
          github: '#'
        },
        {
          title: 'Tourism Website',
          description: 'Destination galleries with virtual tours, Bootstrap carousel, and embedded videos.',
          tech: ['HTML', 'CSS', 'Bootstrap', 'JavaScript'],
          category: 'Frontend',
          featured: false,
          live: '#',
          github: '#'
        }
      ]);
      console.log('✅ Seeded sample projects.');
    } else {
      console.log('ℹ️  Projects already exist.');
    }

    // Seed skills
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      await Skill.create([
        { name: 'React', category: 'Frontend', proficiency: 90, icon: 'react' },
        { name: 'Node.js', category: 'Backend', proficiency: 85, icon: 'nodejs' },
        { name: 'JavaScript', category: 'Programming', proficiency: 95, icon: 'javascript' },
        { name: 'Python', category: 'Programming', proficiency: 80, icon: 'python' },
        { name: 'SQL', category: 'Database', proficiency: 85, icon: 'database' },
        { name: 'Git', category: 'Tools', proficiency: 90, icon: 'git' }
      ]);
      console.log('✅ Seeded sample skills.');
    } else {
      console.log('ℹ️  Skills already exist.');
    }

    // Seed certifications
    const certCount = await Certification.countDocuments();
    if (certCount === 0) {
      await Certification.create([
        {
          name: 'Full Stack Web Development',
          issuer: 'Coursera',
          issue_date: '2024-01-15',
          credential_id: 'FSWD-2024-001'
        },
        {
          name: 'React Developer',
          issuer: 'Meta',
          issue_date: '2024-03-20',
          credential_id: 'REACT-2024-002'
        }
      ]);
      console.log('✅ Seeded sample certifications.');
    } else {
      console.log('ℹ️  Certifications already exist.');
    }

    // Seed hero content
    const heroCount = await HeroContent.countDocuments();
    if (heroCount === 0) {
      await HeroContent.create({
        name: 'Mohan D',
        title: 'Full-Stack Developer | AI/ML Enthusiast',
        subtitle: 'Hi, I\'m Mohan D',
        description: 'Passionate about creating innovative web solutions and exploring the frontiers of artificial intelligence. Currently building full-stack applications with modern technologies.',
        profile_image: 'https://res.cloudinary.com/dovmtmu7y/image/upload/v1751693333/drilldown_iq6iin.jpg',
        background_image: 'https://res.cloudinary.com/dovmtmu7y/image/upload/v1751692323/hero-bg-CjdCbMYo_htrzjv.jpg',
        github_url: 'https://github.com/mohan-d',
        linkedin_url: 'https://linkedin.com/in/mohan-d',
        welcome_text: 'Welcome to my digital workspace'
      });
      console.log('✅ Seeded hero content.');
    } else {
      console.log('ℹ️  Hero content already exists.');
    }

    // Seed about content
    const aboutCount = await AboutContent.countDocuments();
    if (aboutCount === 0) {
      await AboutContent.create({
        journey_title: 'My Journey',
        journey_points: [
          { point: 'Passion for Technology: My journey began with curiosity about how websites work, evolving into a deep appreciation for seamless user experiences and innovative solutions.' },
          { point: 'Continuous Learning: Currently pursuing NxtWave\'s full-stack certification, expanding expertise in React, Node.js, and exploring AI/ML integration.' },
          { point: 'Future Goals: Seeking opportunities to contribute to innovative projects that make real impact, building intuitive interfaces and robust backend systems.' }
        ],
        education_title: 'Education Timeline',
        education_items: [
          { institution: 'ZP High School', details: '(10 CGPA)' },
          { institution: 'Viswa Bharathi Jr. College', details: '(95%)' },
          { institution: 'Sree Dattha', details: '(8.4 CGPA)' },
          { institution: 'NxtWave Full-Stack Certification', details: '(Ongoing)' }
        ],
        strengths_title: 'Core Strengths',
        strengths_list: ['Problem Solving', 'Collaboration', 'Adaptability', 'Creativity']
      });
      console.log('✅ Seeded about content.');
    } else {
      console.log('ℹ️  About content already exists.');
    }

    // Seed contact info
    const contactCount = await ContactInfo.countDocuments();
    if (contactCount === 0) {
      await ContactInfo.create({
        title: 'Get In Touch',
        subtitle: 'Let\'s Connect',
        description: 'I\'m passionate about creating innovative web solutions and exploring the frontiers of artificial intelligence. Currently building full-stack applications with modern technologies.',
        location: 'Hyderabad, Telangana, India',
        email: 'mohan.developer@gmail.com',
        github_url: 'https://github.com/mohan-d',
        linkedin_url: 'https://linkedin.com/in/mohan-d'
      });
      console.log('✅ Seeded contact info.');
    } else {
      console.log('ℹ️  Contact info already exists.');
    }

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedData(); 