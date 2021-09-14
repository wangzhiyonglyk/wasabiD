/**
 * Created by wangzhiyong on 2016-03-26.
 * desc:fetch 查询时的数据模型
 *
 */

class FetchModel
{
    constructor(url,success,data=null,error=null,type="POST",contentType="application/x-www-form-urlencoded",headers=null)
    {
        this.url=url;
        this.data=data;
        this.success=success;
        this.error=error;
        this.type=type;//类型
        this.contentType=contentType;////请求数据格式
        this.headers=headers;
    }
}
export default FetchModel;