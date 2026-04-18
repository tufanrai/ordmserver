import {
  IsString,
  MinLength,
  Matches,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'please enter your full name.' })
  name!: string;

  @IsString()
  @IsEmail({}, { message: 'please enter a valid email address' })
  @IsNotEmpty({ message: 'please enter your email' })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'your email does not match the email standards.',
  })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'please enter your password' })
  @MinLength(6, { message: 'your password must contain at least 6 characters' })
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/, {
    message:
      'Password must contain at least one digit, one lowercase, and one uppercase letter',
  })
  password!: string;

  @IsString()
  restaurant!: string;
}
