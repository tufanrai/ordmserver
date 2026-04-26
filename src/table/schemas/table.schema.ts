import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type TableDocument = HydratedDocument<Table>;

export enum EStatus {
  available = 'Available',
  occupied = 'Occupied',
}

@Schema({ timestamps: true })
export class Table {
  @Prop({ type: Number, required: [true, 'please pass the table number'] })
  tableNumber!: number;

  @Prop({
    type: String,
    required: [true, 'please enter the location of the table'],
  })
  location!: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'please pass the restaurant id'],
    ref: 'Restaurant',
  })
  restaurant!: mongoose.Types.ObjectId;

  @Prop({
    type: Number,
    required: [true, 'please pass the tables capacity'],
  })
  capacity!: number;

  @Prop({
    type: String,
    enum: Object.values(EStatus),
    default: EStatus.available,
  })
  status!: String;
}

export const TableSchema = SchemaFactory.createForClass(Table);
