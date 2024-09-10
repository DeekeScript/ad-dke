import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Alert, Card, Typography } from 'antd';
import React from 'react';
import styles from './Welcome.less';
const CodePreview: React.FC = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);
const Welcome: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <Alert
          message={
            '欢迎使用嘀客，本软件主要用于学习交流！愿我们一同携手共进，合作共赢！不得将此软件用于非法用途！'
          }
          type="success"
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 24,
          }}
        />
        <Typography.Text strong>
          <a
            href="#"
          >
            欢迎使用
          </a>
        </Typography.Text>
        <CodePreview>本软件致力于降低拓客成本，为客户提供一种高效的拓客渠道！</CodePreview>
      </Card>

      <ProCard
        title="我们的优势"
        extra=""
        tooltip="优势说明"
        style={{
          marginTop: '12px',
          lineHeight: '32px',
          fontSize: '14px',
        }}
      >
        <div>1.嘀客基于D音智能推荐算法设计，垂直度更高，精准度更高</div>
        <div>2.嘀客不需要你懂D音运营，自带风控管理（不用担心D音封号）</div>
        <div>3.嘀客是全天挂机引流获客的，不需要太多精力投入</div>
        <div>4.嘀客比市场上大多数软件更稳定</div>
        <div>5.嘀客创始人有多年的各类平台引流经验</div>
        <div>6.嘀客是引流曝光软件，不是D音运营或者涨粉软件</div>
        <div>7.支持贴牌与代理</div>
        <div>8.性价比更高，代理利润空间更大</div>
      </ProCard>
      <Alert
        message={'-_~ 新的一天又开始了，我们一起加油哦！'}
        type="success"
        showIcon
        banner
        style={{
          margin: 0,
          marginTop: 24,
        }}
      />
    </PageContainer>
  );
};
export default Welcome;
