import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { TokenService } from './token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './token.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Token]),
  ],
  controllers: [],
  providers: [TokenService, UsersService],
  exports: [TokenService]
})
export class TokenModule {}
