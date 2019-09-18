# create-umi

Creates a kry UmiJS application/plugin/block/library using the command line.

[![NPM version](https://img.shields.io/npm/v/create-umi.svg?style=flat)](https://npmjs.org/package/create-umi)
[![Build Status](https://img.shields.io/travis/umijs/create-umi.svg?style=flat)](https://travis-ci.org/umijs/create-umi)
[![NPM downloads](http://img.shields.io/npm/dm/create-umi.svg?style=flat)](https://npmjs.org/package/create-umi)

## Usage

```bash
$ yarn create kryumi [appName]
```

## Boilerplates

* `ant-design-pro` - Create project with a layout-only ant-design-pro boilerplate, use together with umi block.
* `kry-pro` - Create kry project with a layout-only ant-design-pro boilerplate, use together with kryumi block.
* `app ` - Create project with a simple boilerplate, support typescript.
* `block ` - Create a umi block.
* `library ` - Create a library with umi.
* `plugin ` - Create a umi plugin.

## Usage Example

```bash
$ yarn create kryumi

? Select the boilerplate type (Use arrow keys)
  ant-design-pro  - Create project with a layout-only ant-design-pro boilerplate, use together with umi block.
  kry-pro         - Create kry project with a layout-only ant-design-pro boilerplate, use together with kryumi block.
❯ app             - Create project with a simple boilerplate, support typescript.
  block           - Create a umi block.
  library         - Create a library with umi.
  plugin          - Create a umi plugin.

? Do you want to use typescript? (y/N)

? What functionality do you want to enable? (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◯ antd
 ◯ dva
 ◯ code splitting
 ◯ dll

  create abc/package.json
  create abc/.gitignore
  create abc/.editorconfig
  create abc/.env
  create abc/.eslintrc
  create abc/.prettierignore
  create abc/.prettierrc
  create abc/.umirc.js
  create abc/mock/.gitkeep
  create abc/src/assets/yay.jpg
  create abc/src/global.css
  create abc/src/layouts/index.css
  create abc/src/layouts/index.tsx
  create abc/src/pages/index.css
  create abc/src/pages/index.tsx
  create abc/tsconfig.json
  create abc/typings.d.ts
 📋  Copied to clipboard, just use Ctrl+V
 ✨  File Generate Done
```

## FAQ

### `yarn create kryumi` command failed

这个问题基本上都是因为没有添加 yarn global module 的路径到 PATH 环境变量引起的。

先执行 `yarn global bin` 拿到路径，然后添加到 PATH 环境变量里。

```bash
$ yarn global bin
/usr/local/bin
```

你也可以尝试用 npm，

```bash
$ npm create kryumi
```

或者手动安装 create-kryumi，并执行他，

```bash
$ npm install create-kryumi -g
$ create-kryumi
```

## Questions & Suggestions

Please open an issue [here](https://github.com/cycle263/create-kry-umi/issues).

## LICENSE

MIT
