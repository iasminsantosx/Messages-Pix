import { Injectable } from '@nestjs/common';
import { PixMessage } from './entities/pix-message.entity';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PixMessagesService {

  constructor(
    @InjectRepository(PixMessage)
    private pixMessagesRepository: Repository<PixMessage>,
  ) {}

  async createMessages(ispb: string, number: number): Promise<void> {
    const messages: PixMessage[] = [];
    for (let i = 0; i < number; i++) {
      const message = new PixMessage();
      message.endToEndId = uuidv4();
      message.valor = Math.random() * 100;
      message.pagador = {
        nome: 'Nome Pagador',
        cpfCnpj: '12345678900',
        ispb,
        agencia: '0001',
        contaTransacional: '1231231',
        tipoConta: 'CACC',
      };
      message.recebedor = {
        nome: 'Nome Recebedor',
        cpfCnpj: '98765432100',
        ispb,
        agencia: '0361',
        contaTransacional: '1210098',
        tipoConta: 'SVGS',
      };
      message.campoLivre = '';
      message.tx_id = uuidv4();
      message.data_hora_pagamento = new Date();
      messages.push(message);
    }

    try {
      await this.pixMessagesRepository.save(messages);
    } catch (error) {
      throw new Error('Erro ao criar as mensagens.');
    }
  }
}
