import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, OneToMany } from 'typeorm';
import { TokenPair } from 'src/interfaces/token.interface';
import { Token } from 'src/token/token.entity';
import { Message } from 'src/chat/message.entity';

@Entity()
export class User {
  @PrimaryColumn({select: false})
  id: string;

  @Column()
  name: string;

  @Column({select: false})
  password: string;

  @OneToMany(() => Token, token => token.user)
  tokens: Token[]

  @OneToMany(() => Message, message => message.user)
  messages: Message[]
}