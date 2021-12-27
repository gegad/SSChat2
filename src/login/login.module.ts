import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from 'src/token/token.module';
import { UsersService } from 'src/users/users.service';
import { TokenService } from 'src/token/token.service';
import { UsersModule } from 'src/users/users.module';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { Token } from 'src/token/token.entity';

@Module({
  imports: [
    UsersModule,
    TokenModule,
    TypeOrmModule.forFeature([Token]),
  ],
  controllers: [LoginController],
  providers: [UsersService, TokenService, LoginService],
  exports: [LoginService]
})
export class LoginModule {}
