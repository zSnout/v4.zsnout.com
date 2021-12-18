A module providing easy access to templating using EJS.

- [Basic Usage](#basic-usage)
  - [EJS Configuration](#ejs-configuration)
    - [echo(content: string): string](#echocontent-string-string)
    - [indent(string: string, depth?: number): string](#indentstring-string-depth-number-string)
    - [title(name: string): void](#titlename-string-void)
    - [meta(name: string, content: string): void](#metaname-string-content-string-void)
    - [desc(description: string): void](#descdescription-string-void)
    - [css(href: string): void](#csshref-string-void)
    - [js(src: string): void](#jssrc-string-void)
    - [nav(title: string, href: string, icon: string): void](#navtitle-string-href-string-icon-string-void)
  - [HTML Output](#html-output)
- [JavaScript API](#javascript-api)
  - [ejsOptions: Options](#ejsoptions-options)
  - [indent(string: string, depth?: number): string](#indentstring-string-depth-number-string-1)
  - [makeAssetList(assets: Assets)](#makeassetlistassets-assets)
  - [render(data: { body: string; title: string; } &amp; Assets)](#renderdata--body-string-title-string---assets)
  - [renderFile(path: string): Promise&lt;string>](#renderfilepath-string-promisestring)
  - [buildFile(path: string): Promise&lt;void>](#buildfilepath-string-promisevoid)
  - [buildDir(dir: string): Promise&lt;void>](#builddirdir-string-promisevoid)
  - [watch(dir: string, signal?: AbortSignal): Promise&lt;void>](#watchdir-string-signal-abortsignal-promisevoid)
- [TypeScript API](#typescript-api)
  - [interface Assets](#interface-assets)
    - [Assets.meta: [string, string]\[]](#assetsmeta-string-string)
    - [Assets.styles: string[]](#assetsstyles-string)
    - [Assets.scripts: string[]](#assetsscripts-string)

# Basic Usage

This module is not meant to be included using `import` or `require`.
Instead, its main purpose is as a command line tool used to "compile" EJS files into their HTML equivalents.
This allows for faster serving of files rather than having them compiled on the fly.
It also allows for a whole directory to be served using [@zsnout/core](https://npmjs.com/package/@zsnout/core)'s `serveDirectory`.

To use the utlity, run `npx @zsnout/core` with one of the subcommands below:

- `file (...filenames)`: Compiles the given EJS files into their HTML equivalents.
- `dir (...dirnames)`: Compiles all EJS files in the given directories into their HTML equivalents.
- `watch (...dirnames)`: Compiles all EJS files in the given directories into their HTML equivalents, and watches for changes.

Additionally, the `build` subcommand is provided as an alias for `dir`.
You may also use `-f`, `-d`, `-w`, and `-b` to specify `file`, `dir`, `watch`, and `build` respectively.

## EJS Configuration

When compiling an EJS file, the following functions are available:

### echo(content: string): string

Adds the content provided into the HTML output.

- `content: string`: The content to be added.

### indent(string: string, depth?: number): string

Indents a string using a specified depth.
Returns the indented string.

- `string: string` - The string to indent.
- `depth?: number` - The number of spaces to indent.

### title(name: string): void

Sets the title of the HTML document.

- `name: string` - The new title.

### meta(name: string, content: string): void

Adds a `<meta>` tag to the HTML document.

- `name: string` - The name of the meta tag.
- `content: string` - The content of the meta tag.

### desc(description: string): void

Shortcut for `meta("description", description)`.

- `description: string` - A description of the page.

### css(href: string): void

Adds a stylesheet to the HTML document.

- `href: string` - The URL of the stylesheet.

### js(src: string): void

Adds a script to the HTML document.

- `src: string` - The URL of the script.

### nav(title: string, href: string, icon: string): void

Adds an icon to the navigation bar.

- `title: string` - The title of the item.
- `href: string` - The URL to go to when clicked.
- `icon: string` - The name of the icon. When in the navbar, the image points to `assets/icons/<icon>.svg`.

## HTML Output

The HTML output includes three assets by default: `assets/index.css`, `assets/jsx.js`, and `assets/index.js`.
These are key to most projects. Because of this, no option to remove them is provided.

The HTML output puts assets into the `head` of the document, so stylesheets will be loaded before content.
Scripts will be loaded after content, as they are parsed as ES6 modules.
The content of your EJS file is placed into a `<main id="main">` element in the body of the document.

Navigation icons are placed in the `<nav>` element, which contains

- a home icon pointing to `assets/icons/home.svg`
- a `<span>` element with the webpage title
- other navigation icons as `<a href title><svg viewBox><use href /></svg></a>` elements.

# JavaScript API

## ejsOptions: Options

The EJS options used by zSnout.

## indent(string: string, depth?: number): string

Indents a string using a specified depth.
Returns the indented string.

- `string: string` - The string to indent.
- `depth?: number` - The number of spaces to indent.

## makeAssetList(assets: Assets)

Takes a list of assets and turns it into a list of HTML strings.
Returns an array containing a string representing each asset in HTML.

- `assets: Assets` - The assets. Contains `meta`, `styles`, and `scripts` keys.

## render(data: { body: string; title: string; } &amp; Assets)

Renders an EJS template to HTML using specific data.
Returns a promise resolving to the rendered HTML.

- `data: { body: string; title: string; } & Assets` - The data to pass to the rendered function.

## renderFile(path: string): Promise&lt;string>

Renders an EJS file to HTML.
Returns a promise resolving to the rendered HTML.

- `path: string` - The path to the file to render.

## buildFile(path: string): Promise&lt;void>

Builds a file and saves it with a .html extension.
Returns a promise resolving once the operation is completed.

- `path: string` - The path to the file that will be built.

## buildDir(dir: string): Promise&lt;void>

Builds all .ejs files in a directory and saves them with a .html extension.
Returns a promise resolving once the operation is completed.

- `dir: string` - The path to the directory that will be built.

## watch(dir: string, signal?: AbortSignal): Promise&lt;void>

Watches a directory for changes and builds .ejs files in it.
Returns a promise resolving once the operation is completed.

- `dir: string` - The path to the directory that will be watched.
- `signal?: AbortSignal` - An optional abort signal. Once this signal is triggered, the watcher will stop.

# TypeScript API

## interface Assets

An object representing assets that will be added to an HTML page using `render`.

### Assets.meta: [string, string]\[]

A list of meta tags to include.

### Assets.styles: string[]

A list of stylesheets to include.

### Assets.scripts: string[]

A list of scripts to include.
