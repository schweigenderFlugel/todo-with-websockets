import { Injectable, Type } from "@nestjs/common";
import { HttpAdapterHost, MetadataScanner, ModulesContainer } from "@nestjs/core";
import { plainToClass } from "class-transformer";
import { validateSync } from "class-validator";
import { IDtoMetadata, IDtoMetadataResponse, IDtoProperties, IRoutes } from "./app.interface";

@Injectable()
export class AppService {
  constructor(
    private readonly modulesContainer: ModulesContainer,
    private readonly metadataScanner: MetadataScanner,
    private readonly adapterHost: HttpAdapterHost,
  ) {}

  private getDtoProperties(dto: Type<IDtoMetadata>): IDtoMetadata['properties'] {
    let properties: IDtoProperties[] = []
    const instance = plainToClass(dto, {});
    const errors = validateSync(instance);
    errors.filter(error => error.target === instance)
      .forEach(error => {
        properties.push({ 
          property: error.property, 
          validators: Object.keys(error.constraints)
        })
      })
    return properties;
  }

  getAllRoutes(): Array<IRoutes> {
    const server = this.adapterHost.httpAdapter.getInstance();
    const routes = server._router.stack
      .filter((r: any) => r.route)
      .map((r: any) => ({
        method: Object.keys(r.route.methods)[0].toUpperCase(),
        path: r.route.path,
      }))
    return routes;
  }

  getAllDtoMetadata() {
    const modules = [...this.modulesContainer.values()];
    let response: IDtoMetadataResponse[] = [];
    const dtos = new Set<Type<IDtoMetadata>>();

    modules.forEach(({ controllers }) => {
      if (!controllers) return;

      controllers.forEach(({ instance }) => {
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
                  response.push({method: key, dto: type})
                  dtos.add(type);
                }
              })
            }
          })
        }
      );
    });
    return response.map(item => ({
      method: item.method,
      dto: {
        name: item.dto.name,
        properties: this.getDtoProperties(item.dto),
      },
    }));
  }
}