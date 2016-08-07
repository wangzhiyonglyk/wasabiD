/**
 * Created by zhiyongwang on 2016-02-25.
 * 工具栏按钮数据模型
 */
class ButtonModel
{
    constructor(name,title,theme="default",size="default",onClick=null,disabled=false,backgroundColor=null,iconCls=null,iconAlign="left",hide=false,href="javascript:void(0);")
    {
        this.name=name;
        this.title=title;
        this.disabled=disabled;
        this.iconCls=iconCls;
        this.iconAlign=iconAlign;
        this.href=href;
        this.onClick=onClick;
        this.backgroundColor=backgroundColor;
        this.tip=null;
        this.theme=theme;
        this.size=size;
        this.color=null;
        this.hide=hide;
        this.className=null;
        this.style=null;

    }
}
module .exports=ButtonModel;