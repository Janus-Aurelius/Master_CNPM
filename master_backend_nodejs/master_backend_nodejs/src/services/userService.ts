// src/services/userService.ts
/**
 * Mock User Service
 * 
 * Trong môi trường production thực tế, service này sẽ kết nối với database
 * để lấy và lưu thông tin người dùng. Đối với đồ án nhỏ, chúng ta sử dụng
 * mock data để đơn giản hóa.
 */

// Mock user database - Quyền được xác định dựa trên email
const users = [
    { 
        id: 1, 
        email: 'student@uit.edu.vn', 
        name: 'Nguyễn Văn A', 
        role: 'student', // Sinh viên
        passwordHash: 'password' // Trong thực tế, đây phải là mật khẩu đã hash
    },
    { 
        id: 2, 
        email: 'financial@uit.edu.vn', 
        name: 'Trần Thị B', 
        role: 'financial', // Phòng tài chính
        passwordHash: 'password' 
    },
    { 
        id: 3, 
        email: 'academic@uit.edu.vn', 
        name: 'Lê Văn C', 
        role: 'academic', // Phòng đào tạo
        passwordHash: 'password' 
    },
    { 
        id: 4, 
        email: 'admin@uit.edu.vn', 
        name: 'Phạm Quang D', 
        role: 'admin', // Quản trị viên
        passwordHash: 'password' 
    },
    // Thêm nhiều người dùng với các vai trò khác nhau để kiểm tra
    { 
        id: 5, 
        email: 'student123@uit.edu.vn', 
        name: 'Hoàng Thị E', 
        role: 'student',
        passwordHash: 'password' 
    },
];

// Token blacklist để quản lý đăng xuất
const tokenBlacklist = new Set<string>();

/**
 * Lấy thông tin người dùng theo email
 */
export const getUserByEmail = async (email: string) => {
    const user = users.find(u => u.email === email);
    return user || null;
};

/**
 * Lấy thông tin người dùng theo ID
 */
export const getUserById = async (id: number) => {
    const user = users.find(u => u.id === id);
    return user || null;
};

/**
 * Thêm token vào blacklist khi đăng xuất
 */
export const blacklistToken = (token: string) => {
    tokenBlacklist.add(token);
};

/**
 * Kiểm tra xem token có trong blacklist không
 */
export const isTokenBlacklisted = (token: string) => {
    return tokenBlacklist.has(token);
};
