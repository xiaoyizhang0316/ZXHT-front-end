var NetUtil = require('netUtil.js');
var CON = require('constant.js');

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function makeCall(number) {
  let valid = false;
  if ((number.startsWith("04") || number.startsWith("02") || number.startsWith("03")) && number.length == 10) {
    number = number;
    valid = true;
  } else if (number.startsWith("1") || number.startsWith("+86")) {
    if (!number.includes("+86")) {
      number = "+86" + number;
    }
    valid = true;
  }
  if (valid) {
    wx.makePhoneCall({
      phoneNumber: number
    })
  } else {
    wx.showModal({
      title: '提示',
      content: '只支持拨打澳洲或中国大陆的手机号码',
      showCancel: false,
    })
  }

}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function trim(str) {
  return str.replace(/(^\s+)|(\s+$)/g, "");
}

function trimAll(str) {
  return str.replace(/\s+/g, "");
}

function guid() {
  function _p8(s) {
    var p = (Math.random().toString(16) + "000000000").substr(2, 8);
    return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
  }
  return _p8() + _p8();
}

function image(pic) {
  return "https://ozexpress.cn/"+pic+".jpg";
}

/**
 * load all the brands and save to local if empty or expired 
 */
function loadBrands() {
  let url = CON.BRAND_URL + "/all";
  return cacheOrLoad("brands", url);
}

function loadProducts() {
  let url = CON.PRODUCT_URL +"/all"
  cacheOrLoad("products", url);
};

/**
 * common method to load the cache or refresh the cache
 */
function cacheOrLoad(storageKey, url){
  let cache = wx.getStorageSync(storageKey);
  if (!cache) {
    NetUtil.netUtil(url, 'GET', '', (ret) => {
      wx.setStorage({
        key: storageKey,
        data: ret,
      }) 
    });
  } else {
      return cache;
  } 
}


module.exports = {
  formatTime: formatTime,
  makeCall: makeCall,
  trim: trim,
  trimAll: trimAll,
  guid: guid,
  image: image,
  loadBrands: loadBrands,
  loadProducts: loadProducts,
  isNumeric: isNumeric,
}
