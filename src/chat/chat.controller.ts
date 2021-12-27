import { Controller, Get, StreamableFile, Res, Req, Post, Put, Body, Param, Query, } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { ChatGuard } from './chat.guard';
import { UseGuards } from '@nestjs/common'
import { MessageService } from './message.service';
import { UserMessageDto } from 'src/dto/user-message.dto';
import { TokenPair } from 'src/interfaces/token.interface';
import { TokenService } from 'src/token/token.service';


@Controller('chat')
@UseGuards(ChatGuard)
export class ChatController {
    
    constructor(
        private messageService: MessageService,
        private tokenService: TokenService,
        ) {}

    @Get()
    loadChatPage(@Res() response) {
        console.log("loadChatPage ->");
        let loginPage = createReadStream(join(process.cwd(), './html/chat_page.html'));
        response.type('text/html').send(loginPage);
    }

    @Post('messages')
    async getMessages(@Body() data: UserMessageDto)  {
        console.log("messages");
        let lastMsgs = await this.messageService.getLastMessages(30);
        console.log(lastMsgs);
        let result: any = {messages: lastMsgs};
        if (data.newTokenPair) {
            result.token = data.newTokenPair;
        }
        return result;
    }

    @Post('logout') 
    logout(@Body() data: TokenPair) {
        console.log('logout');
        this.tokenService.deleteToken(data);
        return 'login';
    }

}
