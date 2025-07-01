// Test to check course registration data
const http = require('http');

async function testCourseRegistrationData() {
    console.log('🔍 Testing course registration data...');
    
    // Test query to check if there's data in related tables
    const testQueries = [
        "SELECT COUNT(*) as count FROM CT_PHIEUDANGKY WHERE MaPhieuDangKy IN (SELECT MaPhieuDangKy FROM PHIEUDANGKY WHERE MaHocKy = 'HK1_2024')",
        "SELECT COUNT(*) as count FROM MONHOC",
        "SELECT COUNT(*) as count FROM LOAIMON", 
        "SELECT COUNT(*) as count FROM DOITUONGUUTIEN",
        "SELECT COUNT(*) as count FROM PHIEUTHUHP WHERE MaPhieuDangKy IN (SELECT MaPhieuDangKy FROM PHIEUDANGKY WHERE MaHocKy = 'HK1_2024')"
    ];
    
    // For now just check one student's detailed calculation
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/financial/payment/status?semesterId=HK1_2024&limit=1',
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
                    console.log('✅ One student detail:');
                    if (jsonData.data && jsonData.data.length > 0) {
                        const student = jsonData.data[0];
                        console.log('Student ID:', student.studentId);
                        console.log('Student Name:', student.studentName);
                        console.log('Total Amount:', student.totalAmount);
                        console.log('Paid Amount:', student.paidAmount);
                        console.log('Remaining:', student.remainingAmount);
                        console.log('Payment Status:', student.paymentStatus);
                        console.log('Payment History:', student.paymentHistory);
                        
                        // The issue is clear: totalAmount = 0 means no course registration data
                        if (student.totalAmount === 0) {
                            console.log('\n❌ ISSUE FOUND: totalAmount is 0');
                            console.log('This means either:');
                            console.log('1. No course registration data in CT_PHIEUDANGKY');
                            console.log('2. No course fee data in MONHOC/LOAIMON');  
                            console.log('3. Missing discount data in DOITUONGUUTIEN');
                        }
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

testCourseRegistrationData().then(() => {
    console.log('\n✅ Analysis complete!');
    process.exit(0);
}).catch(console.error);
