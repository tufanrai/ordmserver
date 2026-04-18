import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddItemDto {
  @IsString()
  @IsNotEmpty({ message: 'please enter the name of the food item' })
  itemName!: string;

  @IsNumber()
  @IsNotEmpty({ message: 'please enter the price of the item' })
  price!: number;

  @IsString()
  @IsNotEmpty({ message: 'please enter the category of the item' })
  category!: string;

  @IsString()
  @IsNotEmpty({ message: 'Please pass the restaurant id/name' })
  restaurant!: string;
}
