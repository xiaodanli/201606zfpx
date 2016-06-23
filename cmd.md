#安装生成器
>sudo npm install -g express-generator
#生成项目
>express -e 201605
#进入生成目录并安装依赖的模块
>cd 201606log && npm install
#设置环境变量并启动服务
>DEBUG=201606log:* npm start
#req.query(处理get请求,获取查询字符串)
>GET /index.html?name=zfpx
>req.query.name
#req.parmas(处理/:name形式的get或post请求,获取请求参数)
>//GET /user/zfpx
>req.parma.name  -->zfpx
#req.body(处理post请求,获取post请求体)
>req.body.name
