/**
 * 群聊
 * @File   : room.js
 * @Author : Richard (xiaowei.hsueh@gmail.com)
 * @Link   : http://www.gistop.com/
 * @Date   : 2018-6-20 17:44:45
 */

const BaseModel = require('./base');
const RoomService = require('../services/room');

class RoomModel extends BaseModel {
  constructor(ctx) {
    super(ctx);
    this.roomService = new RoomService(this.db);
  }
}

module.exports = RoomModel;
