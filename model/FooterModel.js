/**
 * Created by zhiyongwang on 2016-05-20.
 * 列表中页脚的数据模型
 */

class ButtonModel
{
    constructor(name,type,value=null) {
        this.name=name;
        this.type=type;//sum,avg
        this.value=value;
    }
}
module .exports=ButtonModel;