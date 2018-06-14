const session = require('koa-generic-session');
const redisStore = require('koa-redis');
const Koa = require('koa');

const app = new Koa();
app.keys = ['keys', 'keykeys'];
app.use(session({
  store: redisStore({
    host: '127.0.0.1',
    port: 6379
  })
}));

app.use(async ctx => {
  console.log(ctx.path);
  switch (ctx.path) {
    case '/get':
      get.call(ctx);
      break;
    case '/remove':
      remove.call(ctx);
      break;
    case '/regenerate':
      await regenerate.call(ctx);
      break;
  }
});

function get() {
  const session = this.session;
  session.count = session.count || 0;
  session.count++;
  this.body = session.count;
}

function remove() {
  this.session = null;
  this.body = 0;
}

async function regenerate() {
  get.call(this);
  await this.regenerateSession();
  get.call(this);
}

app.listen(8080);
