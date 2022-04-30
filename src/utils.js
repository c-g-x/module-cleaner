import fs from "fs";
import { join } from "path";

export function filterHideDirectory(dirPath) {
  return dirPath && !dirPath.startsWith(".");
}

export function notEmpty(object) {
  return object !== null && object.length > 0;
}

/**
 * 过滤符合条件的目录列表
 *
 * @param dirPathList{string[]|string} path list of directory
 * @param filterFn{(directory: string) => boolean} filter function
 */
export function filterDirectories(dirPathList = [], filterFn = () => true) {
  if (!(dirPathList instanceof Array)) {
    dirPathList = [dirPathList];
  }

  if (dirPathList.length === 0) {
    return dirPathList;
  }

  return dirPathList
    .filter(filterHideDirectory)
    .filter((dirPath) => fs.statSync(dirPath).isDirectory())
    .map((dirPath) => {
      // current path meets the condition
      if (filterFn(dirPath)) {
        console.log(dirPath);
        return dirPath;
      }

      // see sub-dir recursively
      let subDirPathList = fs
        .readdirSync(dirPath)
        .map((filename) => join(dirPath, filename));

      return filterDirectories(subDirPathList, filterFn);
    })
    .flat();
}

/**
 * 根据 names 过滤出目录列表
 *
 * @param dirPathList{string[]|string} 路径列表
 * @param names{string}
 */
export function filterDirectoriesWithNames(dirPathList = [], names) {
  return filterDirectories(dirPathList, (directory) => {
    let pos = directory.lastIndexOf("\\");
    let directoryName =
      (pos !== -1 && directory.substring(pos + 1)) || directory;
    return names.includes(directoryName);
  });
}
