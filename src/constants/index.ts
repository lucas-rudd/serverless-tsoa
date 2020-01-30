import {
  SwaggerDefinition,
  CommandLineFlags,
  SwaggerModelDefinition
} from "../models";

export const DEFAULT_CONFIG: CommandLineFlags = {
  srcDir: "./",
  outDir: "./docs",
  config: "./"
};

export const DEFAULT_SWAGGER_DEFINITION: SwaggerDefinition = {
  components: {
    examples: {},
    headers: {},
    parameters: {},
    requestBodies: {},
    responses: {},
    schemas: {}
  },
  paths: {},
  produces: ["application/json"],
  swagger: "2.0",
  securityDefinitions: {},
  basePath: "/labels",
  consumes: ["application/json"],
  info: {
    title: "label-service"
  },
  definitions: {}
};

export const DEFAULT_MODEL_DEFINITION: SwaggerModelDefinition = {
  name: "",
  contentType: "application/json",
  schema: {
    properties: {}
  },
  type: "object"
};

export const SUPPORTED_EXTENSIONS = ["json", "yml", "yaml", "js"];
