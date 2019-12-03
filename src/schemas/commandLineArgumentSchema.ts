import { object, string } from '@hapi/joi';

export const commandLineArgumentSchema = object({
  srcDir: string().required(),
  outDir: string(),
  config: string(),
}).unknown(true);
