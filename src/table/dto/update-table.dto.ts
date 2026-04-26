import { IsString, IsOptional, IsNumber } from 'class-validator';
import { EStatus } from '../schemas/table.schema';

export class updateTableDto {
  @IsNumber()
  @IsOptional()
  tableNumber!: number;

  @IsString()
  @IsOptional()
  location!: string;

  @IsNumber()
  @IsOptional()
  capacity!: number;

  @IsString()
  @IsOptional()
  status!: EStatus;
}
