import {
  Controller,
  Request,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import CustomError from '../utils/customError.utils';
import { BillsService } from './bills.service';
import { BillDto } from './dtos/create-bill.dto';
import { UpdateBillDto } from './dtos/update-bill.dto';

@Controller('bills')
export class BillsController {
  constructor(private billService: BillsService) {}

  @Get('/')
  async getAllBills(@Request() req) {
    console.log(req.user);
    if (!req.user)
      throw new CustomError("User's data not found", HttpStatus.NOT_ACCEPTABLE);

    return this.billService.getAllBills(req.user.restaurant);
  }

  @Get('/:id')
  async getBillById(@Param('id') id: string) {
    return this.billService.getBillById(id);
  }

  @Post('/')
  async createBill(@Body() data: BillDto) {
    return this.billService.createBill(data);
  }

  @Put('/:id')
  async updateBill(@Param('id') id: string, @Body() data: UpdateBillDto) {
    return this.billService.updateBill(id, data);
  }

  @Delete('/:id')
  async deleteBill(@Param('id') id: string) {
    return this.billService.deleteBill(id);
  }
}
