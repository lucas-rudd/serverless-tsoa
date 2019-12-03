import { green } from 'colors/safe';
import {
  ConvertedSwaggerDefinition,
  SwaggerDefinition,
  Warning,
  SwaggerModelSchemaProperty,
} from '../models';
import { isValidResponseBody } from '../utils';

export const convertToSwaggerPluginFormat = (swaggerDefinition: SwaggerDefinition) => {
  const warnings: Warning[] = [];
  let convertedSwaggerDefinition: ConvertedSwaggerDefinition = {
    methodResponses: [],
  };
  Object.keys(swaggerDefinition.paths).forEach(path => {
    Object.keys(swaggerDefinition.paths[path]).forEach(httpMethod => {
      convertedSwaggerDefinition = {
        ...convertedSwaggerDefinition,
        ...parseParameters(swaggerDefinition.paths[path][httpMethod].parameters),
      };
      if (swaggerDefinition.paths[path][httpMethod].requestBody) {
        convertedSwaggerDefinition = {
          ...convertedSwaggerDefinition,
          requestModels: {
            ...parseRequestBody(swaggerDefinition.paths[path][httpMethod].requestBody),
          },
        };
      }
      Object.keys(swaggerDefinition.paths[path][httpMethod].responses).forEach(response => {
        const responseDefinition = swaggerDefinition.paths[path][httpMethod].responses[response];
        Object.keys(responseDefinition.content).forEach((contentType: string) => {
          const responseDefinitionForContent =
            swaggerDefinition.paths[path][httpMethod].responses[response].content[contentType];
          const responseModelSchema = parseSchema(responseDefinitionForContent.schema);
          if (isValidResponseBody(responseModelSchema)) {
            convertedSwaggerDefinition.methodResponses.push({
              statusCode: response,
              responseBody: { description: responseDefinition.description },
              responseModels: { [contentType]: responseModelSchema },
            });
          } else {
            warnings.push({
              message: `WARNING: Cannot use objects directly in response model schema for the path ${green(
                path
              )}. The response model schema must be a reference to a Model. This warning is likely due to using a Class as a response schema instead of an Interface.`,
              data: responseModelSchema,
            });
          }
        });
      });
    });
  });
  return { warnings, convertedSwaggerDefinition };
};

export const parseSchema = (tsoaSchema: SwaggerModelSchemaProperty): object | string => {
  let responseSchema: string | object = tsoaSchema;
  if (tsoaSchema.type && tsoaSchema.type === 'array' && tsoaSchema.items && tsoaSchema) {
    responseSchema = tsoaSchema.items['$ref'].split('/')[
      tsoaSchema.items['$ref'].split('/').length - 1
    ];
  } else if (tsoaSchema['$ref']) {
    responseSchema = tsoaSchema['$ref'].split('/')[tsoaSchema['$ref'].split('/').length - 1];
  }
  return responseSchema;
};

export const parseRequestBody = (tsoaRequestBody: object) => {
  const requestModel: object = {};

  Object.keys(tsoaRequestBody['content']).forEach((contentType: string) => {
    requestModel[contentType] = parseSchema(tsoaRequestBody['content'][contentType].schema);
  });
  return requestModel;
};

export const parseParameters = (parameters: object[]) => {
  const responseParameters = {};
  parameters.forEach(parameter => {
    if (parameter['in'] === 'path') {
      if (!responseParameters['pathParams']) {
        responseParameters['pathParams'] = [];
      }
      responseParameters['pathParams'].push({ name: parameter['name'] });
    } else if (parameter['in'] === 'query') {
      if (!responseParameters['queryParams']) {
        responseParameters['queryParams'] = [];
      }
      responseParameters['queryParams'].push({ name: parameter['name'] });
    }
  });
  return responseParameters;
};
