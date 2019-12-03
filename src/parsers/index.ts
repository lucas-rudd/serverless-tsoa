import * as jsYaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

const isModuleNotFoundError = (err: any) =>
  err.code !== 'MODULE_NOT_FOUND' || err.message.indexOf('Cannot find module') !== -1;

const parseYaml = (filePath: string) => jsYaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
const parseJs = (filePath: string) => {
  const cwdFilepath = path.resolve(filePath);
  try {
    return require(cwdFilepath);
  } catch (err) {
    if (isModuleNotFoundError(err)) {
      return require(filePath);
    } else {
      throw err; // rethrow
    }
  }
};

const parseJson = (filePath: string) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

export const parsers = {
  yaml: parseYaml,
  js: parseJs,
  json: parseJson,
};
