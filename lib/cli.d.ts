#!/usr/bin/env node
import { CommandLineFlags } from './models';
export declare const generateTsoaSwaggerSpec: (dir: string, files: string[], outDir?: string) => Promise<void>;
export declare const deepGenerateTsoaSwaggerSpec: (dir: string, outDir?: string | undefined) => Promise<[unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]>;
export declare const generateSwagger: (commandLineFlags: CommandLineFlags) => Promise<void>;
export declare const main: (args: string[]) => Promise<void>;
