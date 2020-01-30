import { CommandLineFlags } from "../models";
import { ObjectSchema } from "@hapi/joi";

export const isValidResponseBody = (
  responseModelSchema: object | string
): responseModelSchema is string => {
  return typeof responseModelSchema !== "object";
};

export const validateArguments = (
  args: object,
  schema: ObjectSchema
): args is CommandLineFlags => {
  const { error } = schema.validate(args);
  if (error) {
    throw error;
  }
  return true;
};
