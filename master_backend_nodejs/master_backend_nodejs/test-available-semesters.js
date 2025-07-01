// Test new available semesters API
const http = require('http');

async function testAvailableSemesters() {
    console.log('🔍 Testing available semesters API...');
    
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/financial/payment/available-semesters',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlUwMDMiLCJ1c2VybmFtZSI6ImtldG9hbiIsInJvbGUiOiJmaW5hbmNpYWwiLCJpYXQiOjE3NTA1MjY1NDAsImV4cCI6MTc1MDYxMjk0MH0.ylpyiY6a2yQ9NolZ_KKKa9_Jb85BBMkANYxZlhyVGFE'
        }
    };

    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            console.log(`📊 Status: ${res.statusCode}`);
            
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    console.log('✅ Available semesters:', JSON.stringify(jsonData, null, 2));
                    
                    if (jsonData.success && jsonData.data) {
                        console.log('\n📚 Semester summary:');
                        jsonData.data.forEach(semester => {
                            console.log(`  - ${semester.semesterId}: ${semester.studentCount} students`);
                        });
                    }
                    
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

async function testTokenIssue() {
    console.log('\n🔍 Testing why frontend gets 0 students...');
    
    // Test without token
    console.log('\n--- Test 1: No token ---');
    const optionsNoToken = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/financial/payment/status?semesterId=HK1_2024',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    
    try {
        const resultNoToken = await new Promise((resolve) => {
            const req = http.request(optionsNoToken, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    try {
                        const jsonData = JSON.parse(data);
                        console.log('Response without token:', jsonData);
                        resolve(jsonData);
                    } catch (error) {
                        resolve({ error: data });
                    }
                });
            });
            req.on('error', () => resolve({ error: 'Request failed' }));
            req.end();
        });
    } catch (error) {
        console.log('No token test failed:', error);
    }
    
    // Test with token
    console.log('\n--- Test 2: With token ---');
    const optionsWithToken = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/financial/payment/status?semesterId=HK1_2024',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlUwMDMiLCJ1c2VybmFtZSI6ImtldG9hbiIsInJvbGUiOiJmaW5hbmNpYWwiLCJpYXQiOjE3NTA1MjY1NDAsImV4cCI6MTc1MDYxMjk0MH0.ylpyiY6a2yQ9NolZ_KKKa9_Jb85BBMkANYxZlhyVGFE'
        }
    };
    
    try {
        const resultWithToken = await new Promise((resolve) => {
            const req = http.request(optionsWithToken, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    try {
                        const jsonData = JSON.parse(data);
                        console.log('Response with token:', { 
                            success: jsonData.success, 
                            studentCount: jsonData.data?.length || 0,
                            pagination: jsonData.pagination 
                        });
                        resolve(jsonData);
                    } catch (error) {
                        resolve({ error: data });
                    }
                });
            });
            req.on('error', () => resolve({ error: 'Request failed' }));
            req.end();
        });
    } catch (error) {
        console.log('With token test failed:', error);
    }
}

async function main() {
    try {
        await testAvailableSemesters();
        await testTokenIssue();
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        process.exit(0);
    }
}

main();
