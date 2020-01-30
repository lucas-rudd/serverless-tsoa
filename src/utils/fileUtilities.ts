import * as util from "util";
import * as fs from "fs";

const fsUnlink = util.promisify(fs.unlink);
const fsMkdir = util.promisify(fs.mkdir);
export const findAndRemoveFile = async (fileName: string) => {
  if (fs.existsSync(fileName)) {
    return fsUnlink(fileName);
  }
};

export const makeOutputDirectory = async (dir: string) => {
  if (!fs.existsSync(dir)) {
    return fsMkdir(dir);
  }
};
