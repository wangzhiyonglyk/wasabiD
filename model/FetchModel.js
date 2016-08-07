/**
 * Created by zhiyongwang on 2016-03-26.
 * desc:fetch 查询时的数据模型
 *
 */

class FetchModel
{
    constructor(url,success,params=null,error=null)
    {
        this.url=url;
        this.params=params;
        this.success=success;
        this.error=error;
    }
}
module .exports=FetchModel;