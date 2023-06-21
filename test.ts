/**
 * @description 获取传入数据的类型，小写字符串
 * @param obj
 * @returns
 */
const getDataType = (obj: any): string => {
  let res = Object.prototype.toString.call(obj).split(' ')[1];
  res = res.substring(0, res.length - 1).toLowerCase();
  return res;
};

// const regexp = /type:{{([^]+)}}-|value:{{([^]+)}}/

const convertString = (_key: any, value: any) => {
  const type = getDataType(value);

  if (
    type === 'string' ||
    type === 'boolean' ||
    type === 'number' ||
    type === 'null'
  ) {
    return value;
  }

  if (type === 'undefined') {
    return `type:{{${type}}}-value:{{${value}}}`;
  }

  if (type === 'symbol') {
    return value.toString();
  }

  if (type === 'function') {
    return value.toString().replace(/^function/, '');
  }

  return value;
};

const test = {
  a: 1,
  b: '2',
  c: true,
  d: undefined,
  e: null,
  f: Symbol('f'),
  g: function () {
    const a = { age: 23, name: 'zhangsan' };

    return a;
  }
};

const text = JSON.stringify(test, convertString);
console.log(text);
