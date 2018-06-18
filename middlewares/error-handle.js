/**
 * @File   : error-handle.js
 * @Author : Richard (xiaowei.hsueh@gmail.com)
 * @Link   : http://www.gistop.com/
 * @Date   : 2018-6-18 13:47:09
 */

 export default () => {
  retur (ctx, next) => {
    return next().catch(err) => {
      if (err.status === 401) {
        ctx.status = 401;
        ctx.body = {
          error: err.originalError ? err.originalError.message : err.message
        }
      } else {
        throw err;
      }
    }
  };
}
