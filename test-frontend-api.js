const axios = require('axios');

// Simulate frontend API call
async function testFrontendAPI() {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJnaWFuZ3ZpZW4iLCJyb2xlIjoiYWNhZGVtaWMiLCJpYXQiOjE3MzU5NzI4NzQsImV4cCI6MTczNTk3NjQ3NH0.YourValidTokenHere';
    
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:3000/api',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    try {
        console.log('Testing frontend API call...');
        
        // Test the exact API call that frontend makes
        const response = await axiosInstance.get('/academic/students/bulk-registration?semesterId=HK1_2024');
        
        console.log('✅ Frontend API call successful');
        console.log('Response status:', response.status);
        console.log('Response data type:', typeof response.data);
        console.log('Response data keys:', Object.keys(response.data));
        
        if (response.data.success) {
            console.log('✅ Response has success: true');
            console.log('Data is array:', Array.isArray(response.data.data));
            console.log('Data length:', response.data.data.length);
            
            if (response.data.data.length > 0) {
                console.log('First student:', response.data.data[0]);
                console.log('First student keys:', Object.keys(response.data.data[0]));
            }
        } else {
            console.log('❌ Response has success: false');
            console.log('Error message:', response.data.message);
        }
        
    } catch (error) {
        console.error('❌ Frontend API call failed:', error.response?.data || error.message);
    }
}

testFrontendAPI(); 