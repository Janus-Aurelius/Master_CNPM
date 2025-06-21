// Test Financial API Endpoints
const http = require('http');

// Test function for HTTP requests
const testEndpoint = (path, method = 'GET', data = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: `/api/financial${path}`,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(responseData);
                    resolve({ status: res.statusCode, data: jsonData });
                } catch (e) {
                    resolve({ status: res.statusCode, data: responseData });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
};

async function runTests() {
    console.log('🧪 Testing Financial API Endpoints...\n');

    try {
        // Test 1: Get all priority objects
        console.log('1. Testing GET /priority-objects');
        const test1 = await testEndpoint('/priority-objects');
        console.log(`   Status: ${test1.status}`);
        console.log(`   Response:`, test1.data);
        
        // Test 2: Get all course types
        console.log('\n2. Testing GET /course-types');
        const test2 = await testEndpoint('/course-types');
        console.log(`   Status: ${test2.status}`);
        console.log(`   Response:`, test2.data);

        // Test 3: Test invalid endpoint
        console.log('\n3. Testing GET /invalid-endpoint');
        const test3 = await testEndpoint('/invalid-endpoint');
        console.log(`   Status: ${test3.status}`);
        console.log(`   Response:`, test3.data);

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run tests
runTests().then(() => {
    console.log('\n✅ Test completed!');
}).catch(console.error);
