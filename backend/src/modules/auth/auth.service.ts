import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { User, Role, UserRole } from '../../database/entities/user.entity';
import { RegisterDto } from './dto/register.dto';

/**
 * @class AuthService
 * @description This service handles all authentication-related logic, including user registration, login, token generation, and profile management.
 */
@Injectable()
export class AuthService {
  /**
   * @constructor
   * @param {Repository<User>} userRepository - Repository for User entities.
   * @param {Repository<Role>} roleRepository - Repository for Role entities.
   * @param {Repository<UserRole>} userRoleRepository - Repository for the join table between users and roles.
   * @param {JwtService} jwtService - Service for creating and verifying JSON Web Tokens.
   * @param {ConfigService} configService - Service for accessing configuration variables.
   */
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
   * @method register
   * @description Registers a new user, hashes their password, assigns a default role, and returns authentication tokens.
   * @param {RegisterDto} registerDto - The data for the new user.
   * @returns {Promise<object>} A promise that resolves to an object containing the sanitized user and JWT tokens.
   * @throws {ConflictException} If a user with the provided email already exists.
   */
  async register(registerDto: RegisterDto): Promise<any> {
    const { email, password, fullName, phone, tenantId } = registerDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = this.userRepository.create({
      email,
      passwordHash,
      fullName,
      phone,
      tenantId,
      isActive: true,
    });

    const savedUser = await this.userRepository.save(user);

    const defaultRole = await this.roleRepository.findOne({ where: { code: 'user' } });
    if (defaultRole) {
      const userRole = this.userRoleRepository.create({
        userId: savedUser.id,
        roleId: defaultRole.id,
      });
      await this.userRoleRepository.save(userRole);
    }

    const tokens = await this.generateTokens(savedUser);

    return {
      user: this.sanitizeUser(savedUser),
      ...tokens,
    };
  }

  /**
   * @method validateUser
   * @description Validates a user's credentials by comparing the provided password with the stored hash.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's plain-text password.
   * @returns {Promise<User | null>} A promise that resolves to the User entity if validation is successful, otherwise null.
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
   * @method login
   * @description Generates JWT tokens for an already authenticated user.
   * @param {User} user - The authenticated user entity.
   * @returns {Promise<object>} A promise that resolves to an object containing the sanitized user and JWT tokens.
   */
  async login(user: User): Promise<any> {
    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  /**
   * @method refreshToken
   * @description Generates a new set of access and refresh tokens using a valid refresh token.
   * @param {string} refreshToken - The refresh token to be verified.
   * @returns {Promise<object>} A promise that resolves to an object containing the sanitized user and new JWT tokens.
   * @throws {UnauthorizedException} If the refresh token is invalid or the user is not found or inactive.
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
   * @method logout
   * @description Logs out a user. In a real application, this would involve token blacklisting.
   * @param {string} userId - The ID of the user to log out.
   * @returns {Promise<void>}
   */
  async logout(userId: string): Promise<void> {
    // In a real application, you might want to blacklist tokens
    console.log(`User ${userId} logged out`);
  }

  /**
   * @method getProfile
   * @description Retrieves the profile for the currently authenticated user.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<object>} A promise that resolves to the sanitized user profile.
   * @throws {UnauthorizedException} If the user is not found.
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
   * @method changePassword
   * @description Allows a user to change their password after verifying their current one.
   * @param {string} userId - The ID of the user changing their password.
   * @param {any} changePasswordDto - An object containing the current and new passwords.
   * @returns {Promise<void>}
   * @throws {UnauthorizedException} If the user is not found or the current password is incorrect.
   */
  async changePassword(userId: string, changePasswordDto: any): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    await this.userRepository.update(userId, { passwordHash: newPasswordHash });
  }

  /**
   * @method generateTokens
   * @description Generates JWT access and refresh tokens for a user.
   * @private
   * @param {User} user - The user entity for whom to generate tokens.
   * @returns {Promise<object>} A promise that resolves to an object containing the accessToken and refreshToken.
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
   * @method sanitizeUser
   * @description Removes sensitive properties (like passwordHash) from the user object before sending it in a response.
   * @private
   * @param {User} user - The user entity to sanitize.
   * @returns {object} The user object without the password hash.
   */
  private sanitizeUser(user: User): any {
    const { passwordHash, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}