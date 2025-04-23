import { User } from '../models/user';

export class CreateUserDTO {
  name: string;
  email: string;
  password: string;

  constructor(data: any) {
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
  }

  toEntity(): User {
    return {
      id: 0, // Provide a default or appropriate value for id
      role: 'student', // Provide a default or appropriate value for role
      status: true, // Provide a default or appropriate value for status
      name: this.name,
      email: this.email,
      password: this.password,
    };
  }

  static fromEntity(user: User): CreateUserDTO {
    return new CreateUserDTO(user);
  }
}
