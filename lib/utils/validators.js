"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidResponseBody = (responseModelSchema) => {
    return typeof responseModelSchema !== 'object';
};
exports.validateArguments = (args, schema) => {
    const { error } = schema.validate(args);
    if (error) {
        throw error;
    }
    return true;
};
//# sourceMappingURL=validators.js.map