import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument, EOrderStatus } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order.dto';
import { AppGateway } from '../gateway/app.gateway';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private appGateway: AppGateway,
  ) {}

  // cashier creates a new order
  async createOrder(dto: CreateOrderDto, cashierId: string) {
    const totalAmount = dto.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = await this.orderModel.create({
      ...dto,
      createdBy: cashierId,
      totalAmount,
      status: EOrderStatus.pending,
    });

    // emit to kitchen and owner instantly
    this.appGateway.emitNewOrder(dto.restaurantId, order);

    return order;
  }

  // kitchen updates order status
  async updateOrderStatus(
    orderId: string,
    dto: UpdateOrderStatusDto,
    restaurantId: string,
  ) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');

    order.status = dto.status;
    await order.save();

    // emit status update to cashier and owner instantly
    this.appGateway.emitOrderStatusUpdated(restaurantId, order);

    return order;
  }

  // get all active orders for a specific table
  // used by billing when cashier finalizes the bill
  async getOrdersByTable(tableId: string) {
    return this.orderModel
      .find({
        tableId,
        status: { $nin: [EOrderStatus.cancelled] },
      })
      .sort({ createdAt: 1 });
  }

  // get all orders for a restaurant — used by owner dashboard
  async getOrdersByRestaurant(restaurantId: string) {
    return this.orderModel.find({ restaurantId }).sort({ createdAt: -1 });
  }

  // get pending and cooking orders — used by kitchen view
  async getActiveOrders(restaurantId: string) {
    return this.orderModel
      .find({
        restaurantId,
        status: { $in: [EOrderStatus.pending, EOrderStatus.cooking] },
      })
      .sort({ createdAt: 1 });
  }

  // cancel an order
  async cancelOrder(orderId: string, restaurantId: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');

    if (order.status === EOrderStatus.completed) {
      throw new ForbiddenException('Cannot cancel a completed order');
    }

    order.status = EOrderStatus.cancelled;
    await order.save();

    this.appGateway.emitOrderCancelled(restaurantId, order);

    return order;
  }

  // get a single order by id
  async getOrderById(orderId: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
