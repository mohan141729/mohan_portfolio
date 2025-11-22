// Run this script with: node backend/fix-project-categories.js
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://techlearn2005:mohanPortfolio@mohanportfolio.otpcvr7.mongodb.net/portfolio';

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  tech: [String],
  category: String,
  featured: Boolean,
  live: String,
  github: String,
  image: String,
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

async function fixCategories() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const result = await Project.updateMany(
    { $or: [ { category: { $exists: false } }, { category: '' }, { category: null } ] },
    { $set: { category: 'uncategorized' } }
  );
  console.log(`Updated ${result.modifiedCount} projects to have category 'uncategorized'.`);
  await mongoose.disconnect();
}

fixCategories().catch(err => {
  console.error('Error updating project categories:', err);
  process.exit(1);
}); 