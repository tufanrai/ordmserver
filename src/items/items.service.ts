import { Injectable } from '@nestjs/common';
import { Item } from './schemas/items.schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ItemsService {
  constructor(@InjectModel(Item.name) private itemModule: Model<Item>) {}

  // GET: /api/items:
  async getAllItems() {}
}
