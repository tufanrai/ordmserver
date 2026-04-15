import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantModule } from './restaurant/restaurant.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ItemsModule } from './items/items.module';
import { AuthModule } from './auth/auth.module';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ItemsModule,
    UserModule,
    RestaurantModule,
    MongooseModule.forRoot(
      'mongodb+srv://thulungtufan16_db_user:SXQ6FY0nuSLifPre@publiccluster.iihkq7u.mongodb.net/ordermanagement?retryWrites=true&w=majority&appName=PublicCluster',
    ),
    AuthModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT!),
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: `"No Reply" <${process.env.MAIL_FROM}>`,
      },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
