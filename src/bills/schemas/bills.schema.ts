import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type BillDocument = HydratedDocument<Bill>;

interface IOrders {
  itemName: string;
  price: number;
}

export enum EStatus {
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
  orders!: IOrders[];

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
    enum: Object.values(EStatus),
    default: EStatus.pending,
  })
  status!: EStatus;

  @Prop({
    type: String,
    enum: Object.values(EPaymentMethod),
    default: null,
  })
  paymentMethod!: EPaymentMethod | null;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
