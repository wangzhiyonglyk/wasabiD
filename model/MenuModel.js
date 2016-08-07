/**
 * Created by zhiyongwang on 2016-02-23.
 * 菜单数据模型
 */

class  MenuModel {
    constructor(title, url = "", iconCls= "",content=null) {
       this.title=title;
        this.url=url;
        this.iconCls=iconCls;
        this.menus=[];
        this.content=content;

    }
}
module .exports=MenuModel;