## kry-umi

基于最新的 umi@2.9 版本，支持一键开启 dll ，推荐使用 TypeScript。开箱即用的插件，无需安装额外依赖，比如 dva、dva-loading、dva-immer、path-to-regexp、object-assign、react、react-dom 等，其中 dva-immer 需通过配置开启。

**生成工程后需要配置如下文件**

- multiple-bundle-config 文件，对应多环境 bundle  (create-kry-umi@1.1.0之后版本已经去除)

- 指定build发版机制（create-kry-umi@1.1.0之后版本更新）

- scripts/build.pro 配置，对应 Jenkins 打包基本信息，`yarn create kry-umi [appName]`执行此命令有输入 appName，则只需修改 DEP。不输入 appname，则默认取当前目录名称。

- src/global 和 .sentryclirc 文件的钟 sentry 地址，用于监控前端异常，未修改 build 会有异常。不需要 sentry 监控，可以手动注释 src/global 的初始化代码和 .umirc 的 sentryPlugin。

- install

```js
yarn install // install
yarn start   // 本地服务
yarn lint:es // 检测代码规范
```

- 技巧

  * https 启动 devserver，package.json里修改 env 中的 HTTPS 为true；http启动则需删除此配置。

- 约定的目录结构

```js
.
├── dist/                          // 默认的 build 输出目录
├── mock/                          // mock 文件所在目录，基于express，可在.env文件中关闭：MOCK=none
├── tests/                         // 测试脚本文件
├── pontAPI/                       // pont生成的元数据文件
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
└── pont-config.json               // pont配置文件
└── pontTemplate.ts                // pont接口代码模板
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

- lint

  vscode 配置 lint，安装 `Prettier - Code formatter` 插件，配置 tslint.formatOnSave 为 true，保存自动格式化。

  [lint 规则详情参见](https://github.com/AlloyTeam/tslint-config-alloy)

  ### 常见代码规范

  - 编辑、新增、查看统一使用路由 detial，使用 query 字符串 type 来区分，包括：add、edit、view、copy 等

  - less 全局变量写在 src/layouts/constants.less 里，以便统一样式，包括色号，字号，字体等

  - conventional-changelog生成changelog

  - 接入cnzz埋点

  - api建议使用pont工具，生成接口代码和文档、mock数据等，pont mock端口号默认8008

    **接入步骤**：

    1、安装vscode的插件pont；

    2、安装依赖包pont-engine；

    3、修改pont-config配置，或者pont start命令修改配置；

    4、使用vscode状态栏的generate指令生成pont元数据，对应pontAPI目录。

    **使用步骤**：

    ```js
    // services

    export async function queryLineList(params: any) {
      return API.multiDeliveryLine.query.request(params, {});
    };
    ```

    **使用技巧**

    * cmd + ctrl + p 进行接口查找

    * 右键 pont 接口代码，可以跳转(jump to mock position)去编辑接口的 mocks 数据

    * 右键 pont 接口代码，可以访问(visit mocks interface) GET 类型的 mocks 接口

    * [详情参见](https://github.com/alibaba/pont)

### 常见异常

* run release有未知错误信息，请检查sentry的配置文件，或者 .umirc里直接注释sentry插件 （将不会使用监控系统sentry）

* 修改.sentryclirc的url

* release:debug更新changelog。如果standard-version异常，请关联remote Repository
