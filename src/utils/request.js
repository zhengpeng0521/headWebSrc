import fetch from 'dva/fetch';
import reqwest from 'reqwest';
import Promise from 'promise-polyfill';
import JsonP from 'fetch-jsonp';
import { message, Modal } from 'antd';
import sstokey from '../../mock/sstoken.js';

function parseJSON(response) {
    return response.json();
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */

import qs from 'qs';

window.requestData = function (url,options) {
    if(!!window.navigator.onLine){
        let params = qs.parse(options.body);
        params.isHq = params.isHq || 1;
        options.body = qs.stringify({
            // service: url,
            data: qs.parse(params),
        });
        options = {
            ...options,
            credentials: 'include',     //fetch  请求加上cookie
            headers: {
                ...options.headers,
                isAjax: 'yes',
            }
        };
        return fetch(url, options)
            .then(checkStatus)
            .then(parseJSON)
            .then(function (ret) {
                if (ret && ret.errorCode == 2000) {
                    window.location = BASE_URL + '/';
                } else if (ret && ret.errorCode == 4000) {
                    window.location = BASE_URL + '/logout'
                }
                return { ret };
            })
            .catch((err) => ({ err }));
    }else{
        message.error('请检查您的网络是否连接');
    }
}

window.tmkServiceRequest = function (url,params,suc,fail) {
    if(!!window.navigator.onLine){
        params.data = { ...params, isHq: 1 };
        // params.service = url;

        //异步请求
        reqwest({
            url: url,
            method: 'POST',
            type: 'json',
            headers: {
                isAjax: 'yes',
            },
            data: params,
        }).then(result => {
            if (result.errorCode === 0) {
                if (suc) {
                    suc(result);
                }
            } else {
                if (result.errorCode == 2000) {
                    window.location = BASE_URL + '/';
                } else if (result.errorCode == 4000) {
                    window.location = BASE_URL + '/logout'
                } else {
                    if (fail) {
                        fail(result);
                    } else {
                        message.error(result.errorMessage || result.errorMsg || '服务器开小差啦');
                    }
                }
            }

        }, function (err, msg) {
            message.error('服务器开小差啦');
        });
    }else{
        message.error('请检查您的网络是否连接');
    }
}

window.serviceRequest = function (url,params,suc,fail) {
    if(!!window.navigator.onLine){
        params.data = { ...params, isHq: 1 };
        // params.service = url;

        //异步请求
        reqwest({
            url: url,
            method: 'POST',
            type: 'json',
            headers: {
                isAjax: 'yes',
            },
            data: params,
        }).then(result => {
            if (result.errorCode == 9000) {
                if (suc) {
                    suc(result);
                }
            } else {
                if (result.errorCode == 2000) {
                    window.location = BASE_URL + '/';
                } else if (result.errorCode == 4000) {
                    window.location = BASE_URL + '/logout'
                } else {
                    if (fail) {
                        fail(result);
                    } else {
                        message.error(result.errorMessage || result.errorMsg || '服务器开小差啦');
                    }
                }
            }

        }, function (err, msg) {
            message.error('服务器开小差啦');
        });
    }else{
        message.error('请检查您的网络是否连接');
    }
}

window.serviceRequest1 = function (url,params,suc,fail) {
    if(!!window.navigator.onLine){
        params.data = { ...params, isHq: 0 };
        // params.service = url;

        //异步请求
        reqwest({
            url: url,
            method: 'POST',
            type: 'json',
            headers: {
                isAjax: 'yes',
            },
            data: params,
        }).then(result => {
            if (result.errorCode == 9000) {
                if (suc) {
                    suc(result);
                }
            } else {
                if (result.errorCode == 2000) {
                    window.location = BASE_URL + '/';
                } else if (result.errorCode == 4000) {
                    window.location = BASE_URL + '/logout'
                } else {
                    if (fail) {
                        fail(result);
                    } else {
                        message.error(result.errorMessage || '服务器开小差啦');
                    }
                }
            }

        }, function (err, msg) {
            message.error('服务器开小差啦');
        });
    }else{
        message.error('请检查您的网络是否连接');
    }
}

window.serviceRequest2 = function (url,params) {
    if(!!window.navigator.onLine){
        params.data = { ...params, isHq: 0 };
        // params.service = url;

        //异步请求
        return reqwest({
            url: url,
            method: 'POST',
            type: 'json',
            headers: {
                isAjax: 'yes',
            },
            data: params,
        }).then(ret => {
            if (ret.errorCode == 2000) {
                window.location = BASE_URL + '/';
            } else if (ret.errorCode == 4000) {
                window.location = BASE_URL + '/logout'
            }
            return {ret}

        }, function (err, msg) {
            message.error('服务器开小差啦');
        });
    }else{
        message.error('请检查您的网络是否连接');
    }
}

window.serviceRequestDept = function (url,params,suc,fail) {
    if(!!window.navigator.onLine){
        params.data = { ...params, isHq: 1 };
        // params.service = url;

        //异步请求
        reqwest({
            url: url,
            method: 'POST',
            type: 'json',
            headers: {
                isAjax: 'yes',
            },
            data: params,
        }).then(result => {
            if (result.errorCode === 0) {
                if (suc) {
                    suc(result);
                }
            } else {
                if (result.errorCode == 2000) {
                    window.location = BASE_URL + '/';
                } else if (result.errorCode == 4000) {
                    window.location = BASE_URL + '/logout'
                } else {
                    if (fail) {
                        fail(result);
                    } else {
                        message.error(result.errorMessage || result.errorMsg || '服务器开小差啦');
                    }
                }
            }

        }, function (err, msg) {
            message.error('服务器开小差啦');
        });
    }else{
        message.error('请检查您的网络是否连接');
    }
}
window.serviceRequestDept1 = function (url,params,suc,fail) {
    if(!!window.navigator.onLine){
        params.data = { ...params, isHq: 0 };
        // params.service = url;

        //异步请求
        reqwest({
            url: url,
            method: 'POST',
            type: 'json',
            headers: {
                isAjax: 'yes',
            },
            data: params,
        }).then(result => {
            if (result.errorCode == 0) {
                if (suc) {
                    suc(result);
                }
            } else {
                if (result.errorCode == 2000) {
                    window.location = BASE_URL + '/';
                } else if (result.errorCode == 4000) {
                    window.location = BASE_URL + '/logout'
                } else {
                    if (fail) {
                        fail(result);
                    } else {
                        message.error(result.errorMessage || '服务器开小差啦');
                    }
                }
            }

        }, function (err, msg) {
            message.error('服务器开小差啦');
        });
    }else{
        message.error('请检查您的网络是否连接');
    }
}

// To add to window
if (!window.Promise) {
    window.Promise = Promise;
}

if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function (predicate) {
        if (this === null) {
            throw new TypeError('Array.prototype.findIndex called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return i;
            }
        }
        return -1;
    };
}

if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
        'use strict';
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}

//jsonp跨域请求，仅支持get请求
window.JsonpRequest = function (url, suc, fail) {
    JsonP(url, {
        jsonpCallback: 'callback',
    })
        .then(function (response) {
            return response.json()
        }).then(function (json) {
            if (json.status == '1') {
                if (!!suc) {
                    suc();
                }
            } else {
                if (!!fail) {
                    fail();
                }
            }
            console.log('parsed json', json)
        }).catch(function (ex) {
            if (!!fail) {
                fail();
            }
            console.log('parsing failed', ex)
        })
}

window._ = function (...value) {
    console.info(...value);
}

/**
 * @description 导出接口
 * 
 * @param {string} path 请求路径
 * @param {object} param 请求参数
 */
window.excelExport = function (path, param) {
    param = qs.parse(param);
    let query = {
        isHq : 1,
        ...param,
        exceldown: true,
    }
    window.open(`${DOWNLOAD_EXCEL_URL}${path}?${qs.stringify(query)}`, '_blank');
}

window.generalSaasInterface = function(link, params, header, serviceSource={/*保留参数*/}, additionalParam={/*保留参数*/}) {
	return requestData(BASE_URL + link, {
		method: 'post',
		headers: {
			"Content-Type" : "application/x-www-form-urlencoded",
            ...header,
		},
		body: qs.stringify(params),
	});
}

/*
 * 生成长度为num个不重复的的数组
 * num 位数
 * from 范围最小值
 * to 范围最大值
 */
window.createRandom = function(num,from,to){
    var arr=[];
    var json={};
    while(arr.length<num)
    {
        //产生单个随机数
        var ranNum=Math.ceil(Math.random()*(to-from))+from;
        //通过判断json对象的索引值是否存在 来标记 是否重复
        if(!json[ranNum])
        {
            json[ranNum]=1;
            arr.push(ranNum);
        }

    }
    return arr;
}

/**
 * @description 兼容请求链接
 * @param string 链接
 */
window.compatibleProtocol = function (url) {
    if ((url.startsWith("http") || url.startsWith("https"))) {
        return url;
    } else {
        if (url.startsWith("//")) {
            return window.location.protocol + url;
        } else {
            return window.location.protocol + "//" + url;
        }
    }
}
