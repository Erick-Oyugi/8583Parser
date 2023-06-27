// import _ from 'lodash';
// TODO : research why the above line is not working

export function toCamelCase(obj) {
  const _ = require('lodash');
  if (obj instanceof Array) {
    return obj.map(toCamelCase);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const finalKey = _.camelCase(key);
      result[finalKey] = toCamelCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
}
