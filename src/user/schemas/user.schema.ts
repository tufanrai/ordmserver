import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum ERole {
  owner = 'Owner',
  kitchen = 'Cook',
  Cashier = 'Cashier',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: [true, 'please enter your full name.'] })
  name!: string;

  @Prop({
    required: [true, 'please enter your email.'],
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    unique: [true, 'user with this mail already exists'],
    lowercase: true,
    trim: true,
  })
  email!: string;

  @Prop({
    required: [true, 'please enter your password.'],
    match: [
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/,
      'Password must contain at least one digit, one lowercase, and one uppercase letter',
    ],
    minlength: [6, 'your password must contain at least 6 characters.'],
  })
  password!: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'please enter restaurant id'],
    ref: 'Restaurant',
  })
  restaurant!: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(ERole),
    default: ERole.owner,
  })
  role!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
