// Add this to your server.js file temporarily
// This endpoint will fix image URLs in the production database

app.post('/api/fix-image-urls', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  
  console.log('🔧 Fixing image URLs with base URL:', baseUrl);
  
  // Fix hero content
  db.run(`
    UPDATE hero_content 
    SET profile_image = REPLACE(profile_image, 'http://localhost:4000', ?),
        background_image = REPLACE(background_image, 'http://localhost:4000', ?)
    WHERE profile_image LIKE '%localhost:4000%' 
       OR background_image LIKE '%localhost:4000%'
  `, [baseUrl, baseUrl], function(err) {
    if (err) {
      console.error('Error fixing hero content:', err);
      return res.status(500).json({ error: err.message });
    }
    
    console.log('Fixed hero content images:', this.changes, 'rows affected');
    
    // Fix projects
    db.run(`
      UPDATE projects 
      SET image = REPLACE(image, 'http://localhost:4000', ?)
      WHERE image LIKE '%localhost:4000%'
    `, [baseUrl], function(err) {
      if (err) {
        console.error('Error fixing projects:', err);
        return res.status(500).json({ error: err.message });
      }
      
      console.log('Fixed project images:', this.changes, 'rows affected');
      
      // Fix certifications
      db.run(`
        UPDATE certifications 
        SET image = REPLACE(image, 'http://localhost:4000', ?)
        WHERE image LIKE '%localhost:4000%'
      `, [baseUrl], function(err) {
        if (err) {
          console.error('Error fixing certifications:', err);
          return res.status(500).json({ error: err.message });
        }
        
        console.log('Fixed certification images:', this.changes, 'rows affected');
        
        res.json({ 
          message: 'Image URLs fixed successfully',
          heroFixed: this.changes,
          totalFixed: this.changes
        });
      });
    });
  });
}); 