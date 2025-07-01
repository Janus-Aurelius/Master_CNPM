const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlUwMDIiLCJ1c2VybmFtZSI6ImdpYW5ndmllbiIsInJvbGUiOiJhY2FkZW1pYyIsImlhdCI6MTc1MDU4NjQyNywiZXhwIjoxNzUwNjcyODI3fQ.Ua9zU8rb4f_tHgAFvTMXvEIVODxtbPfOG9j2se2WjbY';

async function testBulkRegistrationAPI() {
    try {
        console.log('Testing bulk registration API with provided token...');

        // Create axios instance with token
        const authenticatedAxios = axios.create({
            baseURL: BASE_URL,
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        // Debug: Check what headers are being sent
        console.log('\nDebug: Request headers:', {
            'Authorization': `Bearer ${TOKEN.substring(0, 20)}...`,
            'Content-Type': 'application/json'
        });

        // Test 1: Check if endpoint exists
        console.log('\n1. Testing GET /api/academic/students/bulk-registration');
        try {
            const response = await authenticatedAxios.get('/academic/students/bulk-registration?semesterId=HK1_2024');
            console.log('✅ Success:', response.status, response.data);
        } catch (error) {
            console.log('❌ Error:', error.response?.status, error.response?.data || error.message);
            console.log('Full error response:', JSON.stringify(error.response?.data, null, 2));
        }

        // Test 2: Check semesters endpoint
        console.log('\n2. Testing GET /api/academic/students/semesters');
        try {
            const response = await authenticatedAxios.get('/academic/students/semesters');
            console.log('✅ Success:', response.status, response.data);
        } catch (error) {
            console.log('❌ Error:', error.response?.status, error.response?.data || error.message);
        }

        // Test 3: Check if academic routes are mounted
        console.log('\n3. Testing GET /api/academic/students');
        try {
            const response = await authenticatedAxios.get('/academic/students');
            console.log('✅ Success:', response.status, 'Students endpoint works');
        } catch (error) {
            console.log('❌ Error:', error.response?.status, error.response?.data || error.message);
        }

        // Test 4: Check if server is running
        console.log('\n4. Testing server health');
        try {
            const response = await axios.get(`${BASE_URL}/auth/health`);
            console.log('✅ Server is running');
        } catch (error) {
            console.log('❌ Server might not be running or health endpoint not found');
        }

    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

testBulkRegistrationAPI(); 