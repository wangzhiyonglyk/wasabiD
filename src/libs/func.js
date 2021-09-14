/**
 * Created by zhiyongwang on 2016-06-08.
 * 将独立于项目的公共函数分享出来
 *2020-11-06，重新规划
 2021-09-10添加新功能
 */

let func = {};


/**
 * 将每个单词的首字母转换为大写
 * @param {*} str 
 * @returns 
 */
func.titleize = function (str) {
    return str.toLowerCase().replace(/(?:^|\s)\w/g, function (c) {
        return c.toUpperCase();
    });
}

/**
 * 驼峰化
 * @param {*} str 
 * @returns 
 */
func.camelize = function (str) {
    return str.replace(/[-_\s]+(.)?/g, function (match, c) {
        return c ? c.toUpperCase() : '';
    });
}

/**
 *  中划线化
 * @param {*} str 
 * @returns 
 */
func.dasherize = function (str) {
    return str.replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
}
/**
 * 获取地址栏参数的值
 * @param {*} sArgName 参数名
 * @returns 
 */
func.GetArgsFromHref = function (sArgName = "", sHref) {
    sHref = sHref || window.location.href;
    let args = sHref.toString().split("?");
    let retval = "";
    if (args[0] == sHref) /*参数为空*/ {
        return retval;
        /*无需做任何处理*/
    }
    let str = args[1];
    if (str.indexOf("#") > -1) {//处理锚点的问题，有可能在前面有可能在后面
        str = str.split("#");
        str = str[0].indexOf("=") > -1 ? str[0] : str[1];

    }
    args = str.toString().split("&");
    for (let i = 0; i < args.length; i++) {
        str = args[i];
        let arg = str.toString().split("=");
        if (arg.length <= 1) continue;
        if (arg[0] == sArgName) retval = arg[1];
    }
    return retval;
}

/**
 * 判断浏览器类型
 * @returns 
 */
func.BrowserType = function () {
    let browserType = "";
    let userAgent = navigator.userAgent.toLowerCase(); //取得浏览器的userAgent字符串
    if (userAgent.indexOf("opera") > -1) {//判断是否Opera浏览器
        browserType = "Opera"
    }
    else if (userAgent.indexOf("opr") > -1) {//新版本是这个
        browserType = "Opera";
    }
    else if (userAgent.indexOf("firefox") > -1) {//判断是否Firefox浏览器
        browserType = "Firefox";
    }
    else if (userAgent.indexOf("chrome") > -1) {//先判断是否Chrome浏览器
        browserType = "Chrome";
    }
    else if (userAgent.indexOf("safari") > -1) {//判断是否Safari浏览器
        browserType = "Safari";
    }
    else if (/msie|trident/.test(userAgent)) {////判断是否IE浏览器
        browserType = func.IEType();
    }


    return browserType;
}
/**
 * 判断IE类型
 * @returns 
 */
func.IEType = function () {
    if (navigator.userAgent.indexOf("MSIE 6.") > -1) {
        return ("IE 6");
    }
    else if (navigator.userAgent.indexOf("MSIE 7.") > -1) {
        return ("IE 7");
    }
    else if (navigator.userAgent.indexOf("MSIE 8.") > -1) {
        return ("IE 8");
    }
    else if (navigator.userAgent.indexOf("MSIE 9.") > -1) {
        return ("IE 9");
    }
    else if (navigator.userAgent.indexOf("MSIE 10.") > -1) {
        return ("IE 10");
    }
    else if (navigator.userAgent.toLowerCase().indexOf("trident") > -1) {
        return ("IE 11");
    }
}

/**
 * 将数字转为英文表达格式
 * @param {*} num 数字
 * @returns 
 */
func.dealNumToEnglishFormat = function (num) {
    if (isNaN(num)) {
        return num;
    }

    let number = num.toString();
    return number.split('').reverse().join('').replace(/(.{3})/g, '$1,').split('').reverse().join('').replace(/^,/, "");
}

/**
 * 日期格式化为字符串
 * @param {DAte} date 日期
 * @param {string} format 
        * 对Date的扩展，将 Date 转化为指定格式的String
        * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
        * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
        * eg:
        * dateformat(new Date(),'yyyy-MM-dd') ==> 2014-03-02
        * dateformat(new Date(),'yyyy-MM-dd hh:mm') ==> 2014-03-02 05:04
        * dateformat(new Date(),'yyyy-MM-dd HH:mm') ==> 2014-03-02 17:04
        * dateformat(new Date(),'yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
        * dateformat(new Date(),'yyyy-MM-dd E HH:mm:ss') ==> 2009-03-10 二 20:09:04
        * dateformat(new Date(),'yyyy-MM-dd EE hh:mm:ss') ==> 2009-03-10 周二 08:09:04
        * dateformat(new Date(),'yyyy-MM-dd EEE hh:mm:ss') ==> 2009-03-10 星期二 08:09:04
        * dateformat(new Date(),'yyyy-M-d h:m:s.S') ==> 2006-7-2 8:9:4.18
 * @returns 
 */
func.dateformat = function (date = new Date(), format = 'yyyy-MM-dd HH:mm:ss') {
    if (!date) return;
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": (date.getHours() % 12 == 0 ? 12 : date.getHours() % 12), //小时
        "H+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    var week = {
        "0": "\u65e5",
        "1": "\u4e00",
        "2": "\u4e8c",
        "3": "\u4e09",
        "4": "\u56db",
        "5": "\u4e94",
        "6": "\u516d"
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    if (/(E+)/.test(format)) {
        format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[date.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return format;
}

/**
 * 字符转日期
 * @param {*} strDate 日期字符
 * @returns 
 */
func.stringToDate = function (strDate) {
    /// <summary>
    /// 字符转日期
    /// </summary>
    /// <param name="strDate" type="string">日期字符格式</param>
    let date = new Date(Date.parse(strDate.replace(/-/g, "/"))); //转换成Date();
    return date;
}

/**
 * cookie操作
 */
func.cookies = {
    /// <summary>
    /// cookies设置
    /// </summary>
    set: function (key, val) {
        let Days = 7;
        let exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = key + "=" + val + ";path=/;expires=" + exp.toGMTString();
    },
    get: function (key) {
        let arr, reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return arr[2];
        else
            return null;
    },
    del: function (key) {
        let exp = new Date();
        exp.setTime(exp.getTime() - 1);
        let cval = this.get(key);
        if (cval != null)
            document.cookie = key + "=" + cval + ";expires=" + exp.toGMTString();
    }
}

/**
 * 根据字符计算宽度
 * @param {*} str 字符
 */
func.charWidth = function (str = "") {
    let width = 0;
    try {
        let strArr = str.split("");

        for (let i = 0; i < strArr.length; i++) {
            let reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
            if (reg.test(strArr[i])) {
                width += 20;//汉字20个像素
            }
            else {
                width += 10;
            }
        }
    } catch (e) {

    }

    return width;
}


/**
 * 对象的复制
 * @param {*} obj 源对象
 * @returns 
 */
func.clone = function (obj) {
    let o;
    switch (typeof obj) {
        case 'undefined': break;
        case 'string': o = obj + ''; break;
        case 'number': o = obj - 0; break;
        case 'boolean': o = obj; break;
        case "function": o = obj; break;//todo 
        case 'object':
            if (obj === null) {
                o = null;
            } else {
                if (obj instanceof Array) {
                    o = [];
                    //o= obj.slice(0)， 注意了这里不能直接使用这个复制，如果数组中的元素为对象，复制是不成功的
                    for (let i = 0; i < obj.length; i++) {
                        o.push(func.clone(obj[i]));
                    }
                } else if (obj instanceof Date) {//对日期的复制
                    o = new Date(obj.valueOf())
                }
                else if (obj instanceof Map) {
                    o = new Map(obj);
                }

                else {//其他对象
                    o = {};
                    for (let k in obj) {
                        o[k] = func.clone(obj[k]);
                    }
                }
            }
            break;
        default:
            o = obj;
            break;
    }
    return o;
}
//获取真正的数据源
func.getSource = function (data, source = "data") {
    /// <summary>
    /// 获取真正的数据源
    /// </summary>
    /// <param name="Data" type="object">Data</param>
    /// <param name="source" type="string">source</param>
    let sourceArr = new Array();
    let returnData = data;

    if (source.indexOf(".") > -1) {
        sourceArr = source.split(".");
    }
    else {
        sourceArr.push(source);
    }
    let i = 0;
    try {
        while (i < sourceArr.length) {
            returnData = returnData[sourceArr[i]];
            if (returnData == null) {
                return null;//直接返回
            }
            i++;

        }
    }
    catch (e) {
        return null;
    }

    return returnData;
}
//判断是否空对象
func.isEmptyObject = function (obj) {
    let isempty = true;
    if (typeof obj === "object") {
        for (let o in obj) {
            isempty = false;
        }
    }
    return isempty;

}
func.download = function (url, title, extend = ".xlsx") {

    if (typeof url == 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url); // 创建blob地址
    }
    else {
        extend = url.substr(url.lastIndexOf("."));
    }
    title = title || func.dateformat(new Date(), "yyyy-MM-dd HH:mm:ss");
    let downloadA = document.createElement("a");
    downloadA.href = url;
    downloadA.download = title + extend;
    downloadA.click();
    window.URL.revokeObjectURL(downloadA.href);//释放
}

/**
 * 生成uuid
 */
func.uuid = function () {
    let s = [];
    let hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    let uuid = s.join("");
    return uuid;
}

/**
 * 判断两个对象是否完全相同
 * @param {*} objA 
 * @param {*} objB  
 * @returns 
 */
func.diff = function (objA = null, objB = null) {//
    if (objA === objB) {
        return false;
    }
    if (objA && objB) {
        if (typeof objA !== typeof objB) {
            return true;
        }
        if (typeof objA !== "object" && typeof objA !== "function") {
            return objA !== objB;
        }
        if (typeof objA === "object") {
            //先拿所有的属性
            let oldProps = Object.getOwnPropertyNames(objA);
            let newProps = Object.getOwnPropertyNames(objB);
            if (oldProps.length !== newProps.length) {
                return true;//不相同
            }
            for (let i = 0; i < oldProps.length; i++) {
                let propName = oldProps[i];//属性名
                //值
                let propA = objA[propName]
                let propB = objB[propName]
                if (func.diff(propA, propB)) {
                    return true;
                }

            }
        }
    }
    return func.diffOrder(objA, objB)
}

/**
 * 判断两个对象是否完全相同并顺序一致
 * @param {*} objA 
 * @param {*} objB 
 */
func.diffOrder = function (objA, objB) {

    try {
        return JSON.stringify(objA) !== JSON.stringify(objB);
    }
    catch (e) {

    }
    return true;

}

/**
 * component Mixins实现
 * @param {object} component 组件
 * @param {Array} mixinClass 
 */
func.componentMixins = function (component, mixinClass = []) {

    try {
        mixinClass.forEach(baseCtor => {
            Object.getOwnPropertyNames(baseCtor).forEach(name => {

                if (typeof baseCtor[name] == "function") {
                    component.prototype[name] = baseCtor[name];
                }
            });
        });
    } catch (e) {

    }

    return component;
}

/**
 * 将二维数据转树型结构
 * @param {Array} data 数据
 * @param {string } idField 节点key
 * @param {string } parentField 父节点key
 * @param {string } textField 文本key
 */
func.toTreeData = function (data, idField = "id", parentField = "pId", textField = "text") {
    data = func.clone(data);//复制一份
    let pos = {};
    let tree = [];//最终数据
    let count = 0;//
    let pId = "";//一级父节点pid值
    let ids = "";//所有id值
    for (let i = 0; i < data.length; i++) {
        ids += "," + data[i][idField] + ","
    }
    for (let i = 0; i < data.length; i++) {
        if (ids.indexOf("," + data[i][parentField] + ",") <= -1) {//属于一级节点的pid值
            pId += "," + data[i][parentField] + ",";
        }
    }
    let index = 0;
    while (data.length !== 0 && count < 200000) {
        count++;
        if (pId.indexOf("," + data[index][parentField] + ",") > -1 || !data[index][parentField]) {
            //一级节点
            let item = {
                ...data[index],
                id: data[index][idField],
                pId: data[index][parentField],
                text: data[index][textField],
                children: []

            }
            tree.push(item);
            pos[data[index][idField]] = [tree.length - 1];//节点路径
            item._path = [tree.length - 1]//保存路径,
            //格式化子节点
            item.children = func.formatTreeDataChildren(data[index].children, item.id, item._path, idField, parentField, textField);
            data.splice(index, 1);
            index--;
        } else {
            let posArr = pos[data[index][parentField]];//拿出父节点的路径
            if (posArr) {
                let obj = tree[posArr[0]];//找到在树中的位置
                for (let j = 1; j < posArr.length; j++) {
                    obj = obj.children[posArr[j]];
                }
                let item = {
                    ...data[index],
                    id: data[index][idField],
                    pId: data[index][parentField],
                    text: data[index][textField],
                    children: data[index].children || [],
                }
                obj.children.push(item);
                pos[data[index][idField]] = posArr.concat([obj.children.length - 1]);
                item._path = pos[data[index][idField]];//保存路径
                //格式化子节点
                item.children = func.formatTreeDataChildren(data[index].children, item.id, item._path, idField, parentField, textField);
                data.splice(index, 1);
                index--;
            }
        }
        index++;
        if (index > data.length - 1) {
            index = 0;
        }
    }
    if (data.length > 0) {
        console.error("数据格式不正确，或者是数据量过大，请使用异步请求");
    }
    return tree;

}
/**
 * 如果树节点本身包含了子节点，格式化节点
 * @param {*} node 
 * @param {*} path 
 */
func.formatTreeDataChildren = function (children, pId, path, idField = "id", parentField = "pId", textField = "text") {
    if (children && children instanceof Array && children.length > 0) {
        for (let i = 0; i < children.length; i++) {
            let newPath = [...path, i];
            let item = {
                ...children[i],
                id: children[i][idField],
                pId: pId,
                text: children[i][textField],
                _path: newPath,
                children: func.formatTreeDataChildren(children[i].children, children[i][idField], newPath, idField, parentField, textField)
            }
            children[i] = item;
        }
        return children;
    }
    return [];


}
/**
 * 找到父节点
 * @param {*} data 
 * @param {*} pId 
 */
func.treeFindParent = function (data, pId) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].id === pId) {
            return data[i];

        }
        if (data[i].children && data[i].children.length > 0) {
            let findNode = func.treeFindParent(data[i].children, pId);
            if (findNode) {
                return findNode;
            }
        }
    }
    return null;
}

/**
 * 找到所有祖先节点
 * @param {*} data 
 * @param {*} pId 
 */
func.treeFindALLParents = function (data, pId) {
    let parents = [];
    let parent = func.treeFindParent(data, pId);
    let count = 0;;//防止死循环
    while (parent && count < 1000) {
        count++;
        parents.push(parent);
        parent = func.treeFindParent(data, parent.pId);

    }
    return parents;
}

/**
 * 深度合并
 * @param {*} targetObj 目标对象
 * @param {*} sourceObj 源对象
 * @returns 
 */
func.deepMerge = function (targetObj, sourceObj) {
    for (var key in sourceObj) {
        targetObj[key].toString() === "[object Object]" ?
            func.deepMerge(targetObj[key], sourceObj[key]) : targetObj[key] = sourceObj[key];
    }
    return targetObj;
}
/**
 * 数组对象去重合并
 * @param {*} arr1 数组1
 * @param {*} arr2 数组2
 * @param {*} key key值
 * @returns 
 */
func.arrayNodupMerge = function (arr1 = [], arr2 = [], key = "id") {
    let arr = [].concat(arr1, arr2);
    let result = [];
    let obj = {};
    for (var i = 0; i < arr.length; i++) {
        if (!obj[arr[i][key]]) {
            result.push(arr[i]);
            obj[arr[i][key]] = true;
        }
    }
    return result;
}

/**
 * create by wangzhiyong
 * date:2021-04-22
 * 日期扩展
 */
/**
   * 两个日期，相隔多少天
   * @param {Date} startDate 开始日期
   * @param {Date} endDate 结束日期
   */
func.getDateDiffDay = function (startDate, endDate) {
    try {
        return (startDate * 1 - endDate * 1) / 60 / 60 / 1000 / 24;
    }
    catch (e) {
        return NaN;
    }

}
/**
 * 所在月的第一天
 * @param {Date} date 
 * @returns 
 */
func.getFirstDateInMonth = function (date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}
/**
 * 所在月的最后一天
 * @param {Date} date 
 * @returns 
 */
func.getLastDateInMonth = function (date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
/**
 * 求所在季度的第一天
 * @param {Date} date 
 */
func.getFirstDateInQuarter = function (date) {
    return new Date(date.getFullYear(), ~~(date.getMonth() / 3) * 3, 1);
}
/**
* 求所在季度的最后一天
* @param {Date} date 
*/
func.getLastDateInQuarter = function (date) {
    return new Date(date.getFullYear(), ~~(date.getMonth() / 3) * 3 + 3, 0);
}
/**
 * 判断是否为闰年
 * @param {Date} date 
 * @returns 
 */
func.isLeapYear = function (date) {
    return new Date(date.getFullYear(), 2, 0).getDate() === 29;

}
/**
 * /**
 * 取得当前月份的天数
 * @param {Date} date 
 * @returns 
 */
func.getDaysInMonth = function (date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}
/**
 * 取得当前第一天是星期几
 * @returns 
 */
func.getFirstDayWeek = function (date) {
    //
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
}
/**
* 取得几个年后的日期
* @param {*} date 日期
* @param {*} n 年数量
* @returns 
*/
func.getNextYear = function (date, n = 1) {
    let newDate = func.clone(date);
    newDate.setYear(newDate.getFullYear() + n);
    return newDate;
}
/**
 * 取得几个月后的日期
 * @param {*} date 日期
 * @param {*} n 月数量
 * @returns 
 */
func.getNextMonth = function (date, n = 1) {
    let newDate = func.clone(date);
    newDate.setMonth(newDate.getMonth() + n);
    return newDate;
}
/**
 * 取得几天后的日期
 * @param {*} date 日期
 * @param {*} n 天数量
 */
func.getNextDay = function (date, n = 1) {
    let newDate = func.clone(date);
    newDate.setDate(newDate.getDate() + n);
    return newDate;
}
/**
* 取得几小时后的日期
* @param {*} date 日期
* @param {*} n 小时量
*/
func.getNextHour = function (date, n = 1) {
    let newDate = func.clone(date);
    newDate.setHours(newDate.getHours() + n);
    return newDate;
}


import base64 from "./base64.js";
func.base64 = base64;
import md5 from "./md5.js";
func.md5 = md5;
export default func;