import { CommandLineFlags } from '../models';

export const parseDirectory = (dir?: string) => {
  if (dir) {
    const dirWithTrailingBackslash = dir.endsWith('/') ? dir : dir + '/';
    const parsedDir = dirWithTrailingBackslash;
    return parsedDir;
  }
  return '';
};

export const parseCommandLineFlags = (
  commandLineArguments: string[]
): Partial<CommandLineFlags> => {
  const commandLineFlags: { [key: string]: string } = {};
  commandLineArguments.forEach((val: string) => {
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
