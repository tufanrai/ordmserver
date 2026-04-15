import { Body, HttpStatus, Injectable } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Utility functions
import CustomError from '../utils/customError.utils';
import { hashPassword } from '../utils/bcrypt.utils';

// Dtos
import { UpdateUserDto } from './dto/UserUpdate.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // GET: /api/user/:id
  async getUser(id: string) {
    const user = await this.userModel.findById(id, { password: 0 });

    if (!user) throw new CustomError('User not found', HttpStatus.NOT_FOUND);

    return user;
  }

  // PUT: /api/user/:id
  async updateUserData(id: string, @Body() data: UpdateUserDto) {
    const user = await this.userModel.findById(id);

    if (!user) throw new CustomError('User not found', HttpStatus.NOT_FOUND);

    if (data.fullName) user.name = data?.fullName;
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
    // Restaurant id save.

    const updatedUserData = await user.save({ validateModifiedOnly: true });

    return updatedUserData;
  }

  // DELETE: /api/user/:id
  async deleteUser(id: string) {
    const deletedSuccess = await this.userModel.findByIdAndDelete(id);

    if (!deletedSuccess)
      throw new CustomError(
        'something went wrong, please try again',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return {
      message: 'user successfully deleted',
      status: 'success',
      success: true,
    };
  }
}
