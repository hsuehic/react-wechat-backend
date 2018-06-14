/**
 * @File   : configs.js
 * @Author : Richard (xiaowei.hsueh@gmail.com)
 * @Link   : http://www.gistop.com/
 * @Date   : 2018-6-14 19:55:43
 */

const path = require('path');
const Koa = require('koa');
const router = require('koa-router');
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const session = require('koa-generic-session');
const redis = require('koa-redis');
const koaStatic = require('koa-static');
const websockify = require('koa-websocket');

const redisStore = redis({});

const app =  websockify(new Koa());
const wsRouter = router();

app.keys = ['keys', 'keykeys'];

// application session
app.use(session({
  store: redisStore
}));

// error handler
onerror(app);

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
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

// websock handle
wsRouter.all('/*', async(ctx, next) => {
  const { websocket: ws } = ctx;
  ws.send('Hello world');
  ws.on('message', message => {
    console.log(message);
  });
  await next(ctx);
});
app.ws.use(wsRouter.routes());
app.ws.use(wsRouter.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;
