import { HttpStatus, Injectable } from '@nestjs/common';
import { Bill, BillDocument } from './schemas/bills.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import CustomError from '../utils/customError.utils';
import { BillDto } from './dtos/create-bill.dto';
import { User, UserDocument } from '../user/schemas/user.schema';
import {
  Restaurant,
  RestaurantDocument,
} from '../restaurant/schema/restaurant.schema';
import { UpdateBillDto } from './dtos/update-bill.dto';

@Injectable()
export class BillsService {
  constructor(
    @InjectModel(Bill.name) private billModle: Model<BillDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
  ) {}

  // GET: /bills
  async getAllBills() {
    const bills = await this.billModle.find();

    if (bills.length < 1)
      throw new CustomError('No any bills registered', HttpStatus.NOT_FOUND);

    return bills;
  }

  //   POST: /bills
  async createBill({ restaurantId, ...data }: BillDto) {
    if (!restaurantId)
      throw new CustomError(
        'Please pass the restaurant id',
        HttpStatus.NOT_ACCEPTABLE,
      );

    const restaurant = await this.restaurantModel.findById(restaurantId);

    if (!restaurant)
      throw new CustomError('Restaurant not found', HttpStatus.NOT_FOUND);

    const newBill = await this.billModle.create({
      restaurantId,
      tableNo: data.tableNumber,
      ...data,
    });

    if (!newBill)
      throw new CustomError(
        'Something went wrong, please try again',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return newBill;
  }

  //PUT: /bill/:id
  async updateBill(id: string, data: UpdateBillDto) {
    if (!id)
      throw new CustomError(
        'Please pass the bill id',
        HttpStatus.NOT_ACCEPTABLE,
      );

    const bill = await this.billModle.findById(id);

    if (!bill) throw new CustomError('Bill not found', HttpStatus.NOT_FOUND);

    if (data.items) bill.items = data.items;
    if (data.discount) bill.discount = data.discount;
    if (data.paymentMethod) bill.paymentMethod = data.paymentMethod;
    if (data.status) bill.status = data.status;
    if (data.tableNumber) bill.tableNo = data.tableNumber;
    if (data.totalAmount) bill.totalAmount = data.totalAmount;
    bill.finalAmount = data.totalAmount - data.discount;

    const updatedBill = await bill.save({ validateModifiedOnly: true });

    if (!updatedBill)
      throw new CustomError(
        'Something went wrong, please try again',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return updatedBill;
  }

  // DELETE: /bill/:id
  async deleteBill(id: string) {
    if (!id)
      throw new CustomError(
        'Please pass the bill id',
        HttpStatus.NOT_ACCEPTABLE,
      );

    const deletedBill = await this.billModle.findByIdAndDelete(id);

    if (!deletedBill)
      throw new CustomError(
        'something went wrong, please try again',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return deletedBill;
  }
}
