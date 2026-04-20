import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EPaymentMethod, EPaymentStatus } from '../schemas/bills.schema';
import mongoose from 'mongoose';

class UpdateOrderItemDto {
  @IsString()
  @IsOptional()
  name!: string;

  @IsNumber()
  @Min(0, { message: 'Price cannot be negative' })
  @IsOptional()
  price!: number;

  @IsNumber()
  @Min(1, { message: 'Quantity must be at least 1' })
  @IsOptional()
  quantity!: number;
}

export class UpdateBillDto {
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDto)
  items!: UpdateOrderItemDto[];

  @IsString()
  @IsOptional()
  tableNumber!: mongoose.Types.ObjectId;

  @IsNumber()
  @Min(0, { message: 'Discount cannot be negative' })
  @IsOptional()
  discount!: number;

  @IsNumber()
  @Min(0, { message: 'Total amount cannot be negative' })
  @IsOptional()
  totalAmount!: number;

  @IsEnum(EPaymentStatus, { message: 'Invalid payment status' })
  @IsOptional()
  status!: EPaymentStatus;

  @IsEnum(EPaymentMethod, { message: 'Invalid payment method' })
  @IsOptional()
  paymentMethod!: EPaymentMethod;
}
