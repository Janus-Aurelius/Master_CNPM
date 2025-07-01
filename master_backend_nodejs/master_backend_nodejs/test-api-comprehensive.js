// Test API without semesterId to see all data
const http = require('http');

async function testWithoutSemesterId() {
    console.log('🔍 Testing API without semesterId...');
    
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/financial/payment/status', // No semesterId
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
                    console.log('✅ Response without semesterId:', JSON.stringify(jsonData, null, 2));
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

async function testAllSemesters() {
    console.log('\n🔍 Testing with different semesters...');
    
    const semesters = ['HK1_2023', 'HK2_2023', 'HK1_2024', 'HK2_2024'];
    
    for (const semester of semesters) {
        console.log(`\n--- Testing semester: ${semester} ---`);
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: `/api/financial/payment/status?semesterId=${semester}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlUwMDMiLCJ1c2VybmFtZSI6ImtldG9hbiIsInJvbGUiOiJmaW5hbmNpYWwiLCJpYXQiOjE3NTA1MjY1NDAsImV4cCI6MTc1MDYxMjk0MH0.ylpyiY6a2yQ9NolZ_KKKa9_Jb85BBMkANYxZlhyVGFE'
            }
        };

        try {
            const result = await new Promise((resolve, reject) => {
                const req = http.request(options, (res) => {
                    let data = '';
                    res.on('data', (chunk) => { data += chunk; });
                    res.on('end', () => {
                        try {
                            const jsonData = JSON.parse(data);
                            console.log(`${semester} - Count: ${jsonData.data?.length || 0}`);
                            if (jsonData.data?.length > 0) {
                                console.log(`${semester} - Sample:`, jsonData.data[0].studentName);
                            }
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
            console.log(`${semester} - Error:`, error.message);
        }
    }
}

async function main() {
    try {
        await testWithoutSemesterId();
        await testAllSemesters();
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        process.exit(0);
    }
}

main();
