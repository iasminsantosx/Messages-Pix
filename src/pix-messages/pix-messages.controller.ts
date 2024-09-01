import { Controller, Post, Param, Res, HttpStatus } from '@nestjs/common';
import { PixMessagesService } from './pix-messages.service';
import { Response } from 'express';


@Controller('api/pix')
export class PixMessagesController {
  constructor(private readonly pixMessagesService: PixMessagesService) {}

  @Post('util/msgs/:ispb/:number')
  async createMessages(
    @Param('ispb') ispb: string,
    @Param('number') number: number,
    @Res() res: Response,
  ) {
    try {
      await this.pixMessagesService.createMessages(ispb, +number);
      res.status(HttpStatus.CREATED).send();
    } catch (e) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
  }

}
