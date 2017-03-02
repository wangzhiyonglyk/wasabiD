/**
 * Created by zhiyongwang on 2016-03-26.
 * desc:fetch 查询时的数据模型
 *
 */

class FetchModel
{
    constructor(url,success,params=null,error=null,type="GET")
    {
        this.url=url;
        this.params=params;
        this.success=success;
        this.error=error;
        this.type=type;//类型
        this.contentType="application/x-www-form-urlencoded";////请求数据格式
    }
}
module .exports=FetchModel;