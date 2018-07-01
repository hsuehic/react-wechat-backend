/**
 * @File   : configs.js
 * @Author : Richard (xiaowei.hsueh@gmail.com)
 * @Link   : http://www.gistop.com/
 * @Date   : 2018-6-14 19:55:43
 */

const path = require('path');
const Koa = require('koa');
const helmet = require('koa-helmet');
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-body');
const logger = require('koa-logger');
const session = require('koa-generic-session');
const redis = require('koa-redis');
const koaStatic = require('koa-static');
const jwt = require('koa-jwt');

const mongo = require('./middlewares/koa-mongo');
const websockify = require('./middlewares/koa-websocket');
const errorHandle = require('./middlewares/error-handle');

const configs = require('./configs');

const redisStore = redis({});

const app = new Koa();

app.keys = ['keys', 'keykeys'];

app.sockets = new Map();

// secure headers
app.use(helmet());

// error handle
app.use(errorHandle());
onerror(app);

// application session
app.use(session({
  store: redisStore
}));

// mongodb context
app.use(mongo(configs.mongodb));

// middlewares
app.use(bodyparser({
  multipart: true,
  urlencoded: true
}));
app.use(json());
app.use(logger());
app.use(koaStatic(path.resolve('./public')));

app.use(views(path.resolve('./views'), {
  extension: 'pug'
}));

// logger
app.use(async(ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// feature routers
const index = require('./routes/index');
const user = require('./routes/user');
const websocket = require('./routes/websocket');

app.use(index.routes(), index.allowedMethods());
// json web tocken
app.use(jwt({ secret: configs.secret, cookie: 'jwt' }).unless({ path: [/\/api\/reg/, /\/api\/login/] }));
// api
app.use(user.routes(), user.allowedMethods());
// websocket
websockify(app);
app.ws.use(websocket.routes()).use(websocket.allowedMethods());

module.exports = app;
