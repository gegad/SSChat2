import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  message: string;

  @Column({ type: 'timestamp', nullable: true })
  date: Date;

  @ManyToOne(() => User, user => user.messages)
  user: User;
}