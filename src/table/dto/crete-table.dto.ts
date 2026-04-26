import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { EStatus } from '../schemas/table.schema';

export class createTableDto {
  @IsString()
  @IsNotEmpty({ message: 'Please describe the location of the table' })
  location!: string;

  @IsNumber()
  @IsNotEmpty({ message: 'please enter the capacity of the table' })
  @Type(() => Number)
  capacity!: number;

  @IsNumber()
  @IsNotEmpty({ message: 'please pass the table number' })
  @Type(() => Number)
  tableNumber!: number;

  @IsString()
  @IsOptional()
  status!: EStatus;
}
