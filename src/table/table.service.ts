import { HttpStatus, Injectable } from '@nestjs/common';
import { Table, TableDocument } from './schemas/table.schema';
import { User, UserDocument } from '../user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createTableDto } from './dto/crete-table.dto';
import CustomError from '../utils/customError.utils';

@Injectable()
export default class TableService {
  constructor(
    @InjectModel(Table.name) private tableModel: Model<TableDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  //   GET: /table/
  async getAllTables(id: string) {
    if (!id)
      throw new CustomError(
        'please pass the restaurant id',
        HttpStatus.NOT_ACCEPTABLE,
      );

    const tables = await this.tableModel.find({ restaurant: id });

    if (tables.length < 1)
      throw new CustomError('No any tables available', HttpStatus.NOT_FOUND);

    return tables;
  }

  //  POST: /table/
  async addTable(data: createTableDto) {
    if (!data)
      throw new CustomError(
        'Please pass all the reqired data',
        HttpStatus.NOT_ACCEPTABLE,
      );

    const table = await this.tableModel.create(data);

    if (!table)
      throw new CustomError(
        'Something went wrong, please try again',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return table;
  }

  //  PUT: /table/:id
  async updateTable(id: string, data: createTableDto) {
    if (!id)
      throw new CustomError(
        'Please pass the table id',
        HttpStatus.NOT_ACCEPTABLE,
      );

    const table = await this.tableModel.findById(id);

    if (!table) throw new CustomError('Table not found', HttpStatus.NOT_FOUND);

    if (data.location) table.location = data.location;
    if (data.status) table.status = data.status;
    if (data.tableNo) table.tableNo = data.tableNo;

    const updatedTableData = await table.save({ validateModifiedOnly: true });

    if (!updatedTableData)
      throw new CustomError(
        'Something went wrong, please try again',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return updatedTableData;
  }

  // DELETE: /table/:id
  async deleteTable(id: string) {
    if (!id)
      throw new CustomError(
        'Please pass the table id',
        HttpStatus.NOT_ACCEPTABLE,
      );
    const deletedTable = await this.tableModel.findByIdAndDelete(id);

    if (!deletedTable)
      throw new CustomError(
        'Something went wrong, please try again',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return deletedTable;
  }
}
