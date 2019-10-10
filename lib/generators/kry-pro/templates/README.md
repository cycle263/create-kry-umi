## kry-umi

基于最新的 umi@2.9 版本，支持一键开启 dll ，推荐使用 TypeScript。开箱即用的插件，无需安装额外依赖，比如 dva、dva-loading、dva-immer、path-to-regexp、object-assign、react、react-dom 等，其中 dva-immer 需通过配置开启。

**生成工程后需要配置如下文件**

- multiple-bundle-config 文件，对应多环境 bundle

- scripts/build.pro 配置，对应 Jenkins 打包基本信息，`yarn create kry-umi [appName]`执行此命令有输入 appName，则只需修改 DEP。不输入 appname，则默认取当前目录名称。

- src/global 和 .sentryclirc 文件的钟 sentry 地址，用于监控前端异常，未修改 build 会有异常。不需要 sentry 监控，可以手动注释 src/global 的初始化代码和 .umirc 的 sentryPlugin。

- install

```js
yarn install // install
yarn start   // 本地服务
yarn lint:es // 检测代码规范
```

- 约定的目录结构

```js
.
├── dist/                          // 默认的 build 输出目录
├── mock/                          // mock 文件所在目录，基于express，可在.env文件中关闭：MOCK=none
├── tests/                         // 测试脚本文件
├── config/
    ├── config.js                  // umi 配置，同 .umirc.js，二选一
└── src/                           // 源码目录，可选
    ├── layouts/index.js           // 全局布局，在所有路由外面嵌套一层路由
    ├── modals/                    // 全局 model
    ├── services/                  // 存放全局通用请求
    ├── components/                // 公用组件
    ├── utils/                     // 全局工具类方法
    ├── e2e/                       // 单元测试脚本文件
    ├── assets/                    // 存放静态资源，例如图片文件、字体文件等
    ├── pages/                     // 页面目录，即路由；也可创建的components、models、services，只用于该页面
        ├── .umi/                  // dev 临时目录，需添加到 .gitignore
        ├── .umi-production/       // build 临时目录，会自动删除
        ├── document.ejs           // HTML 模板
        ├── 404.js                 // 404 页面
        ├── page1.js               // 页面 1，任意命名，导出 react 组件
        ├── page1.test.js          // 用例文件，umi test 会匹配所有 .test.js 和 .e2e.js 结尾的文件
        └── page2.js               // 页面 2，任意命名
    ├── global.css                 // 约定的全局样式文件，自动引入，也可以用 global.less
    ├── global.js                  // 可以在这里加入 polyfill
    ├── app.js                     // 运行时配置文件
├── .umirc.js                      // umi 配置，同 config/config.js，二选一
├── .env                           // 环境变量
└── package.json
```

- 约定的路由

umi 会根据 pages 目录自动生成路由配置。

- modal

model 分两类，一是全局 model，二是页面 model。全局 model 存于 /src/models/ 目录，所有页面都可引用；页面 model 不能被其他页面所引用。

`src/models/**/*.js` 为 global model
`src/pages/**/models/**/*.js` 为 page model

```js
export default {
  namespace: 'demo', // model 的名字，必须全局唯一
  state: {
    count: 0,
  }, // 初始数据
  reducers: {
    save() { ... },
  }, // 修改数据
  effects: {
    *getData() { ... },
  }, // 获取数据
  subscriptions: {
    setup() { ... },
  }, // 订阅数据
}
```

- Effect

  - select 用于获取当前或其他 model 的 state 。

  - call 用于执行一个异步函数，可以理解为等待这个函数执行结束。

  - put 用于触发一个 action，既可以是一个 reducer, 也可以是一个 effect。

- connect

  推荐使用装饰器语法

  ```js
  import { connect } from 'dva';

  connect(({ global, loading }) => ({ global, loading }))(Demo)

  or

  @connect(({ user }) => ({ user }))
  class Demo extend Component
  ```

- import

  推荐使用@

  ```js
  // tsconfig.json
  "paths": {
    "@/*": ["src/*"]
  },
  ```
