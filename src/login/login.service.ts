import { Injectable } from '@nestjs/common';
import { UserLoginDto } from 'src/dto/user-login.dto';
import { UserRegisterDto } from 'src/dto/user-register.dto';
import { UserResponseDto } from 'src/dto/user-response.dto';
import { TokenPair } from 'src/interfaces/token.interface';
import { TokenService } from 'src/token/token.service';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { InsertResult } from 'typeorm';
const bcrypt = require('bcrypt');

@Injectable()
export class LoginService {
  
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
    ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async authenticateUser(userLoginDto: UserLoginDto) {
    console.log(`authenticateUser: user=${userLoginDto.username} pswd=${userLoginDto.password}`);
    let user: User = await this.usersService.findUserByName(userLoginDto.username);
    if (user) {
      console.log(`user ${user.name} found`);
      console.log(user);
      if (await bcrypt.compare(userLoginDto.password, user.password)) {
        let newTokenPair = this.tokenService.generateTokenPair(user.id, user.name);
        await this.tokenService.addToken(newTokenPair, user);
        return newTokenPair;
      }
    }
    console.log("authenticateUser failed!");
    return null;
  }

    async registerUser(userRegisterDto: UserRegisterDto): Promise<null|TokenPair> {
        let response = new UserResponseDto();
        response.status = false;
        console.log(`registerUser: user=${userRegisterDto.username} pswd=${userRegisterDto.password}`);

        if (userRegisterDto.password == userRegisterDto.password2) {
            let user: User = await this.usersService.findUserByName(userRegisterDto.username);
            if (user) {
                console.log(`Failed! User ${userRegisterDto.username} already exists!`);
            } else {
                let password = await bcrypt.hash(userRegisterDto.password, 10) 
                let user: User = await this.usersService.addUser(userRegisterDto.username, password);  

                let tokenPair = this.tokenService.generateTokenPair(user.id, user.name);
                this.tokenService.addToken(tokenPair, user);
                return tokenPair;
            }  
        }
        console.log("registerUser failed!");
        return null;
    }
}
