/**
 * 将组件中属性的转换的方法独立出来
 * date:2020-11-06
 * wangzhiyong
 */
import func from "./func";
import regs from "./regs.js";
let propsTran = {
    /**  
     * 格式化数据，checkbox ,radio,select ,picker,treepicker,tree,treegrid
     * @param {string|number} value 选择的值,处理勾选情况
     * @param {Array} realData 数据
     * @param {string } idOrValueField id或value对应的字段名
     * @param {string} textField  文本对应的字段名
     * @param {*} parentField 父节点对应字段名
     * @param {*} simpleData 是否是简单数据格式
     * @returns 
     */
    formatterData(type, value, data = [], idOrValueField = "value", textField = "text", parentField = "pId", simpleData = true) {
        if (!data) {
            return data;
        }
        let realData = func.clone(data);//复制,否则影响父节点，导致重复更新
        if (realData && realData instanceof Array && realData.length > 0) {
            for (let i = 0; i < realData.length; i++) {
                if (type == "tree" || type == "treepicker" || type == "treegrid") {
                    realData[i].id = realData[i].id || realData[i][idOrValueField];//追加这个属性
                }
                else {

                    realData[i].value = realData[i].value || realData[i][idOrValueField];//追加这个属性
                }

                realData[i].text = realData[i].text || realData[i][textField];//追加这个属性
                if (value && ("," + (value) + ",").indexOf("," + ((type == "tree" || type == "treepicker") ? realData[i].id : realData[i].value) + ",") > -1) {
                    realData[i].checked = true;//节点选中，专门用于树组件
                }
                else {
                    //不处理，不影响原因的
                }
                //如果有子节点的时候.tree,treepicker,picker
                if (realData[i].children && realData[i].children.length > 0) {
                    realData[i].children = propsTran.formatterData(type, value, realData[i].children, idOrValueField, textField, parentField, simpleData);
                }
            }
        }
        if ((type === "tree" || type === "treepicker" || type === "treegrid") && simpleData) {//格式化树型结构
            realData = func.toTreeData(realData, idOrValueField, parentField, textField);
        }
        return realData;
    },


    /**
   * * 设置下拉组件的文本值,用于赋值的时候
   * @param {*} value 
   * @param {*} data 
   */
    processText(value = "", data = []) {

        let text = [];//选中的文本值 
        if (data && data instanceof Array && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                if (("," + (value) + ",").indexOf("," + ((data[i].value + "") || (data[i].id + "")) + ",") > -1) {
                    text.push(data[i].text);
                }
                if (data[i].children && data[i].children.length > 0) {
                    let r = propsTran.processText(value, data[i].children);
                    text = [].concat(r, text);
                }
            }
        }
        return text || [];

    },
    /**
     * 全选,为treepicker设置
     * @param {*} value 
     * @param {*} data 
     */
    getTreePickerValueAll(data) {
        let values = [];
        let texts = [];
        if (data && data instanceof Array && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                values.push(data[i].id);
                texts.push(data[i].text);
                if (data[i].children && data[i].children.length > 0) {
                    let r = propsTran.getTreePickerValueAll(data[i].children);
                    values = [].concat(values, r.values);
                    texts = [].concat(texts, r.texts)
                }
            }
        }
        return {
            values: values,
            texts: texts
        };

    },
    /**
   * 时间范围组件
   * @param {*} props 
   */
    setDateRangeDefaultState(props) {
        //先设置默认值的，再判断用户是否有输入值
        let newDate = new Date();
        //设置第一日期的值
        let firstDate = regs.date.test(props.firstDate) ? props.firstDate : regs.datetime.test(props.firstDate) ? props.firstDate.split(" ")[0] : "";//给的第一个值
        let firstTime = props.type == "daterange" ? "" : props.firstTime || func.dateformat(newDate, "HH:mm:") + "00";
        //先设置默认值
        let first_year = newDate.getFullYear();
        let first_month = newDate.getMonth() + 1;

        let first_day = "";
        let first_rangeBegin = "";
        let first_rangeEnd = "";

        //格式化第一个值
        if (firstDate && firstDate.indexOf(" ") > -1 && regs.datetime.test(firstDate)) {//有时间
            firstDate = props.firstDate.split(" ")[0];
        }
        else if (regs.date.test(firstDate)) {//正规的日期格式

        }
        else {
            firstDate = "";

        }
        if (firstDate) {//第一个日期有值，设置
            first_year = firstDate.split("-")[0] * 1;
            first_month = firstDate.split("-")[1] * 1;
            first_day = firstDate.split("-")[2] * 1;
        }


        //设置第二日期的值
        let secondDate = props.secondDate;//给的第二日期值，字符串
        let secondTime = props.type == "daterange" ? "" : props.secondTime || func.dateformat(newDate, "HH:mm:") + "59";
        //先设置默认值
        let second_year = first_year; //默认与第一个同年
        let second_month;
        let second_day = null;
        let second_rangeBegin = null;
        let second_rangeEnd = null;
        second_month = parseInt(first_month) + 1;//加一个月
        if (second_month > 12) {
            second_year++;
            second_month = 1;
        }

        //格式化第二个值
        if (secondDate && secondDate.indexOf(" ") > -1 && regs.datetime.test(secondDate)) {//有时间
            secondDate = props.secondDate.split(" ")[0];
        }
        else if (secondDate && regs.date.test(secondDate)) {//正规的日期格式
        }
        else {
            secondDate = "";
        }
        if (secondDate) {//第二个输入了值
            if (secondDate.split("-")[0] == first_year && secondDate.split("-")[1] * 1 == first_month) {//第二个日期与第一日期在同一个月
                first_rangeEnd = secondDate.split("-")[2] * 1 > first_day ? secondDate.split("-")[2] * 1 : first_day;
                first_rangeBegin = first_day;

            }
            else if (secondDate.split("-")[0] < first_year && secondDate.split("-")[1] * 1 < first_month) {//第二个日期小于第一日期
                console.log("日期范围格式不正确");
            }
            else {//其他情况。tooo 小于的情况没有考虑，暂时不处理
                second_year = secondDate.split("-")[0] * 1;
                second_month = secondDate.split("-")[1] * 1;
                second_rangeEnd = second_day = secondDate.split("-")[2] * 1;
                second_rangeBegin = -1;//第二个的开始就是第一天
                //第一个日期的开始就是 选中，结束是最大的
                first_rangeBegin = first_day;
                first_rangeEnd = 32;
            }
        }
        else {//第二日期没有值
            first_rangeBegin = first_rangeEnd = first_day;
        }
        let result = {
            oldPropsValue: (props.firstDate || "") + (props.firstTime || "") + (props.secondDate || "") + (props.secondTime || ""),//保存旧值，用于更新
            first_year: first_year,
            first_month: first_month,
            first_day: first_day,
            first_rangeBegin: first_rangeBegin,
            first_rangeEnd: first_rangeEnd,
            firstTime: firstTime,
            second_year: second_year,
            second_month: second_month,
            second_day: second_day,
            second_rangeBegin: second_rangeBegin,
            second_rangeEnd: second_rangeEnd,
            secondTime: secondTime,
        }
        return result;
    },


    /**
     * 表格是否隐藏某行数据,toto,要优化 todo
     * @param {*} data 
     * @param {*} open 
     * @param {*} children 
     * @returns 
     */
    gridShowOrHideData(data, open, row) {
        data = func.clone(data);

        let foldids = [];
        let openids = [];
        let f = function (o, node) {
            if (node.children && node.children instanceof Array && node.children.length > 0) {
                //折叠
                for (let i = 0; i < node.children.length; i++) {
                    if (o === false) {
                        foldids.push(node.children[i].id);
                        if (node.children[i].children && node.children[i].children.length > 0) {
                            f(o, node.children[i]);
                        }
                    }
                    else {
                        openids.push(node.children[i].id);
                        if (node.children[i].children && node.children[i].children.length > 0) {
                            f(node.children[i].open, node.children[i]);
                        }
                    }


                }
            } else {

            }
        }
        f(open, row);
        foldids = "," + foldids.join(",") + ",";
        openids = "," + openids.join(",") + ",";

        if (data && data instanceof Array && data.length > 0) {

            for (let i = 0; i < data.length; i++) {
                if (openids.indexOf("," + data[i].id + ",") > -1) {
                    data[i].hide = false;
                }
                if (foldids.indexOf("," + data[i].id + ",") > -1) {
                    data[i].hide = true;
                }


            }
        }
        return data;
    },
    /**
     * 处理表单组件标签 统一宽度，方便对齐
     * @param {*} labelStyle  style样式
     * @param {*} maxWidth  最大宽度
     * @returns 
     */
    handlerLabelStyle(labelStyle, maxWidth) {
        labelStyle = func.clone(labelStyle) || {};
        labelStyle.width = labelStyle.width !==null && labelStyle.width !==undefined ? labelStyle.width : maxWidth;
        return labelStyle;
    },

 

  

}
export default propsTran;