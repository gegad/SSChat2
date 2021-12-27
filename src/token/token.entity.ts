import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, ManyToOne } from 'typeorm';
import { TokenPair } from 'src/interfaces/token.interface';
import { type } from 'os';
import { User } from 'src/users/user.entity';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string ;

  @ManyToOne(() => User, user => user.tokens)
  user: User
}