/**
 * 群聊
 * @File   : room.js
 * @Author : Richard (xiaowei.hsueh@gmail.com)
 * @Link   : http://www.gistop.com/
 * @Date   : 2018-6-21 10:22:06
 */

const BaseService = require('./base');

class RoomService extends BaseService {
  constructor(db, collectionName = 'room') {
    super(db, collectionName);
  }
}

module.exports = RoomService;
