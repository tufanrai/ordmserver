import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type BillDocument = HydratedDocument<Bill>;

interface IOrders {
  name?: string;
  price?: number;
  quantity?: number;
}

export enum EPaymentStatus {
  pending = 'Pending',
  paid = 'Paid',
  cancelled = 'cancelled',
}

export enum EPaymentMethod {
  cash = 'Cash',
  online = 'Online',
}

@Schema({ timestamps: true })
export class Bill {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'please pass the id of the restaurant'],
    ref: 'Restaurant',
  })
  restaurantId!: mongoose.Types.ObjectId;

  @Prop({
    type: [
      {
        itemName: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    required: [true, 'please enter the items ordered'],
  })
  items!: IOrders[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "please pass the user's id"],
  })
  userId!: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'please pass the table id'],
    ref: 'Table',
  })
  tableNo!: mongoose.Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  discount!: number;

  @Prop({ type: Number, default: 0 })
  totalAmount!: number;

  @Prop({ type: Number, default: 0 })
  finalAmount!: number;

  @Prop({
    type: String,
    enum: Object.values(EPaymentStatus),
    default: EPaymentStatus.pending,
  })
  status!: EPaymentStatus;

  @Prop({
    type: String,
    enum: Object.values(EPaymentMethod),
    default: null,
  })
  paymentMethod!: EPaymentMethod | null;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
