import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
import { EStatus } from '../schemas/table.schema';

export class createTableDto {
  @IsString()
  @IsNotEmpty({ message: 'please pass the table number' })
  tableNo!: string;

  @IsString()
  @IsNotEmpty({ message: 'Please describe the location of the table' })
  location!: string;

  @IsString()
  @IsOptional()
  status!: EStatus;
}
