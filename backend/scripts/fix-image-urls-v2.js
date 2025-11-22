const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, 'portfolio.db');
const db = new sqlite3.Database(dbPath);

console.log('🔧 Image URL Fix Script v2');
console.log('==========================\n');

// Get the base URL from environment or use a default
const getBaseUrl = () => {
  // For production, you should set this environment variable
  return process.env.BASE_URL || 'https://mohan-portfolio-5g5k.onrender.com';
};

const fixImageUrls = () => {
  const baseUrl = getBaseUrl();
  console.log('🎯 Target Base URL:', baseUrl);
  console.log('📁 Database Path:', dbPath);
  console.log('');

  // First, let's see what we have
  console.log('📊 Current Database State:');
  
  db.all('SELECT name FROM sqlite_master WHERE type="table"', (err, tables) => {
    if (err) {
      console.error('❌ Error checking tables:', err);
      return;
    }
    
    console.log('📋 Available tables:', tables.map(t => t.name).join(', '));
    console.log('');

    // Check hero content
    db.all('SELECT id, profile_image, background_image FROM hero_content', (err, rows) => {
      if (err) {
        console.error('❌ Error checking hero content:', err);
      } else {
        console.log('👤 Hero Content Images:');
        if (rows.length === 0) {
          console.log('   No hero content found');
        } else {
          rows.forEach(row => {
            console.log(`   ID: ${row.id}`);
            console.log(`     Profile: ${row.profile_image || 'NULL'}`);
            console.log(`     Background: ${row.background_image || 'NULL'}`);
          });
        }
        console.log('');

        // Now fix the URLs
        console.log('🔧 Fixing hero content URLs...');
        
        db.run(`
          UPDATE hero_content 
          SET profile_image = REPLACE(profile_image, 'http://localhost:4000', ?),
              background_image = REPLACE(background_image, 'http://localhost:4000', ?)
          WHERE profile_image LIKE '%localhost:4000%' 
             OR background_image LIKE '%localhost:4000%'
        `, [baseUrl, baseUrl], function(err) {
          if (err) {
            console.error('❌ Error fixing hero content:', err);
          } else {
            console.log(`✅ Fixed ${this.changes} hero content records`);
          }
          
          // Check projects
          db.all('SELECT id, title, image FROM projects WHERE image IS NOT NULL', (err, rows) => {
            if (err) {
              console.error('❌ Error checking projects:', err);
            } else {
              console.log('📁 Project Images:');
              if (rows.length === 0) {
                console.log('   No projects with images found');
              } else {
                rows.forEach(row => {
                  console.log(`   ID: ${row.id}, Title: ${row.title}`);
                  console.log(`     Image: ${row.image}`);
                });
              }
              console.log('');

              console.log('🔧 Fixing project URLs...');
              db.run(`
                UPDATE projects 
                SET image = REPLACE(image, 'http://localhost:4000', ?)
                WHERE image LIKE '%localhost:4000%'
              `, [baseUrl], function(err) {
                if (err) {
                  console.error('❌ Error fixing projects:', err);
                } else {
                  console.log(`✅ Fixed ${this.changes} project records`);
                }
                
                // Check certifications
                db.all('SELECT id, name, image FROM certifications WHERE image IS NOT NULL', (err, rows) => {
                  if (err) {
                    console.error('❌ Error checking certifications:', err);
                  } else {
                    console.log('🏆 Certification Images:');
                    if (rows.length === 0) {
                      console.log('   No certifications with images found');
                    } else {
                      rows.forEach(row => {
                        console.log(`   ID: ${row.id}, Name: ${row.name}`);
                        console.log(`     Image: ${row.image}`);
                      });
                    }
                    console.log('');

                    console.log('🔧 Fixing certification URLs...');
                    db.run(`
                      UPDATE certifications 
                      SET image = REPLACE(image, 'http://localhost:4000', ?)
                      WHERE image LIKE '%localhost:4000%'
                    `, [baseUrl], function(err) {
                      if (err) {
                        console.error('❌ Error fixing certifications:', err);
                      } else {
                        console.log(`✅ Fixed ${this.changes} certification records`);
                      }
                      
                      console.log('\n🎉 Database fix completed!');
                      console.log('📝 Next steps:');
                      console.log('   1. Commit and push these changes');
                      console.log('   2. Wait for Render to redeploy');
                      console.log('   3. Test your frontend');
                      
                      // Close database
                      setTimeout(() => {
                        db.close((err) => {
                          if (err) {
                            console.error('❌ Error closing database:', err);
                          } else {
                            console.log('🔒 Database connection closed');
                          }
                        });
                      }, 1000);
                    });
                  }
                });
              });
            }
          });
        });
      }
    });
  });
};

// Run the fix
fixImageUrls(); 