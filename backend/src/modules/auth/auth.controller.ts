import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard, JwtAuthGuard } from './guards/auth.guards';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

/**
 * @class AuthController
 * @description This controller exposes endpoints for user authentication, registration, and profile management.
 * @tags auth
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  /**
   * @constructor
   * @param {AuthService} authService - Service for authentication-related business logic.
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * @method register
   * @description Registers a new user with the system.
   * @param {RegisterDto} registerDto - The data needed to register the new user.
   * @returns {Promise<object>} A promise that resolves to the new user's data and authentication tokens.
   */
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request or user already exists.' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * @method login
   * @description Authenticates a user and returns JWT tokens.
   * @param {LoginDto} loginDto - The user's login credentials.
   * @param {Request} req - The Express request object, containing the authenticated user from the guard.
   * @returns {Promise<object>} A promise that resolves to the user's data and authentication tokens.
   */
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user and get authentication tokens' })
  @ApiResponse({ status: 200, description: 'Login successful.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async login(@Body() loginDto: LoginDto, @Request() req) {
    return this.authService.login(req.user);
  }

  /**
   * @method refresh
   * @description Refreshes a user's access token using a valid refresh token.
   * @param {RefreshTokenDto} refreshTokenDto - The DTO containing the refresh token.
   * @returns {Promise<object>} A promise that resolves to a new set of authentication tokens.
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh an access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token.' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  /**
   * @method logout
   * @description Logs out the current user. Note: In a stateless JWT setup, this is often handled client-side.
   * @param {Request} req - The Express request object, containing the authenticated user.
   * @returns {Promise<void>}
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logout successful.' })
  async logout(@Request() req) {
    return this.authService.logout(req.user.id);
  }

  /**
   * @method getProfile
   * @description Retrieves the profile of the currently authenticated user.
   * @param {Request} req - The Express request object, containing the authenticated user.
   * @returns {Promise<object>} A promise that resolves to the user's profile data.
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the current user\'s profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  /**
   * @method changePassword
   * @description Allows the authenticated user to change their password.
   * @param {Request} req - The Express request object, containing the authenticated user.
   * @param {object} changePasswordDto - The DTO containing the current and new passwords.
   * @returns {Promise<void>}
   */
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change the current user\'s password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized or incorrect current password.' })
  async changePassword(@Request() req, @Body() changePasswordDto: any) {
    return this.authService.changePassword(req.user.id, changePasswordDto);
  }
}