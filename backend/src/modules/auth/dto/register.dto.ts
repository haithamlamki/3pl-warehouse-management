import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsUUID, IsOptional } from 'class-validator';

/**
 * @class RegisterDto
 * @description Data transfer object for user registration.
 */
export class RegisterDto {
  /**
   * The new user's email address. Must be a valid email format.
   * @type {string}
   * @example 'user@example.com'
   */
  @ApiProperty({ description: "The new user's email address.", example: 'user@example.com' })
  @IsEmail()
  email: string;

  /**
   * The new user's password. Must be at least 6 characters long.
   * @type {string}
   * @example 'password123'
   */
  @ApiProperty({ description: "The new user's password. Must be at least 6 characters long.", example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  /**
   * The new user's full name.
   * @type {string}
   * @example 'John Doe'
   */
  @ApiProperty({ description: "The new user's full name.", example: 'John Doe' })
  @IsString()
  fullName: string;

  /**
   * The new user's optional phone number.
   * @type {string}
   * @example '+1234567890'
   */
  @ApiProperty({ description: "The new user's optional phone number.", example: '+1234567890', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  /**
   * The unique identifier of the tenant the user belongs to.
   * @type {string}
   * @example 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
   */
  @ApiProperty({ description: 'The unique identifier of the tenant the user belongs to.', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @IsUUID()
  tenantId: string;
}