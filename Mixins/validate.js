/**
 * Created by wangzhiyong on 16/8/5.
 * desc 将验证独立出来

 */
let React=require("react");
var validation=require("../Base/Lang/validation.js");
var regexp=require("../Base/Lang/regs.js");
let Validate={
    validate:function(value) {
        if(value==null||value==undefined)
        {
            value=this.state.value;
        }

        var isvalidate=true;
        var readonly=this.state.readonly;
        var required=this.state.required;
        var helpTip="";
        if(readonly)
        {//不能直接返回，防止上一次的验证效果还在，导致无法消除
        }
        else {
            //非只读

            if (value!=null&&value!=undefined && value !== "") {//注意一定要加双等号，用户输入了值，验证有效性
                if (this.props.regexp && this.props.regexp !== "") {  //有正则表达式

                    isvalidate = this.props.regexp.test(value);
                    if (!isvalidate) {

                        if (!this.props.invalidTip && this.props.invalidTip !== "") {//用户自定义错误提示信息
                            helpTip = this.props.invalidTip;
                        }
                        else {
                            helpTip = validation["invalidTip"];
                        }
                    }
                    else {
                    }
                }
                else {
                    //没有正则表达式，则验证默认正则

                    if (regexp[this.props.type]) {

                        if(typeof regexp[this.props.type] =="function")
                        {
                            isvalidate=regexp[this.props.type](value);
                        }
                        else
                        {
                            isvalidate = regexp[this.props.type].test(value);
                        }


                        if (!isvalidate) {
                            helpTip = validation[this.props.type];
                        }
                    }
                    else {

                    }
                }

                //判断大小，长度等
                if (this.state.min!=null&&this.state.min!=undefined) {
                    switch (this.props.type) {
                        case "text":
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
                                var valueArr=value.toString().split(",");
                                if(valueArr.length<this.state.min)
                                {
                                    isvalidate=false;
                                    helpTip="最少选择"+this.state.min.toString()+"项";
                                }
                            break;
                        case "select":
                            var valueArr=value.toString().split(",");
                            if(valueArr.length<this.state.min)
                            {
                                isvalidate=false;
                                helpTip="最少选择"+this.state.min.toString()+"项";
                            }
                            break;
                    }
                }
                if (this.state.max!=null&&this.state.max!=undefined) {
                    switch (this.props.type) {
                        case "text":
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
                            var valueArr=value.toString().split(",");
                            if(valueArr.length>this.state.max)
                            {
                                isvalidate=false;
                                helpTip="最多选择"+this.state.max.toString()+"项";
                            }
                            break;
                        case "select":
                            var valueArr=value.toString().split(",");
                            if(valueArr.length>this.state.max)
                            {
                                isvalidate=false;
                                helpTip="最多选择"+this.state.max.toString()+"项";
                            }
                            break;
                    }
                }
            }
            else {//输入没有输入
                if (required) {
                    //必填
                    isvalidate = false;//
                    helpTip = validation["required"];
                } else {
                    //认为验证有效
                }

            }
        }


        //设置样式
        if(isvalidate) {
            this.setState({
                validateClass: "",
                helpShow:"none",
                helpTip:"",

            })

        }
        else {

            this.setState({
                validateClass: " wasabi-has-error",
                helpShow:"block",
                helpTip:helpTip
            });

        }
        return isvalidate;
    },
}
module .exports=Validate;