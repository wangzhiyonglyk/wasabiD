/**
 * Created by zhiyongwang on 2016-02-24.
 * 列表表头模型
 */
class HeaderModel {
    constructor(name,header,content=null,hidden=false,sortAble=false,width=null,align="left",rowspan=null,colspan=null)
    {
        this.name=name;
        this.content=content;
        this.hidden=hidden;
        this.sortAble=sortAble;
        this.width=width;
        this.header=header;
        this.align=align;
        this.rowspan=rowspan;
        this.colspan=colspan;

    }
}
module .exports=HeaderModel;