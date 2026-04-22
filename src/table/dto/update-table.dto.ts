import { IsString, IsOptional } from 'class-validator';
import { EStatus } from '../schemas/table.schema';

export class updateTableDto {
  @IsString()
  @IsOptional()
  tableNo!: string;

  @IsString()
  @IsOptional()
  location!: string;

  @IsString()
  @IsOptional()
  status!: EStatus;
}
