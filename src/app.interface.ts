import { Type } from "@nestjs/common";

export interface IDtoProperties {
  property: string;
  validators: string[];
}

export interface IDtoMetadata {
  name: string;
  properties: IDtoProperties[]
}

export interface IRoutes {
  method: string;
  path: string;
  dto: IDtoMetadata | null;
}

export interface IDtoMetadataResponse {
  path: string;
  dto: Type<IDtoMetadata>;
}