import { User } from '../../models/user.interface';

class UserService {
    private users: User[] = []; // In-memory storage, replace with database in production

    async getAllUsers(): Promise<User[]> {
        return this.users;
    }

    async getUserById(id: number): Promise<User | null> {
        return this.users.find(user => user.id === id) || null;
    }

    async createUser(userData: Omit<User, 'id'>): Promise<User> {
        const newUser: User = {
            ...userData,
            id: Date.now(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.users.push(newUser);
        return newUser;
    }

    async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
        const index = this.users.findIndex(user => user.id === id);
        if (index === -1) return null;

        this.users[index] = {
            ...this.users[index],
            ...userData,
            updatedAt: new Date()
        };
        return this.users[index];
    }

    async deleteUser(id: number): Promise<boolean> {
        const initialLength = this.users.length;
        this.users = this.users.filter(user => user.id !== id);
        return this.users.length !== initialLength;
    }

    async changeUserStatus(id: number, status: boolean): Promise<User | null> {
        return this.updateUser(id, { status });
    }
}

export default new UserService(); 