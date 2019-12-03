"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsYaml = __importStar(require("js-yaml"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const isModuleNotFoundError = (err) => err.code !== 'MODULE_NOT_FOUND' || err.message.indexOf('Cannot find module') !== -1;
const parseYaml = (filePath) => jsYaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
const parseJs = (filePath) => {
    const cwdFilepath = path.resolve(filePath);
    try {
        return require(cwdFilepath);
    }
    catch (err) {
        if (isModuleNotFoundError(err)) {
            return require(filePath);
        }
        else {
            throw err; // rethrow
        }
    }
};
const parseJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));
exports.parsers = {
    yaml: parseYaml,
    js: parseJs,
    json: parseJson,
};
//# sourceMappingURL=index.js.map