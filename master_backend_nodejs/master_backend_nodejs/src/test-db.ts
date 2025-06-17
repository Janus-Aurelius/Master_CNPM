import { Database } from './config/database';

async function testConnection() {
    try {
        console.log('Testing database connection...');
        
        // Initialize database connection
        Database.initialize();
        
        // Test query
        const result = await Database.query('SELECT NOW() as current_time');
        console.log('Connection successful!');
        console.log('Current database time:', result[0].current_time);
        
        // Test a more complex query
        const tables = await Database.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log('\nAvailable tables:');
        tables.forEach(table => console.log('-', table.table_name));
        
    } catch (error) {
        console.error('Connection failed:', error);
    } finally {
        // Close connection
        await Database.end();
    }
}

// Run test
testConnection(); 