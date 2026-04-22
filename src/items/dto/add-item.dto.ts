import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class AddItemDto {
  @IsString()
  @IsNotEmpty({ message: 'please enter the name of the food item' })
  itemName!: string;

  @IsString()
  @IsNotEmpty({ message: 'please enter the price of the item' })
  price!: string;

  @IsString()
  @IsNotEmpty({ message: 'please enter the category of the item' })
  category!: string;
}
