import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

interface IOrderItem {
  itemName: string;
  price: number;
  quantity: number;
}

export enum EOrderStatus {
  pending = 'Pending',
  cooking = 'Cooking',
  prepared = 'Prepared',
  completed = 'Completed',
  cancelled = 'Cancelled',
}

@Schema({ timestamps: true })
export class Order {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Please pass the restaurant id'],
  })
  restaurantId!: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: [true, 'Please pass the table id'],
  })
  tableId!: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please pass the cashier id'],
  })
  createdBy!: mongoose.Types.ObjectId;

  @Prop({
    type: [
      {
        itemName: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    required: [true, 'Please pass the order items'],
  })
  items!: IOrderItem[];

  @Prop({
    type: String,
    enum: Object.values(EOrderStatus),
    default: EOrderStatus.pending,
  })
  status!: EOrderStatus;

  @Prop({ type: Number, default: 0 })
  totalAmount!: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
