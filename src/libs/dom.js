/**
 * Created by wangzhiyong on 2016/12/12.
 * 从rctui框架中复制过来,加以改造
 * edit date:2021-04-26
 */

'use strict';

let dom = {
    /**
     * 是否为子孙节点
     * @param {*} parent 
     * @param {*} child 
     * @returns 
     */
    isDescendant: function (parent, child) {
        let node = child.parentNode;
        while (node !== null) {
            if (node === parent) {
                return true;
            }
            node = node.parentNode;
        }

        return false;
    },
    /**
     * 找到某个css类的祖先节点
     */
    ancestorByClass(node, className) {
        while (node !== null) {
            if (node.className && node.className.indexOf(className) > -1) {
                return node;
            }
            node = node.parentNode;
        }

        return null;
    },
    /**
     * 找到某个css类的子节点
     * @param {*} node 
     * @param {*} className 
     * @returns 
     */
    descendantByClass(node, className) {
        return node && node.querySelector("." + className);
    },

    /**
     * 元素是不是不可见
     * @param {*} el 元素
     * @param {*} parent 父节点，默认window
     * @param {*} pad 多余间距
     * @returns 
     */
    overView: function (el, parent = null, pad = 0) {
        let height = parent ? parent.getBoundingClientRect().bottom : window.innerHeight || document.documentElement.clientHeight;
        let bottom = el.getBoundingClientRect().bottom + pad;
        return bottom > height;
    },

   
    /**
     * 获取元素样式
     * @param {*} el 元素节点
     * @param {*} attr css样式属性，非驼峰写法
     * @returns 
     */
    computedStyle: function (el, attr) {
        let attrValue;
        if (el.currentStyle) {
            attrValue = el.currentStyle[attr]
        } else if (window.getComputedStyle) {
            attrValue = window.getComputedStyle(el, null)[attr];
        }
        return attrValue;
    },

    /**
     * 找到有滚动条的祖先节点
     * @param {*} el 
     * @param {*} pad 多余间距
     */
    scrollParent(el) {
        let node = el.parentNode;

        while (node !== null && node != document.documentElement) {
            let overflow = this.computedStyle(node, "overflow");
            if (node.scrollHeight > node.offsetHeight && overflow != "visible" && overflow != "hidden") {
                return node;
            } else {
                node = node.parentNode;
            }
        }
        return null;
    },
    /**
     * 让被滚动条挡住的节点可见
     * @param {*} el 
     * @param {*} pad 
     */
    scrollVisible(el, pad = 0) {
        let scrollParent = dom.scrollParent(el);
        if (el && scrollParent && dom.overView(el, scrollParent, pad)) { //判断是否不可见
            if (scrollParent && scrollParent != window) {
                scrollParent.scrollTop = (scrollParent.scrollHeight - scrollParent.offsetHeight)
            }
        }
    },

    //全屏
    fullScreen() {
        var element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        }
    },

    //退出全屏 
    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }

};
export default dom;