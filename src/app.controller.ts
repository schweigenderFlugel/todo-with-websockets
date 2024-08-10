import { Controller, Get, Render, Inject } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { Public } from "./common/decorators";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

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
  renderDocs() {
    // const schemas = [];
    // this.connection.modelNames().forEach(modelName => {
    //   const model = this.connection.model(modelName);
    //   const schema = model.schema.obj;
    //   schemas.push({ modelName, schema });
    // });
    const routes = this.appService.getAllRoutes();
    const dtos = this.appService.getAllDtoMetadata();
    return { routes, dtos, title: 'Documentación' };
  }
}