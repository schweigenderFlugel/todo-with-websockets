import { Injectable, Type } from '@nestjs/common';
import { PATH_METADATA } from '@nestjs/common/constants';
import {
  HttpAdapterHost,
  MetadataScanner,
  ModulesContainer,
  Reflector,
} from '@nestjs/core';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import {
  IDtoMetadata,
  IDtoProperties,
  IMetadataResponse,
  IRoute,
} from './app.interface';
import { ROUTE_SUMMARY } from './common/decorators';

@Injectable()
export class AppService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly modulesContainer: ModulesContainer,
    private readonly metadataScanner: MetadataScanner,
    private readonly adapterHost: HttpAdapterHost,
    private readonly reflector: Reflector,
  ) {}

  private getDtoProperties(
    dto: Type<IDtoMetadata>,
  ): IDtoMetadata['properties'] {
    const properties: IDtoProperties[] = [];
    const instance = plainToClass(dto, {});
    const errors = validateSync(instance);
    errors
      .filter((error) => error.target === instance)
      .forEach((error) => {
        properties.push({
          property: error.property,
          validators: Object.values(error.constraints),
        });
      });
    return properties;
  }

  private getAllControllerMetadata() {
    const modules = [...this.modulesContainer.values()];
    const response: IMetadataResponse[] = [];

    modules.forEach(({ controllers }) => {
      if (!controllers) return;

      controllers.forEach(({ instance, metatype }) => {
        if (!instance) return;

        const prototype: object = Object.getPrototypeOf(instance);
        const methods = this.metadataScanner.getAllMethodNames(prototype);
        const name = prototype.constructor.name.split('Controller')[0];
        methods
          .filter((method) => method !== 'about' && method !== 'renderDoc')
          .forEach((key) => {
            const types: Type<IDtoMetadata>[] = Reflect.getMetadata(
              'design:paramtypes',
              prototype,
              key,
            );
            const summary = this.reflector.get<string>(
              ROUTE_SUMMARY,
              prototype[key],
            );
            if (types) {
              types.forEach((type) => {
                if (type && type.name.endsWith('Dto')) {
                  const metatypePath =
                    this.reflector.get(PATH_METADATA, metatype) === '/'
                      ? ''
                      : `/${this.reflector.get<string>(
                          PATH_METADATA,
                          metatype,
                        )}`;
                  const methodPath =
                    this.reflector.get<string>(
                      PATH_METADATA,
                      prototype[key],
                    ) === '/'
                      ? ''
                      : `/${this.reflector.get<string>(
                          PATH_METADATA,
                          prototype[key],
                        )}`;
                  const path = `${metatypePath}${methodPath}`;
                  response.push({
                    name: name,
                    path: path,
                    summary: summary,
                    dto: type,
                  });
                }
              });
            }
          });
      });
    });
    return response.map((item) => ({
      name: item.name,
      path: item.path,
      summary: item.summary,
      dto: {
        name: item.dto.name,
        properties: this.getDtoProperties(item.dto),
      },
    }));
  }

  private getModels() {
    const schemas = [];
    this.connection.modelNames().forEach((modelName) => {
      const model = this.connection.model(modelName);
      const schema = model.schema.obj;
      schemas.push({ modelName, schema });
    });
    return schemas;
  }

  getAllRoutes(): IRoute[] {
    const controllerMetadata = this.getAllControllerMetadata();
    const models = this.getModels();
    const server = this.adapterHost.httpAdapter.getInstance();
    models.forEach((model) => {
      const response = {
        [model.modelName]: {},
      };
      for (const key in model.schema) {
        response[model.modelName][key] = model.schema[key]['type'].name;
      }
    });
    const routes = server._router.stack
      .filter((r: any) => r.route)
      .filter((r: any) => r.route.path !== '/about' && r.route.path !== '/docs')
      .map((r: any) => ({
        name: controllerMetadata.some(
          (metadata) => metadata.path === r.route.path,
        )
          ? controllerMetadata.find(
              (metadata) => metadata.path === r.route.path,
            ).name
          : null,
        method: Object.keys(r.route.methods)[0].toUpperCase(),
        path: r.route.path,
        description: controllerMetadata.some(
          (metadata) => metadata.path === r.route.path,
        )
          ? controllerMetadata.find(
              (metadata) => metadata.path === r.route.path,
            ).summary
          : null,
        dto: controllerMetadata.some(
          (metadata) => metadata.path === r.route.path,
        )
          ? {
              name: controllerMetadata.find(
                (metadata) => metadata.path === r.route.path,
              ).dto.name,
              properties: controllerMetadata.find(
                (metadata) => metadata.path === r.route.path,
              ).dto.properties,
            }
          : null,
      })) as IRoute[];

    return routes;
  }
}
