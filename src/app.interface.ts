import { Type } from '@nestjs/common';

export interface IDtoProperties {
  property: string;
  validators: string[];
}

export interface IDtoMetadata {
  name: string;
  properties: IDtoProperties[];
}

export interface IRoute {
  name: string;
  method: string;
  path: string;
  summary: string;
  dto: IDtoMetadata | null;
}

export interface IMetadataResponse {
  name: string;
  path: string;
  method: string;
  summary: string;
  dto: Type<IDtoMetadata>;
}
