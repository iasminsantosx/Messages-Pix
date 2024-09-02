import { Injectable, NotFoundException } from '@nestjs/common';
import { PixMessage } from './entities/pix-message.entity';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PixMessagesService {

  private interactions: Map<string, Date> = new Map();
  private activeStreams: Map<string, number> = new Map(); 
  private readonly MAX_STREAMS = 6;

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
        ispb:'3333',
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

  async getMessages(
    ispb: string,
    interactionId?: string,
    accept?: string,
    waitTimeMs: number = 8000
  ): Promise<{ messages: PixMessage[], nextInteractionId?: string }> {
    try {
      const query = this.pixMessagesRepository.createQueryBuilder('pix_message')
        .where('pix_message.recebedor ->> :field = :ispb', { field: 'ispb', ispb })
        .orderBy('pix_message.data_hora_pagamento', 'ASC')
        .take(10);

      if (interactionId) {
        const interactionMsg = await this.pixMessagesRepository.findOne({ where: { tx_id: interactionId } });
        if (!interactionMsg) {
          throw new NotFoundException('Interaction ID not found');
        }
        query.andWhere('pix_message.data_hora_pagamento > :dataHoraPagamento', { dataHoraPagamento: interactionMsg.data_hora_pagamento });
      } else if (this.interactions.has(ispb)) {
        const lastMessageTime = this.interactions.get(ispb);
        query.andWhere('pix_message.data_hora_pagamento > :dataHoraPagamento', { dataHoraPagamento: lastMessageTime });
      }

      let messages = await query.getMany();
      const startTime = Date.now();

      while (messages.length === 0 && (Date.now() - startTime) < waitTimeMs) {
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        messages = await query.getMany();
      }

      let nextInteractionId: string | undefined;
      if (messages.length >= 10) {
        nextInteractionId = messages[messages.length - 1].tx_id;
      }

      if (accept === 'multipart/json') {
        if (messages.length > 0) {
          this.interactions.set(ispb, messages[messages.length - 1].data_hora_pagamento);
        }
        return { messages, nextInteractionId };
      } else {
        this.interactions.delete(ispb);
        return { messages: messages.slice(0, 1), nextInteractionId };
      }
    } catch (error) {
      throw new Error('Falha ao pegar as mensagens.');
    }
  }

  async startStream(ispb: string, accept?: string): Promise<{ messages: PixMessage[], nextInteractionId?: string }> {
    try {
      const currentStreams = this.activeStreams.get(ispb) || 0;
      console.log(`Current streams for ${ispb}: ${currentStreams}`);
      
      if (currentStreams >= this.MAX_STREAMS) {
        throw new Error('Too many active streams');
      }
      
      this.activeStreams.set(ispb, currentStreams + 1);
      
      const { messages, nextInteractionId } = await this.getMessages(ispb, undefined, accept);
      return { messages, nextInteractionId };
    } catch (error) {
      throw error;  
    } 
  }

  async stopStream(ispb: string, interactionId: string): Promise<void> {
    try {
      const currentStreams = this.activeStreams.get(ispb) || 0;
  
      if (currentStreams > 0) {
        this.activeStreams.set(ispb, currentStreams - 1);
      }
  
      if (this.activeStreams.get(ispb) === 0) {
        this.activeStreams.delete(ispb);
      }
    } catch (error) {
      throw new Error('Ocorreu um erro na hora de para o stream.');
    }
  }
}
