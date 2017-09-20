/**
 * Created by wangzhiyong on 2016/12/12.
 * 从rctui复制，改造
 */
'use strict';

export function on (el, type, callback) {
    if(el.addEventListener) {
        el.addEventListener(type, callback);
    } else {
        el.attachEvent('on' + type, function() {
            callback.call(el);
        });
    }
}

export function off (el, type, callback) {
    if(el.removeEventListener) {
        el.removeEventListener(type, callback);
    } else {
        el.detachEvent('on' + type, callback);
    }
}

export function once (el, type, callback) {
    let typeArray = type.split(' ');
    let recursiveFunction = function(e){
        e.target.removeEventListener(e.type, recursiveFunction);
        return callback(e);
    };

    for (let i = typeArray.length - 1; i >= 0; i--) {
        on(el, typeArray[i], recursiveFunction);
    }
}
