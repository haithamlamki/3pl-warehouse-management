import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<any>;
    login(loginDto: LoginDto, req: any): Promise<any>;
    refresh(refreshTokenDto: RefreshTokenDto): Promise<any>;
    logout(req: any): Promise<void>;
    getProfile(req: any): Promise<any>;
    changePassword(req: any, changePasswordDto: any): Promise<void>;
}
