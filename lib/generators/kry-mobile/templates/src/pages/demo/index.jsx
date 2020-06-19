import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, WingBlank, WhiteSpace } from 'antd-mobile';
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
      <div copyable={true}>{children}</div>
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
        <div>
          <Card>
            <p>umi ui 现已发布，欢迎使用 npm run ui 启动体验demo。</p>
            <div>
              <a target="_blank" rel="noopener noreferrer" href="https://pro.ant.design/docs/block">
                <FormattedMessage
                  id="app.welcome.link.block-list"
                  defaultMessage="基于 block 开发，快速构建标准页面的Demo"
                />
              </a>
            </div>
            <CodePreview>npx umi block list</CodePreview>
            <div style={{
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
            </div>
            <CodePreview> npm run fetch:blocks</CodePreview>
          </Card>
          <WingBlank size="lg">
            <WhiteSpace size="lg" />
            <Card>
              <Card.Header
                title="This is title"
                thumb="https://gw.alipayobjects.com/zos/rmsportal/MRhHctKOineMbKAZslML.jpg"
                extra={<span>this is extra</span>}
              />
              <Card.Body>
                <div>This is content of `Card`</div>
              </Card.Body>
              <Card.Footer content="footer content" extra={<div>extra footer content</div>} />
            </Card>
            <WhiteSpace size="lg" />
          </WingBlank>
          <p style={{ textAlign: 'center', marginTop: 24 }}>
            Want to add more pages? Please refer to{' '}
            <a href="https://pro.ant.design/docs/block-cn" target="_blank" rel="noopener noreferrer">
              use block
            </a>
            。
          </p>
        </div>
    );
  }
};

export default connect(({ global, loading }) => ({
  global,
  loading,
}))(Demo);
