/**
 * 将组件中属性的转换的方法独立出来
 * date:2020-11-06
 * wangzhiyong
 */
import func from "./func";
import regs from "./regs.js";
let propsTran = {
    /**
    * * 对数据进行预处理， 方便后期操作 
       * date:2020-11-06 edit 2022-10-27 重写
       * 王志勇
    * @param {*} data 数据
    * @param {*} pId 父节点
    * @param {*} path 初始化路径
    * @param {*} idField id字段
    * @param {*} parentField 父节点字段
    * @param {*} textField 文本字段
    * @param {*} childrenField 子节点字段
    * @param {*} isSimpleData 是否简单数据
    * @returns 
    */
      preprocess(data = [], pId = "", path = [], idField = "id", parentField = "pId", textField = "text", childrenField = "children", isSimpleData=false) {
        let result=[];
        if (Array.isArray(data)) {
            data = isSimpleData ? func.toTreeData(data, idField, parentField, textField) : data;
             result= data.map((item, index) => {
                 item.id=item[idField];
                 item.pId=pId;
                 item._path=[...path, index];
                 item.text=item[textField]
                 item.children=(Array.isArray(item[childrenField])&&item[childrenField].length>0)? propsTran.preprocess(item[childrenField], item[idField], [...path, index], idField, parentField, textField, childrenField,false):[];
                return item;
            })
        }
        return result;
    },
    /**
     * 预处理某个节点
     * @param {*} node 节点
      * @param {*} idField id字段
    * @param {*} parentField 父节点字段
    * @param {*} textField 文本字段
    * @param {*} childrenField 子节点字段
     */
    preprocessNode(node,idField = "id", parentField = "pId", textField = "text", childrenField = "children")
    {
        node.id=node[idField];
        node.pId=node[parentField];
        node.text=node[textField]
        node.children=(Array.isArray(node[childrenField])&&node[childrenField].length>0)? propsTran.preprocess(node[childrenField], node[idField], [...node._path], idField, parentField, textField, childrenField,false):[];
        return node;
    },
/**
 * 对表单数据进行预处理，方便后期操作 
 * @param {*} data 
 * @param {*} valueField 
 * @param {*} textField 
 * @returns 
 */
    preprocessForm(data = [],valueField="value",textField="text") {
        if (Array.isArray(data)) {
          return data.map((item, index) => {
                return {
                    ...item,//保留原有字段
                    //附加字段，方便后期操作
                    value: item[valueField],            
                    text: item[textField],
                };
            })
        }
        return [];
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
        labelStyle.width = labelStyle.width !== null && labelStyle.width !== undefined ? labelStyle.width : maxWidth;
        return labelStyle;
    },





}
export default propsTran;