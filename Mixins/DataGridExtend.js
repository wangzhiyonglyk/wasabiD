/**
 * Created by wangzhiyong on 2016/10/25.
 * 将原有的单击与双击事件
 * 将新增的 ,粘贴,拖动,鼠标右键,滚动,固定表头,固定列等功能
 * 作为DataGrid扩展功能
 */
let React=require("react");
var unit=require("../libs/unit.js");
var FetchModel=require("../model/FetchModel.js");
var Message=require("../Base/unit/Message.jsx");
var element=require("../libs/element.js");//
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
    pasteSuccess:function(data) {
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
    },
    setWidthAndHeight:function() {//重新计算列表的高度,固定的表头每一列的宽度
        if(this.refs.grid.parentElement.className=="wasabi-detail") {//如果列表是在详情列表中不处理

        }
        else { //主列表

            //固定表头的列
            var headerTableHeader=  this.refs.headertable.children[0].children[0].children;
            //列表的原始表头的列
            var bodyTableHeader=  this.refs.bodytable.children[0].children[0].children;
            this.refs.headertable.style.width="auto";// 因为有可能用户设置了宽度比屏幕宽度小
            for(let index=0;index<bodyTableHeader.length;index++)
            {//遍历，如果原始表头的列的宽度与固定表头对应列不一样,就设置
                if(bodyTableHeader[index].clientWidth!=headerTableHeader[index].clientWidth)
                {
                    headerTableHeader[index].children[0].style.width=bodyTableHeader[index].clientWidth+"px";
                }
            }
            //监听列表的横向滚动的事件,以便固定表头可以一同滚动
            this.refs.tablebody.onscroll=this.tablebodyScrollHandler;//
            if(!this.state.height)
            {
                this.setState({
                    height:this.clientHeight-element.getElementViewTop(this.refs.grid)-5//底部留点空白
                })

            }
        }
    },
    tablebodyScrollHandler:function(event) {//监听列表的横向滚动的事件,以便固定表头可以一同滚动
        this.refs.tablefixHeader.style.left="-"+event.target.scrollLeft+"px";

    },

}
module .exports=DataGridExtend;