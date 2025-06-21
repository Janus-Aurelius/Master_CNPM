// Test payment status API
const http = require('http');

async function testPaymentAPI() {
    console.log('🔍 Testing Payment Status API...');
    
    // Test with token in headers
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/financial/payment/status?semesterId=HK1_2024',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlUwMDMiLCJ1c2VybmFtZSI6ImtldG9hbiIsInJvbGUiOiJmaW5hbmNpYWwiLCJpYXQiOjE3NTA1MjY1NDAsImV4cCI6MTc1MDYxMjk0MH0.ylpyiY6a2yQ9NolZ_KKKa9_Jb85BBMkANYxZlhyVGFE'
        }
    };

    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            console.log(`📊 Status: ${res.statusCode}`);
            console.log(`📋 Headers:`, res.headers);
            
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    console.log('✅ Response:', JSON.stringify(jsonData, null, 2));
                    resolve(jsonData);
                } catch (error) {
                    console.log('📄 Raw Response:', data);
                    resolve(data);
                }
            });
        });

        req.on('error', (error) => {
            console.error('❌ Error:', error);
            reject(error);
        });

        req.end();
    });
}

// Test database directly
async function testDatabase() {
    console.log('\n🔍 Testing Database directly...');
    
    try {
        // Import after ensuring we're in the right directory
        const { DatabaseService } = require('./src/services/database/databaseService');
        
        // Test semester exists
        console.log('📅 Checking semester HK1_2024...');
        const semester = await DatabaseService.query('SELECT * FROM HOCKYNAMHOC WHERE MaHocKy = $1', ['HK1_2024']);
        console.log('Semester data:', semester);
        
        // Test registration records
        console.log('\n📚 Checking PHIEUDANGKY for HK1_2024...');
        const registrations = await DatabaseService.query('SELECT COUNT(*) as count FROM PHIEUDANGKY WHERE MaHocKy = $1', ['HK1_2024']);
        console.log('Registration count:', registrations);
        
        // Test available semesters
        console.log('\n📋 Available semesters:');
        const allSemesters = await DatabaseService.query('SELECT MaHocKy, NamHoc FROM HOCKYNAMHOC ORDER BY NamHoc DESC');
        console.log('All semesters:', allSemesters);
        
        // Test sample data with any available semester
        if (allSemesters.length > 0) {
            const sampleSemester = allSemesters[0].mahocky;
            console.log(`\n🔍 Testing with semester: ${sampleSemester}`);
            const sampleData = await DatabaseService.query(`
                SELECT 
                    pd.MaSoSinhVien,
                    sv.HoTen,
                    pd.MaHocKy
                FROM PHIEUDANGKY pd 
                JOIN SINHVIEN sv ON pd.MaSoSinhVien = sv.MaSoSinhVien 
                WHERE pd.MaHocKy = $1 
                LIMIT 3
            `, [sampleSemester]);
            console.log('Sample data:', sampleData);
        }
        
    } catch (error) {
        console.error('❌ Database test error:', error);
    }
}

async function main() {
    try {
        // Test database first
        await testDatabase();
        
        // Then test API
        await testPaymentAPI();
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        process.exit(0);
    }
}

main();
