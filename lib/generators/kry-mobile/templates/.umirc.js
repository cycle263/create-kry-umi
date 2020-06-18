// const path = require('path');
// const MultipleBundlePlugin = require('webpack-plugin-create-multiple-bundle-from-string-replace');
const SentryPlugin = require('@sentry/webpack-plugin');

// 获取git版本号
// tslint:disable-next-line: no-var-requires
export const __SENTRY_VERSION__ = require("./package.json").version;
// const cwd = process.cwd();

// ref: https://umijs.org/config/
const config = {
  //样式变量列表：https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
  theme: {
    "font-size-base": "13px",
  },
  treeShaking: true,
  history: 'hash',
  disableCSSModules: true,
  hash: true,
  <% if (reactFeatures.includes('pont')) { -%>
  proxy: {
    "/pontApi": {
      "target": "http://localhost:8008/",
      "changeOrigin": true
    }
  },
  <% } -%>
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: <% if (reactFeatures.includes('antdMobile')) { %>true<% } else { %>false<% } %>,
      dva: <% if (reactFeatures.includes('dva')) { %>true<% } else { %>false<% } %>,
      dynamicImport: <% if (reactFeatures.includes('dynamicImport')) { %>{ webpackChunkName: true, level: 1 }<% } else { %>false<% } %>,
      title: '<%= name %>',
      dll: <% if (reactFeatures.includes('dll')) { %>true<% } else { %>false<% } %>,
      <% if (reactFeatures.includes('locale')) { %>locale: {
        enable: true,
        default: 'en-US',
      },<% } %>
      routes: {
        exclude: [<% if (reactFeatures.includes('dva')) { %>
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,<% } %>
          /constants\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }]
  ],
  devtool: !!process.env.isRelease ? "source-map" : "",
  define: {
    __DEV__: process.env.NODE_ENV === "development",
    __HOST_CDN__: process.env.HOST_CDN,
    __HOST_API__: process.env.HOST_API,
    __MOCK__: !!process.env.MOCK,
    __IS_DEBUG_SENTRY__: !!process.env.DEBUG_SENTRY,
    __IS_RELEASE__: JSON.stringify(!!process.env.isRelease),
    __SENTRY_VERSION__: JSON.stringify(__SENTRY_VERSION__),
  },
  chainWebpack(config) {
    if (!!process.env.isRelease) {
      // sentry 上传sourceMap
      // config.plugin('SentryPlugin')
      //   .use(new SentryPlugin({
      //     release: __SENTRY_VERSION__,
      //     include: './dist',
      //     urlPrefix: '/',
      //     ignore: ['node_modules']
      //   }))

      // 多环境拷贝
      // config
      //   .plugin('MultipleBundle')
      //   .use(new MultipleBundlePlugin(
      //     require(path.resolve(__dirname, './multiple-bundle-config.js')),
      //     {
      //       sourcePath: path.resolve(__dirname, './dist'),
      //       distPath: `${path.resolve(__dirname, './dist')}/multiple-bundle-from-string-replace`,
      //     },
      //   ));

      config.output.set("publicPath", process.env.HOST_CDN);
    }
  }
}

export default config;
