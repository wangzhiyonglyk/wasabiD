/**
 * Created by wangzhiong on 2016/12/24.
 * datagrid，内置的编辑器模型
 * editor
 */
class EditorModel
{
    constructor(type,options=null)
    {
       this.type=type;//input组件类型，
       this.options=options;//input组件的属性
        this.content=null;//修改前如何处理text,value,返回类型{value:"",text:""}
       this.edited=null;//值修改后的处理函数
    }
}
module .exports=EditorModel;