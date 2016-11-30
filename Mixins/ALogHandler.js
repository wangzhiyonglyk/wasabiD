/**
 * Created by apple on 2016/11/26.
 * 框架在改版后采用了标准通信接口,为了兼容心怡科技的之前的系统,故此做一个兼容处理
 */
let React=require("react");
var unit=require("../libs/unit.js");
let AlogHandler={
     formatResult:function(result) {//将后端数据转为标准格式
         var newResult={
             success:false,
             rows:null,
             total:0,
             message:"",
             errorCode:"",
             footer:null,
         };
         if(result.data) {//存在data
             if (result.data.data) {//分页
                 newResult.rows = result.data.data;
                 if (result.data.total) {//分页
                     newResult.total = result.total;
                 }
             }
             else {//可能是不分页查询,可能是实体查询
                 newResult.rows = result.data;
                 if (result.total) {
                     newResult.total = result.total;
                 }
                 else {
                     if (newResult.rows instanceof Array) {//是数组,普通查询,否则是实体查询
                         newResult.total = newResult.rows.length;
                     }

                 }
             }
         }else
         {//如果连data都不存在,直接为result;
             newResult=result;
         }

     },
     dataSourceHandler:function(result,dataSource) {//处理数据的数据源
         var dataResult;
         if(dataSource=="rows")
         {//如果还是标准值,要换
             if(this.props.pagination==false)
             {//不分页下
                 dataSource="data";
             }
             else
             { //分页
                 dataSource="data.data";
             }

         }
         else
         {//不是标准值,说明已经明确自定义了,不需要换

         }
         dataResult= unit.getSource( result,dataSource);
         return dataResult;
     },
     totalSourceHandler:function(result) {//处理总记录数的数据源
        var totalSource;
        var totalSource=this.props.totalSource;
        if(totalSource=="total")
        {//如果还是标准值,要换
            totalSource="data.total";
        }
        else
        {//不是标准值,说明已经明确自定义了,不需要换

        }
        totalSource = unit.getSource(result, totalSource);
        return totalSource;
    },
     footerSourceHandler:function(result) {//处理页脚的数据源
        var footerSource;
        var footerSource=this.props.footerSource;
        if(footerSource=="footer")
        {//如果还是标准值,要换
            footerSource="data.footer";
        }
        else
        {//不是标准值,说明已经明确自定义了,不需要换

        }
        footerSource = unit.getSource(result, footerSource);
        return footerSource;
    }
}
module .exports=AlogHandler;