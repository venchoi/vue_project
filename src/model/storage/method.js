import storageApi from '../../plugins/base/storage';
import http from '../../plugins/http/http';

/**
 * storage 图表数据存储基类
 * 提供数据初始化、读、写、清空、请求的方法。
 * storageApi: 处理图表数据的插件，
 */
class storage {
  constructor() {
    this.name = ''; // storage中存储的结构名称，目前有：user、IndexCode、Codes、witchGroup
    this.api = null; //  HTTP请求时的API信息，后台接口url, 可以没有
    this.param = {}; // 数据类型，目前'idx'表示指数；'stk'表示个股
    this.limit = null; // 是否节流
    this.storageApi = storageApi; // 图表数据处理插件
    this.written = () => {};
  }

  /**
   * 数据写入
   * @param data - 数据
   * @param isSession - 是否写入Session
   * isSession 用于判断数据是否保留在浏览器中，
   * isSession = true则说明数据保留在sesstion，会随浏览器页面关闭而清除。
   * isSession =false则说明数据保留在浏览器中，不会随浏览器关闭而清除。
   */
  write(data, isSession) {
    if (isSession) {
      storageApi.session.save(this.name, data);
    } else {
      storageApi.application.save(this.name, data);
    }
    this.written(data);
  }
  read() {
    return storageApi.read(this.name);
  }
  clear() {
    storageApi.clear(this.name);
  }

  /**
   * 请求
   * @param cb
   */
  request(cb) {
    const self = this;
    if (this.api &&
      (this.limit === null || (typeof this.limit === 'function' && this.limit()))
    ) {
      http.api[this.api]({
        param: this.param,
        success(data) {
          self.write(data);
          if (typeof cb === 'function') {
            cb();
          }
        },
      });
    }
  }
  init(cb) {
    if (this._init) {
      this._init(cb);
    }
  }
}

export default storage;
