import {
  Controller,
  Request,
  Get,
  Param,
  Body,
  HttpStatus,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import TableService from './table.service';
import CustomError from '../utils/customError.utils';
import { createTableDto } from './dto/crete-table.dto';

@Controller('table')
export class TableController {
  constructor(private tableService: TableService) {}

  // GET: /table
  @Get('/')
  getAllTables(@Request() req) {
    if (!req.user)
      throw new CustomError("User's data not found", HttpStatus.NOT_ACCEPTABLE);

    return this.tableService.getAllTables(req.user.restaurant);
  }

  //   POST: /table
  @Post('/')
  addNewTable(@Body() data: createTableDto) {
    return this.tableService.addTable(data);
  }

  // PUT: /table/:id
  @Put('/:id')
  updateTable(@Param('id') id: string, @Body() data: createTableDto) {
    return this.tableService.updateTable(id, data);
  }

  // DELETE: /table/:id
  @Delete('/:id')
  deleteTable(@Param('id') id: string) {
    return this.tableService.deleteTable(id);
  }
}
