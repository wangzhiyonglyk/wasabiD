/**
 * Created by zhiyongwang on 2016-02-25.
 * 工具栏按钮数据模型
 */
class ButtonModel
{
    constructor(name,title,theme="default")
    {
        this.name=name;
        this.title=title;
        this.disabled=false;
        this.iconCls=null;
        this.iconAlign="left";
        this.href="javascript:void(0);";
        this.onClick=null;
        this.backgroundColor=null;
        this.tip=null;
        this.theme=theme;
        this.size="default";
        this.color=null;
        this.hide=false;
        this.className=null;
        this.style=null;
        this.draggable=false;

    }
}
module .exports=ButtonModel;