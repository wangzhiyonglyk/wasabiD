/**
 * Created by wangzhiyong on 2016/10/25.
 * 将原有的单击与双击事件
 * 将新增的 ,粘贴,拖动,鼠标右键等功能
 * 作为DataGrid扩展功能
 */
let React=require("react");
var unit=require("../libs/unit.js");
var FetchModel=require("../model/FetchModel.js");
var Message=require("../Base/unit/Message.jsx");
let DataGridExtend={
    onClick:function(rowData,rowIndex){
        if(this.props.selectChecked==true) {
            let key=this.getKey(rowIndex);//获取关键字
            if(this.state.checkedData.has(key)) {
                this.onChecked(rowIndex, "");
            }
            else {
                this.onChecked(rowIndex,key);
            }
        }
        if(this.props.onClick!=null)
        {
            this.props.onClick(rowIndex,rowData);//注意参数换了位置,因为早期版本就是这样子
        }

    },
    onDoubleClick:function(rowData,rowIndex) {
        if(this.props.onDoubleClick!=null)
        {
            this.props.onDoubleClick(rowIndex,rowData);

        }
    },
    onPaste:function(event) {
            //调用公共用的粘贴处理函数
     this.pasteHandler(event,this.pasteSuccess);
    },
    pasteSuccess:function(data)
    {
        if(this.props.pasteUrl!=null&&this.props.pasteUrl!="")
        {//用户定义了粘贴url
            let actualParams=null;//实际参数
            if(this.props.pasteParamsHandler!=null)
            {//如果粘贴参数处理函数不为空
                actualParams=this.props.pasteParamsHandler(data);
            }
            //保留以前的状态值,保存以前的查询条件
            var fetchmodel=new FetchModel(this.props.pasteUrl,this.loadSuccess.bind(this,this.state.url,this.props.pageSize,1,this.props.sortName,this.props.sortOrder,this.state.params),actualParams,this.loadError);
            fetchmodel.lang=this.props.lang;
            console.log("datagrid-paste-fetch",fetchmodel);
            unit.fetch.post(fetchmodel);
        }
    },
    detailViewHandler:function(detail) {
        var colSpan = this.state.headers.length;

        var key = this.getKey(this.state.focusIndex);
        if (this.props.selectAble == true) {
            colSpan++;
        }
        this.setState({
                detailIndex: key,
                detailView: <tr key={key+"detail"}>
            <td colSpan={colSpan}><div className="wasabi-detail" >{detail}</div></td>
            </tr>,
    })
    }


}
module .exports=DataGridExtend;