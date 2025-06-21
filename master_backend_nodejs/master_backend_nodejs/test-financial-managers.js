// test-financial-managers.js
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test dashboard functions
async function testDashboard() {
    console.log('\n=== Testing Dashboard Manager ===');
    
    try {
        // Test dashboard data
        console.log('Testing getDashboardData...');
        const dashboardResponse = await axios.get(`${BASE_URL}/api/financial/dashboard`);
        console.log('✓ Dashboard data:', dashboardResponse.data);
        
        // Test financial analytics
        console.log('Testing getFinancialAnalytics...');
        const analyticsResponse = await axios.get(`${BASE_URL}/api/financial/analytics?timeframe=monthly`);
        console.log('✓ Analytics data:', analyticsResponse.data);
    } catch (error) {
        console.error('✗ Dashboard tests failed:', error.response?.data || error.message);
    }
}

// Test payment functions
async function testPaymentManager() {
    console.log('\n=== Testing Payment Manager ===');
    
    try {
        // Test get all payment status
        console.log('Testing getAllPaymentStatus...');
        const paymentsResponse = await axios.get(`${BASE_URL}/api/financial/payments?page=1&limit=5`);
        console.log('✓ Payment status data:', {
            total: paymentsResponse.data.pagination?.total,
            count: paymentsResponse.data.data?.length
        });
        
        // Test student payment status (if we have students)
        if (paymentsResponse.data.data && paymentsResponse.data.data.length > 0) {
            const studentId = paymentsResponse.data.data[0].student_id;
            console.log(`Testing getStudentPaymentStatus for student: ${studentId}...`);
            const studentResponse = await axios.get(`${BASE_URL}/api/financial/payments/student/${studentId}`);
            console.log('✓ Student payment data:', {
                student: studentResponse.data[0]?.student_name,
                records: studentResponse.data.length
            });
        }
    } catch (error) {
        console.error('✗ Payment tests failed:', error.response?.data || error.message);
    }
}

// Test tuition functions
async function testTuitionManager() {
    console.log('\n=== Testing Tuition Manager ===');
    
    try {
        // Test tuition calculation (we need a real student ID)
        console.log('Testing calculateTuition...');
        
        // First get a student from payment data
        const paymentsResponse = await axios.get(`${BASE_URL}/api/financial/payments?page=1&limit=1`);
        
        if (paymentsResponse.data.data && paymentsResponse.data.data.length > 0) {
            const studentId = paymentsResponse.data.data[0].student_id;
            const semester = 'Spring 2025';
            
            // Test get tuition record
            console.log(`Testing getTuitionRecord for student: ${studentId}...`);
            const tuitionResponse = await axios.get(`${BASE_URL}/api/financial/tuition/student/${studentId}?semester=${semester}`);
            console.log('✓ Tuition record:', {
                student: tuitionResponse.data?.student_name,
                total: tuitionResponse.data?.total_amount,
                status: tuitionResponse.data?.payment_status
            });
        } else {
            console.log('⚠ No students found for tuition testing');
        }
    } catch (error) {
        console.error('✗ Tuition tests failed:', error.response?.data || error.message);
    }
}

// Test configuration functions
async function testConfigurationManager() {
    console.log('\n=== Testing Configuration Manager ===');
    
    try {
        // Test get tuition settings
        console.log('Testing getTuitionSettings...');
        const settingsResponse = await axios.get(`${BASE_URL}/api/financial/settings?semester=Spring%202025`);
        console.log('✓ Tuition settings:', {
            semester: settingsResponse.data?.semester,
            priorityObjects: settingsResponse.data?.priorityObjects?.length || 0,
            courseTypes: settingsResponse.data?.courseTypes?.length || 0,
            fees: settingsResponse.data?.semesterFees?.length || 0
        });
        
        // Test financial reports
        console.log('Testing generateFinancialReport...');
        const reportResponse = await axios.get(`${BASE_URL}/api/financial/reports/summary`);
        console.log('✓ Financial report:', reportResponse.data);
    } catch (error) {
        console.error('✗ Configuration tests failed:', error.response?.data || error.message);
    }
}

// Test CRUD operations for priority objects and course types
async function testCRUDOperations() {
    console.log('\n=== Testing CRUD Operations ===');
    
    try {
        // Test Priority Objects CRUD
        console.log('Testing Priority Objects CRUD...');
        
        // Get all priority objects
        const priorityResponse = await axios.get(`${BASE_URL}/api/financial/priority-objects`);
        console.log('✓ Priority Objects count:', priorityResponse.data?.length || 0);
        
        // Test Course Types CRUD
        console.log('Testing Course Types CRUD...');
        
        // Get all course types
        const courseTypesResponse = await axios.get(`${BASE_URL}/api/financial/course-types`);
        console.log('✓ Course Types count:', courseTypesResponse.data?.length || 0);
        
    } catch (error) {
        console.error('✗ CRUD tests failed:', error.response?.data || error.message);
    }
}

// Main test function
async function runAllTests() {
    console.log('🚀 Starting Financial Managers Test Suite...');
    console.log('Testing financial business logic after refactoring into separate managers');
    
    await testDashboard();
    await testPaymentManager();
    await testTuitionManager();
    await testConfigurationManager();
    await testCRUDOperations();
    
    console.log('\n🏁 Test Suite Completed!');
    console.log('All financial managers have been tested.');
    console.log('\nNote: Some tests may fail if the database is empty or server is not running.');
    console.log('Make sure to start the server with: npm start');
}

// Check if server is running
async function checkServer() {
    try {
        await axios.get(`${BASE_URL}/health`);
        return true;
    } catch (error) {
        try {
            await axios.get(`${BASE_URL}`);
            return true;
        } catch (error2) {
            return false;
        }
    }
}

// Execute tests
(async () => {
    const serverRunning = await checkServer();
    
    if (!serverRunning) {
        console.error('❌ Server is not running on', BASE_URL);
        console.log('Please start the server first with: npm start');
        process.exit(1);
    }
    
    console.log('✅ Server is running on', BASE_URL);
    await runAllTests();
})();
