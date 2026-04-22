import { HttpStatus, Injectable } from '@nestjs/common';
import { Bill, BillDocument } from './schemas/bills.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import CustomError from '../utils/customError.utils';
import { BillDto } from './dtos/create-bill.dto';
import { User, UserDocument } from '../user/schemas/user.schema';
import {
  Restaurant,
  RestaurantDocument,
} from '../restaurant/schema/restaurant.schema';
import { UpdateBillDto } from './dtos/update-bill.dto';
import { AppGateway } from '../gateway/app.gateway';

@Injectable()
export class BillsService {
  constructor(
    @InjectModel(Bill.name) private billModel: Model<BillDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
    private appGateway: AppGateway,
  ) {}

  // GET: /bills
  async getAllBills(id: string) {
    if (!id)
      throw new CustomError(
        'Please pass the restaurant id',
        HttpStatus.NOT_ACCEPTABLE,
      );

    const bills = await this.billModel.find();
    if (bills.length < 1)
      throw new CustomError('No bills found', HttpStatus.NOT_FOUND);
    return bills;
  }

  // GET: /bills/:id
  async getBillById(id: string) {
    if (!id)
      throw new CustomError(
        'Please pass the bill id',
        HttpStatus.NOT_ACCEPTABLE,
      );
    const bill = await this.billModel
      .findById(id)
      .populate('restaurantId')
      .populate('tableNo')
      .populate('userId', '-password');
    if (!bill) throw new CustomError('Bill not found', HttpStatus.NOT_FOUND);
    return bill;
  }

  // GET: /bills/restaurant/:restaurantId
  async getBillsByRestaurant(restaurantId: string) {
    const bills = await this.billModel
      .find({ restaurantId })
      .populate('tableNo')
      .populate('userId', '-password')
      .sort({ createdAt: -1 });
    if (bills.length < 1)
      throw new CustomError(
        'No bills found for this restaurant',
        HttpStatus.NOT_FOUND,
      );
    return bills;
  }

  // POST: /bills
  async createBill(dto: BillDto) {
    const restaurant = await this.restaurantModel.findById(dto.restaurantId);
    if (!restaurant)
      throw new CustomError('Restaurant not found', HttpStatus.NOT_FOUND);

    // calculate finalAmount on the backend
    const discount = dto.discount ?? 0;
    const finalAmount = dto.totalAmount - discount;

    const newBill = await this.billModel.create({
      restaurantId: dto.restaurantId,
      tableNo: new mongoose.Types.ObjectId(dto.tableNo),
      items: dto.items,
      discount,
      totalAmount: dto.totalAmount,
      finalAmount,
    });

    if (!newBill)
      throw new CustomError(
        'Something went wrong, please try again',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    // notify owner dashboard instantly via socket
    this.appGateway.emitBillCreated(dto.restaurantId, newBill);

    return newBill;
  }

  // PUT: /bills/:id
  async updateBill(id: string, data: UpdateBillDto) {
    if (!id)
      throw new CustomError(
        'Please pass the bill id',
        HttpStatus.NOT_ACCEPTABLE,
      );

    const bill = await this.billModel.findById(id);
    if (!bill) throw new CustomError('Bill not found', HttpStatus.NOT_FOUND);

    if (data.items) bill.items = data.items;
    if (data.tableNo) bill.tableNo = new mongoose.Types.ObjectId(data.tableNo);
    if (data.discount !== undefined) bill.discount = data.discount;
    if (data.paymentMethod) bill.paymentMethod = data.paymentMethod;
    if (data.status) bill.status = data.status;
    if (data.totalAmount) bill.totalAmount = data.totalAmount;

    // always recalculate finalAmount on the backend
    const totalAmount = data.totalAmount ?? bill.totalAmount;
    const discount = data.discount ?? bill.discount ?? 0;
    bill.finalAmount = totalAmount - discount;

    const updatedBill = await bill.save({ validateModifiedOnly: true });

    if (!updatedBill)
      throw new CustomError(
        'Something went wrong, please try again',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    // notify owner dashboard of the update via socket
    this.appGateway.emitBillUpdated(bill.restaurantId.toString(), updatedBill);

    return updatedBill;
  }

  // DELETE: /bills/:id
  async deleteBill(id: string) {
    if (!id)
      throw new CustomError(
        'Please pass the bill id',
        HttpStatus.NOT_ACCEPTABLE,
      );

    const deletedBill = await this.billModel.findByIdAndDelete(id);
    if (!deletedBill)
      throw new CustomError(
        'Something went wrong, please try again',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return deletedBill;
  }
}
