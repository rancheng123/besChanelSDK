 
import Fingerprint2 from 'fingerprintjs2';
import { getPageUrlParam, getRouterName } from './utils';
import Cookies from 'js-cookie';
import { urlMode } from './config.js';

// 生成一个唯一的浏览器指纹id
function getDeviceId() {
  return new Promise((resolve, reject) => {
    if (window.requestIdleCallback) {
      requestIdleCallback(function () {
          Fingerprint2.get(function (components) {
            var values = components.map(function (component) { return component.value });
            var murmur = Fingerprint2.x64hash128(values.join(''), 31);
            resolve(murmur);
          });
      });
    } else {
      setTimeout(function () {
          Fingerprint2.get(function (components) {
            var values = components.map(function (component) { return component.value });
            var murmur = Fingerprint2.x64hash128(values.join(''), 31);
            resolve(murmur);
          })
      }, 500);
    }
  });
}

// 生成一个唯一UUID
function getUuid(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [], i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random()*16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}
// 获取当前token，先从当前url中取，没有再从cookie中取
function getToken() {
  let locationUrl;
  if(urlMode() === 'hash') {
    locationUrl = window.location.hash;
  } else {
    locationUrl = window.location.search;
  }
  return getPageUrlParam(locationUrl, 'token') ? getPageUrlParam(locationUrl, 'token') : Cookies.get('ovo_ticket');
}


/**
 * 获取当前操作系统
 */
function getOperationSys() {
  var OS = '';
  var OSArray = {};
  var UserAgent = navigator.userAgent.toLowerCase();
  OSArray.Windows = (navigator.platform == 'Win32') || (navigator.platform == 'Windows');
  OSArray.Mac = (navigator.platform == 'Mac68K') || (navigator.platform == 'MacPPC')
    || (navigator.platform == 'Macintosh') || (navigator.platform == 'MacIntel');
  OSArray.iphone = UserAgent.indexOf('iPhone') > -1;
  OSArray.ipod = UserAgent.indexOf('iPod') > -1;
  OSArray.ipad = UserAgent.indexOf('iPad') > -1;
  OSArray.Android = UserAgent.indexOf('Android') > -1;
  for (var i in OSArray) {
    if (OSArray[i]) {
      OS = i;
    }
  }
  return OS;
}

// 获取浏览器和版本号
function getBrowserInfo(){
  var Sys = {};
  var ua = navigator.userAgent.toLowerCase();
   var re =/(msie|firefox|chrome|opera|version).*?([\d.]+)/;
   var m = ua.match(re);
   if(!m) return Sys
   Sys.browser = m[1].replace(/version/, "'safari");
   Sys.ver = m[2];
   return Sys;
}
const url =encodeURIComponent(window.location.href)
// 前置页面地址和当前页面地址
class referUrl {
  constructor() {
    this.currentUrl = '';
    this.url = encodeURIComponent(window.location.href);
    this.urlPath = '';
    this.urlHost = '';
    this.referUrl = '';
    this.currentName = '';
    this.referName = '';
    this.referrerHost= ''
    this.source_type = ''
    this.init();
  }
  init() {
    this.currentUrl = window.location.href.split('?')[0];
    this.referUrl = encodeURIComponent(document.referrer) || '';
    this.urlHost =  window.location.host
    this.urlPath =  window.location.pathname
    this.url =  url
    this.refererHost = this.referUrl.split('?')[0];
    this.currentName = getRouterName();
    this.sourceType =  this.referUrl.includes(this.urlHost) ? 1 : 2 // 1站内,2站外
  }
}

const referUrlInstance = new referUrl();

export default {
  getDeviceId,
  getUuid,
  getToken,
  getOperationSys,
  getBrowserInfo,
  referUrlInstance
};
