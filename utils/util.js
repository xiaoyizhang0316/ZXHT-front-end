var NetUtil = require('netUtil.js');
var CON = require('constant.js');


var productFlag = 0;
var bannerFlag = 0;
var targetShopInfoFlag = 0;
var categoryFlag = 0;

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
  wx.getLocation({
    success: function (res) {
      //console.log(res);
    },
    fail: function (res) {
      console.log(res);
    }
  })
    return CON.IMG_BASE + pic + ".jpg";
}

function imageThumb(pic) {
  wx.getLocation({
    success: function (res) {
      //console.log(res);
    },
    fail: function (res) {
      console.log(res);
    }
  })
    return CON.IMG_BASE_THUMB + pic + ".jpg";
}

/**
 * load all the brands and save to local if empty or expired 
 */
function loadBrands() {
    let url = CON.BRAND_URL + "/all";
    return cacheOrLoad("brands", url);
}

function loadShopParams() {
    let shopParams = {}
    NetUtil.netUtil(CON.GET_SHOPPARAMS_URL, "GET", "", function(shopParams) {
        if (shopParams) {
          shopParams.rate = shopParams.rate.toFixed(2);
          shopParams.rate = Math.round(shopParams.rate*100)/100
            wx.setStorage({
                key: "shopParams",
                data: shopParams,
            })
        }
		return 1;
    })
}

function loadShipAgents() {
    let shipAgents = {}
    NetUtil.netUtil(CON.GET_SHIPAGENTS_URL, "GET", "", function(shipAgents) {
        if (shipAgents) {
            wx.setStorage({
                key: "shipAgents",
                data: shipAgents,
            })
        }
		return 1;
    })
}

function loadPayments() {
    let payments = {}
    NetUtil.netUtil(CON.GET_PAYMENTS_URL, "GET", "", function(payments) {
        if (payments) {
            wx.setStorage({
                key: "payments",
                data: payments,
            })
        }
		return 1;
    })
}




/****************************
进入动态读取模式
**/
function loadShop(openId,targetShopId,callback)
{
	loadProducts(openId, targetShopId);
	loadShopBanner(targetShopId);
	loadCategories(targetShopId);
	loadShopInfo(targetShopId);
	wait()
	function wait (){
		if((productFlag+bannerFlag+targetShopInfoFlag+categoryFlag) == 4)
		{
			callback(true)
			return;
		}else{
			setTimeout(function () {
				console.log("---------------------------------------------------------")
				console.log(productFlag)
				console.log(bannerFlag)
				console.log(targetShopInfoFlag)
				console.log(categoryFlag)
				console.log("---------------------------------------------------------")
				wait()
				return
			}, 1000)
		}
	}
}


function loadProducts(openId, targetShopId) {
	
    let self = this
    let products = {}
    NetUtil.netUtil(CON.GET_TARGETSHOP_PRODUCTS_URL + openId + "/" + targetShopId, "GET", "", function(shopProducts) {
        if (shopProducts) {
            console.log(shopProducts);
			wx.setStorageSync("shopProducts", shopProducts)
        }
		productFlag = 1;
    })
};

function loadCategories(targetShopId){	
	
	NetUtil.netUtil(CON.CATEGORY_URL + "openId/" + targetShopId, "GET", "", function (categories) {
		wx.setStorageSync("categories", categories)
		categoryFlag = 1;
	})
}

function loadShopBanner(targetShopId) {
    let self = this
    NetUtil.netUtil(CON.GET_SHOP_BANNER + targetShopId, "GET", "", function(res) {
        if (res) {
            console.log(res);
            if (res.flag == true) {
                wx.setStorageSync("shopBanner", res.banner)
            } else {
                wx.setStorageSync("shopBanner", null)
            }
			bannerFlag = 1;
		
        }
    });


};
function loadShopInfo(targetShopId)
{
	let url = CON.getMyShopInfo + targetShopId
	
	NetUtil.netUtil(url, "GET", "", function (res) {
		wx.setStorageSync("targetShopInfo", res);
		targetShopInfoFlag = 1
	})
}
/**
 * common method to load the cache or refresh the cache
 */
function cacheOrLoad(storageKey, url) {
    let cache = wx.getStorageSync(storageKey);

    if (!cache) {
        NetUtil.netUtil(url, 'GET', '', (ret) => {
            console.log(storageKey + "OK!")
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
    loadShopBanner: loadShopBanner,
    loadPayments: loadPayments,
    loadShipAgents: loadShipAgents,
    loadShopParams: loadShopParams,
    imageThumb: imageThumb,
    isNumeric: isNumeric,
	loadShop: loadShop
}