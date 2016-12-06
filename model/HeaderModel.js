/**
 * Created by zhiyongwang on 2016-02-24.
 * 列表表头模型
 */
class HeaderModel {
    constructor(name,label,content=null,hide=false,sortAble=false,width=null,fixed=false, align="left",rowspan=null,colspan=null)
    {
        this.name=name;
        this.label=label;
        this.content=content;
        this.hide=hide;
        this.sortAble=sortAble;
        this.width=width;
        this.fixed=fixed;
        this.align=align;
        this.rowspan=rowspan;
        this.colspan=colspan;


    }
}
module .exports=HeaderModel;