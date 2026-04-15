import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

// DTOs
import { RegisterDto } from './dto/UserRegister.dto';
import { LoginDto } from './dto/UserLogin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // POST: /auth/register
  @Post('/register')
  registerUser(@Body() data: RegisterDto) {
    return this.authService.registerUser(data);
  }

  //   POST: /auth/login
  @Post('/login')
  loginUser(@Body() data: LoginDto) {
    return this.authService.loginUser(data);
  }
}
