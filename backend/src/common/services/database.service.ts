import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Get user by email
   * @param email User email
   * @returns User entity or null
   */
  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['userRoles', 'userRoles.role'],
    });
  }

  /**
   * Get user by ID
   * @param id User ID
   * @returns User entity or null
   */
  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['userRoles', 'userRoles.role'],
    });
  }

  /**
   * Create a new user
   * @param userData User data
   * @returns Created user
   */
  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  /**
   * Update user
   * @param id User ID
   * @param userData User data to update
   * @returns Updated user
   */
  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, userData);
    return this.findUserById(id);
  }

  /**
   * Soft delete user
   * @param id User ID
   */
  async deleteUser(id: string): Promise<void> {
    await this.userRepository.update(id, { isActive: false });
  }

  /**
   * Check if user has specific role
   * @param userId User ID
   * @param roleCode Role code
   * @returns Boolean
   */
  async userHasRole(userId: string, roleCode: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!user) return false;

    return user.userRoles.some((userRole) => userRole.role.code === roleCode);
  }

  /**
   * Get user roles
   * @param userId User ID
   * @returns Array of role codes
   */
  async getUserRoles(userId: string): Promise<string[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!user) return [];

    return user.userRoles.map((userRole) => userRole.role.code);
  }
}
