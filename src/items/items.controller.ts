import {
  Controller,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  Request,
  HttpStatus,
} from '@nestjs/common';
import CustomError from '../utils/customError.utils';
import { ItemsService } from './items.service';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('items')
export class ItemsController {
  constructor(private itemService: ItemsService) {}

  @Get('/')
  async getAllItems(@Request() req) {
    if (!req.user)
      throw new CustomError("User's data not found", HttpStatus.NOT_ACCEPTABLE);

    return this.itemService.getAllItems(req.user.restaurant);
  }

  @Post('/')
  async addItem(@Body() data: AddItemDto, @Request() req) {
    if (!req.user)
      throw new CustomError("User's data not found", HttpStatus.NOT_ACCEPTABLE);

    return this.itemService.addItem(req.user.restaurant, data);
  }

  @Put('/:id')
  async updateItem(@Param('id') id: string, @Body() data: UpdateItemDto) {
    return this.itemService.updateItem(id, data);
  }

  @Delete('/:id')
  async deleteItem(@Param('id') id: string) {
    return this.itemService.deleteItem(id);
  }
}
