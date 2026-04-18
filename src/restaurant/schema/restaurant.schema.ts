import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RestaurantDocument = HydratedDocument<Restaurant>;

@Schema({ timestamps: true })
export class Restaurant {
  @Prop({
    type: String,
    required: [true, 'please enter the name of the restaurant'],
  })
  restaurantName!: string;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
