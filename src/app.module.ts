import { Module } from '@nestjs/common';
import { PixMessagesModule } from './pix-messages/pix-messages.module';

@Module({
  imports: [PixMessagesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
