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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsoa_1 = require("tsoa");
const yaml = __importStar(require("js-yaml"));
const fs = __importStar(require("fs"));
const constants_1 = require("./constants");
const movers_1 = require("./movers");
const adaptors_1 = require("./adaptors");
const _ = __importStar(require("lodash"));
const safe_1 = require("colors/safe");
const utils_1 = require("./utils");
const swaggerFile = '/swagger.yaml';
const modelFile = '/models.yaml';
const thisProcess = process;
exports.swaggerSpecGenerator = (tsoaConfig, outDir) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const baseSwagger = outDir + swaggerFile;
        const baseModel = outDir + modelFile;
        console.log(`generating swagger spec for ${safe_1.green(process.cwd())}`);
        yield tsoa_1.generateSwaggerSpec(tsoaConfig.swagger, tsoaConfig.routes);
        const swaggerDefinition = yaml.safeLoad(fs.readFileSync(utils_1.parseDirectory(process.cwd()) +
            utils_1.parseDirectory(tsoaConfig.swagger.outputDirectory) +
            '/swagger.yaml', 'utf8'));
        let baseSwaggerDefinition = constants_1.DEFAULT_SWAGGER_DEFINITION;
        if (fs.existsSync(baseSwagger)) {
            baseSwaggerDefinition = yaml.safeLoad(fs.readFileSync(baseSwagger, 'utf8'));
        }
        baseSwaggerDefinition = _.merge(baseSwaggerDefinition, swaggerDefinition);
        fs.writeFileSync(baseSwagger, yaml.safeDump(baseSwaggerDefinition));
        /**
         * move models to model dir
         * then remove from swagger file in the same dir
         */
        yield movers_1.moveModels(swaggerDefinition, baseModel);
        const { components } = swaggerDefinition, swaggerDefinitionWithoutModels = __rest(swaggerDefinition, ["components"]);
        const { warnings, convertedSwaggerDefinition } = adaptors_1.convertToSwaggerPluginFormat(swaggerDefinitionWithoutModels);
        thisProcess.send({ warnings });
        fs.writeFileSync(utils_1.parseDirectory(process.cwd()) +
            utils_1.parseDirectory(tsoaConfig.swagger.outputDirectory) +
            '/swagger.yaml', yaml.safeDump(convertedSwaggerDefinition));
    }
    catch (error) {
        thisProcess.send({ error: { message: error.message, stack: error.stack } });
    }
});
thisProcess.on('message', ({ tsoaConfig, outDir }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.swaggerSpecGenerator(tsoaConfig, outDir);
        process.exit(0);
    }
    catch (error) {
        process.exit(1);
    }
}));
//# sourceMappingURL=generator.js.map