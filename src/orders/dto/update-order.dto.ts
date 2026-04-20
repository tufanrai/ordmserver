import { IsEnum, IsNotEmpty } from 'class-validator';
import { EOrderStatus } from '../schemas/order.schema';

export class UpdateOrderStatusDto {
  @IsEnum(EOrderStatus, { message: 'Invalid order status' })
  @IsNotEmpty({ message: 'Please pass the order status' })
  status!: EOrderStatus;
}
