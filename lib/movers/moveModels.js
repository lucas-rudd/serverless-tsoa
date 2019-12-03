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
const fs = __importStar(require("fs"));
const yaml = __importStar(require("js-yaml"));
const helper_utils_1 = require("@fwi-be-common/helper-utils");
const constants_1 = require("../constants");
exports.moveModels = (swaggerDefinition, baseModelFile) => __awaiter(void 0, void 0, void 0, function* () {
    const { components } = swaggerDefinition;
    Object.keys(components.schemas).forEach(definitionKey => {
        const modelDefinition = constants_1.DEFAULT_MODEL_DEFINITION;
        let baseModelDefinition = new Set();
        if (fs.existsSync(baseModelFile)) {
            baseModelDefinition = new Set(yaml
                .safeLoad(fs.readFileSync(baseModelFile, 'utf8'))
                .map((value) => JSON.stringify(value)));
        }
        modelDefinition.name = definitionKey;
        modelDefinition.schema = components.schemas[definitionKey];
        const modelDefinitionWithoutNullable = helper_utils_1.deepRemoveKey(modelDefinition, 'nullable');
        const modelWithRefsAltered = exports.modifyReferences(modelDefinitionWithoutNullable);
        baseModelDefinition.add(JSON.stringify(modelWithRefsAltered));
        fs.writeFileSync(baseModelFile, yaml.safeDump([...baseModelDefinition].map((value) => JSON.parse(value))));
    });
});
exports.modifyReferences = (model) => {
    const convertedModelSchema = Object.assign({}, model);
    const modelProperties = convertedModelSchema.schema.properties;
    Object.keys(modelProperties).forEach((propertyKey) => {
        const responseSchema = modelProperties[propertyKey];
        if (responseSchema['type'] &&
            responseSchema['type'] === 'array' &&
            responseSchema['items'] &&
            responseSchema['items']['$ref']) {
            responseSchema['items']['$ref'] = `{{model: ${modelProperties[propertyKey]['items']['$ref'].split('/')[modelProperties[propertyKey]['items']['$ref'].split('/').length - 1]}}}`;
        }
        else if (responseSchema['$ref']) {
            responseSchema['$ref'] = `{{model: ${modelProperties[propertyKey]['$ref'].split('/')[modelProperties[propertyKey]['$ref'].split('/').length - 1]}}}`;
        }
    });
    return convertedModelSchema;
};
//# sourceMappingURL=moveModels.js.map