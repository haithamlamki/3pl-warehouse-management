import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * @class RefreshTokenDto
 * @description Data transfer object for refreshing an access token.
 */
export class RefreshTokenDto {
  /**
   * The refresh token used to obtain a new access token.
   * @type {string}
   * @example 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
   */
  @ApiProperty({ description: 'The refresh token used to obtain a new access token.', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' })
  @IsString()
  refreshToken: string;
}