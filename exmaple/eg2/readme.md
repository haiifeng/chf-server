# 多人在线聊天
http://www.52im.net/thread-516-1-1.html
## 需求分析

1. 兼容不支持WebSocket的低版本浏览器。
2. 允许客户端有相同的用户名。
3. 进入聊天室后可以看到当前在线的用户和在线人数。
4. 用户上线或退出，所有在线的客户端应该实时更新。
5. 用户发送消息，所有客户端实时收取。

在实际的开发过程中，为了使用WebSocket接口构建Web应用，我们首先需要构建一个实现了 WebSocket规范的服务端，服务端的实现不受平台和开发语言的限制，只需要遵从WebSocket规范即可，目前已经出现了一些比较成熟的WebSocket服务端实现，比如本文使用的Node.js+Socket.IO。为什么选用这个方案呢？先来简单介绍下他们两。

## Node.js
- Node.js采用C++语言编写而成，它不是Javascript应用，而是一个Javascript的运行环境，据Node.js创始人Ryan Dahl回忆，他最初希望采用Ruby来写Node.js，但是后来发现Ruby虚拟机的性能不能满足他的要求，后来他尝试采用V8引擎，所以选择了C++语言。

- Node.js支持的系统包括*nux、Windows，这意味着程序员可以编写系统级或者服务器端的Javascript代码，交给Node.js来解释执行。Node.js的Web开发框架Express，可以帮助程序员快速建立web站点，从2009年诞生至今，Node.js的成长的速度有目共睹，其发展前景获得了技术社区的充分肯定。

## Socket.IO
https://github.com/socketio/socket.io
- Socket.IO是一个开源的WebSocket库，它通过Node.js实现WebSocket服务端，同时也提供客户端JS库。Socket.IO支持以事件为基础的实时双向通讯，它可以工作在任何平台、浏览器或移动设备。

- Socket.IO支持4种协议：WebSocket、htmlfile、xhr-polling、jsonp-polling，它会自动根据浏览器选择适合的通讯方式，从而让开发者可以聚焦到功能的实现而不是平台的兼容性，同时Socket.IO具有不错的稳定性和性能。