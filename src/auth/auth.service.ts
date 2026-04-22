import { Injectable, HttpStatus } from '@nestjs/common';

// Mail service
import { MailService } from '../mail/mail.service';

// Database
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ERole } from '../user/schemas/user.schema';
import { User, UserDocument } from '../user/schemas/user.schema';
import {
  Restaurant,
  RestaurantDocument,
} from '../restaurant/schema/restaurant.schema';

// DTOs
import { RegisterDto } from './dto/UserRegister.dto';
import { LoginDto } from './dto/UserLogin.dto';

// Utility functions and classes
import { hashPassword, verifyPassword } from '../utils/bcrypt.utils';
import CustomError from '../utils/customError.utils';
import { generateToken } from '../utils/jwt.utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
    private readonly mailerService: MailService,
  ) {}

  // POST: /api/auth/register
  async registerUser({ password, restaurant, ...dto }: RegisterDto) {
    // Restaurant registration
    if (!restaurant)
      throw new CustomError('please enter the name of the restaurant', 401);

    const restaurantId = await this.restaurantModel.create({
      restaurantName: restaurant,
    });

    if (!restaurantId)
      throw new CustomError(
        'Something went wrong, Please try again',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    // Hash password
    const hashedPassword = await hashPassword(password);

    if (!hashedPassword)
      throw new CustomError(
        'Something went wrong, please try again',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    // User's account creation
    const user = await this.userModel.create({
      password: hashedPassword,
      restaurant: restaurantId._id,
      isOneTime: false,
      ...dto,
    });

    // Staff's id creation
    if (user) {
      const demoPass = `TempPass${Math.random()}`;

      const kitchen = await this.userModel.create({
        name: 'Kitchen',
        email: `kitchen@${dto.email.split('@')[1]}`,
        password: demoPass,
        restaurant: restaurantId._id,
        role: ERole.kitchen,
        isOneTime: true,
      });

      const cashier = await this.userModel.create({
        name: 'Cashier',
        email: `cashier@${dto.email.split('@')[1]}`,
        password: demoPass,
        restaurant: restaurantId._id,
        role: ERole.Cashier,
        isOneTime: true,
      });

      await this.mailerService.sendStaffCredentials(
        user.email,
        user.name,
        restaurantId.restaurantName,
        cashier.email,
        demoPass,
        kitchen.email,
        demoPass,
      );
    }

    if (!user)
      throw new CustomError(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return user;
  }

  // POST: /api/auth/login
  async loginUser({ email, password }: LoginDto) {
    const user = await this.userModel.findOne({ email });

    if (!user)
      throw new CustomError(
        'User with this mail does not exists',
        HttpStatus.NOT_FOUND,
      );

    const verifiedPassword = verifyPassword(password, user.password);

    if (!verifiedPassword)
      throw new CustomError(
        'either your password or email is incorrect',
        HttpStatus.UNAUTHORIZED,
      );

    const token = generateToken({
      name: user.name,
      email: user.email,
      role: user.role,
      restaurant: user.restaurant,
    });

    if (!token)
      throw new CustomError(
        'something went wrong, please try again',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return { user, token };
  }
}
