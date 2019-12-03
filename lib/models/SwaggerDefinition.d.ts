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
export declare const ContentTypes: Readonly<{
    guard: (value: string | number) => value is "text/html" | "text/plain" | "application/octet-stream" | "application/json" | "application/pdf" | "image/png" | "image/jpeg" | "image/gif";
    check: (value: string | number) => "text/html" | "text/plain" | "application/octet-stream" | "application/json" | "application/pdf" | "image/png" | "image/jpeg" | "image/gif";
    values: ("text/html" | "text/plain" | "application/octet-stream" | "application/json" | "application/pdf" | "image/png" | "image/jpeg" | "image/gif")[];
} & {
    type: "text/html" | "text/plain" | "application/octet-stream" | "application/json" | "application/pdf" | "image/png" | "image/jpeg" | "image/gif";
}>;
export declare type ContentTypes = typeof ContentTypes.type;
export interface SwaggerModelSchemaProperty {
    type?: 'string' | 'array';
    items?: {
        $ref: string;
    };
    $ref?: string;
}
export interface SwaggerModelSchemaDefinition {
    properties: {
        [key: string]: object;
    };
    required?: string[];
}
export interface SwaggerModelDefinition {
    name: string;
    contentType: ContentTypes;
    schema: SwaggerModelSchemaDefinition;
    type: 'object' | 'array';
}
