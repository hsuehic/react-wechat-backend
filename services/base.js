/**
 * 服务基类
 * @File   : base.js
 * @Author : Richard (xiaowei.hsueh@gmail.com)
 * @Link   : http://www.gistop.com/
 * @Date   : 2018-6-20 14:35:59
 */

class BaseService {
  constructor(db, collectionName) {
    this.db = db;
    this.collectionName = collectionName;
    this.collection = db.collection(collectionName);
  }

  /**
   * 执行批量操作
   * @param {Array.<object>} ops 操作列表
   * @param {object} opts 设置
   */
  async bulkWrite(ops, opts) {
    const result = await this.collection.bulkWrite(ops, opts);
    return result;
  }

  /**
   * 查询，返回游标
   * @param {object} query 查询对象
   * @param {object} opts 设置
   */
  async find(query, opts) {
    const result = await this.collection.find(query, opts);
    return result;
  }

  /**
   * 查询，并更新
   * @param {object} query 查询对象
   * @param {object} opts 设置
   */
  async findOne(query, opts) {
    const result = await this.collection.findOne(query, opts);
    return result;
  }

  /**
   * 查询，并返回第一个符合的对象
   * @param {object} filter 查询对象
   * @param {object} update 更新操作
   * @param {object} opts 设置
   */
  async findOneAndUpdate(filter, update, opts) {
    const result = await this.collection.findOneAndUpdate(filter, update, opts);
    return result;
  }

  /**
   * 从集合中删除一个对象
   * @param {object} filter 筛选条件
   * @param {object} opts 设置
   */
  async deleteOne(filter, opts) {
    const result = await this.collection.deleteOne(filter, opts);
    return result;
  }

  /**
   * 从集合中删除多个对象
   * @param {object} filter 筛选条件
   * @param {object} opts 设置
   */
  async deleteMany(filter, opts) {
    const result = await this.collection.deleteMany(filter, opts);
    return result;
  }

  /**
   * 更新文档
   * @param {object} filter 查询对象
   * @param {object} document 更新文档
   * @param {object} opts 设置
   */
  async updateMany(filter, document, opts) {
    const result = await this.collection.updateMany(filter, document, opts);
    return result;
  }

  /**
   * 新增加文档
   * @param {Array} docs 要新增加的文档
   * @param {object} opts 选项
   */
  async insertMany(docs, opts) {
    const result = await this.collection.insert(docs, opts);
    return result;
  }

  /**
   * 更新一个文档
   * @param {object} filter 查询对象
   * @param {object} document 更新文档
   * @param {object} opts 设置
   */
  async updateOne(filter, document, opts) {
    const result = await this.collection.updateOne(filter, document, opts);
    return result;
  }
}

module.exports = BaseService;
