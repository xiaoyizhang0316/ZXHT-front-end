//url相关
// const BASE_URL = "http://101.178.98.25:8443"
// const BASE_URL = "https://mini.zhenxianghaitao.com"
// const BASE_URL = "https://localhost"
const BASE_URL = "https://a5f93900.ngrok.io"


//登录
const CATEGORY_URL = BASE_URL + "/api/mall/categories/";
const SHOP_PRODUCT_URL = BASE_URL + "/api/mall/shopProducts/";
const PRODUCT_URL = BASE_URL + "/api/mall/products/";
const BRAND_URL = BASE_URL + "/api/mall/brands";
const GET_OPEN_ID = BASE_URL + "/api/customers/openid";
const tryCode_URL = BASE_URL + "/api/mall/test/appid/";
const tryAddUser_URL = BASE_URL + "/api/mall/users/saveOrUpdateUserData";

//获得个人用户页面信息
const shopisOpenOrNot = BASE_URL + "/api/mall/shops/checkOpenShop/"
const shopSign = BASE_URL + "/api/mall/shops/getShopInfo/"


const HEADERS = {
    'content-type': 'application/json',
    'Authorization': 'Basic ZXhwcmVzczozeTZGUkAyRw=='
};

//二维码扫描和商品搜索
const BAR_CODE_URL = PRODUCT_URL + "barcode/";
const SEARCH_URL = PRODUCT_URL + "title/";


module.exports = {
  BASE_URL: BASE_URL,
  CATEGORY_URL: CATEGORY_URL,
  SHOP_PRODUCT_URL: SHOP_PRODUCT_URL,
  PRODUCT_URL: PRODUCT_URL,
  BRAND_URL: BRAND_URL,
  GET_OPEN_ID: GET_OPEN_ID,
  tryCode_URL: tryCode_URL,
  tryAddUser_URL: tryAddUser_URL,
  shopisOpenOrNot: shopisOpenOrNot,
  HEADERS: HEADERS,

  BAR_CODE_URL: BAR_CODE_URL,
  SEARCH_URL: SEARCH_URL
}
