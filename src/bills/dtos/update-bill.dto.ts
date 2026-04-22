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
import { OrderItemDto } from './create-bill.dto';

export class UpdateBillDto {
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items?: OrderItemDto[];

  @IsString()
  @IsOptional()
  tableNo?: string;

  @IsNumber()
  @Min(0, { message: 'Discount cannot be negative' })
  @IsOptional()
  discount?: number;

  @IsNumber()
  @Min(0, { message: 'Total amount cannot be negative' })
  @IsOptional()
  totalAmount?: number;

  @IsEnum(EPaymentStatus, { message: 'Invalid payment status' })
  @IsOptional()
  status?: EPaymentStatus;

  @IsEnum(EPaymentMethod, { message: 'Invalid payment method' })
  @IsOptional()
  paymentMethod?: EPaymentMethod;
}
