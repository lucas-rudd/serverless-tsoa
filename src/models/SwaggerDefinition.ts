import { Union } from '../utils/typeguardUtilities';

export interface SwaggerDefinition {
  components: {
    examples: object;
    headers: object;
    parameters: object;
    requestBodies: object;
    responses: object;
    schemas: object;
  };
  paths: object;
  produces: string[];
  swagger: '2.0';
  securityDefinitions: object;
  basePath: string;
  consumes: string[];
  info: {
    title: string;
  };
  definitions: object;
}

export const ContentTypes = Union(
  'text/plain',
  'text/html',
  'application/octet-stream',
  'application/json',
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/gif'
);
export type ContentTypes = typeof ContentTypes.type;

export interface SwaggerModelSchemaProperty {
  type?: 'string' | 'array';
  items?: {
    $ref: string;
  };
  $ref?: string;
}
export interface SwaggerModelSchemaDefinition {
  properties: { [key: string]: object };
  required?: string[];
}
export interface SwaggerModelDefinition {
  name: string;
  contentType: ContentTypes;
  schema: SwaggerModelSchemaDefinition;
  type: 'object' | 'array';
}
