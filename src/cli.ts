#!/usr/bin/env node
import { fork, ChildProcess } from "child_process";
import { red, yellow, green } from "colors/safe";
import { CommandLineFlags, Warning } from "./models";
import {
  parseDirectory,
  parseCommandLineFlags,
  validateArguments,
  findAndRemoveFile,
  makeOutputDirectory
} from "./utils";
import { commandLineArgumentSchema } from "./schemas";
import { SUPPORTED_EXTENSIONS, DEFAULT_CONFIG } from "./constants";
import * as fs from "fs";
import * as _ from "lodash";
import { loadConfig } from "./config";

const baseDirectory = process.cwd();
const swaggerFile = "/swagger.yaml";
const modelFile = "/models.yaml";
const errors: Error[] = [];
const warnings: Warning[] = [];
const childProcesses: any = [];

const generateChildProcessPromise = (childProcesses: ChildProcess) =>
  new Promise((resolve, reject) => {
    childProcesses.on("message", ({ warnings: processWarnings, error }) => {
      if (processWarnings) {
        warnings.push(...processWarnings);
      }
      if (error) {
        const convertedError = new Error(error.message);
        convertedError.stack = error.stack;
        errors.push(convertedError);
      }
    });
    childProcesses.on("exit", code => {
      resolve(code);
    });
  });

export const generateTsoaSwaggerSpec = async (
  dir: string,
  files: string[],
  outDir: string = baseDirectory
) => {
  if (files.includes("tsoa.json")) {
    const tsoaConfig = require(dir + "tsoa.json");
    try {
      const childProcess = fork(`${__dirname}/generator.js`, [], {
        cwd: dir,
        stdio: "inherit"
      });
      childProcess.send({ tsoaConfig, outDir });
      childProcesses.push(generateChildProcessPromise(childProcess));
    } catch (e) {
      errors.push(e);
    }
  }
};

export const deepGenerateTsoaSwaggerSpec = async (
  dir: string,
  outDir?: string
) => {
  const files: string[] = fs.readdirSync(dir);
  generateTsoaSwaggerSpec(dir, files, outDir).catch(e => errors.push(e));
  for (const file of files) {
    try {
      if (fs.statSync(dir + file).isDirectory()) {
        deepGenerateTsoaSwaggerSpec(dir + file + "/", outDir).catch(
          e => errors.push
        );
      }
    } catch (e) {
      errors.push(e);
    }
  }
  return await Promise.all(childProcesses);
};

export const generateSwagger = async (commandLineFlags: CommandLineFlags) => {
  const { srcDir, outDir = "./" } = commandLineFlags;
  const parsedSrcDirectory =
    parseDirectory(baseDirectory) + parseDirectory(srcDir);
  const parsedOutDirectory =
    parseDirectory(baseDirectory) + parseDirectory(outDir);
  const baseSwagger = parsedOutDirectory + swaggerFile;
  const baseModel = parsedOutDirectory + modelFile;
  await Promise.all([
    findAndRemoveFile(baseSwagger),
    findAndRemoveFile(baseModel)
  ]);
  await Promise.all([makeOutputDirectory(parsedOutDirectory)]);
  await deepGenerateTsoaSwaggerSpec(parsedSrcDirectory, parsedOutDirectory);
  if (warnings.length > 0) {
    console.warn(`${warnings.length} warning(s) occurred`);
    warnings.forEach(warning => {
      console.warn(
        yellow(warning.message),
        green(JSON.stringify(warning.data))
      );
    });
  }
  if (errors.length > 0) {
    console.error(`${errors.length} error(s) occurred`);
    errors.forEach(error => {
      console.error(red(error.message), error.stack);
    });
  }
};

export const main = async (args: string[]) => {
  const commandLineFlags = parseCommandLineFlags(args);
  let config = {
    ...DEFAULT_CONFIG,
    ...commandLineFlags
  };
  if (!commandLineFlags.config) {
    SUPPORTED_EXTENSIONS.forEach(ext => {
      config = {
        ...config,
        ...loadConfig(
          parseDirectory(commandLineFlags.srcDir) + `documentationConfig.${ext}`
        )
      };
    });
  } else {
    config = {
      ...config,
      ...loadConfig(commandLineFlags.config)
    };
  }
  if (validateArguments(config, commandLineArgumentSchema)) {
    await generateSwagger(config);
  }
};

main(process.argv).catch(e => console.error(red("FATAL ERROR"), e));
