/**
 * Created by wangzhiyong on 16/8/5.
 * desc 将验证独立出来

 */
let React = require("react");
let validation = require("../Lang/validation.js");
let regexp = require("../Lang/regs.js");
let Validate = {
    validate: function (value) {
        value = value ? value : this.state.value;
        let isvalidate = true;
        let helpTip = "";
          let valueArr =[];
        if (this.state.readonly) {//不能直接返回，防止上一次的验证效果还在，导致无法消除
        }
        else {//非只读
            if (this.state.validateState && this.state.validateState != "valid") {//处理于后台验证中,或者是验证失败
                isvalidate = false;
            }
            else {//没有后台验证，或者后台验证已经成功
                if (this.state.validateState && this.state.validateState != "valid") {//处理于后台验证中,或者是验证失败
                    isvalidate = false;
                }
                else {//没有后台验证，或者后台验证已经成功
                    if (value != null && value != undefined && value !== "") {//因为有可能输入0,注意一定要加双等号，用户输入了值，验证有效性
                        if (regexp.sql.test(value)) {//判断有效性
                            isvalidate = false;
                            helpTip = "输入非法";
                        }
                        else if (value.toString() == "NaN") {//多加一层判断，有可能用户计算错误导致输入了NaN
                            isvalidate = false;
                            helpTip = "非有效数字";
                        }
                        else if (this.props.regexp) {  //有自定义正则表达式
                            isvalidate = this.props.regexp.test(value);
                            helpTip = isvalidate ? "" : this.props.invalidTip ? this.props.invalidTip : validation["invalidTip"];
                        }
                        else {//没有正则表达式，则验证默认正则
                            if (regexp[this.props.type]) {//系统存在这个类型
                                if (typeof regexp[this.props.type] == "function") {
                                    isvalidate = regexp[this.props.type](value);
                                }
                                else {
                                    isvalidate = regexp[this.props.type].test(value);
                                }
                                helpTip = isvalidate ? "" : validation[this.props.type];
                            }
                            else {

                            }
                        }
                     
                        if (isvalidate) {//有效再验证
                            //判断大小，长度等
                            if (typeof this.state.min == "number") {
                                switch (this.props.type) {
                                    case "text":
                                        if (value.toString().length < this.state.min) {
                                            isvalidate = false;
                                            helpTip = "长度不能小于" + this.state.min;
                                        }
                                        break;
                                    case "password":
                                        if (value.toString().length < this.state.min) {
                                            isvalidate = false;
                                            helpTip = "长度不能小于" + this.state.min;
                                        }
                                        break;
                                    case "number":

                                        if (value < this.state.min) {
                                            isvalidate = false;
                                            helpTip = "不能小于" + this.state.min;
                                        }
                                        break;
                                    case "integer":
                                        if (value < this.state.min) {
                                            isvalidate = false;
                                            helpTip = "不能小于" + this.state.min;
                                        }
                                    case "checkbox":
                                         valueArr = value.toString().split(",");
                                        if (valueArr.length < this.state.min) {
                                            isvalidate = false;
                                            helpTip = "最少选择" + this.state.min.toString() + "项";
                                        }
                                        break;
                                    case "select":
                                         valueArr = value.toString().split(",");
                                        if (valueArr.length < this.state.min) {
                                            isvalidate = false;
                                            helpTip = "最少选择" + this.state.min.toString() + "项";
                                        }
                                        break;
                                }
                            }
                            if (isvalidate&&typeof this.state.max == "number") {
                                {
                                    switch (this.props.type) {
                                        case "text":
                                            if (value.toString().length > this.state.max) {
                                                isvalidate = false;
                                                helpTip = "长度不能大于" + this.state.max;
                                            }
                                            break;
                                        case "password":
                                            if (value.toString().length > this.state.max) {
                                                isvalidate = false;
                                                helpTip = "长度不能大于" + this.state.max;
                                            }
                                            break;
                                        case "number":
                                            if (value > this.state.max) {
                                                isvalidate = false;
                                                helpTip = "不能大于" + this.state.max;
                                            }
                                            break;
                                        case "integer":
                                            if (value > this.state.max) {
                                                isvalidate = false;
                                                helpTip = "不能大于" + this.state.max;
                                            }
                                            break;
                                        case "checkbox":
                                             valueArr = value.toString().split(",");
                                            if (valueArr.length > this.state.max) {
                                                isvalidate = false;
                                                helpTip = "最多选择" + this.state.max.toString() + "项";
                                            }
                                            break;
                                        case "select":
                                             valueArr = value.toString().split(",");
                                            if (valueArr.length > this.state.max) {
                                                isvalidate = false;
                                                helpTip = "最多选择" + this.state.max.toString() + "项";
                                            }
                                            break;
                                    }
                                }
                            }


                        }

                    }
                    else {//没有输入
                        if (this.state.required) {
                            //必填
                            isvalidate = false;//
                            helpTip = validation["required"];
                        }

                    }

                }
                
                //设置样式
                if (isvalidate) {
                    this.setState({
                        validateClass: "",
                        helpShow: "none",
                        helpTip: "",
                    })

                }
                else {

                    this.setState({
                        validateClass: " wasabi-has-error",
                        helpShow: "block",
                        helpTip: helpTip
                    });

                }

            }

        }


        //设置样式
        if (isvalidate) {
            this.setState({
                validateClass: "",
                helpShow: "none",
                helpTip: "",

            })

        }
        else {

            this.setState({
                validateClass: " wasabi-has-error",
                helpShow: "block",
                helpTip: helpTip
            });

        }
        return isvalidate;
    },
}
module.exports = Validate;