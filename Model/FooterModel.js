/**
 * Created by zhiyongwang on 2016-05-20.
 * 列表中页脚的数据模型
 */

class FooterModel
{
    constructor(name,type,value=null,content=null) {
        this.name=name;
        this.type=type;//sum,avg
        this.value=value;
        this.content=content;//复合计算函数
    }
}
module .exports=FooterModel;