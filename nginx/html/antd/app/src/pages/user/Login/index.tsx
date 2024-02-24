import Footer from '@/components/Footer';
import { login } from '@/services/api/api';
import { LockOutlined, QrcodeOutlined, UserOutlined, } from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText, } from '@ant-design/pro-components';
import { Alert, message, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import styles from './index.less';
const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);
const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState({});
  const [type, setType] = useState<string>('2');
  const { initialState, setInitialState } = useModel('@@initialState');
  const [isAdmin, setIsAdmin] = useState(history.location.pathname.indexOf('me') !== -1);

  useEffect(() => {
    if (isAdmin) {
      setType('0');
      console.log(1);
    }
  }, [isAdmin]);

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };
  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      const msg = await login({
        ...values,
      });
      if (msg.success === true) {
        const defaultLoginSuccessMessage = '登录成功！';
        message.success(defaultLoginSuccessMessage);
        localStorage.setItem('token', msg.data.token);
        localStorage.setItem('roleType', msg.data.role_type);
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as {
          redirect: string;
        };
        history.push(redirect || '/');
        return;
      } else {
        document.getElementById('img').src = '/api/verify?' + Math.random();
      }
      // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      message.error(defaultLoginFailureMessage);
    }
  };
  const { success, msg } = userLoginState;
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/logo.png" />}
          title="嘀客捧场式营销系统"
          subTitle={'嘀客致力于打造中国最具影响力的智能AI引流获客系统'}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            values.role_type = type;
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane key="1" tab={'代理商登录'} />
            <Tabs.TabPane key="2" tab={'商户登陆'} />
            {isAdmin ? <Tabs.TabPane key="0" tab={'平台登录'} /> : undefined}
          </Tabs>

          {success === false && (
            <LoginMessage content={msg} />
          )}

          <ProFormText
            name="mobile"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={styles.prefixIcon} />,
            }}
            placeholder={'手机号'}
            rules={[
              {
                required: true,
                message: '用手机号是必填项！',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={styles.prefixIcon} />,
            }}
            placeholder={'密码'}
            rules={[
              {
                required: true,
                message: '密码是必填项！',
              },
            ]}
          />

          <ProFormText name="code" placeholder={'图片验证码'} fieldProps={{
            size: 'large',
            prefix: <QrcodeOutlined className={styles.prefixIcon} />,
          }} addonAfter={<div><img title='点击切换' id="img" onClick={() => { document.getElementById('img').src = '/api/verify?' + Math.random(); }} style={{ width: '126px' }} src="/api/verify" /></div>} />

          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              忘记密码 ?
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Login;
