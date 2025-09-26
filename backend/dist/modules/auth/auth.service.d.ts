import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, Role, UserRole } from '../../database/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly userRepository;
    private readonly roleRepository;
    private readonly userRoleRepository;
    private readonly jwtService;
    private readonly configService;
    constructor(userRepository: Repository<User>, roleRepository: Repository<Role>, userRoleRepository: Repository<UserRole>, jwtService: JwtService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<any>;
    validateUser(email: string, password: string): Promise<User | null>;
    login(user: User): Promise<any>;
    refreshToken(refreshToken: string): Promise<any>;
    logout(userId: string): Promise<void>;
    getProfile(userId: string): Promise<any>;
    changePassword(userId: string, changePasswordDto: any): Promise<void>;
    private generateTokens;
    private sanitizeUser;
}
