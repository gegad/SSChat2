import { Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenPair, DecodeResult } from 'src/interfaces/token.interface';
import { HttpArgumentsHost, WsArgumentsHost } from '@nestjs/common/interfaces';
import { TokenService } from 'src/token/token.service';


@Injectable()
export class ChatGuard implements CanActivate {
    constructor(
        private tokenService: TokenService,
    ) {}

    canActivate(
        context: ExecutionContext,
      ): boolean | Promise<boolean> | Observable<boolean> {
          console.log('canActivate: '+ context.getHandler().name);

          if (context.getHandler().name == 'loadChatPage') {
            return true;
          }
          if (context.getType() == "http") {
              return this.verifyTokenHttp(context.switchToHttp())
          } else if (context.getType() == "ws") {
              return this.verifyTokenWs(context.switchToWs());              
          }          
          return false;
      }

    async verifyTokenWs(ctx: WsArgumentsHost) {
        console.log("verifyTokenWs ->");
        let tokenPair: TokenPair = ctx.getData()?.token;
        let decoded: null | DecodeResult = await this.tokenService.decodeTokenAndRefresh(tokenPair);
        if (decoded.user) {
            if (decoded?.newTokenPair) {
                ctx.getClient().send(JSON.stringify(decoded.newTokenPair));
            }
            delete ctx.getData().token;
            ctx.getClient().user = decoded.user;
            return true;
        }
        return false;
    }

    async verifyTokenHttp(ctx: HttpArgumentsHost) {
      console.log("verifyTokenHttp ->");
      let tokenPair: TokenPair = ctx.getRequest().body;
      let decoded: null | DecodeResult = await this.tokenService.decodeTokenAndRefresh(tokenPair);
        if (decoded?.user) {
            if (decoded?.newTokenPair) {
                ctx.getRequest().body.newTokenPair = decoded.newTokenPair;
            }
            return true;
        }
        return false;
    }
}
