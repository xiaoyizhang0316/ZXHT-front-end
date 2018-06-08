//url相关
const BASE_URL = "https://mini.zhenxianghaitao.com"

//const BASE_URL = "https://34842770.ngrok.io"
const IMG_BASE = "https://img.zhenxianghaitao.com/storage/mini/"
const IMG_DETAIL_BASE = "https://img.zhenxianghaitao.com/"
//登录 初始设置
const CATEGORY_URL = BASE_URL + "/api/mall/categories/";
const SHOP_PRODUCT_URL = BASE_URL + "/api/mall/shopProducts/";
const PRODUCT_URL = BASE_URL + "/api/mall/products/";
const BRAND_URL = BASE_URL + "/api/mall/brands";
const GET_OPEN_ID = BASE_URL + "/api/customers/openid";
const tryCode_URL = BASE_URL + "/api/mall/test/appid/";
const tryAddUser_URL = BASE_URL + "/api/mall/users/saveOrUpdateUserData";
const CREATE_OR_UPDATE_USER = BASE_URL + "/api/mall/users/saveOrUpdateUserData";

const GET_SHOPPARAMS_URL = BASE_URL + "/api/mall/shops/getShopParams";
const GET_PAYMENTS_URL = BASE_URL + "/api/mall/shops/getPayments";
const GET_SHIPAGENTS_URL = BASE_URL + "/api/mall/shops/getShipAgents";
//获得个人用户页面信息
const shopisOpenOrNot = BASE_URL + "/api/mall/shops/checkOpenShop/";
const ShopInfo = BASE_URL + "/api/mall/shops/getShopInfo/";


//获得，更新关于自己店铺的信息
const getMyShopInfo = BASE_URL + "/api/mall/shops/openId/"
const updateMyShopInfo = BASE_URL + "/api/mall/shops/update"
const FANS_LIST_URL = BASE_URL + "/api/mall/users/getFansApplyToShop/"
const FANS_ACCESS_URL = BASE_URL + "/api/mall/users/updateFansAccess"
const FANS_VIP_URL = BASE_URL + "/api/mall/users/updateFansVipLevel"
const UPDATE_FAN_URL = BASE_URL + "/api/mall/users/updateFan"
const ADD_SHOP_PRODUCT_URL = BASE_URL + "/api/mall/shops/addShopProduct"
const APPLY_TO_SHOP = BASE_URL + "/api/mall/users/applyToShop/"
const CREATE_SHOP = BASE_URL + "/api/mall/shops/create"
const HEADERS = {
  'content-type': 'application/json',
  'Authorization': 'Basic ZXhwcmVzczozeTZGUkAyRw=='
};
const ONE_BUTTON_PRODUCTS = BASE_URL + "/api/mall/shops/oneButtonProducts/"
const BALANCE_APPLY = BASE_URL + "/api/mall/shops/balanceApply/"
const GET_SHOP_BALANCE = BASE_URL + "/api/mall/shops/getShopBalance/"



//二维码扫描和商品搜索
const BAR_CODE_URL = PRODUCT_URL + "barcode/";
const SEARCH_URL = PRODUCT_URL + "title/";

//商品信息 购物车信息
const GET_TARGETSHOP_PRODUCTS_URL = SHOP_PRODUCT_URL + "openId/";
const GET_TARGETSHOP_PRODUCT_URL = SHOP_PRODUCT_URL + "getTargetShopProduct/"
const SAVE_CONSIGNEE_URL = BASE_URL + "/api/mall/users/saveConsignee";
const DELETE_CONSIGNEE_URL = BASE_URL + "/api/mall/users/deleteConsignee/";
const GET_MY_CONSIGNEES_URL = BASE_URL + "/api/mall/users/getMyConsignees/"
const SET_DEFAULT_CONSIGNEE_URL = BASE_URL + "/api/mall/users/setDefaultConsignee/"
const GET_ALL_PRODUCT_BY_CATEGORYID_URL = BASE_URL + "/api/mall/products/category/"
const GET_MY_PRODUCTS = SHOP_PRODUCT_URL + "openId/"

//进入他人店铺
const GET_SHOPS_APPLY_TO_SHOP = BASE_URL + "/api/mall/users/getShopsApplyToShop/"

//订单
const SAVE_ORDER_URL = BASE_URL + "/api/mall/orders/saveOrder"
const GET_ALL_ORDERS_SELLER = BASE_URL + "/api/mall/orders/getOrders/2/"
const GET_ORDERINFO = BASE_URL + "/api/mall/orders/getOrder"
const GET_ALL_ORDERS_BUYER = BASE_URL + "/api/mall/orders/getOrders/1/"
const CANCEL_ORDER_BUYER = BASE_URL + "/api/mall/orders/cancelOrder/"
const UPDATE_ORDER_URL = BASE_URL + "/api/mall/orders/updateOrder"
const CONFRIM_ORDER_URL = BASE_URL + "/api/mall/orders/confirmOrder"
const PAY_ORDER_URL = BASE_URL + "/api/mall/orders/payOrder/"
const REORDER_URL = BASE_URL + "/api/mall/orders/reorder"
const RECEIVE_ORDER_URL = BASE_URL + "/api/mall/orders/receiveOrder/"
const GET_CURRENT_ORDERGOOD_PRICE = BASE_URL +"/api/mall/orders/getCurrentOrderGoodPrice"
//发货单
const SAVE_SHIPORDER = BASE_URL + "/api/mall/orders/saveShipOrder"

//转发订单
const TRANSFER_ORDER = BASE_URL + "/api/mall/orders/transferOrder"
const GET_TRANSFER_ORDER = BASE_URL + "/api/mall/orders/getTransferOrder"
const APPLY_TRANSFER_ORDER = BASE_URL + "/api/mall/orders/applyTransferOrder"
const ACCEPT_TRANSFER_ORDER = BASE_URL + "/api/mall/orders/acceptTransferOrder/"
const DECLINE_TRANSFER_ORDER = BASE_URL + "/api/mall/orders/declineTransferOrder/"


//功能性
const UPLOADFILE = BASE_URL + "/api/mall/test/uploadFile"

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
  updateMyShopInfo: updateMyShopInfo,
  getMyShopInfo: getMyShopInfo,
  HEADERS: HEADERS,
  FANS_LIST_URL: FANS_LIST_URL,
  FANS_VIP_URL: FANS_VIP_URL,
  FANS_ACCESS_URL: FANS_ACCESS_URL,
  BAR_CODE_URL: BAR_CODE_URL,
  SEARCH_URL: SEARCH_URL,
  GET_TARGETSHOP_PRODUCTS_URL: GET_TARGETSHOP_PRODUCTS_URL,
  ADD_SHOP_PRODUCT_URL: ADD_SHOP_PRODUCT_URL,
  SAVE_CONSIGNEE_URL: SAVE_CONSIGNEE_URL,
  DELETE_CONSIGNEE_URL: DELETE_CONSIGNEE_URL,
  GET_MY_CONSIGNEES_URL: GET_MY_CONSIGNEES_URL,
  SET_DEFAULT_CONSIGNEE_URL: SET_DEFAULT_CONSIGNEE_URL,
  APPLY_TO_SHOP: APPLY_TO_SHOP,
  GET_SHOPS_APPLY_TO_SHOP: GET_SHOPS_APPLY_TO_SHOP,
  CREATE_SHOP: CREATE_SHOP,
  CREATE_OR_UPDATE_USER: CREATE_OR_UPDATE_USER,
  SAVE_ORDER_URL: SAVE_ORDER_URL,
  GET_ALL_ORDERS_SELLER: GET_ALL_ORDERS_SELLER,
  GET_ORDERINFO: GET_ORDERINFO,
  GET_ALL_ORDERS_BUYER: GET_ALL_ORDERS_BUYER,
  CANCEL_ORDER_BUYER: CANCEL_ORDER_BUYER,
  UPDATE_ORDER_URL: UPDATE_ORDER_URL,
  CONFRIM_ORDER_URL: CONFRIM_ORDER_URL,
  PAY_ORDER_URL: PAY_ORDER_URL,
  SAVE_SHIPORDER: SAVE_SHIPORDER,
  GET_ALL_PRODUCT_BY_CATEGORYID_URL: GET_ALL_PRODUCT_BY_CATEGORYID_URL,	
  UPLOADFILE: UPLOADFILE,
  IMG_BASE: IMG_BASE,
  REORDER_URL: REORDER_URL,
  RECEIVE_ORDER_URL: RECEIVE_ORDER_URL,
  GET_MY_PRODUCTS: GET_MY_PRODUCTS,
  GET_TARGETSHOP_PRODUCT_URL : GET_TARGETSHOP_PRODUCT_URL,
  GET_SHOPPARAMS_URL : GET_SHOPPARAMS_URL,
  GET_PAYMENTS_URL : GET_PAYMENTS_URL,
  GET_SHIPAGENTS_URL : GET_SHIPAGENTS_URL,
  UPDATE_FAN_URL: UPDATE_FAN_URL,
  IMG_BASE: IMG_BASE,
  ONE_BUTTON_PRODUCTS: ONE_BUTTON_PRODUCTS,
  IMG_DETAIL_BASE : IMG_DETAIL_BASE,
  BALANCE_APPLY: BALANCE_APPLY,
  GET_SHOP_BALANCE: GET_SHOP_BALANCE,
  TRANSFER_ORDER: TRANSFER_ORDER,
  GET_TRANSFER_ORDER: GET_TRANSFER_ORDER,
  APPLY_TRANSFER_ORDER: APPLY_TRANSFER_ORDER,
  ACCEPT_TRANSFER_ORDER: ACCEPT_TRANSFER_ORDER,
  DECLINE_TRANSFER_ORDER: DECLINE_TRANSFER_ORDER,
  GET_CURRENT_ORDERGOOD_PRICE: GET_CURRENT_ORDERGOOD_PRICE
   
}
