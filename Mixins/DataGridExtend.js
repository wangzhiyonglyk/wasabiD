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

        if ( !(event.clipboardData && event.clipboardData.items) ) {//浏览器不支持这个功能
        }
        else
        {
            for (var i = 0, len = event.clipboardData.items.length; i < len; i++) {
                var item = event.clipboardData.items[i];
                if (item.kind === "string") {//文本型数据
                    item.getAsString( (pasteData) =>{//异步的
                        var data=[];//返回的数据
                    if (pasteData.indexOf("<html") > -1||pasteData.indexOf("<table")>-1) {//如果从excel复制过来，会有完整html的内容

                    }
                    else if (pasteData.indexOf("\t")>-1||pasteData.indexOf("\r\n")>-1) {
                        //是多列或者多行数据,则处理,否则视为普通粘贴
                        var rows = pasteData.split("\r\n");//得到所有行数据
                        for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                            var columns=    rows[rowIndex].split("\t");//当前所有列数据
                            var currentColumn=[];//当前行数据,为了除去空字符
                            for(var columnIndex=0;columnIndex<columns.length;columnIndex++) {
                                if(columns[columnIndex].trim()=="") {
                                    continue;//空字符
                                }
                                else {
                                    currentColumn.push(columns[columnIndex]);
                                }
                            }
                            data.push(currentColumn);
                        }
                    }
                    if(data.length>0) {
                        if(this.props.pasteUrl!=null&&this.props.pasteUrl!="")
                        {
                            let actualParams=null;
                            if(this.props.pasteParamsHandler!=null)
                            {
                                actualParams=this.props.pasteParamsHandler(data);
                            }
                            //保留以前的状态值
                            var fetchmodel=new FetchModel(this.props.pasteUrl,this.loadSuccess.bind(this,this.state.url,this.props.pageSize,1,this.props.sortName,this.props.sortOrder,this.state.params),actualParams,this.loadError);
                            fetchmodel.lang=this.props.lang;
                            console.log("datagrid-paste-fetch",fetchmodel);
                            unit.fetch.post(fetchmodel);
                        }

                    }

                })

                } else if (item.kind === "file") {//文件类型
                    var pasteFile = item.getAsFile();
                    // pasteFile就是获取到的文件，暂时不处理
                }
            }
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