/**
 *Created by wangzhiyong on 2016-04-05
 * desc:列表组件,由此组件开始独立重构所组件,不再依赖
 * wasabi框架的第一个组件
 * 2016-06-09后开始调整整个样式
 *
 */
require("../../sass/Base/Data/DataGrid.scss");
require("../../sass/Base/Data/DataGridDetail.scss");
var React=require("react");
var unit=require("../../libs/unit.js");
var FetchModel=require("../../model/FetchModel.js");
var LinkButton=require("../Buttons/LinkButton.jsx");
var CheckBox=require("../Form/CheckBox.jsx");
var Radio=require("../Form/Radio.jsx");
var Message=require("../unit/Message.jsx");
var shouldComponentUpdate=require("../../Mixins/shouldComponentUpdate.js");
var DataGridHandler=require("../../Mixins/DataGridHandler.js");
var DataGridExtend=require("../../Mixins/DataGridExtend.js");
var pasteExtend=require("../../Mixins/pasteExtend.js");
var alogHandler=require("../../Mixins/alogHandler.js");//专门为心怡科技做兼容处理


var DataGrid=React.createClass({
    mixins:[shouldComponentUpdate,DataGridHandler,DataGridExtend,pasteExtend,alogHandler],
    propTypes: {
        width:React.PropTypes.oneOfType([
            React.PropTypes.number,
            React.PropTypes.string,
        ]) ,//宽度
        height:React.PropTypes.number,//高度
        selectAble:React.PropTypes.bool,// 是否显示选择，默认值 false
        singleSelect:React.PropTypes.bool,//是否为单选,默认值为 false
        detailAble:React.PropTypes.bool,//是否显示详情,默认值 false
        borderAble:React.PropTypes.bool,//是否显示表格边框，默认值 false
        foncusAble:React.PropTypes.bool,//是否显示焦点行，默认值 false
        pagination:React.PropTypes.bool,//是否分页,默认值 true
        selectChecked:React.PropTypes.bool,//选择行的时候是否同时选中
        pageIndex:React.PropTypes.number,//当前页号
        pageSize:React.PropTypes.number,//分页大小，默认20
        sortName:React.PropTypes.string,//排序字段,
        sortOrder:React.PropTypes.oneOf([
            "asc",
            "desc",
        ]),//排序方式,默认asc,
        keyField:React.PropTypes.string,//关键字段
        headers:React.PropTypes.array,//表头设置
        total:React.PropTypes.number,// 总条目数，默认为 0
        data:React.PropTypes.array,//当前页数据（json）

        url:React.PropTypes.string,//ajax地址
        backSource:React.PropTypes.string,//ajax的返回的数据源中哪个属性作为数据源,为null时直接后台返回的数据作为数据源(旧版本)
        dataSource:React.PropTypes.string,//ajax的返回的数据源中哪个属性作为数据源,为null时直接后台返回的数据作为数据源(新版本)
        totalSource:React.PropTypes.string,//ajax的返回的数据源中哪个属性作为总记录数,为null时直接后台返回的数据中的total
        params:React.PropTypes.object,//查询条件
        onClick:React.PropTypes.func,//单击事件
        onDoubleClick:React.PropTypes.func,//双击事件
        onChecked:React.PropTypes.func,//表格中有一行被选中
        detailHandler:React.PropTypes.func,//展示详情的函数，父组件一定要有返回值,返回详情组件
        footer:React.PropTypes.array,//页脚,
        footerSource:React.PropTypes.string,//页脚数据源,
        lang:React.PropTypes.oneOf([
            "java",
            "C#",
            "php"
        ]),//后端语言
        pagePosition:React.PropTypes.oneOf([
            "top",
            "bottom",
            "both"
        ]),//分页栏的位置
        clearChecked:React.PropTypes.bool,//刷新数据后是否清除选择,
        pasteUrl:React.PropTypes.string,//粘贴后的url
        pasteParamsHandler:React.PropTypes.func,//对粘贴后的数据进行处理,形成参数并且返回
    },
    getDefaultProps:function(){
        return{
            width:"100%",
            height:null,
            selectAble:false,
            singleSelect:false,
            detailAble:false,
            foncusAble:false,
            borderAble:false,
            pagination:true,
            pageIndex:1,
            pageSize:20,
            sortName:"id",
            sortOrder:"asc",
            keyField:"id",
            headers:[],
            total:0,
            data:[],
            updateHandler:null,
            detailHandler:null,
            url:null,//
            backSource:"data",//
            dataSource:"data",//
            totalSource:"total",//
            params:null,
            footer:null,//页脚
            onClick:null,
            onDoubleClick:null,
            onPaste:null,
            onChecked:null,
            footerSource:"footer",//页脚数据源
            selectChecked:false,
            lang:"java",
            pagePosition:"bottom",//默认分页在底部
            clearChecked:true,//是否清空选择的
            pasteUrl:null,
            pasteParamsHandler:null,


        }
    },
    getInitialState:function() {
        this.clientHeight=document.documentElement.clientHeight;//先得到高度,防止后期页面发生晃动
        var data=[];
        if(this.props.data instanceof  Array)
        {
            data=this.props.data;
        }
        return {
            url:this.props.url,
            params:unit.clone( this.props.params),//这里一定要复制,只有复制才可以比较两次参数是否发生改变没有,防止父组件状态任何改变而导致不停的查询
            pageIndex:this.props.pageIndex,
            pageSize:this.props.pageSize,
            sortName:this.props.sortName,
            sortOrder:this.props.sortOrder,
            data:(this.props.pagination==true? data.slice(0,this.props.pageSize):data),//只只保留当前的数据
            checkedData:new Map(),
            detailView:null,//详情行,
            detailIndex:null,//显示详情的行下标
            total:this.props.total,//总记录数
            loading:(this.props.url&&this.props.url!="")?true:false,//显示正在加载图示
            footer:this.props.footer,//页脚
            headers:this.props.headers,//表头会可能后期才传送,也会动态改变
            height:this.props.height,//如果没有设置高度还要从当前页面中计算出来空白高度,以适应布局


        }
    },
    componentWillReceiveProps:function(nextProps) {
        /*
         url与params而url可能是通过reload方法传进来的,并没有作为状态值绑定
         headers可能是后期才传了,见Page组件可知
         所以此处需要详细判断
         */
        if(nextProps.url) {
            //说明父组件将url作为状态值来绑定的
            /*
             注意了***************（见reload方法）
             isReloadType的作用:
             为真:说明是通过reload方法来执行更新的,组件本身的params与父组件的params已经不同步了,不能更新
             为假:说明是父组件仅仅使用了状态值作为通信方式,先判断是否有params变化，没有则不查询,有从第一页开始查询
             *********
             */
            if (this.isReloadType!=true&&this.paramNotEaqual(  nextProps.params)) {
                //仅仅通过状态值更新,参数有变,更新
                this.updateHandler(nextProps.url,this.state.pageSize, 1, this.state.sortName, this.state.sortOrder, nextProps.params,nextProps.headers);
            }
            else {//父组件状态值没有发生变化,或者使用reload方法更新的

                if(nextProps.headers)
                { //存在着这种情况,后期才传headers,所以要更新一下
                    this.setState({
                        headers: nextProps.headers,
                    })
                }

            }

        }
        else
        { //说明父组件将url没有作为状态值来绑定的
            if(this.state.url)
            {//组件本身的url不为空说明通过reload方法绑定了url,父组件本身没有绑定url,所以不能查询

                if(nextProps.headers)
                { //存在着这种情况,后期才传headers,所以要更新一下
                    this.setState({
                        headers: nextProps.headers,
                    })
                }
            }
            else {
                //没有url时，自定义更新事件
                if (nextProps.data != null && nextProps.data != undefined && nextProps.data instanceof Array) {
                    this.setState({
                        data: (this.props.pagination == true ? nextProps.data.slice(0, nextProps.pageSize) : nextProps.data),
                        total: nextProps.total,
                        pageIndex: nextProps.pageIndex,
                        pageSize: nextProps.pageSize,
                        sortName: this.props.sortName,
                        sortOrder: nextProps.sortOrder,
                        loading: false,
                        headers: nextProps.headers,//表头可能会更新
                    })
                }
            }

        }
    },
    componentDidMount:function(){
        //渲染后再开始加载数据
        if(this.state.url&&this.state.url!="")
        {//如果存在url,
            this.updateHandler(this.state.url,this.state.pageSize,this.state.pageIndex,this.state.sortName,this.state.sortOrder)
        }
    },
    componentDidUpdate:function() {
        this.setWidthAndHeight();//重新计算列表的高度,固定的表头每一列的宽度
    },
    renderHeader :function() {//渲染表头
        if(this.state.headers instanceof  Array)
        {

        }
        else {
            return null;
        }
        let headers = [];

        if (this.props.selectAble) {
            let props={
                value:this.checkCurrentPageCheckedAll()==true?"yes":null,
                data:[{value:"yes",text:""}],
                onSelect:this.checkedAllHandler,
                name:"all",
            }
            //使用label,因为多个列可能绑定一个字段
            if(this.props.singleSelect==true){
                headers.push(
                    <th  key="headercheckbox" className="check-column" name="check-column" style={{width:35}} >
                        <div className="wasabi-table-cell" name="check-column" >
                        </div>
                    </th>

                );
            }
            else {
                headers.push(
                    <th key="headercheckbox" className="check-column" name="check-column" style={{width:35}} >
                        <div className="wasabi-table-cell" name="check-column"> <CheckBox {...props} ></CheckBox></div>
                    </th>
                );
            }

        }
        this.state.headers.map((header, index) => {
                if(header==null)
                {//如果是空则不处理

                }
                else {
                    let sortOrder = "";
                    var props={};//设置单击事件
                    if (header.sortAble == true) {
                        sortOrder = " both";
                        if (this.state.sortName == header.name) {
                            //是当前排序字段
                            sortOrder += " " + this.state.sortOrder;
                            props. onClick=(header.sortAble == true?this.onSort.bind(this,header.name,this.state.sortOrder=="asc"?"desc":"asc"):null);
                        }
                        else {
                            props. onClick=(header.sortAble == true?this.onSort.bind(this,header.name,"asc"):null);
                        }
                    }
                    if (header.hidden == true) {
                        //隐藏则不显示
                    } else {
                        headers.push(
                            <th key={"header"+index.toString()} name={header.label} {...props} className={""+sortOrder} style={{textAlign:(header.align?header.align:"left")}}
                                onMouseMove={this.headerMouseMoveHandler}
                                onContextMenu={this.headerContextMenuHandler}
                                onMouseDown={this.headerMouseDownHandler}>

                                <div className="wasabi-table-cell"  name={header.label} style={{width:(header.width?header.width:null),textAlign:(header.align?header.align:"left")}}>
                                    {header.label}</div>
                            </th>)
                    }
                }

            }
        );


        return headers;
    },
    renderBody:function() {//渲染表体
        var trobj=[];
        if(this.state.data instanceof Array&&this.state.headers instanceof  Array)
        {

        }
        else
        {
            return ;
        }

        this.state.data.map((rowData,rowIndex)=> {
            let tds = [];
            if (this.props.selectAble) {
                let key = this.getKey(rowIndex);
                let props = {
                    value: this.state.checkedData.has(key) == true ? key : null,
                    data: [{value: key, text: ""}],
                    onSelect: this.onChecked.bind(this, rowIndex),
                    name: key,
                }

                if (this.props.singleSelect == true) {
                    tds.push(
                        <td key={"bodycheckbox"+rowIndex.toString()} className="check-column" style={{width:35}}>
                            <div className="wasabi-table-cell" > <Radio {...props} ></Radio></div></td>
                    );

                }
                else {
                    tds.push(
                        <td key={"bodycheckbox"+rowIndex.toString()} className="check-column" style={{width:35}}>
                            <div className="wasabi-table-cell"  ><CheckBox {...props} ></CheckBox></div></td>
                    );
                }
            }

            this.state.headers.map((header, columnIndex) => {
                if (header==null||header.hidden) {
                    return;
                }

                let content = header.content;
                if (typeof content === 'string') {//指定的列
                    content =this. substitute(content, rowData);
                } else if (typeof content === 'function') {//函数
                    try {
                        content = content(rowData,rowIndex);
                    }
                    catch (e)
                    {
                        content="";
                    }

                } else {//为空时
                    content = rowData[header.name];
                }
                //TODO 先保留旧代码
                //let whiteSpace="nowrap";//默认不换行,对超过30个字的,设置为换行模式
                //if(content&&typeof  content !=="string"&&content!=="number") {
                //
                //    if(content.key&&content.key.toString().length>30) {
                //        whiteSpace = "normal";
                //    }else if(content instanceof  Array&&content.length>0&&content[0].key&&content[0].key.toString().length>30)
                //    { whiteSpace = "normal";
                //
                //    }
                //}
                //else if(content &&typeof  content.toString()=="string"&&content.toString().length>30)
                //{
                //    whiteSpace="normal";
                //}
                // style={{textAlign:(header.align?header.align:"left"),whiteSpace:whiteSpace}}
                if (columnIndex==0&&this.props.detailAble) {
                    //在第一列显示详情
                    tds.push(<td onClick={this.detailHandler.bind(this,rowIndex,rowData)}
                                 key={"col"+rowIndex.toString()+"-"+columnIndex.toString()}>
                        <div className="wasabi-table-cell" style={{width:(header.width?header.width:null),textAlign:(header.align?header.align:"left")}}>
                            {content}
                            <LinkButton iconCls="icon-detail" tip="查看详情"></LinkButton>

                        </div>
                    </td>);
                }
                else {
                    tds.push(<td onClick={this.onClick.bind(this,rowData,rowIndex)}
                                 onDoubleClick={this.onDoubleClick.bind(this,rowData,rowIndex)}
                                 key={"col"+rowIndex.toString()+"-"+columnIndex.toString()}
                    >  <div className="wasabi-table-cell"    style={{width:(header.width?header.width:null),textAlign:(header.align?header.align:"left")}}>{content}</div></td>);
                }

            });
            let trClassName=null;
            if((rowIndex*1)%2==0)
            {//不是选中行的时候
                trClassName="even";
            }
            if((rowIndex*1)==this.state.focusIndex&&this.props.foncusAble)
            {
                trClassName="selected";
            }
            trobj.push(<tr  className={trClassName} key={"row"+rowIndex.toString()}    onMouseDown={this.onMouseDown.bind(this,rowIndex)}>{tds}</tr>);
            var key=this.getKey(rowIndex);
            if(this.state.detailIndex==key)
            {

                trobj.push(this.state.detailView);
            }

        });
        return trobj;

    },
    substitute:function(str, obj) {//得到绑定字段的内容
        return str.replace((/\\?\{([^{}]+)\}/g), function(match, name){
            if (match.charAt(0) === '\\') {
                return match.slice(1);
            }
            return (obj[name] === null || obj[name] === undefined) ? '' : obj[name];
        });
    },
    renderTotal:function() {//渲染总记录数，当前记录的下标
        if(this.state.headers&&this.state.headers.length>0)
        {
            var benginIndex=0; var endIndex=0;//数据开始序号与结束序
            var total=this.state.total;
            var control;
            if(this.state.data instanceof Array ) {
                if(this.state.data.length>0)
                {
                    if(this.props.pagination)
                    {
                        benginIndex=this.state.pageSize*(this.state.pageIndex-1)+1;
                        endIndex=this.state.pageSize*(this.state.pageIndex-1)+this.state.data.length;
                    }
                    else
                    {
                        endIndex=this.state.data.length;
                        total=this.state.data.length;
                    }

                }

            }
            control=  <div key="pagination-detail" className="pagination-detail">
                        <span className="pagination-info">显示第{benginIndex}
                            到{endIndex}条，
                            共{total}条</span>
                <LinkButton iconCls="icon-reload" name="reload" onClick={this.reload}></LinkButton>
            </div>;
            return control;
        }
        else
        {
            return null;
        }

    },
    renderPagination:function(type) {//显示分页控件
        var paginationCom=null;
        if (this.props.pagination) {

            var pageAll = ( parseInt(this.state.total / this.state.pageSize));//共多少页
            if ((this.state.total % this.state.pageSize) > 0) {
                pageAll++;//求余后得到最终总页数
            }
            if(pageAll==0)
            {//数据为空，直接返回
                return null;
            }

            if (pageAll > 7) {//大于7页，
                let pageComponent = [];//分页组件
                let firstIndex=0;//第一个显示哪一页
                let lastIndex=0;//最后一个显示哪一页
                let predisabledli= <li key="predis" className="page-last-separator disabled"><a href="javascript:void(0)">...</a></li>;//多余的分页标记
                let lastdisabledli= <li key="lastdis" className="page-last-separator disabled"><a href="javascript:void(0)">...</a></li>;//多余的分页标记
                if(this.state.pageIndex>=4&&this.state.pageIndex<=pageAll-3)
                {//处于中间位置的页号
                    firstIndex=this.state.pageIndex-2;
                    lastIndex=this.state.pageIndex+2;
                }
                else {
                    //非中间位置
                    if(this.state.pageIndex<4) {
                        //靠前的位置
                        firstIndex = 2;
                        lastIndex = 6;
                        predisabledli=null;//设置为空
                    }else
                    {//靠后的位置
                        if(this.state.pageIndex>pageAll-3)
                        {
                            firstIndex = pageAll-5;
                            lastIndex = pageAll-1;
                            lastdisabledli=null;//设置为空
                        }
                    }
                }
                for (let i=firstIndex; i <=lastIndex; i++) {
                    pageComponent.push(<li key={"li"+i} className={"page-number "+((this.state.pageIndex*1)==(i)?"active":"")}><a
                        href="javascript:void(0)" onClick={this.paginationHandler.bind(this,(i))}>{(i)}</a></li>);
                }
                pageComponent.unshift(predisabledli);pageComponent.push(lastdisabledli);
                paginationCom= <div className="pull-right pagination">
                    <ul className="pagination" style={{marginTop:type=="top"?0:5,marginBottom:type=="top"?5:0}}>
                        <li key={"lipre"} className="page-pre"><a href="javascript:void(0)" onClick={this.prePaginationHandler} >‹</a></li>
                        <li key={"lifirst"} className={"page-number "+((this.state.pageIndex*1)==(1)?"active":"")}><a
                            href="javascript:void(0)" onClick={this.paginationHandler.bind(this,(1))}>{( 1)}</a></li>
                        {
                            pageComponent
                        }

                        <li key="lilast" className={"page-number "+((this.state.pageIndex*1)==(pageAll)?"active":"")}><a href="javascript:void(0)"  onClick={this.paginationHandler.bind(this,(pageAll))}>{(pageAll)}</a></li>
                        <li key="linext"  key={"next"} className="page-next"><a href="javascript:void(0)" onClick={this.nextPaginationHandler} >›</a></li>
                    </ul>
                </div>;
            }
            else {
                //小于7页直接显示

                let pagearr = [];
                for (let i = 0; i < pageAll; i++) {
                    var control=<li key={"li"+i} className={"page-number "+((this.state.pageIndex*1)==(i+1)?"active":"")}>
                        <a href="javascript:void(0)"  onClick={this.paginationHandler.bind(this,(i+1))}>{(i + 1)}</a></li>;
                    pagearr.push(control);
                }
                paginationCom = (
                    <div className="pull-right">
                        <ul className="pagination" style={{marginTop:type=="top"?0:5,marginBottom:type=="top"?5:0}}>
                            {
                                pagearr
                            }
                        </ul>
                    </div>
                )

            }

        }
        return paginationCom;

    },
    renderFooter:function() {//渲染页脚
        var tds = [];
        this.footerActualData=[];//,页脚的实际统计数据，用于返回
        if (this.state.footer instanceof Array) {
            //分页的情况下
            if (this.props.selectAble) {
                tds.push(
                    <td key="footerselect" className="check-column"></td>
                );
            }
            this.state.headers.map((header,headerindex)=>
            {
                var footerchild=this.state.footer.filter(function(d)
                {
                    return d.name==header.name;
                })
                if(footerchild&&footerchild.length>0)
                {
                    if(footerchild[0].value!=null&&footerchild[0].value!=undefined)
                    {//如果有值
                        var obj={};obj[header.name]=footerchild[0].value;
                        footerActualData.push(obj);
                        tds.push(<td key={headerindex+header.name}>{footerchild[0].value}</td>)
                    }
                    else {
                        //表明从本页数据统计
                        switch (footerchild[0].type)
                        {
                            case "sum":
                                var obj={};obj[header.name]=this.sumHandler(footerchild[0]);
                                this. footerActualData.push(obj);
                                if(obj[header.name]!=null)
                                {
                                    tds.push(<td  key={header.name} >{"总计："+obj[header.name]}</td>);
                                }
                                else {
                                    tds.push(<td  key={header.name} ></td>);
                                }
                                break;
                            case "avg":
                                var obj1={};obj1[header.name]=this.avgHandler(footerchild[0]);
                                this. footerActualData.push(obj1);
                                if(obj[header.name]!=null)
                                {
                                    tds.push(<td  key={headerindex+header.name} >{"平均值："+obj1[header.name]}</td>);
                                }
                                else {
                                    tds.push(<td  key={headerindex+header.name} ></td>);
                                }
                                break ;
                            default:
                                tds.push(<td  key={headerindex+header.name}></td>);
                        }
                    }
                }
                else
                {
                    tds.push(<td key={header.name+headerindex}></td>);
                }

            });

            return <tr key="footertr" style={{height:36}}>{tds}</tr>;
        }


    },
    render:function() {
        let className="table table-no-bordered";
        if(this.props.borderAble===true)
        {
            className="table";
        }
        let headerControl=this.renderHeader();
        let gridHeight=this.state.height;
        let tableHeight=gridHeight?( this.props.pagePosition=="both")?gridHeight-70:gridHeight-35:null;
        return (<div className="wasabi-table" ref="grid"
                     onPaste={this.onPaste}
                     onMouseDown={this.gridMouseDownHandler}
                     style={{width:this.props.width,height:gridHeight}}  >
            <div className="wasabi-table-pagination" ref="toppagination"
                 style={{display:(this.props.pagePosition=="top"||this.props.pagePosition=="both")?this.props.pagination?"block":"none":"none"}}>
                {this.renderTotal()}
                <div style={{display:(this.props.pagination?"block":(this.state.data instanceof Array &&this.state.data.length>0)?"block":"none")}}>
                    {this.renderPagination("top")}
                </div>
            </div>

            <div className="table-container">
                <div className="table-fixHeader" ref="tablefixHeader">
                    <table  className={className} key="headertable"  ref="headertable"
                            onMouseMove={this.fixedTableMouseMoveHandler} onMouseUp={this.fixedTableMouseUpHandler}>
                        <thead>
                        <tr>
                            {headerControl}
                        </tr>
                        </thead>
                    </table>
                </div>
                <div className="table-body"  ref="tablebody" style={{height:tableHeight}}
                     onScroll={this.tableBodyScrollHandler}>
                    <table  className={className} key="bodytable"  ref="bodytable">
                        <thead >
                        <tr>
                            {headerControl}
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.renderBody()
                        }
                        {
                            this.renderFooter()
                        }
                        </tbody>
                    </table>
                </div></div>
            <div className="wasabi-table-pagination" ref="bottompagination"
                 style={{display:(this.props.pagination?"block":(this.props.pagePosition=="bottom"||this.props.pagePosition=="both")?"block":"none")}}>
                {this.renderTotal()}
                <div style={{display:(this.props.pagination?"block":(this.state.data instanceof Array &&this.state.data.length>0)?"block":"none")}}>
                    {this.renderPagination()}
                </div>
            </div>
            <div className="table-loading" style={{display:this.state.loading==true?"block":"none"}}></div>
            <div className="load-icon"  style={{display:this.state.loading==true?"block":"none"}}></div>
            <div onMouseUp={this.divideMouseUpHandler}  ref="tabledivide" className="wasabi-table-divide"  style={{top:(this.props.pagePosition=="top"||this.props.pagePosition=="both")?35:0}}></div>
            <div className="header-menu-container" ref="headermenu">
                <ul className="header-menu">
                    <li key="first"><a href="javascript:void(0);" className="header-menu-item" onClick={this.menuHideHandler} >隐藏此列</a></li>
                    {this.state.headerMenu}
                </ul>
            </div>
        </div>);
    }
});
module .exports=DataGrid;
