import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { PageLoading, SettingDrawer } from '@ant-design/pro-components';
import { RunTimeLayoutConfig, useModel } from 'umi';
import { history } from 'umi';
import defaultSettings from '../config/defaultSettings';
import { requests } from '../config/request';
import { currentUser as queryCurrentUser } from './services/api/api';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
const meLoginPath = '/me';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      if (localStorage.getItem('roleType') === '0') {
        history.push(meLoginPath);
      } else {
        history.push(loginPath);
      }
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  if (history.location.pathname !== loginPath && history.location.pathname !== loginPath + '/' && history.location.pathname !== meLoginPath && history.location.pathname !== meLoginPath + '/') {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      if (location.pathname === meLoginPath || location.pathname === meLoginPath + '/') {
        localStorage.setItem('roleType', '0');
      }

      if (location.pathname === loginPath || location.pathname === loginPath + '/') {
        localStorage.removeItem('roleType');
      }

      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath && location.pathname !== meLoginPath) {
        if (localStorage.getItem('roleType') === '0') {
          history.push(meLoginPath);
        } else {
          history.push(loginPath);
        }
      }
    },
    links: isDev
      ? [
        // <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
        //   <LinkOutlined />
        //   <span>OpenAPI 文档</span>
        // </Link>,
        // <Link to="/~docs" key="docs">
        //   <BookOutlined />
        //   <span>业务组件文档</span>
        // </Link>,
      ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

window.connectModel = (key, name) => {
  return (WrappedComponent) => {
    return (props) => {
      const model = useModel(name);
      const data = { [key]: model };
      return <WrappedComponent {...props} {...data} />;
    };
  };
};

export const request = requests;
