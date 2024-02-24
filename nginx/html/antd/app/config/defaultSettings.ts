import { Settings as LayoutSettings } from '@ant-design/pro-components';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string | boolean;
} = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '捧场式营销开创者与领导者',
  pwa: false,
  logo: '/logo2.png',
  iconfontUrl: '//at.alicdn.com/t/c/font_3859213_sd8aeupc9ar.js'
};

export default Settings;
