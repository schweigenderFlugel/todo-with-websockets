import { Controller, Get, Render } from "@nestjs/common";
import { Public } from "./common/decorators";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('about')
  @Render('index')
  async about() {
    return {
      info: 'Actualmente no tiene permiso para acceder a esta API. Por favor, pongase en contacto con el proveedor para obterner las credenciales'
    }
  }

  @Public()
  @Get('docs')
  @Render('docs')
  renderDoc() {
    const routes = this.appService.getAllRoutes();
    return { routes, title: 'Documentación' };
  }
}