import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserMessageDto } from 'src/dto/user-message.dto';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
    ) {}

    addMessage(msgData: UserMessageDto, user: User) : void {
        let msg: Message = new Message();
        msg.date = msgData.date;
        msg.message = msgData.message;
        msg.user = user;
        try {
            this.messageRepository.save(msg);
        } catch (e) {
            console.log(e);
        }
    }

    async getLastMessages(msgNumber: number) {
        try{
            return this.messageRepository.createQueryBuilder("message")
            .select()
            .innerJoinAndSelect("message.user", "user")
            .orderBy("message.date", "DESC")
            .limit(msgNumber)
            .getMany();
        } catch (e) {
            console.log(e);
        }
        return null;
    }
}
