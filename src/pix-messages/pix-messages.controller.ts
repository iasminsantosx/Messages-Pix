import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PixMessagesService } from './pix-messages.service';


@Controller('pix-messages')
export class PixMessagesController {
  constructor(private readonly pixMessagesService: PixMessagesService) {}

}
