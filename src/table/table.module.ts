import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import TableService from './table.service';
import { TableController } from './table.controller';
import { Table, TableSchema } from './schemas/table.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from '../auth/middleware/auth.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Table.name, schema: TableSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [TableService],
  controllers: [TableController],
})
export class TableModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(TableController);
  }
}
