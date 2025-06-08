// Password hashing utility for database users
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

async function hashExistingPasswords() {
    try {
        // Get all users with plain text passwords
        const result = await pool.query('SELECT id, email, password FROM users WHERE status = true');
        const users = result.rows;
        
        console.log(`Found ${users.length} users to update`);
        
        for (const user of users) {
            // Check if password is already hashed
            if (user.password.startsWith('$2b$')) {
                console.log(`User ${user.email} already has hashed password`);
                continue;
            }
            
            // Hash the plain text password
            const hashedPassword = await bcrypt.hash(user.password, 10);
            
            // Update the user's password in database
            await pool.query(
                'UPDATE users SET password = $1 WHERE id = $2',
                [hashedPassword, user.id]
            );
            
            console.log(`Updated password for user: ${user.email}`);
        }
          console.log('Password hashing completed!');
    } catch (error) {
        console.error('Error hashing passwords:', error.message);
    }
}

// Also create some test users with known passwords
async function createTestUsers() {
    try {
        const testUsers = [
            {
                email: 'sv001@student.edu',
                name: 'Sinh Viên Test 1',
                role: 'student',
                password: 'student123'
            },
            {
                email: 'gv001@lecturer.edu',
                name: 'Giảng Viên Test 1', 
                role: 'academic',
                password: 'teacher123'
            },
            {
                email: 'admin@system.edu',
                name: 'Admin Test',
                role: 'admin', 
                password: 'admin123'
            }
        ];
        
        for (const user of testUsers) {
            // Check if user already exists
            const existing = await pool.query('SELECT id FROM users WHERE email = $1', [user.email]);
            if (existing.rows.length > 0) {
                console.log(`User ${user.email} already exists`);
                continue;
            }
            
            // Hash password
            const hashedPassword = await bcrypt.hash(user.password, 10);
            
            // Insert new user
            await pool.query(
                'INSERT INTO users (email, name, role, password, status) VALUES ($1, $2, $3, $4, true)',
                [user.email, user.name, user.role, hashedPassword]
            );
            
            console.log(`Created test user: ${user.email} with password: ${user.password}`);
        }
          } catch (error) {
        console.error('Error creating test users:', error.message);
    }
}

// Run both functions
async function main() {
    console.log('=== Hashing existing passwords ===');
    await hashExistingPasswords();
      console.log('\n=== Creating test users ===');
    await createTestUsers();
    
    console.log('\n=== Done ===');
    await pool.end();
    process.exit(0);
}

main();
