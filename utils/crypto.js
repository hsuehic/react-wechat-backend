/**
 * @File   : crypto.js.js
 * @Author : Richard (xiaowei.hsueh@gmail.com)
 * @Link   : http://www.gistop.com/
 * @Date   : 2018-6-16 14:32:41
 */

const crypto = require('crypto');

/**
 * 使用md5方法加密码
 * @param {string} input 需要加密的字符串
 * @return {string} 加密码生成的字符串
 */
const encryptUsingMd5 = input => {
  const md5 = crypto.createHash('md5');
  return md5.update(input).digest('hex');
};

module.exports = {
  encryptUsingMd5
};
