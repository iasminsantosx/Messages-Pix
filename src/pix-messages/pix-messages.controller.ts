import { Controller, Post, Param, Res, HttpStatus, Get, Headers, NotFoundException } from '@nestjs/common';
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

  @Get('/:ispb/stream/start')
  async startStream(
    @Param('ispb') ispb: string,
    @Headers('accept') accept: string,
    @Res() res: Response,
  ) {
    try {
      const { messages, nextInteractionId } = await this.pixMessagesService.startStream(ispb, accept);

      if (accept === 'multipart/json') {
        if (messages.length > 0) {
          res.setHeader('Pull-Next', nextInteractionId ? `/api/pix/${ispb}/stream/${nextInteractionId}` : '');
          res.status(HttpStatus.OK).json(messages);
        } else {
          res.setHeader('Pull-Next', nextInteractionId ? `/api/pix/${ispb}/stream/${nextInteractionId}` : '');
          res.status(HttpStatus.NO_CONTENT).send();
        }
      } else {
        if (messages.length > 0) {
          res.setHeader('Pull-Next', nextInteractionId ? `/api/pix/${ispb}/stream/${nextInteractionId}` : '');
          res.status(HttpStatus.OK).json(messages.slice(0, 1));
        } else {
          res.setHeader('Pull-Next', nextInteractionId ? `/api/pix/${ispb}/stream/${nextInteractionId}` : '');
          res.status(HttpStatus.NO_CONTENT).send();
        }
      }
    } catch (e) {
      if (e instanceof NotFoundException) {
        res.status(HttpStatus.NOT_FOUND).json({ message: e.message });
      } else if (e.message === 'Too many active streams') {
        res.status(HttpStatus.TOO_MANY_REQUESTS).json({ message: e.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
      }
    }
  }

  @Get('/:ispb/stream/:interactionId')
  async GetMessages(
    @Param('ispb') ispb: string,
    @Param('interactionId') interactionId: string,
    @Headers('accept') accept: string,
    @Res() res: Response,
  ) {
    try {
      const { messages, nextInteractionId } = await this.pixMessagesService.getMessages(ispb, interactionId, accept);

      if (accept === 'multipart/json') {
        if (messages.length > 0) {
          res.setHeader('Pull-Next', nextInteractionId ? `/api/pix/${ispb}/stream/${nextInteractionId}` : '');
          res.status(HttpStatus.OK).json(messages);
        } else {
          res.setHeader('Pull-Next', nextInteractionId ? `/api/pix/${ispb}/stream/${nextInteractionId}` : '');
          res.status(HttpStatus.NO_CONTENT).send();
        }
      } else {
        if (messages.length > 0) {
          res.setHeader('Pull-Next', nextInteractionId ? `/api/pix/${ispb}/stream/${nextInteractionId}` : '');
          res.status(HttpStatus.OK).json(messages.slice(0, 1));
        } else {
          res.setHeader('Pull-Next', nextInteractionId ? `/api/pix/${ispb}/stream/${nextInteractionId}` : '');
          res.status(HttpStatus.NO_CONTENT).send();
        }
      }
    } catch (e) {
      if (e instanceof NotFoundException) {
        res.status(HttpStatus.NOT_FOUND).json({ message: e.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
      }
    }
  }

}
