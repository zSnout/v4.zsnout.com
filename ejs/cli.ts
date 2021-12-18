#!/usr/bin/env node
import { buildDir, buildFile, watch } from "./index";

function onError(error: any): never {
  if ("message" in error) console.log(`Error: ${error.message}`);
  else console.log(`An unknown error occurred.`);

  process.exit();
}

let argv = process.argv;
let files = argv.slice(2);
let mode = files.shift();

if (!files.length) files = ["."];

let arr: Promise<void>[];

if (mode == "build" || mode == "-b") arr = files.map(buildDir);
else if (mode == "dir" || mode == "-d") arr = files.map(buildDir);
else if (mode == "file" || mode == "-f") arr = files.map(buildFile);
else if (mode == "watch" || mode == "-w") arr = files.map((dir) => watch(dir));
else {
  console.log("Usage: npx @zsnout/ejs [dir|watch] [...directories]");
  console.log("       npx @zsnout/ejs [file] [...files]");
  console.log("       ");
  console.log("       You may also use -d, -w, or -f");
  console.log("       The subcommands `build` and `-b` are aliases for `dir`");

  process.exit();
}

Promise.all(arr).catch(onError);
