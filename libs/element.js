/**
 * Created by wangzhiyong on 2016/11/29.
 * 增加一个对元素的操作api
 * 获取位置,高度,宽度,可以使用getBoundingClientRect,暂时先保留下面两个方法
 */
let element= {
    //获取网页元素的相对浏览器的左距离
    getElementViewLeft: function (element) {
        /// <summary>
        /// 获取网页元素的相对浏览器的左距离
        /// </summary>
        /// <param name="element" type="object">元素</param>
        var actualLeft = element.offsetLeft;
        var current = element.offsetParent;
        while (current !== null) {
            actualLeft += current.offsetLeft;
            current = current.offsetParent;
        }
        if (document.compatMode == "BackCompat") {
            var elementScrollLeft = document.body.scrollLeft;
        } else {
            var elementScrollLeft = document.documentElement.scrollLeft;
        }
        return actualLeft - elementScrollLeft;
    },
    //获取网页元素的相对浏览器的上距离
    getElementViewTop: function (element) {
        /// <summary>
        /// 获取网页元素的相对浏览器的上距离
        /// </summary>
        /// <param name="element" type="object">元素</param>
        var actualTop = element.offsetTop;
        var current = element.offsetParent;
        while (current !== null) {
            actualTop += current.offsetTop;
            current = current.offsetParent;
        }
        if (document.compatMode == "BackCompat") {
            var elementScrollTop = document.body.scrollTop;
        } else {
            var elementScrollTop = document.documentElement.scrollTop;
        }
        return actualTop - elementScrollTop;
    }

}
module .exports=element;