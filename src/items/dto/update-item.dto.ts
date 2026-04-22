import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  itemName!: string;

  @IsOptional()
  @IsString()
  price!: string;

  @IsOptional()
  @IsString()
  category!: string;
}
