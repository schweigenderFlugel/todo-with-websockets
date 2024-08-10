import { Injectable, Type } from "@nestjs/common";
import { HttpAdapterHost, MetadataScanner, ModulesContainer } from "@nestjs/core";
import { plainToClass } from "class-transformer";
import { validateSync } from "class-validator";
import { IDtoMetadata, IRoutes } from "./app.interface";

@Injectable()
export class AppService {
  constructor(
    private readonly modulesContainer: ModulesContainer,
    private readonly metadataScanner: MetadataScanner,
    private readonly adapterHost: HttpAdapterHost,
  ) {}

  private getDtoProperties(dto: Type<IDtoMetadata>): IDtoMetadata['properties'] {
    const instance = plainToClass(dto, {});
    const errors = validateSync(instance);
    console.log(instance);
    return Object.keys(instance).map(key => ({
      property: key,
      validators: errors
        .filter(error => error.property === key)
        .map(error => error.constraints)
        .flatMap(contraints => Object.keys(contraints))
    }));
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

  getAllDtoMetadata(): IDtoMetadata[] {
    const modules = [...this.modulesContainer.values()];
    const dtos = new Set<Type<IDtoMetadata>>();

    modules.forEach(({ controllers }) => {
      if (!controllers) return;

      controllers.forEach(({ instance }) => {
        if (!instance) return;

        const prototype = Object.getPrototypeOf(instance);
        if (prototype.constructor.name.endsWith('Controller')) {
          const methods = this.metadataScanner.getAllMethodNames(prototype);
          methods.forEach(key => {
            const types: Type<IDtoMetadata>[] = Reflect.getMetadata('design:paramtypes', prototype, key);
            if (types) {
              types.forEach(type => {
                if (type && type.name.endsWith('Dto')) dtos.add(type);
              })
            }
          })
        }
      });
    });
    return Array.from(dtos).map(dto => ({
      name: dto.name,
      properties: this.getDtoProperties(dto),
    }));
  }
}