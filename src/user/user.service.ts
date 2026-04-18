import { Body, HttpStatus, Injectable } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import {
  Restaurant,
  RestaurantDocument,
} from '../restaurant/schema/restaurant.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Utility functions
import CustomError from '../utils/customError.utils';
import { hashPassword } from '../utils/bcrypt.utils';

// Dtos
import { UpdateUserDto } from './dto/UserUpdate.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
  ) {}

  // GET: /api/user/:id
  async getUser(id: string) {
    const user = await this.userModel.findById(id, { password: 0 });

    if (!user) throw new CustomError('User not found', HttpStatus.NOT_FOUND);

    return user;
  }

  // PUT: /api/user/:id
  async updateUserData(id: string, data: UpdateUserDto) {
    const user = await this.userModel.findById(id);

    if (!user) throw new CustomError('User not found', HttpStatus.NOT_FOUND);

    console.log(data);

    if (data.name) user.name = data?.name;
    if (data.email) user.email = data?.email;
    if (data.password) {
      const hashedPassword = await hashPassword(data.password);
      if (!hashedPassword)
        throw new CustomError(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

      user.password = hashedPassword;
    }
    let newRestaurantData;
    if (data.restaurant) {
      const restaurant = await this.restaurantModel.findById(user.restaurant);

      if (!restaurant)
        throw new CustomError('Restaurant not found', HttpStatus.NOT_FOUND);

      newRestaurantData = restaurant.save({ validateModifiedOnly: true });
    }

    if (data.restaurant) user.restaurant = newRestaurantData._id;

    const updatedUserData = await user.save({ validateModifiedOnly: true });

    return updatedUserData;
  }

  // DELETE: /api/user/:id
  async deleteUser(id: string) {
    const owner = await this.userModel.findById(id);

    if (!owner) throw new CustomError('user not found', HttpStatus.NOT_FOUND);

    const deleted = await this.userModel.deleteMany({
      restaurant: owner?.restaurant,
    });

    if (!deleted)
      throw new CustomError(
        'Something went wrong please try again',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return {
      message: 'user successfully deleted',
      status: 'success',
      success: true,
    };
  }
}
