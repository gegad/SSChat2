import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { LoginModule } from './login/login.module';
import { ChatModule } from './chat/chat.module';
import { Message } from './chat/message.entity';
import { Token } from './token/token.entity';
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'sschat',
      entities: [User, Message, Token],
      synchronize: true,
    }),
    ChatModule,
    TokenModule,
    LoginModule,    
],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
