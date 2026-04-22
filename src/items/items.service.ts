import { HttpStatus, Injectable } from '@nestjs/common';
import { Item } from './schemas/items.schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AddItemDto } from './dto/add-item.dto';
import CustomError from '../utils/customError.utils';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(@InjectModel(Item.name) private itemModule: Model<Item>) {}

  // GET: /items/
  async getAllItems(id: string) {
    const items = await this.itemModule.find({ restaurant: id });

    if (items.length <= 0)
      return { message: "You don't have any items to display." };

    return items;
  }

  // POST: /items:
  async addItem(id: string, item: AddItemDto) {
    if (!id)
      throw new CustomError(
        'Please pass the restaurant id',
        HttpStatus.NOT_ACCEPTABLE,
      );

    if (!item)
      throw new CustomError(
        'please fill all the inputs',
        HttpStatus.NOT_ACCEPTABLE,
      );

    const items = await this.itemModule.create({ restaurant: id, ...item });

    if (!items)
      throw new CustomError(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return items;
  }

  // PUT: /items;
  async updateItem(id: string, newData: UpdateItemDto) {
    const item = await this.itemModule.findById(id);

    if (!item) {
      throw new CustomError('Item not found', HttpStatus.NOT_FOUND);
    }

    if (newData.itemName) item.itemName = newData.itemName;
    if (newData.price) item.price = newData.price;
    if (newData.category) item.category = newData.category;

    const updatedItem = await item.save({ validateModifiedOnly: true });

    if (!updatedItem)
      throw new CustomError(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return updatedItem;
  }

  // DELETE: /items/:id
  async deleteItem(id: string) {
    const deleted = await this.itemModule.findByIdAndDelete(id);

    if (!deleted) throw new CustomError('something went wrong', 500);

    return { message: 'item successfully deleted' };
  }
}
