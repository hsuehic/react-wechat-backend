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
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const session = require('koa-generic-session');
const redis = require('koa-redis');
const koaStatic = require('koa-static');
const websockify = require('koa-websocket');
const mongo = require('koa-mongo');
const jwt = require('koa-jwt');

const configs = require('./configs');

const errorHandle = require('./middlewares/error-handle');

const redisStore = redis({});

const app = websockify(new Koa());

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
app.use(mongo({
  host: '127.0.0.1',
  port: 27017,
  db: 'wechat',
  max: 100,
  min: 1
}));

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
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
const users = require('./routes/users');
const websocket = require('./routes/websocket');

app.use(index.routes(), index.allowedMethods());

app.use(jwt({ secret: configs.secret }).unless({ path: [/\/api\/reg/, /\/api\/login/] }));
app.use(users.routes(), users.allowedMethods());

app.ws.use(websocket.routes()).use(websocket.allowedMethods());

module.exports = app;
