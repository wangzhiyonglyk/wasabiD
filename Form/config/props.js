/**
 * create by wangzhiyong
 * date:2017-08-14
 * 将表单配置独立
 */
import React from "react";
export default {
      name:React.PropTypes.string.isRequired,//字段名
        label:React.PropTypes.oneOfType([React.PropTypes.number,React.PropTypes.string,React.PropTypes.element,React.PropTypes.node]),//字段文字说明属性
        title:React.PropTypes.string,//提示信息
        width:React.PropTypes.number,//宽度
        height:React.PropTypes.number,//高度
        value:React.PropTypes.oneOfType([React.PropTypes.number,React.PropTypes.string]),//默认值,
        text:React.PropTypes.oneOfType([React.PropTypes.number,React.PropTypes.string]),//默认文本值
        placeholder:React.PropTypes.oneOfType([React.PropTypes.number,React.PropTypes.string]),//输入框预留文字
        readonly:React.PropTypes.bool,//是否只读
        required:React.PropTypes.bool,//是否必填
        hide:React.PropTypes.bool,//是否隐藏
        regexp:React.PropTypes.string,//正则表达式
        invalidTip:React.PropTypes.string,//无效时的提示字符
        style:React.PropTypes.object,//自定义style
        controlStyle:React.PropTypes.object,//自定义外层样式
        className:React.PropTypes.string,//自定义class
    
        //其他属性 text
        rows:React.PropTypes.number,//textarea
        cols:React.PropTypes.number,//textarea
        min:React.PropTypes.number,//最小值,最小长度,最少选项
        max:React.PropTypes.number,//最大值,最大长度,最多选项
        onClick:React.PropTypes.func,//单击事件
        onChange:React.PropTypes.func,//值改变事件

        //其他属性 combobox
        multiple:React.PropTypes.bool,//是否允许多选
        valueField: React.PropTypes.string,//数据字段值名称
        textField:React.PropTypes.string,//数据字段文本名称
        url:React.PropTypes.string,//ajax的后台地址
        params:React.PropTypes.object,//查询参数
        dataSource:React.PropTypes.string,//ajax的返回的数据源中哪个属性作为数据源,为null时直接后台返回的数据作为数据源
        data:React.PropTypes.array,//自定义数据源
        extraData:React.PropTypes.array,//额外的数据,对url有效
        onSelect: React.PropTypes.func,//选中后的事件，回传，value,与text,data

        //其他属性 picker
        secondUrl:React.PropTypes.string,//第二层节点的后台地址,
        secondParams:React.PropTypes.object,//第二层节点的后台参数
        secondParamsKey:React.PropTypes.string,//第二层节点的后台参数中传递一级节点value值的参数名称
        thirdUrl:React.PropTypes.string,//第三层节点的后台地址，
        thirdParams:React.PropTypes.object,//第三层节点的后台参数
        thirdParamsKey:React.PropTypes.string,//第三层节点的后台参数中传递二级节点value值的参数名称
        hotTitle:React.PropTypes.string,//热门选择标题
        hotData:React.PropTypes.array,//热门选择的数据
}