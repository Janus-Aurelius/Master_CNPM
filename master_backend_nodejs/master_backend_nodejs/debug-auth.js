// Debug authentication issue
const http = require('http');

async function testAuthenticationIssue() {
    console.log('🔍 Testing authentication issue...');
    
    // Test without token
    console.log('\n--- Test 1: Without Authorization header ---');
    const optionsNoAuth = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/financial/payment/status?semesterId=HK1_2024',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const result1 = await new Promise((resolve, reject) => {
            const req = http.request(optionsNoAuth, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    try {
                        const jsonData = JSON.parse(data);
                        console.log('No Auth Response:', {
                            status: res.statusCode,
                            dataLength: jsonData.data?.length || 0,
                            success: jsonData.success
                        });
                        resolve(jsonData);
                    } catch (error) {
                        resolve({ error: data });
                    }
                });
            });
            req.on('error', reject);
            req.end();
        });
    } catch (error) {
        console.log('No Auth Error:', error.message);
    }

    // Test with token
    console.log('\n--- Test 2: With Authorization header ---');
    const optionsWithAuth = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/financial/payment/status?semesterId=HK1_2024',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlUwMDMiLCJ1c2VybmFtZSI6ImtldG9hbiIsInJvbGUiOiJmaW5hbmNpYWwiLCJpYXQiOjE3NTA1MjgwMjAsImV4cCI6MTc1MDYxNDQyMH0.WB9Wbolbh32JjZTzDv3L7Ix07Gdt6n9REYIdwyOeO9Q'
        }
    };

    try {
        const result2 = await new Promise((resolve, reject) => {
            const req = http.request(optionsWithAuth, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    try {
                        const jsonData = JSON.parse(data);
                        console.log('With Auth Response:', {
                            status: res.statusCode,
                            dataLength: jsonData.data?.length || 0,
                            success: jsonData.success
                        });
                        resolve(jsonData);
                    } catch (error) {
                        resolve({ error: data });
                    }
                });
            });
            req.on('error', reject);
            req.end();
        });
    } catch (error) {
        console.log('With Auth Error:', error.message);
    }

    console.log('\n🎯 Conclusion: If "With Auth" has data but "No Auth" has 0 data, then the issue is authentication in frontend.');
}

testAuthenticationIssue().then(() => {
    process.exit(0);
}).catch(console.error);
