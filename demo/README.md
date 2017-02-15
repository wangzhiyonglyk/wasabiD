# wasabi Design PC框架测试DEMO<sup>React</sup>
	心怡科技物流有限公司PC前端框架
	此版本可以用来使用，也可以用于学习

### 简介

wasabi Design PC端框架是由心怡科技前端团队基于react技术专为企业应用系统定制的技术平台。首先将前后端通信独立成一个类库，方便广大使用react技术的同学们无需引入jquery框架就可与后端通信。框架提供丰富的常规组件与功能组件，具体有良好的交互体验效果... 

### 安装
```
npm install wasabiD --save-dev
```
当然前提是您必须安装React和相关依赖项。如果已经安装请忽略。
- 1.webpack要全局安装一次
```
$ npm install webpack -g
```
- 2.项目依赖项安装方式
```
$ npm install babel-core --save-dev
```
### 浏览效果
开启npm窗口进入项目并执行脚本
```
$ npm test
```
然后访问：
http://localhost:8080/build/index.html
如果端口占用，请更换端口。

### 监听修改
另开启npm窗口进入项目执行脚本
```
$ npm start
```
此时编辑src里的文件时会及时编译，刷新页面即可浏览效果。

### 技术支持
有任何问题请加QQ群：273959805 找群主即可。
[详细文档API查阅](http://www.mimiinfo.com/)