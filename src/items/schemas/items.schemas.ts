import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ItemDocument = HydratedDocument<Item>;

@Schema({ timestamps: true })
export class Item {
  @Prop({
    type: String,
    required: [true, 'please enter the name of the food item.'],
  })
  itemName!: string;

  @Prop({
    type: String,
    required: [true, 'please enter the price of the food item.'],
  })
  price!: string;

  @Prop({
    type: String,
    required: [true, 'please enter the category of the food item.'],
  })
  category!: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'restaurant',
    required: [true, 'please pass the restaurant id'],
  })
  restaurant!: mongoose.Types.ObjectId;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
