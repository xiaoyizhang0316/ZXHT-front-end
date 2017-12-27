//用到时再加载
const obj = {
  'NetUtil': 'netUtil',
  'CON': 'constant',
  'Util': 'util',
}

// use by this way:
// var COM = require('.../common.js')
// COM.load('NetUtil').XXX
function loadUtil(filename) {
  if (!filename) {
    return ""
  }

  var file = require(obj[filename] + ".js")
  return file;
}

module.exports = {
  load: function (filename) {
    return loadUtil(filename);
  },
}

// 一次把所有的js都加载进来
// var NetUtil = require('netUtil.js')
// var CON = require('constant.js')
// var Util = require('util.js')

// module.exports = {
//   NetUtil: NetUtil,
//   CON: CON,
//   Util: Util
// }
