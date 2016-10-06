/**
 * Created by zhiyongwang on 2016-03-26.
 * desc:fetch 查询时的数据模型
 *
 */

class FetchModel
{
    constructor(url,success,params=null,error=null,lang="java",type="GET")
    {
        this.url=url;
        this.params=params;
        this.success=success;
        this.error=error;
        this.lang=lang;
        this.type="GET";
    }
}
module .exports=FetchModel;