/**
 * Created by wangzhiyong on 2016/12/14.
 * 树节点模型
 */

class  NodeModel {
    constructor(value, text, isParent = false) {
        this.value = value;//值
        this.text = text;//标题
        this.isParent = isParent;//是否父节点,如果没有强制，则会根据是否有子节点来判断是为父节点
        this.tip = null;//提示信息
        this.iconCls = "icon-file";//默认图标
        this.iconClose = "icon-folder";//关闭图标
        this.iconOpen = "icon-open-folder";//打开的图标
        this.open = false;//是否处于打开状态
        this.selected = false;//是否被选中
        this.checked = false,//是否被勾选
        this.checkAble = false;//是否允许勾选
        this.checkedType = {"Y": "ps", "N": "ps"},//勾选对于父子节点的关联关系
        this.href = "javascript=void(0)";//节点的链接
        this.url = null;//子节点加载的url地址
        this.key = "id";//向后台传输的字段名
        this.params = null;//向后台传输的额外参数
        this.property = null;////其他数据,TODO 先保留，暂时没处理
        this.data = [];////子节点数据
        this.onSelect = null;////选中后的事件

    }
}
module.exports=NodeModel;