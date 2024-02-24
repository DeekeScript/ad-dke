import { outLogin, editPassword } from '@/services/api/api';
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { DrawerForm, ProFormText } from '@ant-design/pro-components';
import { Avatar, Menu, message, Spin } from 'antd';
import type { ItemType } from 'antd/lib/menu/hooks/useItems';
import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback } from 'react';
import { history, useModel } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  await outLogin();
  const { query = {}, search, pathname } = history.location;
  const { redirect } = query;
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/user/login' && !redirect) {
    localStorage.removeItem('token');
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: pathname + search,
      }),
    });
  }
};

const submit = async (params) => {
  let res = await editPassword(params);
  if (res.success) {
    message.success(res.msg);
    setTimeout(async () => {
      await loginOut();
    }, 700);
  }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        setInitialState((s) => ({ ...s, currentUser: undefined }));
        loginOut();
        return;
      }
      //history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }

  const menuItems: ItemType[] = [
    ...(menu
      ? [
        // {
        //   key: 'center',
        //   icon: <UserOutlined />,
        //   label: '个人中心',
        // },
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: <DrawerForm
            trigger={
              <span>密码修改</span>
            }
            title={'密码设置'}
            layout={'horizontal'}
            autoFocusFirstInput
            drawerProps={{
              destroyOnClose: true,
            }}
            submitTimeout={2000}
            onFinish={async (res) => {
              await submit(res);
            }}
            width={"420px"}
          >
            <ProFormText rules={[{ required: true, message: '旧密码不能为空' }]} name="old_password" labelCol={{ span: 5 }} label="旧密码" />
            <ProFormText.Password rules={[{ required: true, message: '新密码不能为空' }]} name="password" labelCol={{ span: 5 }} label="新密码" />
            <ProFormText.Password rules={[{ required: true, message: '确认密码不能为空' }]} name="repeat_password" labelCol={{ span: 5 }} label="确认密码" />
          </DrawerForm>,
        },
      ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick} items={menuItems} />
  );

  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
        <span className={`${styles.name} anticon`}>{currentUser.name}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
