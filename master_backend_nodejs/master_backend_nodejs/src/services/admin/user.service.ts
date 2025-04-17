// src/services/user.service.ts
import { User } from '../../models/user';

export class UserService {
    private users: User[] = [
        {
            id: 1,
            name: "Admin User",
            email: "admin@example.com",
            password: "admin123",
            role: "admin",
            status: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: 2,
            name: "Student User",
            email: "student@example.com",
            password: "student123",
            role: "student",
            status: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: 3,
            name: "Academic Staff",
            email: "academic@example.com",
            password: "academic123",
            role: "academic",
            status: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];

    async getAllUsers(): Promise<User[]> {
        return Promise.resolve(this.users);
    }

    async getUserById(id: number): Promise<User | undefined> {
        const user = this.users.find(u => u.id === id);
        return Promise.resolve(user);
    }

    async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
        const newUser: User = {
            ...userData,
            id: this.users.length + 1,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.users.push(newUser);
        return Promise.resolve(newUser);
    }

    async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
        const index = this.users.findIndex(u => u.id === id);
        if (index === -1) return undefined;

        this.users[index] = {
            ...this.users[index],
            ...userData,
            updatedAt: new Date()
        };
        return Promise.resolve(this.users[index]);
    }

    async deleteUser(id: number): Promise<boolean> {
        const index = this.users.findIndex(u => u.id === id);
        if (index === -1) return false;

        // Soft delete
        this.users[index].status = false;
        this.users[index].updatedAt = new Date();
        return Promise.resolve(true);
    }
}