import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PixMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  endToEndId: string;

  @Column('decimal')
  valor: number;

  @Column('json')
  pagador: {
    nome: string;
    cpfCnpj: string;
    ispb: string;
    agencia: string;
    contaTransacional: string;
    tipoConta: string;
  };

  @Column('json')
  recebedor: {
    nome: string;
    cpfCnpj: string;
    ispb: string;
    agencia: string;
    contaTransacional: string;
    tipoConta: string;
  };

  @Column({ nullable: true })
  campoLivre: string;

  @Column()
  tx_id: string;

  @Column()
  data_hora_pagamento: Date; 
}