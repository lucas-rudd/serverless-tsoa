import { CommandLineFlags } from '../models';
export declare const parseDirectory: (dir?: string | undefined) => string;
export declare const parseCommandLineFlags: (commandLineArguments: string[]) => Partial<CommandLineFlags>;
