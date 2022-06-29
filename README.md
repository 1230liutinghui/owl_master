猫头鹰助理使用说明

## *公网访问 demo*

- 电脑要能支持语音录入（台式机没有外设的需要插入耳机，不然无法运行）

❗️❗️我们已经利用云服务器做了部署，使用 https://119.91.99.211即可访问。

工号：2019

密码：123



## *本地运行项目*

### 1、依赖

前端： npm install 或 yarn install (推荐)

后端： JDK 17；redis运行端口6379；mysql运行端口3306，配置请见application.yml

在前端main.js中，修改接口访问地址为 https://localhost:8989

### 2、启动

前端： npm run dev

后端： 运行 OwlAssistantEndApplication

浏览器访问 localhost:8085 即可

工号：2019

密码：123
