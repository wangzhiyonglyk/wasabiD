/**
 * Created by zhiyongwang on 2016-05-24.
 * 三级联动选择面板数据模型
 */

class PickerModel
{
    constructor(value,text="",expand=false,children=null) {
        this.value=value;//名称
        this.text=text;//标题
        this.expand=expand;//是否为展开状态
        this.children=children;//子节点
    }
}
export default PickerModel;

