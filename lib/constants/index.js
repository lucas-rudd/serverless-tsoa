"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CONFIG = {
    srcDir: './',
    outDir: './docs',
    config: './',
};
exports.DEFAULT_SWAGGER_DEFINITION = {
    components: {
        examples: {},
        headers: {},
        parameters: {},
        requestBodies: {},
        responses: {},
        schemas: {},
    },
    paths: {},
    produces: ['application/json'],
    swagger: '2.0',
    securityDefinitions: {},
    basePath: '/labels',
    consumes: ['application/json'],
    info: {
        title: 'label-service',
    },
    definitions: {},
};
exports.DEFAULT_MODEL_DEFINITION = {
    name: '',
    contentType: 'application/json',
    schema: {
        properties: {},
    },
    type: 'object',
};
exports.SUPPORTED_EXTENSIONS = ['json', 'yml', 'yaml', 'js'];
//# sourceMappingURL=index.js.map