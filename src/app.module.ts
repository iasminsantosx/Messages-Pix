import { Module } from '@nestjs/common';
import { PixMessagesModule } from './pix-messages/pix-messages.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PixMessage } from './pix-messages/entities/pix-message.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [PixMessage],
      synchronize: true,
    }),
    PixMessagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
