"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const parsers_1 = require("../parsers");
exports.loadConfig = (filePath) => {
    let config = {};
    const ext = path.extname(filePath);
    try {
        if (ext === '.yml' || ext === '.yaml') {
            config = parsers_1.parsers.yaml(filePath);
        }
        else if (ext === '.js') {
            config = parsers_1.parsers.js(filePath);
        }
        else {
            config = parsers_1.parsers.json(filePath);
        }
        console.log(`loaded config from: "${filePath}"`);
    }
    finally {
        return config;
    }
};
//# sourceMappingURL=index.js.map