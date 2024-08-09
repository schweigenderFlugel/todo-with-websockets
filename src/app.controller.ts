import { Controller, Get, Render, Inject } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { Public } from "./common/decorators";

@Controller()
export class AppController {
  constructor(
    @Inject(HttpAdapterHost) private readonly adapterHost: HttpAdapterHost,
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
    const server = this.adapterHost.httpAdapter.getInstance();
    const schemas = [];
    this.connection.modelNames().forEach(modelName => {
      const model = this.connection.model(modelName);
      const schema = model.schema.obj;
      schemas.push({ modelName, schema });
    });
    const routes = server._router.stack
      .filter((r: any) => r.route)
      .map((r: any) => ({
        method: Object.keys(r.route.methods)[0].toUpperCase(),
        route: r.route.path,
      }))
    return { apiDocumentation: routes, title: 'Documentación', schemas };
  }
}