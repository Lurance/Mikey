# Mikey

这是参加腾讯全国小程序比赛的项目的公共后端库

## 技术栈

### 应用环境

Nodejs v 9.11.1

TypeScript v 2.8.3 


### 核心应用环境

Koa v 2.5.0 

MongoDB v 3.6.4

Mocha v 5.1.1 


## 目录结构

```
├── @types                  --- 自动生成的类型定义文件
├── dist                    --- 编译生成的js文件
├── app
│   ├── controllers         ---  控制器
│   ├── utils               ---  帮助工具集
│   ├── jobs                ---  定时任务
│   ├── models              ---  数据库 model for ORM
│   └── services            ---  controller 与 model 的粘合层 类似于Java的DAO，封装了些公共逻辑
├── config
│   ├── environments        ---  环境变量以及配置
│   └── routers             ---  路由配置文件
└── test
    └── apis                ---  测试用例
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
    |       |                                    |                      |----Service 注入       |
    |       |                   |                |--->ErrorHandle                              |
    |-------|                   |                                                              |
                                |                                                              |
                                |                                                              |
                                |--------------------------------------------------------------|


```