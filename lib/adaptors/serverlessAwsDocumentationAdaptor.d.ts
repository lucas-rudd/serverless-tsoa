import { ConvertedSwaggerDefinition, SwaggerDefinition, Warning, SwaggerModelSchemaProperty } from '../models';
export declare const convertToSwaggerPluginFormat: (swaggerDefinition: SwaggerDefinition) => {
    warnings: Warning[];
    convertedSwaggerDefinition: ConvertedSwaggerDefinition;
};
export declare const parseSchema: (tsoaSchema: SwaggerModelSchemaProperty) => string | object;
export declare const parseRequestBody: (tsoaRequestBody: object) => object;
export declare const parseParameters: (parameters: object[]) => {};
