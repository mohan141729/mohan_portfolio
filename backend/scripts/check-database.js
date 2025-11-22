const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, 'portfolio.db');
const db = new sqlite3.Database(dbPath);

console.log('Checking database for image URLs...\n');

// Check hero content
db.all('SELECT id, profile_image, background_image FROM hero_content', (err, rows) => {
  if (err) {
    console.error('Error checking hero content:', err);
  } else {
    console.log('Hero Content Images:');
    rows.forEach(row => {
      console.log(`ID: ${row.id}`);
      console.log(`  Profile Image: ${row.profile_image}`);
      console.log(`  Background Image: ${row.background_image}`);
      console.log('');
    });
  }
});

// Check projects
db.all('SELECT id, title, image FROM projects WHERE image IS NOT NULL', (err, rows) => {
  if (err) {
    console.error('Error checking projects:', err);
  } else {
    console.log('Project Images:');
    rows.forEach(row => {
      console.log(`ID: ${row.id}, Title: ${row.title}`);
      console.log(`  Image: ${row.image}`);
      console.log('');
    });
  }
});

// Check certifications
db.all('SELECT id, name, image FROM certifications WHERE image IS NOT NULL', (err, rows) => {
  if (err) {
    console.error('Error checking certifications:', err);
  } else {
    console.log('Certification Images:');
    rows.forEach(row => {
      console.log(`ID: ${row.id}, Name: ${row.name}`);
      console.log(`  Image: ${row.image}`);
      console.log('');
    });
  }
});

// Close database after checking
setTimeout(() => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
  });
}, 2000); 