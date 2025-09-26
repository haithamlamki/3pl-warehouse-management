import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard that validates JWT access tokens on protected routes.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}


