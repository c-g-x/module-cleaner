import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs";
import { filterDirectoriesWithNames } from "./utils.js";

let argv = yargs(hideBin(process.argv))
  .alias({ p: "path", h: "help", v: "version" })
  .describe({
    p: "module path, also support list",
  })
  .config({
    path: ["C:\\workspace\\company"],
    deleteDirectory: ["node_modules", "target", "dist"],
  }).argv;

let { path: dirPathList, deleteDirectory } = argv;

if (!(dirPathList instanceof Array)) {
  dirPathList = [dirPathList];
}

let absoluteFilePathList = filterDirectoriesWithNames(
  dirPathList,
  deleteDirectory
);
console.log(absoluteFilePathList);

absoluteFilePathList.forEach((absoluteFilePath) => {
  let before = Date.now();
  fs.rmSync(absoluteFilePath, { recursive: true, force: true });
  let after = Date.now();

  console.log(
    `${((after - before) / 1000).toFixed(2).padStart(5)}s, ${absoluteFilePath}`
  );
});
absoluteFilePathList.forEach((absoluteFilePath) =>
  fs.rmSync(absoluteFilePath, { recursive: true, force: true })
);
