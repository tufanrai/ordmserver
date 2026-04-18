import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  itemName!: string;

  @IsOptional()
  @IsNumber()
  price!: number;

  @IsOptional()
  @IsString()
  category!: string;
}
