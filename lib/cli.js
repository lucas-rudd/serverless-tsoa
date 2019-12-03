#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const safe_1 = require("colors/safe");
const utils_1 = require("./utils");
const schemas_1 = require("./schemas");
const constants_1 = require("./constants");
const fs = __importStar(require("fs"));
const config_1 = require("./config");
const baseDirectory = process.cwd();
const swaggerFile = '/swagger.yaml';
const modelFile = '/models.yaml';
const errors = [];
const warnings = [];
const childProcesses = [];
const generateChildProcessPromise = (childProcesses) => new Promise((resolve, reject) => {
    childProcesses.on('message', ({ warnings: processWarnings, error }) => {
        if (processWarnings) {
            warnings.push(...processWarnings);
        }
        if (error) {
            const convertedError = new Error(error.message);
            convertedError.stack = error.stack;
            errors.push(convertedError);
        }
    });
    childProcesses.on('exit', code => {
        resolve(code);
    });
});
exports.generateTsoaSwaggerSpec = (dir, files, outDir = baseDirectory) => __awaiter(void 0, void 0, void 0, function* () {
    if (files.includes('tsoa.json')) {
        const tsoaConfig = require(dir + 'tsoa.json');
        try {
            const childProcess = child_process_1.fork(`${__dirname}/generator.js`, [], { cwd: dir, stdio: 'inherit' });
            childProcess.send({ tsoaConfig, outDir });
            childProcesses.push(generateChildProcessPromise(childProcess));
        }
        catch (e) {
            errors.push(e);
        }
    }
});
exports.deepGenerateTsoaSwaggerSpec = (dir, outDir) => __awaiter(void 0, void 0, void 0, function* () {
    const files = fs.readdirSync(dir);
    exports.generateTsoaSwaggerSpec(dir, files, outDir).catch(e => errors.push(e));
    for (const file of files) {
        try {
            if (fs.statSync(dir + file).isDirectory()) {
                exports.deepGenerateTsoaSwaggerSpec(dir + file + '/', outDir).catch(e => errors.push);
            }
        }
        catch (e) {
            errors.push(e);
        }
    }
    return yield Promise.all(childProcesses);
});
exports.generateSwagger = (commandLineFlags) => __awaiter(void 0, void 0, void 0, function* () {
    const { srcDir, outDir = './' } = commandLineFlags;
    const parsedSrcDirectory = utils_1.parseDirectory(baseDirectory) + utils_1.parseDirectory(srcDir);
    const parsedOutDirectory = utils_1.parseDirectory(baseDirectory) + utils_1.parseDirectory(outDir);
    const baseSwagger = parsedOutDirectory + swaggerFile;
    const baseModel = parsedOutDirectory + modelFile;
    yield Promise.all([utils_1.findAndRemoveFile(baseSwagger), utils_1.findAndRemoveFile(baseModel)]);
    yield Promise.all([utils_1.makeOutputDirectory(parsedOutDirectory)]);
    yield exports.deepGenerateTsoaSwaggerSpec(parsedSrcDirectory, parsedOutDirectory);
    if (warnings.length > 0) {
        console.warn(`${warnings.length} warning(s) occurred`);
        warnings.forEach(warning => {
            console.warn(safe_1.yellow(warning.message), safe_1.green(JSON.stringify(warning.data)));
        });
    }
    if (errors.length > 0) {
        console.error(`${errors.length} error(s) occurred`);
        errors.forEach(error => {
            console.error(safe_1.red(error.message), error.stack);
        });
    }
});
exports.main = (args) => __awaiter(void 0, void 0, void 0, function* () {
    const commandLineFlags = utils_1.parseCommandLineFlags(args);
    let config = Object.assign(Object.assign({}, constants_1.DEFAULT_CONFIG), commandLineFlags);
    if (!commandLineFlags.config) {
        constants_1.SUPPORTED_EXTENSIONS.forEach(ext => {
            config = Object.assign(Object.assign({}, config), config_1.loadConfig(utils_1.parseDirectory(commandLineFlags.srcDir) + `documentationConfig.${ext}`));
        });
    }
    else {
        config = Object.assign(Object.assign({}, config), config_1.loadConfig(commandLineFlags.config));
    }
    if (utils_1.validateArguments(config, schemas_1.commandLineArgumentSchema)) {
        yield exports.generateSwagger(config);
    }
});
exports.main(process.argv).catch(e => console.error(safe_1.red('FATAL ERROR'), e));
//# sourceMappingURL=cli.js.map