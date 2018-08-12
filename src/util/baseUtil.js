const BUILTIN_OBJECT = {
  '[object Function]': 1,
  '[object RegExp]': 1,
  '[object Date]': 1,
  '[object Error]': 1,
  '[object CanvasGradient]': 1,
  '[object CanvasPattern]': 1,
  // For node-canvas
  '[object Image]': 1,
  '[object Canvas]': 1,
};

const TYPED_ARRAY = {
  '[object Int8Array]': 1,
  '[object Uint8Array]': 1,
  '[object Uint8ClampedArray]': 1,
  '[object Int16Array]': 1,
  '[object Uint16Array]': 1,
  '[object Int32Array]': 1,
  '[object Uint32Array]': 1,
  '[object Float32Array]': 1,
  '[object Float64Array]': 1,
};

const objToString = Object.prototype.toString;

/**
 * 遍历方法
 * @param {Object} obj - 遍历的对象
 * @param {function} cb - 回调函数 接受 (value,key)
 */
const each = (obj, cb) => {
  let keys;
  if (obj instanceof Array) {
    return obj.forEach(cb);
  } else if (typeof obj === 'object') {
    keys = Object.keys(obj);
    return keys.forEach((k) => {
      cb(obj[k], k);
    });
  }
  return null;
};
const isEmptyObject = obj => Object.keys(obj).length === 0;
/**
 * 复制
 * @param source - 可以是Object、Array及其他普通类型
 * @returns {*} - 复制副本
 */
const clone = (source) => {
  if (source === null || typeof source !== 'object') {
    return source;
  }

  let result = source;
  const typeStr = objToString.call(source);
  if (typeStr === '[object Array]') {
    result = [];
    for (let i = 0, len = source.length; i < len; i += 1) {
      result[i] = clone(source[i]);
    }
  } else if (TYPED_ARRAY[typeStr]) {
    result = source.constructor.from(source);
  }

  return result;
};

/**
 * 复制，与clone的区别是：copy可以消除Vuex 添加的getter setter
 */
const copy = (source) => {
  if (source === null || typeof source !== 'object') {
    return source;
  }

  let result;
  const typeStr = objToString.call(source);
  if (typeStr === '[object Array]') {
    result = [];
  } else if (typeStr === '[object Object]') {
    result = {};
  } else {
    result = source;
  }
  each(source, (value, key) => {
    result[key] = copy(value);
  });

  return result;
};
/**
 * 判断是否为对象
 * @param value - 输入值
 * @returns {boolean} - 如果是funcion 或者object则返回true
 */
const isObject = (value) => {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  const type = typeof value;
  return type === 'function' || (!!value && type === 'object');
};
const isDom = value => typeof value === 'object' && typeof value.nodeType === 'number' && typeof value.ownerDocument === 'object';

const isArray = value => objToString.call(value) === '[object Array]';

const isBuildInObject = value => !!BUILTIN_OBJECT[objToString.call(value)];
/**
 * 合并
 * @param target - 目标
 * @param source - 源
 * @param overwrite - 是否覆盖
 * @returns {*} - 合并结果保存在target中，返回target
 * 如果源和目标有一个不是Object类型，覆盖则返回源，不覆盖则返回目标；
 * 对于两个都是Object类型的，比较他们本身的属性，如果两者属性都为Object，则递归调用merge;
 * 否则只处理overwrite为true，或者在target对象中没有此属性的情况，将source的属性值clone到target相应属性中；
 * 并且，对于target本没有的属性，也会创建属性并赋值。合并结果保存在target中。
 */
const merge = (target, source, overwrite) => {
  // We should escapse that source is string
  // and enter for ... in ...
  const $target = target;
  if (!isObject(source) || !isObject(target)) {
    return overwrite ? clone(source) : target;
  }

  each(source, (value, key) => {
    if (Object.hasOwnProperty.call(source, key)) {
      const targetProp = target[key];
      const sourceProp = source[key];

      if (isObject(sourceProp)
        && isObject(targetProp)
        && !isArray(sourceProp)
        && !isArray(targetProp)
        && !isDom(sourceProp)
        && !isDom(targetProp)
        && !isBuildInObject(sourceProp)
        && !isBuildInObject(targetProp)
      ) {
        // 如果需要递归覆盖，就递归调用merge
        merge(targetProp, sourceProp, overwrite);
      } else if (overwrite || !(key in target)) {
        // 否则只处理overwrite为true，或者在目标对象中没有此属性的情况
        // NOTE，在 target[key] 不存在的时候也是直接覆盖
        $target[key] = clone(source[key], true);
      }
    }
  });

  return target;
};

const createArray = (length, def) => new Array(...new Array(length)).map(() => def);

const defaults = (target, source, overlay) => {
  const t = target;
  const s = source;
  each(s, (value, key) => {
    if (Object.prototype.hasOwnProperty.call(s, key)
      && (overlay ? s[key] !== null : t[key] === null)
    ) {
      t[key] = s[key];
    }
  });
  return t;
};

const mixin = (target, source, overlay) => {
  const t = 'prototype' in target ? target.prototype : target;
  const s = 'prototype' in source ? source.prototype : source;

  defaults(t, s, overlay);
};

/**
 * 获取最新数据
 * @param {Array} array - 遍历的对象
 * @returns {*} - 如果传入参数是数组且不为空则返回数组最后一项；否则返回空
 */
const getLast = (array) => {
  if (isArray(array) && array.length > 0) {
    return array[array.length - 1];
  }
  return null;
};

/**
 * 数组去重
 * @param array - 传入数组
 * @returns {Array} - 去重后数组
 */
const arrUnique = (array) => {
  const tmp = {};
  const ret = [];
  each(array, (item) => {
    if (!tmp[item]) {
      tmp[item] = 1;
      ret.push(item);
    }
  });
  return ret;
};

/**
 * 求数组补集
 * @param {array} a - 补集最终所在的数组
 * @param {array} b - 需要排除的数组
 * eg：a: [3]; b: [0, 1, 2, 3];
 * intersect(a, b);//[0, 1, 2]
 */
const minus = (a, b) => {
  const result = new Array(0);
  const obj = {};
  each(a, (item) => {
    obj[item] = 1;
  });
  each(b, (item) => {
    if (!obj[item]) {
      obj[item] = 1;
      result.push(item);
    }
  });
  return result;
};


export default {
  each,
  isEmptyObject,
  clone,
  copy,
  mixin,
  isObject,
  isArray,
  merge,
  createArray,
  getLast,
  arrUnique,
  minus,
};
