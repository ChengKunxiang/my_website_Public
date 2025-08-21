# My_Website 

这个网站是我自己在俄罗斯无聊的时候写的，初衷是为了把在俄罗斯拍的照片全部放在一个网站上，方便其他人查看。现网站可以在树莓派4B上运行。 
我特意删除了所有超算网站的用户名和密码，为了避免隐私泄露和被导师细细地切成臊子。

## 启动个人服务器

我用了以下工具：loophole 内网穿透工具；nginx web服务器；pm2 多进程管理工具，用于运行多个网站(?)。
以下是一些可能会用到的命令：


### loophole 启动
```
cd loophole
sudo ./loophole account login
```
```
sudo ./loophole http <端口> <ip>
```
例如：
```
sudo ./loophole http 80 192.168.31.193
```

### nginx 启动（一般为开机自启）
```
sudo /etc/init.d/nginx start
```

### kill process
```
sudo kill -9 <PID>
```
例如：
```
sudo kill -9 $(sudo lsof -t -i :80)
```

### check process（80是端口号）
```
sudo ss -tulnp | grep :80
```
```
sudo netstat -tulnp | grep :80
```

### pm2 启动（"my-backend"可以调整）
```
pm2 start server.js --name "my-backend"
```
```
pm2 start /var/www/server.js --name "my-backend"
```

## 网站目标
- [x] 能够显示图片并舒适查看；
- [x] 动态显示图片；
- [x] 拥有导航站，并可以在不同站点转换；
- [x] 实现背景、标题、切换；
- [ ] 添加视频播放；


