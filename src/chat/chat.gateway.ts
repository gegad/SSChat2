import { UseGuards } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket} from "@nestjs/websockets";
import { DecodeResult, TokenPair } from "src/interfaces/token.interface";
import { Server, Socket } from 'ws';
import { ChatGuard } from "./chat.guard";
import { UserMessageDto } from "src/dto/user-message.dto";
import { User } from "src/users/user.entity";
import { TokenService } from "src/token/token.service";
import { MessageService } from "./message.service";
const url = require('url');

@UseGuards(ChatGuard)
@WebSocketGateway(5001)
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private tokenService: TokenService,
        private messageService: MessageService
    ) {}

    @WebSocketServer() server: Server;
    private activeConnections: Set<Socket>;

    @SubscribeMessage('msg')
    handleChatEvent(@MessageBody() data: UserMessageDto, @ConnectedSocket() client: Socket) {
        console.log("handlelChatEvent");
        console.log(data);
        let user: User = client.user;
        this.messageService.addMessage(data, user);
        data.user = user;
        for (let conn of this.activeConnections) {
            conn.send(JSON.stringify(data));
        }
    }

    
    afterInit(server: any) {
        console.log("afterInit:");
        this.activeConnections = new Set();
    }

    // QUESTION: is there a way to handle quthentication for ws connection in guard?
    async handleConnection(socket: Socket, ...args: any[]) {
        console.log("handleConnection:");
        let query = url.parse(args[0].url).query;
        let queryParams = new URLSearchParams(query);
        let tokenPair: TokenPair = { 
            accessToken: queryParams.get("acct"),
            refreshToken: queryParams.get("reft")
        };
        let result: DecodeResult = await this.tokenService.decodeTokenAndRefresh(tokenPair);
        if (result.user) {
            this.activeConnections.add(socket);
            if (result?.newTokenPair) {
                socket.send(JSON.stringify(tokenPair));
            }
        } else {
            socket.close(4000);            
        }
    }

    handleDisconnect(socket: Socket) {
        console.log("handleDisconnect:");
        this.activeConnections.delete(socket);
    }


}