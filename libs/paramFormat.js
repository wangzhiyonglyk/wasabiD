/**
 * Created by wangzhiyong on 16/10/5.
 */
//将参数模型中数组转换为对象

//格式化参数
var paramFormat=function(data) {
    //将参数中的数组转为后台可识别的格式

    if(!data)
    {
        return data;
    }
    else if(typeof data ==="string")
    {
        return data;
    }
    else if(data.constructor===FormData) {//参数为FormData,直接返回
        return data;

    }
    else if(data instanceof  Array)
    {
        throw new Error("参数必须是字符,空值,对象,FormData,不可以为数组");
        return null;
    }

    data =arrayFormat(data);//将参数模型中数组转换为对象,再格式式参数
    var arr = [];
    for (var name in data) {
        arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    }
    if(arr.length>0) {
        return arr.join("&");
    }
    else {
        return null;
    }

    function arrayFormat(data) {
        var MvcParameterAdaptive = {};
        //验证是否为数组
        MvcParameterAdaptive.isArray = Function.isArray || function (o) {
                return typeof o === "object" &&
                    Object.prototype.toString.call(o) === "[object Array]";
            };

        //将数组转换为对象
        MvcParameterAdaptive.convertArrayToObject = function (/*数组名*/arrName, /*待转换的数组*/array, /*转换后存放的对象，不用输入*/saveOjb) {
            var obj = saveOjb || {};

            function func(name, arr) {
                for (var i in arr) {
                    if (!MvcParameterAdaptive.isArray(arr[i]) && typeof arr[i] === "object") {
                        for (var j in arr[i]) {
                            if (MvcParameterAdaptive.isArray(arr[i][j])) {
                                func(name + "[" + i + "]." + j, arr[i][j]);
                            } else if (typeof arr[i][j] === "object") {
                                MvcParameterAdaptive.convertObject(name + "[" + i + "]." + j + ".", arr[i][j], obj);
                            } else {
                                obj[name + "[" + i + "]." + j] = arr[i][j];
                            }
                        }
                    } else {
                        obj[name + "[" + i + "]"] = arr[i];
                    }
                }
            }

            func(arrName, array);

            return obj;
        };

        //转换对象
        MvcParameterAdaptive.convertObject = function (/*对象名*/objName, /*待转换的对象*/turnObj, /*转换后存放的对象，不用输入*/saveOjb) {
            var obj = saveOjb || {};

            function func(name, tobj) {
                for (var i in tobj) {
                    if (MvcParameterAdaptive.isArray(tobj[i])) {
                        MvcParameterAdaptive.convertArrayToObject(i, tobj[i], obj);
                    } else if (typeof tobj[i] === "object") {
                        func(name + i + ".", tobj[i]);
                    } else {
                        obj[name + i] = tobj[i];
                    }
                }
            }

            func(objName, turnObj);
            return obj;
        };


        var arrName = "";//参数名

        if (typeof data !== "object") throw new Error("请传入json对象");
        if (MvcParameterAdaptive.isArray(data) && !arrName) throw new Error("必须是对象,如果是数组请使用对象包裹！");

        if (MvcParameterAdaptive.isArray(data)) {
            return MvcParameterAdaptive.convertArrayToObject(arrName, data);
        }
        return MvcParameterAdaptive.convertObject("", data);
    }
}


module .exports=paramFormat;