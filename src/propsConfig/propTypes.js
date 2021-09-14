/**
 * create by wangzhiyong
 * date:2017-08-14
 * 2020-11-08
 * 将表单配置独立
 */
import PropTypes from "prop-types";
export default {
        type: PropTypes.oneOf([
                "none",//空的占位符
                "rate",//评分
                "text",//普通输入框
                "password",//密码
                "email",//邮箱
                "url",//网址
                "mobile",//手机
                "idcard",//身份证
                "date",//日期
                "time",//时间
                "timerange",//时间范围
                "datetime",//日期时间
                "daterange",//日期范围
                "datetimerange",//日期时间范围
                "alpha",//英文字母
                "alphanum",//英文字母与数字
                "integer",//整型数据
                "number",//数字
                "textarea",//多行文本
                "select",//下拉框
                "radio",//单选框
                "rate",//评分
                "checkbox",//复选框
                "checkbutton",//复选按钮
                "switch",//开关
                "picker",//级联选择组件
                "treepicker",//下拉树选择
                "gridpicker",//表格下拉
                "panelpicker",//面板选择
        ]),//字段类型，
        name: PropTypes.string,//字段名
        label: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.element, PropTypes.node]),//字段文字说明属性
        title: PropTypes.string,//提示信息
        //基础属性
        value: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),//默认值,
        text: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),//默认文本值
        placeholder: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),//输入框预留文字
        readOnly: PropTypes.bool,//是否只读
        required: PropTypes.bool,//是否必填
        hide: PropTypes.bool,//是否隐藏
        regexp: PropTypes.string,//正则表达式
        invalidTip: PropTypes.string,//无效时的提示字符
        style: PropTypes.object,//自定义style
        className: PropTypes.string,//自定义class

        //其他属性 text
        rows: PropTypes.number,//textarea
        cols: PropTypes.number,//textarea
        resize: PropTypes.bool,//是否可以拖动大小
        min: PropTypes.number,//最小值,最小长度,最少选项
        max: PropTypes.number,//最大值,最大长度,最多选项
        onClick: PropTypes.func,//单击事件
        onChange: PropTypes.func,//值改变事件
        onSearch: PropTypes.func,//查询事件

        //其他属性 combobox
        contentType: PropTypes.string,//http请求的request类型
        httpHeader: PropTypes.object,//http请求的头部
        multiple: PropTypes.bool,//是否允许多选
        valueField: PropTypes.string,//数据字段值名称
        textField: PropTypes.string,//数据字段文本名称
        url: PropTypes.string,//ajax的后台地址
        params: PropTypes.object,//查询参数
        dataSource: PropTypes.string,//ajax的返回的数据源中哪个属性作为数据源,为null时直接后台返回的数据作为数据源
        data: PropTypes.array,//自定义数据源
        // extraData:PropTypes.array,//额外的数据,对url有效
        onSelect: PropTypes.func,//选中后的事件，回传，value,与text,data
        attachAble: PropTypes.bool,//select是否可以添加数据
        //其他属性 picker
        secondUrl: PropTypes.string,//第二层节点的后台地址,
        secondParams: PropTypes.object,//第二层节点的后台参数
        secondParamsKey: PropTypes.string,//第二层节点的后台参数中传递一级节点value值的参数名称
        thirdUrl: PropTypes.string,//第三层节点的后台地址，
        thirdParams: PropTypes.object,//第三层节点的后台参数
        thirdParamsKey: PropTypes.string,//第三层节点的后台参数中传递二级节点value值的参数名称
        hotTitle: PropTypes.string,//热门选择标题
        hotData: PropTypes.array,//热门选择的数据
        idField: PropTypes.string,//树组件/picker id字段名称
        parentField: PropTypes.string,//树组件/picker pId字段名称
        simpleData: PropTypes.bool,//树组件/picker 是否启用简单数据格式
        attachTime: PropTypes.bool,//日期组件时是否附带时间
        attachSecond: PropTypes.bool,//时间组件是否附带秒
        allMinute: PropTypes.bool,//时间组件是否显示全部分钟

        priKey:PropTypes.array,//主键
        headers: PropTypes.array,//表头
}