import {
  Controller,
  Post,
  Patch,
  Get,
  Delete,
  Body,
  Param,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // POST /orders — cashier creates a new order
  @Post()
  async createOrder(@Body() dto: CreateOrderDto, @Request() req) {
    const cashierId = req.user.userId;
    return this.ordersService.createOrder(dto, cashierId);
  }

  // PATCH /orders/:id/status — kitchen updates order status
  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body() dto: UpdateOrderStatusDto,
    @Request() req,
  ) {
    const restaurantId = req.user.restaurant;
    return this.ordersService.updateOrderStatus(orderId, dto, restaurantId);
  }

  // GET /orders/table/:tableId — get all orders for a table
  @Get('table/:tableId')
  async getOrdersByTable(@Param('tableId') tableId: string) {
    return this.ordersService.getOrdersByTable(tableId);
  }

  // GET /orders/restaurant/:restaurantId — owner views all orders
  @Get('restaurant/:restaurantId')
  async getOrdersByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.ordersService.getOrdersByRestaurant(restaurantId);
  }

  // GET /orders/active/:restaurantId — kitchen views active orders
  @Get('active/:restaurantId')
  async getActiveOrders(@Param('restaurantId') restaurantId: string) {
    return this.ordersService.getActiveOrders(restaurantId);
  }

  // GET /orders/:id — get a single order
  @Get(':id')
  async getOrderById(@Param('id') orderId: string) {
    return this.ordersService.getOrderById(orderId);
  }

  // DELETE /orders/:id — cancel an order
  @Delete(':id')
  async cancelOrder(@Param('id') orderId: string, @Request() req) {
    const restaurantId = req.user.restaurant;
    return this.ordersService.cancelOrder(orderId, restaurantId);
  }
}
