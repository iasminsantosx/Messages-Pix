import { Module } from '@nestjs/common';
import { PixMessagesService } from './pix-messages.service';
import { PixMessagesController } from './pix-messages.controller';

@Module({
  controllers: [PixMessagesController],
  providers: [PixMessagesService],
})
export class PixMessagesModule {}
