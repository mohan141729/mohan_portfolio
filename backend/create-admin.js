const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'portfolio.db');
const db = new sqlite3.Database(dbPath);

const email = 'admin@example.com';
const password = 'admin123';

// Hash the password
const hashedPassword = bcrypt.hashSync(password, 10);

// Insert admin user
const stmt = db.prepare('INSERT OR REPLACE INTO admins (email, password_hash) VALUES (?, ?)');
stmt.run(email, hashedPassword, function(err) {
  if (err) {
    console.error('Error creating admin:', err);
  } else {
    console.log('✅ Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Hash:', hashedPassword);
  }
  stmt.finalize();
  db.close();
}); 