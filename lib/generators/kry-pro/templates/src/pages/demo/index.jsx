import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Typography, Alert, Layout, Spin } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';

const CodePreview = ({ children }) => (
  <pre
    style={{
      background: '#f2f4f5',
      padding: '12px 20px',
      margin: '12px 0',
    }}
  >
    <code>
      <Typography.Text copyable={true}>{children}</Typography.Text>
    </code>
  </pre>
);

class Demo extends Component {
  componentDidMount() {
    <% if (reactFeatures.includes('pont')) { -%>
    // pont api 使用案例
    window.API.user.getUserByName.request({ username: 'test' }).then((res) => {
      // tslint:disable-next-line: no-console
      console.log('Pont mock response: >>>>>>>>>>', res);
    });
    <% } -%>
  }

  render() {
    const { loading } = this.props;
    return (
      <Spin spinning={loading.effects['global/getDemo']}>
        <Layout>
          <Card>
            <Alert
              message="umi ui 现已发布，欢迎使用 npm run ui 启动体验demo。"
              type="success"
              showIcon={true}
              banner={true}
              style={{
                margin: -12,
                marginBottom: 24,
              }}
            />
            <Typography.Text strong={true}>
              <a target="_blank" rel="noopener noreferrer" href="https://pro.ant.design/docs/block">
                <FormattedMessage
                  id="app.welcome.link.block-list"
                  defaultMessage="基于 block 开发，快速构建标准页面的Demo"
                />
              </a>
            </Typography.Text>
            <CodePreview>npx umi block list</CodePreview>
            <Typography.Text
              strong={true}
              style={{
                marginBottom: 12,
              }}
            >
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://pro.ant.design/docs/available-script#npm-run-fetchblocks"
              >
                <FormattedMessage id="app.welcome.link.fetch-blocks" defaultMessage="获取全部区块" />
              </a>
            </Typography.Text>
            <CodePreview> npm run fetch:blocks</CodePreview>
          </Card>
          <p style={{ textAlign: 'center', marginTop: 24 }}>
            Want to add more pages? Please refer to{' '}
            <a href="https://pro.ant.design/docs/block-cn" target="_blank" rel="noopener noreferrer">
              use block
            </a>
            。
          </p>
        </Layout>
      </Spin>
    );
  }
};

export default connect(({ global, loading }) => ({
  global,
  loading,
}))(Demo);
