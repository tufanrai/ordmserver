import { IsString, IsOptional } from 'class-validator';

export class update_restaurantDto {
  @IsOptional()
  @IsString()
  restaurantName!: string;
}
