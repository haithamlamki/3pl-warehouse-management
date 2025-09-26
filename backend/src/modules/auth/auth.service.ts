import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { User, Role, UserRole } from '../../database/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Register a new user
   * @param registerDto Registration data
   * @returns User and tokens
   */
  async register(registerDto: RegisterDto): Promise<any> {
    const { email, password, fullName, phone, tenantId } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = this.userRepository.create({
      email,
      passwordHash,
      fullName,
      phone,
      tenantId,
      isActive: true,
    });

    const savedUser = await this.userRepository.save(user);

    // Assign default role (you can customize this logic)
    const defaultRole = await this.roleRepository.findOne({ where: { code: 'user' } });
    if (defaultRole) {
      const userRole = this.userRoleRepository.create({
        userId: savedUser.id,
        roleId: defaultRole.id,
      });
      await this.userRoleRepository.save(userRole);
    }

    // Generate tokens
    const tokens = await this.generateTokens(savedUser);

    return {
      user: this.sanitizeUser(savedUser),
      ...tokens,
    };
  }

  /**
   * Validate user credentials
   * @param email User email
   * @param password User password
   * @returns User if valid, null otherwise
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email, isActive: true },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      return user;
    }

    return null;
  }

  /**
   * Login user
   * @param user User entity
   * @returns User and tokens
   */
  async login(user: User): Promise<any> {
    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  /**
   * Refresh access token
   * @param refreshToken Refresh token
   * @returns New tokens
   */
  async refreshToken(refreshToken: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
        relations: ['userRoles', 'userRoles.role'],
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user);

      return {
        user: this.sanitizeUser(user),
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Logout user (invalidate tokens)
   * @param userId User ID
   */
  async logout(userId: string): Promise<void> {
    // In a real application, you might want to blacklist tokens
    // For now, we'll just return success
    console.log(`User ${userId} logged out`);
  }

  /**
   * Get user profile
   * @param userId User ID
   * @returns User profile
   */
  async getProfile(userId: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.sanitizeUser(user);
  }

  /**
   * Change user password
   * @param userId User ID
   * @param changePasswordDto Password change data
   */
  async changePassword(userId: string, changePasswordDto: any): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await this.userRepository.update(userId, { passwordHash: newPasswordHash });
  }

  /**
   * Generate access and refresh tokens
   * @param user User entity
   * @returns Tokens
   */
  private async generateTokens(user: User): Promise<any> {
    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      roles: user.userRoles?.map((ur) => ur.role.code) || [],
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '30d'),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Remove sensitive data from user object
   * @param user User entity
   * @returns Sanitized user
   */
  private sanitizeUser(user: User): any {
    const { passwordHash, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}
