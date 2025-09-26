import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * @class LoginDto
 * @description Data transfer object for user login.
 */
export class LoginDto {
  /**
   * The user's email address.
   * @type {string}
   * @example 'user@example.com'
   */
  @ApiProperty({ description: "The user's email address.", example: 'user@example.com' })
  @IsEmail()
  email: string;

  /**
   * The user's password. Must be at least 6 characters long.
   * @type {string}
   * @example 'password123'
   */
  @ApiProperty({ description: 'The user\'s password. Must be at least 6 characters long.', example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;
}