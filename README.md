# Mikey

这是参加腾讯全国小程序比赛的项目的公共后端库

## 技术栈

### 应用环境

Nodejs v 9.11.1

TypeScript v 2.8.3 


### 核心应用环境

Koa v 2.5.1 

MongoDB v 3.6.4

Mocha v 5.2.0 


## 目录结构

```
|
|---src                   --------- 后端核心代码库
|    |
|    |
|    |---- config         --------- 配置文件
|    |
|    |---- controllers    --------- 控制器，分发请求
|    |
|    |---- helpers        --------- 帮助（扩展）工具，和业务逻辑并不强相关
|    |
|    |---- model          --------- 数据模型ORM以及模型接口定义
|    |
|    |---- service        --------- 服务。通过依赖注入被服务或者控制器使用 
|    |
|    |---- app.ts         --------- 工厂函数，创造Koa Server
|
|
|---- index.ts            --------- 入口

```


## 基本架构


```      

                                                                         
                                                           取得APP配置信息  |--------> production.ts
                                                          |-------------> |--------> development.ts
                                                          |               |--------> test.ts
                                |-------------------------|------------------------------------|
                                |                     MIKEY APP                                |
                                |                                                              |
                                |                                           |->Restful Core    |
    |-------|                   |                |--->Router--->Controller->|->Utils Handle    |
    |       |                   |                |                      ^   |->Render HTML     |
    |       |    HTTP REQUEST   |                |                      ^                      |
    |  USER |     ---------->   |   中间件parse ->|--->Logger            ^                      |
    |       |                   |                |                      |----Service 依赖注入   |
    |       |                   |                |--->ErrorHandle                              |
    |-------|                   |                                                              |
                                |                                                              |
                                |                                                              |
                                |--------------------------------------------------------------|


```



## 用户分享的行为逻辑

```

|------------------
|                 |       |----> 生成一次性shareKey (含有过期时间) ----
|                 |       |                                         |
|    用户点击分享   |——-- > |                                         | ---- > 产生分享元数据传回分享接口
|                 |       |                                         |
|                 |       |----> 取得数据，构造URl                ————|
|-----------------|




|-------------————|          | ------ > 校验shareKey
|                 |          |
|                 |          |
|   用户打开某分享  | ------ > |                            ------ > 取得shareData，生成sharePage
|                 |          |
|                 |          | ------ > 请求URl
|-----------——————|    
                       
                       
                  
            
```


## 运行须知

> * 目前版本并未提供单元测试，以后会提供基于Mocha的单元测试

> * 由于隐私问题已经移除src/config/目录下的相关配置文件。具体有weChat.ts以及seniverse.ts文件。
如果需要和微信小程序搭配使用需自行添加

```typescript
interface WeChatConfig {
  appid: string,
  appsecret: string
}

interface SeniverseConfig {
  apiKey: string
}
```