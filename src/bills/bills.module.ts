import { Module } from '@nestjs/common';
import { BillsService } from './bills.service';
import { BillsController } from './bills.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bill, BillSchema } from './schemas/bills.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import {
  Restaurant,
  RestaurantSchema,
} from '../restaurant/schema/restaurant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bill.name, schema: BillSchema },
      { name: User.name, schema: UserSchema },
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
  ],
  providers: [BillsService],
  controllers: [BillsController],
})
export class BillsModule {}
