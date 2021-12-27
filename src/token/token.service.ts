import { Injectable } from '@nestjs/common';
import { TokenPair, DecodeResult, DecodedToken } from 'src/interfaces/token.interface';
const jwt = require('jsonwebtoken');

// TODO: use ConfigModule
import * as dotenv from 'dotenv';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Token } from './token.entity';
import { InjectRepository } from '@nestjs/typeorm';
dotenv.config();
// import 


@Injectable()
export class TokenService {

    constructor(
        @InjectRepository(Token)
        private tokenRepository: Repository<Token>,
        private usersService: UsersService,
    ) {}

    generateTokenPair(userId: string, userName: string): TokenPair {
      
        let accessToken =  jwt.sign({id: userId, name: userName}, process.env.ACCESS_TOKEN_KEY, { expiresIn: '15m' });
        let refreshToken =  jwt.sign({id: userId, name: userName}, process.env.REFRESH_TOKEN_KEY, { expiresIn: '2d' });
        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        };
    }

    async decodeAccessToken(token: string): Promise<null|User> {
        let decoded: DecodedToken;
        try {
            decoded =  jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
        } catch (err) {
            console.log("Access token verification failed");
            return null;
        }
        return await this.usersService.findUser(decoded.id);
    }

    async decodeRefreshToken(token: string): Promise<null|User> {
        let decoded: DecodedToken;
        try {
            decoded =  jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
        } catch (err) {
            console.log("Refresh token verification failed");
            return null;
        }
        return await this.usersService.findUser(decoded.id);
    }

    async decodeTokenAndRefresh(tokenPair: TokenPair): Promise<null|DecodeResult> {
        console.log('TokenService: decodeTokenAndRefresh -> ');
        console.log(tokenPair);
        
        let accessTokenExpired: boolean = false;
        let decodedUser: User = await this.decodeAccessToken(tokenPair.accessToken);
        if (!decodedUser) {
            decodedUser = await this.decodeRefreshToken(tokenPair.refreshToken);
            accessTokenExpired = true;
        }
        if (!decodedUser) {
            this.deleteToken(tokenPair);
            return null;
        }
           
        let tokenFound = await this.findTokenUser(tokenPair);
        console.log(tokenFound);
        if (!tokenFound || tokenFound.user.id != decodedUser.id) {
            return null;
        }
        let result: DecodeResult = {user: decodedUser};
        if (accessTokenExpired) {
            let newTokenPair = this.generateTokenPair(decodedUser.id, decodedUser.name);
            // TODO: 
            console.log("REFRESH TOKEN: NEW PAIR ->");
            console.log(newTokenPair);

            this.deleteToken(tokenPair);
            this.addToken(newTokenPair, decodedUser);
            result.newTokenPair = newTokenPair;
        }
        return result;
    }    

    async findTokenUser(tokenPair: TokenPair): Promise<null|Token> {
        console.log(`findTokenUser: `);
        try {
            return this.tokenRepository.createQueryBuilder("token")
                                            .innerJoinAndSelect("token.user", "user")
                                            .where({accessToken: tokenPair.accessToken, 
                                                    refreshToken: tokenPair.refreshToken})
                                            .getOne();

        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async addToken(tokenPair: TokenPair, user: User) {
        console.log("addToken");
        try {
            let newToken = new Token();
            newToken.accessToken = tokenPair.accessToken;
            newToken.refreshToken = tokenPair.refreshToken;
            newToken.user = user;
            this.tokenRepository.save(newToken);
        } catch (e) {
            console.log(e);
        }
    }

    async deleteToken(tokenPair: TokenPair) {
        console.log("deleteToken");
        try {
            this.tokenRepository.delete({accessToken: tokenPair.accessToken});
            this.tokenRepository.delete({refreshToken: tokenPair.refreshToken});
        } catch (e) {

        }     
    }
}
