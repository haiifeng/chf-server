(function () {
	let d = document,
		w = window,
		p = parseInt,

		dd = d.documentElement,
		db = d.body,
		dc = d.compatMode == 'CSS1Compat',
		dx = dc ? dd : db,

		ec = encodeURIComponent;

	window.CHAT = {
		msgObj: document.getElementById('message'),
		screenHeight: window.innerHeight ? window.innerHeight : dx.clientHeight,
		userName: null,
		userId: null,
		socket: null,

		//让浏览器滚动条保持在最底部
		scrollToBottom() {
			window.scrollTo(0, this.msgObj.clientHeight);
		},

		//退出，页面刷新
		logout() {
			//ths.socket.disconnect();
			location.reload();
		},

		//提交聊天内容
		submit() {
			let content = document.getElementById('content').value;
			if (content && content.trim() && content != '') {
				let obj = {
					userid: this.userId,
					username: this.userName,
					content,
				};
				this.socket.emit('message', obj);
				document.getElementById('content').value = '';
			}
			return false;
		},

		genUid() {
			return (new Date()).getTime() + '' + Math.floor(Math.random() * 898 + 100);
		},

		//更新系统消息：用户加入，用户退出的时候调用
		updateSysMsg(o, action) {
			//当前在线用户列表
			let onlineUsers = o.onlineUsers;
			//当前在线人数
			let onlineCount = o.onlineCount;
			//新加入用户的信息
			let user = o.user;

			//更新在线人数
			let userHtml = '';
			let separator = '';
			for (let key in onlineUsers) {
				if (onlineUsers.hasOwnProperty(key)) {
					userHtml += separator + onlineUsers[key];
					separator = '、';
				}
			}
			document.getElementById('onlinecount').innerHTML = '当前共有 ' + onlineCount + ' 人在线，在线列表：' + userHtml;

			//添加系统消息
			let html = `<div class="msg-system">${user.username}${(action == 'login') ? ' 加入了聊天室' : ' 退出了聊天室'}</div>`;
			let section = document.createElement('section');
			section.className = 'system J-mjrlinkWrap J-cutMsg';
			section.innerHTML = html;
			this.msgObj.appendChild(section);
			this.scrollToBottom();
		},

		//第一个界面，用户提交用户名
		userNameSubmit() {
			let userName = document.getElementById('username').value;
			if (userName && userName.trim() && userName != '') {
				document.getElementById('username').value = '';
				document.getElementById('loginbox').style.display = 'none';
				document.getElementById('chatbox').style.display = 'block';
				this.init(userName);
			}
			return false;
		},

		init(userName) {
			// 客户端根据时间和随机数生成uid，这样聊天室用户名可以重复
			// 实际项目中，用户登录后直接采用用户的uid即可
			this.userId = this.genUid();
			this.userName = userName;

			document.getElementById('showusername').innerHTML = this.userName;
			this.msgObj.style.minHeight = (this.screenheight - db.clientHeight + this.msgObj.clientHeight) + "px";
			this.scrollToBottom();

			//链接websocket后端服务器
			this.socket = io.connect('ws://localhost:3000');

			//告诉服务器有用户登录
			this.socket.emit('login', {
				userid: this.userId,
				username: this.userName
			});

			//监听新用户登录
			this.socket.on('login', o => {
				CHAT.updateSysMsg(o, 'login')
			});

			//监听用户退出
			this.socket.on('login', o => {
				CHAT.updateSysMsg(o, 'logout');
			});

			//监听消息发送
			this.socket.on('message', obj => {
				let isme = obj.userid == CHAT.userId ? true : false;
				let contentDiv = `<div>${obj.content}</div>`;
				let userNameDiv = `<div>${obj.username}</div>`;

				let section = document.createElement('section');
				if (isme) {
					section.className = 'user';
					section.innerHTML = contentDiv + userNameDiv;
				} else {

					section.className = 'service';
					section.innerHTML = contentDiv + contentDiv;
				}

				CHAT.msgObj.appendChild(section);
				CHAT.scrollToBottom();
			});
		},

	};

	//通过‘回车’提交用户名
	document.getElementById('username').onkeydown = function (e) {
		e = e || event;
		if (e.keyCode === 13) {
			CHAT.userNameSubmit();
		}
	};

	//通过’回车‘提交内容信息
	document.getElementById('content').onkeydown = function (e) {
		e = e || event;
		if (e.keyCode === 13) {
			CHAT.submit();
		}
	}
})();