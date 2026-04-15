import { Controller, Param, Get, Post, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/UserUpdate.dto';

@Controller('user')
export class UserController {
  constructor(private userservice: UserService) {}

  //   GET: /user/:id
  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userservice.getUser(id);
  }

  //   PUT: /user/:id
  @Put(':id')
  updateUserData(@Param('id') id: string, data: UpdateUserDto) {
    return this.userservice.updateUserData(id, data);
  }

  //   DELETE: /user/:id
  @Delete('id')
  deleteUser(@Param('id') id: string) {
    return this.userservice.deleteUser(id);
  }
}
