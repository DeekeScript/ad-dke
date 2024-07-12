# 抖音黑科技AI引流获客软件
<img src='https://home.deeke.top/Index/githubStatistic?name=github-ad-dke' width=0 height=0 />
## 【我们自主研发的DeekeScript不久后将发布，我们正在招贤纳士，要求请查看文档地址：<a href="https://doc.deeke.top/INVITE.html" target="_blank">https://doc.deeke.top/INVITE.html</a>

### 【tips：后台版一键贴牌功能即将推出（无需技术人员，即可完成贴牌工作），届时将会招募各地城市合伙人】
### 【tips：我们耕耘这个行业已有多年，我们未来还需要更多的合作伙伴，期待你的加入！联系方式，请在文档末尾查看】

### 管理员后台展示

    后台主要采用PHP的thinkPHP框架开发，页面采用的是antd Pro开发，后台主要涉及到以下模块：

    1.用户管理：查看平台下的所有用户数据
    2.代理商管理：查看平台下的所有代理商数据
    3.设备管理：查看平台下的所有设备
    4.群控管理：一键采集抖音用户手机号（手机运行本程序打包的APP采集，非接口采集），以及采集数据管理
    5.日志管理：APP运行日志管理
    6.系统管理：APP列表（上传APP包）

<img alt="抖音小说小程序后台" src="image/backend-3.png" title="抖音小说小程序后台" width="100%"/>

### 代理商后台展示

    后台主要采用PHP的thinkPHP框架开发，页面采用的是antd Pro开发，后台主要涉及到以下模块：

    1.用户管理：查看平台下的所有用户数据
    2.代理商管理：查看平台下的所有代理商数据
    3.设备管理：查看平台下的所有设备
    4.群控管理：一键采集抖音用户手机号（手机运行本程序打包的APP采集，非接口采集），以及采集数据管理
    5.日志管理：APP运行日志管理
    6.系统管理：APP列表（上传APP包）

<img alt="抖音小说小程序后台" src="image/backend-1-1.png" title="抖音小说小程序后台" width="100%"/>

### APP展示

<div style="justify-content: space-between;flex-wrap:wrap;width:100%;">
<img alt="主页" src="./image/1.jpg" title="抖音小说小程序-主页" width="30%"/>
<img alt="主页" src="./image/2.jpg" title="抖音小说小程序-主页" width="30%"/>
<img alt="书库" src="./image/3.jpg" title="抖音小说小程序-书库" width="30%"/>
<img alt="书架" src="./image/3-1.jpg" title="抖音小说小程序-书架" width="30%"/>
<img alt="搜索页" src="./image/4.jpg" title="抖音小说小程序-搜索页" width="30%"/>
<img alt="个人中心" src="./image/5.jpg" title="抖音小说小程序-个人中心" width="30%"/>
<img alt="详情页" src="./image/5-1.jpg" title="抖音小说小程序-详情页" width="30%"/>
<img alt="订单页面" src="./image/6.jpg" title="抖音小说小程序-订单页面" width="30%"/>
<img alt="充值页" src="./image/7.jpg" title="抖音小说小程序-充值页" width="30%"/>
<img alt="客服页" src="./image/8.jpg" title="抖音小说小程序-客服页" width="30%"/>
<img alt="阅读页-白天模式" src="./image/9.jpg" title="抖音小说小程序-阅读页" width="30%"/>
<img alt="阅读页-夜间模式" src="./image/10.jpg" title="抖音小说小程序-阅读页" width="30%"/>
</div>

### 贴牌APP展示【目前已贴牌30+，分布全国各地】

<div style="justify-content: space-between;flex-wrap:wrap;width:100%;">
<img alt="阅读页-章节" src="./image/11.jpg" title="抖音小说小程序-章节切换" width="30%"/>
<img alt="阅读记录" src="./image/12.jpg" title="抖音小说小程序-阅读记录" width="30%"/>
</div>

### 系统部署说明【需要源代码的请联系V：15807197051】

    系统核心文件夹架构如下：
        docker-linux         线上部署的docker-compose.yaml文件
        nginx
        mysql
           cert               Nginx的证书文件
           conf.d             nginx的配置文件，里面有一个配置文件可以作为参考
           html
              antd            后台页面文件（打包后的文件，需要源文件，请联系我本人）
              apk             打包成apk的js文件，需要打包工具的，请联系商务或者作者
              php             后台的接口，采用thinkphp
        php                   PHP的配置文件
        redis                 Redis配置文件
        docker-compose.yaml   构建系统的核心文件

    接下来，请执行如下步骤：（下面的过程中可能会因为环境的不同出现不同的问题，需要自行解决，如果无法解决，请联系作者本人）
        1.下载docker
        2.获取本仓库代码
        3.填写各个配置文件【请阅读配置文件】
        4.进入docker-compose.yaml所在文件夹，执行：  docker compose up -d
        5.执行“docker ps -a”可以看到 nginx、PHP、mysql、Node都已启动
        6.如果各个配置都正确，这个时候访问你的域名，应该就能看到登录界面，如下：

<img alt="登录页面" src="image/backend-1.png" title="抖音小说小程序登录页面" width="100%"/>

### 如果需要查看后台页面，请访问以下地址：

请联系商务或者作者

### 配置文件

PHP需要的配置，可以在.env里面配置

### 成功案例我们有很多，有需要请联系商务：

<img alt="docker服务" src="image/yize.jpg" title="docker服务" width="30%"/>

### 本程序由8年资深软件工程师开发【团队正在招募一些有业余时间的软件工程师（PHP，Python，Golang，Android，IOS，JavaScript，逆向工程师等）共图大业~】：

<img alt="docker服务" src="image/weixin.jpg" title="docker服务" width="30%"/>
