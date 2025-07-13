const mongoose = require('mongoose');
require('dotenv').config();

// Define Resume model locally
const resumeSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  file_path: { type: String, required: true },
  size: { type: Number, required: true },
}, { timestamps: true });
const Resume = mongoose.model('Resume', resumeSchema);

async function fixResume() {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  // Remove all resumes that are not Cloudinary URLs
  const result = await Resume.deleteMany({ file_path: { $not: /^https?:\/\/res\.cloudinary\.com\// } });
  console.log(`Deleted ${result.deletedCount} invalid resume(s).`);

  // Optionally, if no resume remains, prompt to upload a new one via admin panel
  const count = await Resume.countDocuments();
  if (count === 0) {
    console.log('No valid resume found. Please upload a new resume from the admin panel.');
  } else {
    console.log('Valid resume(s) present.');
  }

  await mongoose.disconnect();
}

fixResume(); 