// Test script để login và kiểm tra API
const axios = require('axios');

async function loginAndTestAPI() {
    try {
        console.log('🔐 Logging in with ketoan/123...');
        
        // Step 1: Login
        const loginRes = await axios.post('http://localhost:3000/api/auth/login', {
            username: 'ketoan',
            password: '123'
        });
          console.log('✅ Login successful:', loginRes.data);
        const token = loginRes.data.data?.token;
        
        if (!token) {
            console.error('❌ No token in login response');
            return;
        }
        
        // Step 2: Test available semesters with token
        console.log('\n📚 Testing available semesters with token...');
        const availableRes = await axios.get('http://localhost:3000/api/financial/payment/available-semesters', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('✅ Available semesters:', availableRes.data);
        
        // Step 3: Test payment status with token
        console.log('\n💰 Testing payment status with token...');
        const paymentRes = await axios.get('http://localhost:3000/api/financial/payment/status', {
            params: { semesterId: 'HK1_2023' },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('✅ Payment status response:', {
            success: paymentRes.data.success,
            dataLength: paymentRes.data.data?.length,
            total: paymentRes.data.pagination?.total
        });
        
        if (paymentRes.data.data && paymentRes.data.data.length > 0) {
            console.log('📝 Sample student data:', paymentRes.data.data[0]);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
    }
}

loginAndTestAPI();
