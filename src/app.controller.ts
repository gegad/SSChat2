import { Controller, Get, Redirect, Res } from '@nestjs/common';
import { response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { AppService } from './app.service';

@Controller()
export class AppController {

  @Get()
  @Redirect('login')
  start() {
  }
}
