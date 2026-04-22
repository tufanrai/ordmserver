import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsString()
  @IsNotEmpty({ message: 'Please enter the item name' })
  itemName!: string;

  @IsNumber()
  @Min(0, { message: 'Price cannot be negative' })
  price!: number;

  @IsNumber()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity!: number;
}

export class BillDto {
  @IsArray()
  @IsNotEmpty({ message: 'Please pass the ordered items list' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @IsString()
  @IsNotEmpty({ message: 'Please pass the restaurant id' })
  restaurantId!: string;

  @IsString()
  @IsNotEmpty({ message: 'Please pass the table id' })
  tableNo!: string;

  @IsNumber()
  @Min(0, { message: 'Discount cannot be negative' })
  @IsOptional()
  discount!: number;

  @IsNumber()
  @Min(0, { message: 'Total amount cannot be negative' })
  @IsNotEmpty({ message: 'Please pass the total amount' })
  totalAmount!: number;
}
