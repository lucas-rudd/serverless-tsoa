import { SwaggerDefinition, SwaggerModelDefinition } from '../models';
export declare const moveModels: (swaggerDefinition: SwaggerDefinition, baseModelFile: string) => Promise<void>;
export declare const modifyReferences: (model: SwaggerModelDefinition) => {
    name: string;
    contentType: "text/html" | "text/plain" | "application/octet-stream" | "application/json" | "application/pdf" | "image/png" | "image/jpeg" | "image/gif";
    schema: import("../models").SwaggerModelSchemaDefinition;
    type: "object" | "array";
};
