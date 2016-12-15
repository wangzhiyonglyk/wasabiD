/**
 * Created by wangzhiyong on 2016/12/12.
 * 从rctui框架中复制过来,加以改造
 */

'use strict';

let dom={
    tryParseInt:function(p) {
    if (!p) {
        return 0;
    }
    const pi = parseInt(p);
    return pi || 0;
},


    isDescendant :function  (parent, child) {
    let node = child.parentNode;

    while (node !== null) {
        if (node === parent) {
            return true;
        }
        node = node.parentNode;
    }

    return false;
},

    offset: function  (el) {
    const rect = el.getBoundingClientRect();
    return {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft
    };
},

    forceRedraw: function forceRedraw (el) {
    let originalDisplay = el.style.display;

    el.style.display = 'none';
    let oh = el.offsetHeight;
    el.style.display = originalDisplay;
    return oh;
},

    withoutTransition :function  (el, callback) {
    //turn off transition
    el.style.transition = 'none';

    callback();

    //force a redraw
    forceRedraw(el);

    //put the transition back
    el.style.transition = '';
},

    getOuterHeight :function  (el) {
    let height = el.clientHeight
        + this.tryParseInt(el.style.borderTopWidth)
        + this.tryParseInt(el.style.borderBottomWidth)
        + this.tryParseInt(el.style.marginTop)
        + this.tryParseInt(el.style.marginBottom);
    return height;
},

    getScrollTop: function  () {
    const dd = document.documentElement;
    let scrollTop = 0;
    if (dd && dd.scrollTop) {
        scrollTop = dd.scrollTop;
    } else if (document.body) {
        scrollTop = document.body.scrollTop;
    }
    return scrollTop;
},

    overView: function  (el, pad = 0) {
    let height = window.innerHeight || document.documentElement.clientHeight;
    let bottom = el.getBoundingClientRect().bottom + pad;
    return bottom > height;
},

    computedStyle: function  (el, attr) {
    var lineHeight;
    if (el.currentStyle) {
        lineHeight = el.currentStyle[attr]
    } else if (window.getComputedStyle) {
        lineHeight = window.getComputedStyle(el , null)[attr];
    }
    return lineHeight;
},

    getLineHeight: function  (origin) {
    let el = origin.cloneNode(true);
    let lineHeight;
    el.style.padding = 0;
    el.rows = 1;
    el.innerHTML = '&nbsp;'
    el.style.minHeight= 'inherit'
    origin.parentNode.appendChild(el);
    lineHeight = el.clientHeight;
    origin.parentNode.removeChild(el);

    return lineHeight;
}

};
module.exports =dom;