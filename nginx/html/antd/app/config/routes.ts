export default [
  {
    path: '/welcome',
    name: '欢迎页',
    icon: 'icon-icon_huanyingmoshi',
    component: './Welcome',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '/users',
    name: '用户管理',
    icon: 'icon-kehuyingxiao',
    key: 'Api_userList',
    access: 'adminRouteFilter',
    routes: [
      {
        path: '/users/list',
        name: '用户列表',
        component: './User/List',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: '登陆',
    path: '/user/login',
    component: './User/Login',
    hideInMenu: true,
    layout: false,
  },
  {
    name: '登陆',
    path: '/me',
    component: './User/Login',
    hideInMenu: true,
    layout: false,
  },
  {
    path: '/agent',
    name: '代理商管理',
    icon: 'icon-fenxiao',
    key: 'Api_agentList',
    access: 'adminRouteFilter',
    routes: [
      {
        path: '/agent/list',
        name: '代理商列表',
        component: './Agent/List',
      },
    ],
  },

  {
    path: '/machine',
    name: '设备管理',
    icon: 'icon-shouji',
    //access: 'machine',
    routes: [
      {
        path: '/machine/list',
        name: '设备列表',
        icon: 'smile',
        //hideInMenu: true,
        component: './Machine/List',
      },
    ],
  },
  // {
  //   path: '/city',
  //   name: '同城管理',
  //   icon: 'icon-tongcheng1',
  //   key: 'Api_focusUserList',
  //   access: 'adminRouteFilter',
  //   routes: [
  //     {
  //       path: '/city/focuslist',
  //       name: '关注列表',
  //       component: './City/focusList',
  //     },
  //     {
  //       path: '/city/chatlist',
  //       name: '互动列表',
  //       component: './City/chatList',
  //     },
  //     {
  //       path: '/city/statistic',
  //       name: '数据统计',
  //       component: './City/statistic',
  //     },
  //     {
  //       path: '/city/blacklist',
  //       name: '黑名单列表',
  //       component: './City/blackList',
  //     },
  //     {
  //       component: './404',
  //     },
  //   ],
  // },
  {
    path: '/statistic',
    name: '数据管理',
    icon: 'icon-shujukanban',
    key: 'statisticList',
    access: 'adminRouteFilter',
    routes: [
      {
        path: '/statistic/list',
        name: '数据统计',
        icon: 'smile',
        component: './Statistic/List',
      },
    ],
  },
  {
    path: '/task',
    name: '任务管理',
    icon: 'icon-renwu2',
    key: 'Api_taskList',
    access: 'adminRouteFilter',
    routes: [
      {
        path: '/task/list',
        name: '任务列表',
        icon: 'smile',
        component: './Task/List',
      },
      {
        path: '/task/videoRule',
        name: '视频规则',
        icon: 'smile',
        component: './Task/VideoRule',
      },
      {
        path: '/task/userRule',
        name: '用户规则',
        icon: 'smile',
        component: './Task/UserRule',
      },
      {
        path: '/task/commentRule',
        name: '评论规则',
        icon: 'smile',
        component: './Task/CommentRule',
      },
    ],
  },

  {
    path: '/video',
    name: '短视频管理',
    icon: 'icon-douyin',
    key: 'Api_videoList',
    access: 'adminRouteFilter',
    routes: [
      {
        path: '/video/list',
        name: '短视频列表',
        icon: 'smile',
        component: './Video/List',
      },
      {
        path: '/video/detail',
        name: '视频明细',
        icon: 'smile',
        //hideInMenu: true,
        component: './Video/Detail',
      },
      {
        path: '/video/comment',
        name: '评论区明细',
        icon: 'smile',
        //hideInMenu: true,
        component: './Video/Comment',
      },
      {
        path: '/video/douyin',
        name: '用户明细',
        icon: 'smile',
        //hideInMenu: true,
        component: './Video/User',
      },
    ],
  },
  {
    path: '/speech',
    name: '话术管理',
    icon: 'icon-huashuku',
    key: 'Api_speechLibList',
    access: 'adminRouteFilter',
    routes: [
      {
        path: '/speech/lib',
        name: '话术库列表',
        icon: 'smile',
        component: './Speech/Lib',
      },
      {
        path: '/speech/lib/list',
        name: '话术列表',
        icon: 'smile',
        hideInMenu: true,
        component: './Speech/List',
      },
    ],
  },
  {
    path: '/grab',
    name: '微信群控管理',
    icon: 'icon-shujucaiji',
    key: 'Api_grabTaskList',
    access: 'adminRouteFilter',
    routes: [
      {
        path: '/grab/list',
        name: '采集任务列表',
        icon: 'smile',
        hideInMenu: false,
        component: './Grab/List',
      },
      {
        path: '/grab/phone',
        name: '手机号列表',
        icon: 'smile',
        hideInMenu: false,
        component: './Grab/PhoneList',
      },
      {
        path: '/grab/setting',
        name: '群控设置',
        icon: 'smile',
        hideInMenu: false,
        component: './Grab/Setting',
      },
    ],
  },
  {
    path: '/log',
    name: '日志管理',
    icon: 'icon-rizhi',
    key: 'Api_logList',
    access: 'adminRouteFilter',
    routes: [
      {
        path: '/log/list',
        name: '日志列表',
        icon: 'smile',
        component: './Log/List',
      },
    ],
  },
  {
    path: '/system',
    name: '系统管理',
    icon: 'icon-shezhi',
    key: 'Api_apkList',
    access: 'adminRouteFilter',
    routes: [
      {
        path: '/system/apk',
        name: 'Apk列表',
        icon: 'smile',
        component: './System/Apk',
      },
    ],
  },
];
