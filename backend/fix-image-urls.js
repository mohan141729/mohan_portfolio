const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, 'portfolio.db');
const db = new sqlite3.Database(dbPath);

// Get the base URL from environment or use a default
const getBaseUrl = () => {
  // For production, you should set this environment variable
  return process.env.BASE_URL || 'https://mohan-portfolio-5g5k.onrender.com';
};

const fixImageUrls = () => {
  const baseUrl = getBaseUrl();
  console.log('Fixing image URLs with base URL:', baseUrl);

  // Fix hero content images
  db.run(`
    UPDATE hero_content 
    SET profile_image = REPLACE(profile_image, 'http://localhost:4000', ?),
        background_image = REPLACE(background_image, 'http://localhost:4000', ?)
    WHERE profile_image LIKE '%localhost:4000%' 
       OR background_image LIKE '%localhost:4000%'
  `, [baseUrl, baseUrl], function(err) {
    if (err) {
      console.error('Error fixing hero content images:', err);
    } else {
      console.log('Fixed hero content images:', this.changes, 'rows affected');
    }
  });

  // Fix project images
  db.run(`
    UPDATE projects 
    SET image = REPLACE(image, 'http://localhost:4000', ?)
    WHERE image LIKE '%localhost:4000%'
  `, [baseUrl], function(err) {
    if (err) {
      console.error('Error fixing project images:', err);
    } else {
      console.log('Fixed project images:', this.changes, 'rows affected');
    }
  });

  // Fix certification images
  db.run(`
    UPDATE certifications 
    SET image = REPLACE(image, 'http://localhost:4000', ?)
    WHERE image LIKE '%localhost:4000%'
  `, [baseUrl], function(err) {
    if (err) {
      console.error('Error fixing certification images:', err);
    } else {
      console.log('Fixed certification images:', this.changes, 'rows affected');
    }
  });

  // Close database after all operations
  setTimeout(() => {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed');
      }
    });
  }, 1000);
};

// Run the fix
fixImageUrls(); 