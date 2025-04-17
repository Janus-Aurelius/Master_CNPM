import axios, { AxiosError } from 'axios';

export async function testRole(role: string) {
    try {
        console.log(`\n----- Testing ${role.toUpperCase()} role -----`);

        // Login
        const loginRes = await axios.post('http://localhost:3000/auth/login', {
            email: `${role}@example.com`,
            password: 'password'
        });

        console.log(`Logged in as ${role}`);

        // Extract token from response
        const token = loginRes.data.token;
        if (!token) {
            throw new Error('No token received in login response');
        }

        // Get the redirect URL from login response
        const redirectUrl = loginRes.data.redirectUrl;
        console.log(`Redirect URL for ${role}: ${redirectUrl}`);

        // Try accessing the role-specific dashboard using the token
        try {
            const dashboardRes = await axios.get(
                `http://localhost:3000${redirectUrl}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            console.log(`${role} dashboard access: SUCCESS`);
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.error(`${role} dashboard access: FAILED - ${error.response?.status} ${error.response?.statusText}`);
                console.error(error.response?.data);
            } else {
                console.error(`${role} dashboard access: FAILED - ${String(error)}`);
            }
        }

        // Try accessing admin dashboard (should fail except for admin)
        try {
            const adminRes = await axios.get(
                'http://localhost:3000/api/admin/dashboard',
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            console.log(`Admin access as ${role}: SUCCESS`);
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response?.status === 403) {
                console.log(`Admin access as ${role}: DENIED (expected for non-admin)`);
            } else if (error instanceof AxiosError) {
                console.error(`Admin access test failed: ${error.response?.status} ${error.response?.statusText}`);
                console.error(error.response?.data);
            } else {
                console.error(`Admin access test error: ${String(error)}`);
            }
        }
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error(`Error testing ${role}: ${error.response?.status} ${error.response?.statusText}`);
            console.error(error.response?.data || error.message);
        } else {
            console.error(`Error testing ${role}: ${String(error)}`);
        }
    }
}

// Test all roles sequentially with async/await
async function testAllRoles() {
    try {
        await testRole('student');
        await testRole('academic');
        await testRole('financial');
        await testRole('admin');
        console.log("\n----- All tests completed -----");
    } catch (error) {
        console.error("Test suite error:", error);
    }
}

// Run the tests
testAllRoles();

const BASE_URL = 'http://localhost:3000/api/admin';

// Test tạo user mới
async function testCreateUser() {
    try {
        const response = await axios.post(`${BASE_URL}/users`, {
            name: "Test User",
            email: "test@example.com",
            password: "test123",
            role: "student",
            phoneNumber: "0123456789",
            address: "Test Address"
        });
        console.log('Create User Response:', response.data);
        return response.data.data.id;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Create User Error:', error.response?.data || error.message);
        } else {
            console.error('Create User Error:', error);
        }
    }
}

// Test lấy danh sách users
async function testGetAllUsers() {
    try {
        const response = await axios.get(`${BASE_URL}/users`);
        console.log('Get All Users Response:', response.data);
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Get All Users Error:', error.response?.data || error.message);
        } else {
            console.error('Get All Users Error:', error);
        }
    }
}

// Test lấy user theo ID
async function testGetUserById(id: number) {
    try {
        const response = await axios.get(`${BASE_URL}/users/${id}`);
        console.log('Get User By ID Response:', response.data);
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Get User By ID Error:', error.response?.data || error.message);
        } else {
            console.error('Get User By ID Error:', error);
        }
    }
}

// Test cập nhật user
async function testUpdateUser(id: number) {
    try {
        const response = await axios.put(`${BASE_URL}/users/${id}`, {
            name: "Updated Test User",
            email: "updated@example.com",
            phoneNumber: "0987654321"
        });
        console.log('Update User Response:', response.data);
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Update User Error:', error.response?.data || error.message);
        } else {
            console.error('Update User Error:', error);
        }
    }
}

// Test xóa user
async function testDeleteUser(id: number) {
    try {
        const response = await axios.delete(`${BASE_URL}/users/${id}`);
        console.log('Delete User Response:', response.data);
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Delete User Error:', error.response?.data || error.message);
        } else {
            console.error('Delete User Error:', error);
        }
    }
}

// Chạy các test
async function runTests() {
    console.log('=== Starting Admin User Management Tests ===');
    
    // Test tạo user và lấy ID
    const userId = await testCreateUser();
    if (!userId) {
        console.log('Failed to create user, stopping tests');
        return;
    }

    // Test các chức năng khác
    await testGetAllUsers();
    await testGetUserById(userId);
    await testUpdateUser(userId);
    await testDeleteUser(userId);

    console.log('=== Tests Completed ===');
}

// Chạy tests
runTests().catch(console.error);