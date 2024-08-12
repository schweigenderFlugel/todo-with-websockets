import { Injectable, Type } from "@nestjs/common";
import { PATH_METADATA } from "@nestjs/common/constants";
import { HttpAdapterHost, MetadataScanner, ModulesContainer, Reflector } from "@nestjs/core";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { plainToClass } from "class-transformer";
import { validateSync } from "class-validator";
import { IDtoMetadata, IDtoMetadataResponse, IDtoProperties, IRoutes } from "./app.interface";

@Injectable()
export class AppService {
  constructor(
    private readonly modulesContainer: ModulesContainer,
    private readonly metadataScanner: MetadataScanner,
    private readonly adapterHost: HttpAdapterHost,
    @InjectConnection() private readonly connection: Connection,
    private readonly reflector: Reflector,
  ) {}

  private getDtoProperties(dto: Type<IDtoMetadata>): IDtoMetadata['properties'] {
    let properties: IDtoProperties[] = []
    const instance = plainToClass(dto, {});
    const errors = validateSync(instance);
    errors.filter(error => error.target === instance)
      .forEach(error => {
        properties.push({ 
          property: error.property, 
          validators: Object.values(error.constraints)
        })
      })
    return properties;
  }

  private getAllDtoMetadata() {
    const modules = [...this.modulesContainer.values()];
    let response: IDtoMetadataResponse[] = [];

    modules.forEach(({ controllers }) => {
      if (!controllers) return;

      controllers.forEach(({ instance, metatype }) => {
        if (!instance) return;

        const prototype: object = Object.getPrototypeOf(instance);
        const methods = this.metadataScanner.getAllMethodNames(prototype);
        methods
          .filter(method => method !== 'about' && method !== 'renderDoc')
          .forEach(key => {
            const types: Type<IDtoMetadata>[] = Reflect.getMetadata('design:paramtypes', prototype, key);
            if (types) {
              types.forEach(type => {
                if (type && type.name.endsWith('Dto')) {
                  const metatypePath = this.reflector.get(PATH_METADATA, metatype) === '/'
                    ? ''
                    : `/${this.reflector.get<string>(PATH_METADATA, metatype)}`;
                  const methodPath = this.reflector.get<string>(PATH_METADATA, prototype[key]) === '/'
                    ? ''
                    : `/${this.reflector.get<string>(PATH_METADATA, prototype[key])}`
                  const path = `${metatypePath}${methodPath}`;
                  response.push({ path: path, dto: type })
                }
              })
            }
          })
        }
      );
    });
    return response.map(item => ({
      path: item.path,
      dto: {
        name: item.dto.name,
        properties: this.getDtoProperties(item.dto),
      },
    }));
  }

  private getModelSchema() {
    const schemas = [];
    this.connection.modelNames().forEach(modelName => {
      const model = this.connection.model(modelName);
      const schema = model.schema.obj;
      schemas.push({ modelName, schema });
    });
  }

  getAllRoutes(): Array<IRoutes> {
    const validationSchemas = this.getAllDtoMetadata();
    const server = this.adapterHost.httpAdapter.getInstance();
    const routes = server._router.stack
      .filter((r: any) => r.route)
      .filter((r: any) => r.route.path !== '/about' && r.route.path !== '/docs')
      .map((r: any) => ({
        method: Object.keys(r.route.methods)[0].toUpperCase(),
        path: r.route.path,
        dto: validationSchemas.some(schema => schema.path === r.route.path)
          ? {
              name: validationSchemas.find(schema => schema.path === r.route.path).dto.name,
              properties: validationSchemas.find(schema => schema.path === r.route.path).dto.properties,
            } 
          : null
      }))
    return routes;
  }
}