"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = require("@hapi/joi");
exports.commandLineArgumentSchema = joi_1.object({
    srcDir: joi_1.string().required(),
    outDir: joi_1.string(),
    config: joi_1.string(),
}).unknown(true);
//# sourceMappingURL=commandLineArgumentSchema.js.map