import { Controller, Get, Post } from "@nestjs/common";
import { Public } from "./common/decorators";

@Controller()
export class AppController {

  @Public()
  @Get('about')
  async about() {
    return {
      info: 'Welcome to the API Project. You must contact the provider to get the credentials'
    }
  }
}