import { Options, renderFile as renderEJS } from "ejs";
import glob = require("fast-glob");
import { writeFile, watch as fsWatch } from "fs/promises";
import { join } from "path";

let baseAssets: Assets = {
  meta: [],
  styles: ["/assets/index.css"],
  scripts: ["/assets/jsx.js", "/assets/index.js"],
};

function xml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export { renderEJS };

/** An object representing assets that will be added to an HTML page using `render`. */
export interface Assets {
  /** A list of meta tags to include. */
  meta: [string, string][];

  /** A list of stylesheets to include. */
  styles: string[];

  /** A list of scripts to include. */
  scripts: string[];
}

/** The EJS options used by zSnout. */
export let ejsOptions: Options = Object.freeze({
  outputFunctionName: "echo",
  destructuredLocals: ["assets", "css", "js", "meta", "body", "title"], // unused for now
});

/**
 * Indents a string using a specified depth.
 * @param string The string to indent.
 * @param depth The number of spaces to indent.
 * @returns The indented string.
 */
export function indent(string: string, depth = 2): string {
  return string.split("\n").join("\n" + " ".repeat(depth));
}

/**
 * Takes a list of assets and turns it into a list of HTML strings.
 * @param assets The assets. Contains `meta`, `styles`, and `scripts` keys.
 * @returns An array containing a string representing each asset in HTML.
 */
export function makeAssetList(assets: Assets) {
  let meta = [...baseAssets.meta, ...assets.meta];
  let styles = [...baseAssets.styles, ...assets.styles];
  let scripts = [...baseAssets.scripts, ...assets.scripts];

  return [
    ...meta.map(
      ([name, content]) =>
        `<meta name="${xml(name)}" content="${xml(content)}" />`
    ),
    ...styles.map((href) => `<link rel="stylesheet" href="${xml(href)}" />`),
    ...scripts.map(
      (src) => `<script type="module" src="${xml(src)}"></script>`
    ),
  ];
}

let makeIcon = (title: string, href: string, icon: string) => {
  title = xml(title);
  href = xml(href);
  icon = xml(icon);

  return `<a href="${href}" title="${title}"><svg viewBox="2 2 20 20"><use href="/assets/icons/${icon}.svg#icon" /></svg></a>`;
};

/**
 * Renders an EJS template to HTML using specific data.
 * @param data The data to pass to the rendered function.
 * @returns A promise resolving to the rendered HTML.
 */
export async function render({
  body,
  title,
  icons,
  ...assets
}: {
  body: string;
  title: string;
  icons: [string, string, string][];
} & Assets) {
  return await renderEJS(join(__dirname, "/index.ejs"), {
    body,
    title,
    indent,
    buttons: icons.map(([title, href, icon]) => makeIcon(title, href, icon)),
    assets: makeAssetList(assets),
  });
}

/**
 * Renders an EJS file to HTML.
 * @param path The path to the file to render.
 * @returns A promise resolving to the rendered HTML.
 */
export async function renderFile(path: string) {
  let title = "";
  let meta: [string, string][] = [];
  let styles: string[] = [];
  let scripts: string[] = [];
  let icons: [string, string, string][] = [];

  let body = await renderEJS(path, {
    title: (name: string) => void (title = name),
    meta: (name: string, content: string) => void meta.push([name, content]),
    css: (href: string) => void styles.push(href),
    js: (src: string) => void scripts.push(src),
    nav: (title: string, href: string, icon: string) =>
      void icons.push([title, href, icon]),
    desc: (description: string) => void meta.push(["description", description]),
    indent,
  });

  return await render({ body, title, meta, styles, scripts, icons });
}

/**
 * Builds a file and saves it with a .html extension.
 * @param path The path to the file that will be built.
 * @returns A promise resolving once the operation is completed.
 */
export async function buildFile(path: string) {
  if (path.substr(-4) != ".ejs") throw new Error("File must end in .ejs");

  await writeFile(path.slice(0, -4) + ".html", await renderFile(path));
}

/**
 * Builds all .ejs files in a directory and saves them with a .html extension.
 * @param dir The path to the directory that will be built.
 * @returns A promise resolving once the operation is completed.
 */
export async function buildDir(dir: string) {
  let files = await glob([`${dir}/**/*.ejs`, "!**/node_modules/**"]);

  await Promise.all(files.map((file) => join(dir, file)).map(buildFile));
}

/**
 * Watches a directory for changes and builds .ejs files in it.
 * @param dir The path to the directory that will be watched.
 * @param signal An optional abort signal. Once this signal is triggered, the watcher will stop.
 * @returns A promise resolving once the operation is completed.
 */
export async function watch(dir: string, signal?: AbortSignal) {
  await buildDir(dir);
  console.log(`Built directory, watching for new changes...`);

  for await (let { filename } of fsWatch(dir, { recursive: true, signal })) {
    if (filename.substr(-4) == ".ejs") buildFile(join(dir, filename));
  }
}
