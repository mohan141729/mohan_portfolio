const bcrypt = require('bcryptjs');

const password = 'admin123';
const hash = bcrypt.hashSync(password, 10);
console.log('Password:', password);
console.log('Hash:', hash);

// Test the hash
const isMatch = bcrypt.compareSync(password, hash);
console.log('Hash verification:', isMatch); 