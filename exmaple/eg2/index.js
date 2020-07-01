const {
    on
} = require('process');

let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.send('<h1>Welcome Realtime Server。。。。</h1>');
})

http.listen(3000, () => {
    console.log('listening on *:3000');
});

//在线用户
let onlineUsers = {};
//当前在线人数
var onlineCount = 0;

io.on('connection', socket => {
    console.log('a user connected');

    //监听新用户加入
    socket.on('login', obj => {
        //将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
        socket.name = obj.userid;

        //检查在线列表，如果不在里面就加入
        if (!onlineUsers.hasOwnProperty(obj.userid)) {
            onlineUsers[obj.userid] = obj.username;
            //在线人数+1；
            onlineCount++;
        }

        //向所有客户端广播新用户加入
        io.emit('login', {
            onlineUsers,
            onlineCount,
            user: obj
        });
        console.log(obj.username + '加入了聊天室')
    });

    socket.on('disconnect', () => {
        //将退出的用户从在线列表中删除
        if (onlineUsers.hasOwnProperty(socket, name)) {
            //退出用户的信息
            let obj = {
                userid: socket.name,
                username: onlineUsers[socket.name]
            };

            //删除
            delete onlineUsers(socket.name);
            //在线人数-1
            onlineCount--;

            //向所有客户端广播用户退出
            io.emit('logout', {
                onlineUsers,
                onlineCount,
                user,
                obj
            });
            console.log(obj.username + '退出了聊天室');
        }
    });

    //监听用户发布聊天内容
    socket.on('message', obj => {
        //向所有客户端广播发布的消息
        io.emit('message', obj);
        console.log(obj.username + '说：' + obj.content)
    })
});
