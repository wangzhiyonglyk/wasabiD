/**
 * create by wangzhiyong
 * date:2017-08-14
 * 将表单配置独立
 */
import React from "react";
import PropTypes from "prop-types";
export default {
      name:PropTypes.string,//字段名
        label:PropTypes.oneOfType([PropTypes.number,PropTypes.string,PropTypes.element,PropTypes.node]),//字段文字说明属性
        title:PropTypes.string,//提示信息
        
        value:PropTypes.oneOfType([PropTypes.number,PropTypes.string]),//默认值,
        text:PropTypes.oneOfType([PropTypes.number,PropTypes.string]),//默认文本值
        placeholder:PropTypes.oneOfType([PropTypes.number,PropTypes.string]),//输入框预留文字
        readonly:PropTypes.bool,//是否只读
        required:PropTypes.bool,//是否必填
        hide:PropTypes.bool,//是否隐藏
        regexp:PropTypes.string,//正则表达式
        invalidTip:PropTypes.string,//无效时的提示字符
        style:PropTypes.object,//自定义style
        controlStyle:PropTypes.object,//自定义外层样式
        className:PropTypes.string,//自定义class
    
        //其他属性 text
        rows:PropTypes.number,//textarea
        cols:PropTypes.number,//textarea
        min:PropTypes.number,//最小值,最小长度,最少选项
        max:PropTypes.number,//最大值,最大长度,最多选项
        onClick:PropTypes.func,//单击事件
        onChange:PropTypes.func,//值改变事件

        //其他属性 combobox
        multiple:PropTypes.bool,//是否允许多选
        valueField: PropTypes.string,//数据字段值名称
        textField:PropTypes.string,//数据字段文本名称
        url:PropTypes.string,//ajax的后台地址
        params:PropTypes.object,//查询参数
        dataSource:PropTypes.string,//ajax的返回的数据源中哪个属性作为数据源,为null时直接后台返回的数据作为数据源
        data:PropTypes.array,//自定义数据源
        extraData:PropTypes.array,//额外的数据,对url有效
        onSelect: PropTypes.func,//选中后的事件，回传，value,与text,data

        //其他属性 picker
        secondUrl:PropTypes.string,//第二层节点的后台地址,
        secondParams:PropTypes.object,//第二层节点的后台参数
        secondParamsKey:PropTypes.string,//第二层节点的后台参数中传递一级节点value值的参数名称
        thirdUrl:PropTypes.string,//第三层节点的后台地址，
        thirdParams:PropTypes.object,//第三层节点的后台参数
        thirdParamsKey:PropTypes.string,//第三层节点的后台参数中传递二级节点value值的参数名称
        hotTitle:PropTypes.string,//热门选择标题
        hotData:PropTypes.array,//热门选择的数据
}