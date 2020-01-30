import { generateSwaggerSpec, Config } from "tsoa";
import { lock, unlock, check } from "proper-lockfile";
import * as yaml from "js-yaml";
import * as fs from "fs";
import { SwaggerDefinition } from "./models";
import { DEFAULT_SWAGGER_DEFINITION } from "./constants";
import { moveModels } from "./movers";
import { convertToSwaggerPluginFormat } from "./adaptors";
import * as _ from "lodash";
import { green } from "colors/safe";
import { parseDirectory } from "./utils";
import { ChildProcess } from "child_process";

const swaggerFile = "/swagger.yaml";
const modelFile = "/models.yaml";

const thisProcess = (process as NodeJS.EventEmitter) as ChildProcess;

export const swaggerSpecGenerator = async (
  tsoaConfig: Config,
  outDir: string
) => {
  try {
    const baseSwagger = outDir + swaggerFile;
    const baseModel = outDir + modelFile;
    console.log(`generating swagger spec for ${green(process.cwd())}`);
    await generateSwaggerSpec(tsoaConfig.swagger, tsoaConfig.routes);
    const swaggerDefinition = yaml.safeLoad(
      fs.readFileSync(
        parseDirectory(process.cwd()) +
          parseDirectory(tsoaConfig.swagger.outputDirectory) +
          "/swagger.yaml",
        "utf8"
      )
    );
    let baseSwaggerDefinition: SwaggerDefinition = DEFAULT_SWAGGER_DEFINITION;
    if (fs.existsSync(baseSwagger)) {
      await lock(baseSwagger, { retries: 10 });
      baseSwaggerDefinition = yaml.safeLoad(
        fs.readFileSync(baseSwagger, "utf8")
      );
    }
    baseSwaggerDefinition = _.merge(baseSwaggerDefinition, swaggerDefinition);
    fs.writeFileSync(baseSwagger, yaml.safeDump(baseSwaggerDefinition));
    if (await check(baseSwagger)) {
      await unlock(baseSwagger);
    }
    /**
     * move models to model dir
     * then remove from swagger file in the same dir
     */
    if (fs.existsSync(baseModel)) {
      await lock(baseModel, { retries: 10 });
    }
    await moveModels(swaggerDefinition, baseModel);
    if (await check(baseModel)) {
      await unlock(baseModel);
    }
    const { components, ...swaggerDefinitionWithoutModels } = swaggerDefinition;
    const {
      warnings,
      convertedSwaggerDefinition
    } = convertToSwaggerPluginFormat(swaggerDefinitionWithoutModels);
    thisProcess.send({ warnings });
    fs.writeFileSync(
      parseDirectory(process.cwd()) +
        parseDirectory(tsoaConfig.swagger.outputDirectory) +
        "/swagger.yaml",
      yaml.safeDump(convertedSwaggerDefinition)
    );
  } catch (error) {
    thisProcess.send({ error: { message: error.message, stack: error.stack } });
  }
};

thisProcess.on("message", async ({ tsoaConfig, outDir }) => {
  try {
    await swaggerSpecGenerator(tsoaConfig, outDir);
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
});
