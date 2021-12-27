import { Controller, Get, StreamableFile, Res, Req, Post, Put, Body } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { readFileSync, createReadStream } from 'fs';
import { join, resolve } from 'path';
import { UserLoginDto } from 'src/dto/user-login.dto';
import { UserRegisterDto } from 'src/dto/user-register.dto';
import { TokenPair } from 'src/interfaces/token.interface';
import { PassThrough } from 'stream';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {

    constructor(private loginService: LoginService) {}

    @Get()
    loadLoginPage(@Res() response)  {
        console.log("login");
        let loginPage = createReadStream(join(process.cwd(), './html/login_page.html'));
        response.type('text/html').send(loginPage);
    }

    @Post('auth')
    async login(@Body() userLoginDto: UserLoginDto) {
        console.log(`auth: user=${userLoginDto.username} pswd=${userLoginDto.password}`);
        return this.loginService.authenticateUser(userLoginDto);
    }

    @Post('register')
    async register(@Body() userRegisterDto: UserRegisterDto) {
        console.log(`register: user=${userRegisterDto.username} pswd=${userRegisterDto.password}`);
        return await this.loginService.registerUser(userRegisterDto);
    }
        
}
