import { IConfig } from 'umi-types';
const path = require('path');
const MultipleBundlePlugin = require('webpack-plugin-create-multiple-bundle-from-string-replace');
const SentryPlugin = require('@sentry/webpack-plugin');
const version = require('./package.json').version;
const cwd = process.cwd();

// ref: https://umijs.org/config/
const config: IConfig = {
  treeShaking: true,
  history: 'hash',
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: <% if (reactFeatures.includes('antd')) { %>true<% } else { %>false<% } %>,
      dva: <% if (reactFeatures.includes('dva')) { %>true<% } else { %>false<% } %>,
      dynamicImport: <% if (reactFeatures.includes('dynamicImport')) { %>{ webpackChunkName: true }<% } else { %>false<% } %>,
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
          /components\//,
        ],
      },
    }]
  ],
  define: {
    '__HOST_CDN__': JSON.stringify(process.env.HOST_CDN),
    '__HOST_API__': JSON.stringify(process.env.HOST_API),
    '__IS_RELEASE__': JSON.stringify(!!process.env.isRelease)
  },
  chainWebpack(config) {
    if (!!process.env.isRelease) {
      // sentry 上传sourceMap
      config.plugin('SentryPlugin')
        .use(new SentryPlugin({
          release: version,
          include: './dist',
          urlPrefix: '/',
          ignore: ['node_modules']
        }))

      // 多环境拷贝
      config
        .plugin('MultipleBundle')
        .use(new MultipleBundlePlugin(
          require(path.resolve(__dirname, './multiple-bundle-config.ts')),
          {
            sourcePath: path.resolve(__dirname, './dist'),
            distPath: `${path.resolve(__dirname, './dist')}/multiple-bundle-from-string-replace`,
          },
        ));

      config.output.set("publicPath", process.env.HOST_CDN);
    }
  }
}

export default config;
