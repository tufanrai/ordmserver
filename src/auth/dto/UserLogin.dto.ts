import { IsString, IsNotEmpty, IsEmail, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsEmail({}, { message: 'please enter a valid email address' })
  @IsNotEmpty({ message: 'please enter your email' })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'your email does not match the email standards.',
  })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'please enter your password' })
  password!: string;
}
