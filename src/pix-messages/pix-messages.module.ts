import { Module } from '@nestjs/common';
import { PixMessagesService } from './pix-messages.service';
import { PixMessage } from './entities/pix-message.entity';
import { PixMessagesController } from './pix-messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PixMessage])],
  controllers: [PixMessagesController],
  providers: [PixMessagesService],
})
export class PixMessagesModule {}
