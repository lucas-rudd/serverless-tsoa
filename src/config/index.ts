import * as path from 'path';
import { parsers } from '../parsers';

export const loadConfig = (filePath: string) => {
  let config = {};

  const ext = path.extname(filePath);
  try {
    if (ext === '.yml' || ext === '.yaml') {
      config = parsers.yaml(filePath);
    } else if (ext === '.js') {
      config = parsers.js(filePath);
    } else {
      config = parsers.json(filePath);
    }
    console.log(`loaded config from: "${filePath}"`);
  } finally {
    return config;
  }
};
