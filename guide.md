
## 埋点SDK使用文档

### 引入SDK

```js
// SDK 将 Collect 挂载到window上
<script src="./dist/collect.min.js"></script>

 // 实例Collect 
  // main_id  必传 主账号ID
  // customer_id 可传 客户ID
  const myCollect = new Collect({"main_id":222,"customer_id":444});
```

### 手动埋点

#### init 初始化

```js
  // 初始化埋点数据 
  myCollect.init();
```

#### $visit 页面访问上报方式

需要统计访问页面的数据和页面停留时长时，在页面加载完成后调用此方法

#### 参数

| 参数              | 说明           | 类型          | 是否必填 |
|-------------------|--------------|---------------|---------|
| page_id           | 页面的唯一标识 | number/string | 是       |
| page_first_title  | 页面的一级标题 | string        | 否       |
| page_second_title | 页面的二级标题 | string        | 否       |
| source_title      | 页面的来源     | string        | 否       |

##### 示例

```js
  const params = {
    page_id: "10001",  
    page_first_title: "会议详情", 
    page_second_title: "致趣一期会议", 
    source_title: "微信分享" 
  }
  myCollect.$visit(params);

```

#### $eventClick 点击事件

需要统计某一点击事件时，在点击后调用此方法

##### 参数

| 参数               | 说明             | 类型          | 是否必填 |
|--------------------|----------------|---------------|---------|
| element_content    | 事件的内容或描述 | number/string | 否       |
| element_name       | 事件的名称       | string        | 是       |
| element_target_url | 跳转链接         | string        | 否       |
| userName           | 自定义参数1      | any           | 否       |

##### 示例

```js
  const params = {
    element_content:"点击跳转到致趣登录页面", 
    element_name:"致趣登录", 
    element_target_url:"https://stage.ma.scrmtech.com/user/index/login", 
    userName:"XXX" , 
    options2:"" ,
  }
  myCollect.$eventClick(params)
```

#### $associate 关联用户调用

如果需要关联用户可以在用户登录成功之后调用

##### 参数

| 参数        | 说明           | 类型   | 是否必填 |
|-------------|--------------|--------|---------|
| customer_id | 用户的唯一标识 | any    | 是       |
| userName    | 自定义参数     | string | 否       |

##### 示例

```js
  // 使用场景如登录或注册
  // "10001" 是用户的唯一标识
 const params = {
    customer_id: "10001" // 用户的唯一标识
  }
  myCollect.$associate(params);
```

#### $dispatch 自定义埋点

如果需要在特殊场景埋点数据可以调用此方法

###### 参数

| 参数    | 说明       | 类型 | 是否必填 |
|---------|----------|------|---------|
| option1 | 自定义参数 | any  | 否       |
| option1 | 自定义参数 | any  | 否       |

##### 示例

```js
  // 使用场景如登录或注册
  // "10001" 是用户的唯一标识
 const params = {
    option1: "10001" 
    option2: "10001" 
  }
  myCollect.$dispatch(params);

```

#### $getAnonymousId 获取anonymous_id

埋点会生成一个anonymous_id来标识埋点用户的唯一值

##### 示例

```js
    // 返回字符串anonymous_id
  myCollect.$getAnonymousId();
  
```

#### $setBaseUrl

设置上报数据的地址

###### 参数

| 参数    | 说明       | 类型 | 是否必填 |
|---------|----------|------|---------|
| url | 上报数据地址 | string  | 是      |

##### 示例

```js
  myCollect.$setBaseUrl();
  
```

### 全埋点 (初步方案)

#### init初始化

开启全埋点 `autoCollect` 为 true,配置监听事件的标签`eventTags`,

```js
  // 初始化埋点数据 
  myCollect.init({
    autoCollect:true,
    eventTags:["BUTTON"] //  button 标签的点击事件
  });
```
