import {
  baseUtil,
} from '../../util';

const checkKeys = (head, keys) => {
  const result = {};
  const type = keys[0];
  if (type === 'all') {
    baseUtil.each(head, (key, index) => {
      result[key] = index;
    });
  } else {
    baseUtil.each(keys, (key) => {
      if (head.indexOf(key) > -1) {
        result[key] = head.indexOf(key);
      }
    });
  }
  return result;
};
/**
 * chart 的数据
 */
class ChartData {
  constructor() {
    this.origin = null;
    this.data = null;
    this.head = null;
  }

  add(data) {
    this.origin = data;
    this.head = data.head;
    this.data = data.data;
    return this;
  }

  object(...keys) {
    return this.singleKey((value, key) => {
      const point = {};
      point[key] = value;
      return point;
    }, ...keys);
  }

  array(...keys) {
    return this.singleKey((value) => {
      const point = [];
      point.push(value);
      return point;
    }, ...keys);
  }

  string(...keys) {
    return this.singleKey(value => value.toString(), ...keys);
  }

  singleKey(handler, ...keys) {
    return this.handler((d, ks) => {
      let point = null;
      baseUtil.each(ks, (index, k) => {
        if (!point) {
          point = handler(d[index], k);
        } else if (baseUtil.isObject(point)) {
          baseUtil.merge(point, handler(d[index], k));
        } else if (baseUtil.isArray(point)) {
          point.concat(handler(d[index], k));
        } else if (typeof point === 'string') {
          point += ` ${point}`;
        }
      });
      return point;
    }, ...keys);
  }

  handler(handler, ...keys) {
    let result = [];
    const ks = checkKeys(this.head, keys);
    baseUtil.each(this.data, (d, dIndex) => {
      const point = handler(d, ks, dIndex);
      if (baseUtil.isArray(point)) {
        result = result.concat(point);
      } else {
        result.push(point);
      }
    });
    return result;
  }
}

export default new ChartData();
