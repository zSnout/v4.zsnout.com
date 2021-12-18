import { serveDirectory } from "@zsnout/core";
import { join } from "path";

serveDirectory(join(__dirname, "/client"));
