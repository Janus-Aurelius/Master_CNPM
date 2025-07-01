// Test script for financial routes
// Run with: node test-financial-routes.js

const API_BASE = 'http://localhost:3000/api/financial';

// Test endpoints (you need to have server running and authentication token)
const testEndpoints = [
    {
        name: 'Dashboard Overview',
        method: 'GET',
        url: `${API_BASE}/dashboard/overview?semesterId=HK2024_1`,
        description: 'Get dashboard statistics'
    },
    {
        name: 'Payment Status List', 
        method: 'GET',
        url: `${API_BASE}/payment/status?semesterId=HK2024_1&page=1&limit=10`,
        description: 'Get payment status list for semester'
    },
    {
        name: 'Priority Objects',
        method: 'GET', 
        url: `${API_BASE}/config/priority-objects`,
        description: 'Get all priority objects'
    },
    {
        name: 'Course Types',
        method: 'GET',
        url: `${API_BASE}/config/course-types`, 
        description: 'Get all course types with pricing'
    },
    {
        name: 'Payment Deadline',
        method: 'GET',
        url: `${API_BASE}/config/payment-deadline`,
        description: 'Get current semester payment deadline'
    },
    {
        name: 'Health Check',
        method: 'GET',
        url: `${API_BASE}/health`,
        description: 'Financial module health check'
    }
];

console.log('=== Financial Module API Endpoints ===\n');

testEndpoints.forEach((endpoint, index) => {
    console.log(`${index + 1}. ${endpoint.name}`);
    console.log(`   ${endpoint.method} ${endpoint.url}`);
    console.log(`   Description: ${endpoint.description}\n`);
});

console.log('=== Sample POST Requests ===\n');

console.log('1. Confirm Payment:');
console.log('POST /api/financial/payment/confirm');
console.log('Content-Type: application/json');
console.log(JSON.stringify({
    studentId: "SV001",
    amount: 5000000,
    paymentMethod: "bank_transfer", 
    semester: "HK2024_1",
    paymentDate: new Date().toISOString(),
    notes: "Test payment"
}, null, 2));

console.log('\n2. Create Priority Object:');
console.log('POST /api/financial/config/priority-objects');
console.log('Content-Type: application/json');
console.log(JSON.stringify({
    priorityId: "TEST01",
    priorityName: "Test Priority Object",
    discountAmount: 1000000
}, null, 2));

console.log('\n3. Update Course Type Price:');
console.log('PUT /api/financial/config/course-types/LT/price');
console.log('Content-Type: application/json');
console.log(JSON.stringify({
    newPrice: 350000
}, null, 2));

console.log('\n=== Authentication Required ===');
console.log('All endpoints require authentication token in header:');
console.log('Authorization: Bearer <your-jwt-token>');
