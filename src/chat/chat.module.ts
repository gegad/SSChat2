import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from 'src/token/token.module';
import { UsersService } from 'src/users/users.service';
import { TokenService } from 'src/token/token.service';
import { UsersModule } from 'src/users/users.module';
import { ChatController } from './chat.controller';
import { Message } from './message.entity';
import { MessageService } from './message.service';
import { ChatGateway } from './chat.gateway';
import { Token } from 'src/token/token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    TypeOrmModule.forFeature([Token]),
    UsersModule,
    TokenModule
  ],
  controllers: [ChatController],
  providers: [UsersService, TokenService, MessageService, ChatGateway],
  exports: []
})
export class ChatModule {}
