let http = require('http');
let ws = require('nodejs-websocket');
let fs = require('fs');

let app = http.createServer((req, res) => {
    fs.readFile(__dirname + '/index.html', (err, data) => {
        if (err) {
            res.writeHead(500);
            return res.end('error');
        }
        res.writeHead(200);
        res.end(data)
    })
});
app.listen(80);
console.log('server is listen on 80....');

let server = ws.createServer(conn => {
    console.log('new connection');
    conn.on('text', str => {
        broadcast(server, str);
    });
    conn.on('close', (code, reason) => {
        console.log('connection closed')
    })
}).listen(5000);

function broadcast(server, msg) {
    server.connections.forEach(conn => {
        conn.sendText(msg)
    });
}