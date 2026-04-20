import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
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

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty({ message: 'Please pass the restaurant id' })
  restaurantId!: string;

  @IsString()
  @IsNotEmpty({ message: 'Please pass the table id' })
  tableId!: string;

  @IsArray()
  @IsNotEmpty({ message: 'Please pass the order items' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
