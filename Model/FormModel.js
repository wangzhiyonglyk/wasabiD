/**
 * Created by zhiyongwang on 2016-02-19.
 * 表单数据模型
 */
//
class  FormModel {
    constructor(name,label="",type = "text",required=false,value="",hide=false,url=null,data=[],extraData=[],valueField="value",textField="text") {
        this.type = type;//控件类型
        this.name = name;// 数据key名称，唯一
        this.value=value;///默认值
        this.readonly=false;///，是否只读，默认为 false
        this.onClick=null//单击事件
        this.onChange=null,//值改变事件
        this.className = null; // 需要额外添加的 className
        this.label = label;//{string|element}  // 表单字段提示文字
        this.equal = ""; // 判断值是否与另一个 Input 相等，string 为另一个  name
        this.min = null ;     // 值类型为 string 时，最小长度；为 number 时，最小值；为 array 时，最少选项数
        this.max = null ;      // 值类型为 string 时，最大长度；为 number 时，最大值；为 array 时，最多选项数
        this.required = required; // 是否必填，默认为 false
        this.regexp=null;//正则表达式
        this.placeholder="";//占位提示文字
        this.onlyline=false;//表单控件是否占一行
        this.rows=5;//textarea行数
        this.hide=hide;//是否隐藏
        this.text="";//下拉框默认显示的文本值
        this.valueField=valueField;//下拉框数据字段值名称
        this.textField=textField;//下拉框数据字段文本名称
        this.url=url;//ajax的后台地址
        this.backSource=null;//ajax的返回的数据源中哪个属性作为数据源,为null时直接后台返回的数据作为数据源
        this.data=data;//数据源
        this.onSelect=null;//下拉框的选中事件
        this.extraData=extraData;//下拉框附加的数据
        this.secondUrl=null;//下拉选择面板中的二级节点查询url
        this.thirdUrl=null;//下拉选择面板中的三级节点查询url
        this.params={};//下拉选择面板中的一级节点查询url所需要的参数
        this.secondParams={};//下拉选择面板中的二级节点查询url所需要的参数
        this.secondParamsKey=null;//下拉选择面板中的查询二级节点时一级节点传递的value对应的参数名称
        this.thirdParams={};//下拉选择面板中的三级节点查询url所需要的参数
        this.thirdParamsKey=null;//下拉选择面板中的查询三级节点时二级节点传递的value对应的参数名称
        this.hotTitle=null;//热门选择标题
        this.hotData=null;//热门选择数据
        this.headers=null;//gridpicker下拉表格中的表格头部
        this.size="default";//表单大小
        this.postion="default";//表单位置
    }


}

module.exports=FormModel;

