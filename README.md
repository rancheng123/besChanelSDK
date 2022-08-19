## 运行
#### 安装依赖

```js
  npm install 
```

#### 本地运行

```js
  npm run dev
```

#### 打包

```js
  npm run build
```

## 埋点设计

  `Collect` 数据收集的类，接受`main_id`,`customer_id`两个参数，分别为主账号ID和客户ID,`customer_id`可以为空。

  公共参数`commonProperties`，页面会话ID`pageSession`，访问数据`visitParams`，点击事件数据`eventData`，退出参数`params`，埋点会话的过期时间`expiresTime`，上报数据地址`baseUrl`。
### init
`init`方法来初始化数据，包括：
- 生成指纹ID getFingerprintId()
- 生成匿名ID getAnonymousId()
- 生成会话ID getSessionId()
- 获取浏览器信息 getDeviceInfo()
- 注册事件 registerEvent()
###  $visit
`$visit` 方法来收集访问页面的上报数据。埋点行为类型`behavior_type`为`page_view`,埋点获取页面的访问地址`url`,页面来源`referer`,生成页面会话`pageSession`，和访问时间`params.visitTime`用于计算页面停留时长。上报数据时将初始化数据`commonProperties`合并上传。
###  $eventClick
$eventClick方法收集点击行为上报数据。埋点行为类型`behavior_type`为`webClick`,上报数据时将用户参数`eventParams`，页面会话`pageSession`参数，初始化数据`commonProperties`合并上传

###  $associate
$associate方法关联用户上报。埋点行为类型`behavior_type`为`associate`,上报数据时将用户参数`customerId`，页面会话`pageSession`参数，初始化数据`commonProperties`合并上传

###  $dispatch
$eventClick方法收集点击行为上报数据。埋点行为类型`behavior_type`为`dispatch`,上报数据时将用户参数`optionsParams`，页面会话`pageSession`参数，初始化数据`commonProperties`合并上传
