/// <reference types="hapi__joi" />
import { CommandLineFlags } from '../models';
import { ObjectSchema } from '@hapi/joi';
export declare const isValidResponseBody: (responseModelSchema: string | object) => responseModelSchema is string;
export declare const validateArguments: (args: object, schema: ObjectSchema<any>) => args is CommandLineFlags;
