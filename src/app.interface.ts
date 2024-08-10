export interface IDtoMetadata {
  name: string;
  properties: {
    property: string;
    validators: string[];
  }[]
}

export interface IRoutes {
  method: string;
  path: string;
}