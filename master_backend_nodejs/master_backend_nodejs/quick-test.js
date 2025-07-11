// Quick API test - simplified
const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/financial/priority-objects',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

console.log('Testing API endpoint...');

const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log('Response:', data);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.end();
