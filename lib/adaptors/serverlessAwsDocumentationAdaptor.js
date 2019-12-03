"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const safe_1 = require("colors/safe");
const utils_1 = require("../utils");
exports.convertToSwaggerPluginFormat = (swaggerDefinition) => {
    const warnings = [];
    let convertedSwaggerDefinition = {
        methodResponses: [],
    };
    Object.keys(swaggerDefinition.paths).forEach(path => {
        Object.keys(swaggerDefinition.paths[path]).forEach(httpMethod => {
            convertedSwaggerDefinition = Object.assign(Object.assign({}, convertedSwaggerDefinition), exports.parseParameters(swaggerDefinition.paths[path][httpMethod].parameters));
            if (swaggerDefinition.paths[path][httpMethod].requestBody) {
                convertedSwaggerDefinition = Object.assign(Object.assign({}, convertedSwaggerDefinition), { requestModels: Object.assign({}, exports.parseRequestBody(swaggerDefinition.paths[path][httpMethod].requestBody)) });
            }
            Object.keys(swaggerDefinition.paths[path][httpMethod].responses).forEach(response => {
                const responseDefinition = swaggerDefinition.paths[path][httpMethod].responses[response];
                Object.keys(responseDefinition.content).forEach((contentType) => {
                    const responseDefinitionForContent = swaggerDefinition.paths[path][httpMethod].responses[response].content[contentType];
                    const responseModelSchema = exports.parseSchema(responseDefinitionForContent.schema);
                    if (utils_1.isValidResponseBody(responseModelSchema)) {
                        convertedSwaggerDefinition.methodResponses.push({
                            statusCode: response,
                            responseBody: { description: responseDefinition.description },
                            responseModels: { [contentType]: responseModelSchema },
                        });
                    }
                    else {
                        warnings.push({
                            message: `WARNING: Cannot use objects directly in response model schema for the path ${safe_1.green(path)}. The response model schema must be a reference to a Model. This warning is likely due to using a Class as a response schema instead of an Interface.`,
                            data: responseModelSchema,
                        });
                    }
                });
            });
        });
    });
    return { warnings, convertedSwaggerDefinition };
};
exports.parseSchema = (tsoaSchema) => {
    let responseSchema = tsoaSchema;
    if (tsoaSchema.type && tsoaSchema.type === 'array' && tsoaSchema.items && tsoaSchema) {
        responseSchema = tsoaSchema.items['$ref'].split('/')[tsoaSchema.items['$ref'].split('/').length - 1];
    }
    else if (tsoaSchema['$ref']) {
        responseSchema = tsoaSchema['$ref'].split('/')[tsoaSchema['$ref'].split('/').length - 1];
    }
    return responseSchema;
};
exports.parseRequestBody = (tsoaRequestBody) => {
    const requestModel = {};
    Object.keys(tsoaRequestBody['content']).forEach((contentType) => {
        requestModel[contentType] = exports.parseSchema(tsoaRequestBody['content'][contentType].schema);
    });
    return requestModel;
};
exports.parseParameters = (parameters) => {
    const responseParameters = {};
    parameters.forEach(parameter => {
        if (parameter['in'] === 'path') {
            if (!responseParameters['pathParams']) {
                responseParameters['pathParams'] = [];
            }
            responseParameters['pathParams'].push({ name: parameter['name'] });
        }
        else if (parameter['in'] === 'query') {
            if (!responseParameters['queryParams']) {
                responseParameters['queryParams'] = [];
            }
            responseParameters['queryParams'].push({ name: parameter['name'] });
        }
    });
    return responseParameters;
};
//# sourceMappingURL=serverlessAwsDocumentationAdaptor.js.map