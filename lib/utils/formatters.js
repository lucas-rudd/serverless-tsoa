"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDirectory = (dir) => {
    if (dir) {
        const dirWithTrailingBackslash = dir.endsWith('/') ? dir : dir + '/';
        const parsedDir = dirWithTrailingBackslash;
        return parsedDir;
    }
    return '';
};
exports.parseCommandLineFlags = (commandLineArguments) => {
    const commandLineFlags = {};
    commandLineArguments.forEach((val) => {
        if (val.startsWith('--')) {
            const flag = val.slice(2);
            if (flag.includes('=')) {
                const commandLineFlagKey = flag.split('=')[0];
                commandLineFlags[commandLineFlagKey] = flag.split('=')[1];
            }
        }
    });
    return commandLineFlags;
};
//# sourceMappingURL=formatters.js.map