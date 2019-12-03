export interface ConvertedSwaggerMethodResponse {
    statusCode: string;
    responseBody: {
        description?: string;
    };
    responseModels: object;
    responseHeaders?: object;
}
export interface ConvertedSwaggerParam {
    name: string;
    description?: string;
}
export interface ConvertedSwaggerDefinition {
    requestModels?: object;
    queryParams?: ConvertedSwaggerParam[];
    pathParams?: ConvertedSwaggerParam[];
    methodResponses: ConvertedSwaggerMethodResponse[];
}
