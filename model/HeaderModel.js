/**
 * Created by zhiyongwang on 2016-02-24.
 * 列表表头模型
 */
class HeaderModel {
    constructor(name,label,content=null,hidden=false,sortAble=false,width=null,fixed=false, align="left",rowspan=null,colspan=null)
    {
        this.name=name;
        this.label=label;
        this.content=content;
        this.hidden=hidden;
        this.sortAble=sortAble;
        this.width=width;
        this.fixed=fixed;
        this.align=align;
        this.rowspan=rowspan;
        this.colspan=colspan;


    }
}
module .exports=HeaderModel;