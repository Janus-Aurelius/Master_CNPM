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