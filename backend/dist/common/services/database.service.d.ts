import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
export declare class DatabaseService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findUserByEmail(email: string): Promise<User | null>;
    findUserById(id: string): Promise<User | null>;
    createUser(userData: Partial<User>): Promise<User>;
    updateUser(id: string, userData: Partial<User>): Promise<User>;
    deleteUser(id: string): Promise<void>;
    userHasRole(userId: string, roleCode: string): Promise<boolean>;
    getUserRoles(userId: string): Promise<string[]>;
}
