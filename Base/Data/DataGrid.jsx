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
var Message=require("../unit/Message.jsx");
var shouldComponentUpdate=require("../../Mixins/shouldComponentUpdate.js");

var DataGrid=React.createClass({
    mixins:[shouldComponentUpdate],
    propTypes: {
        width:React.PropTypes.number,//宽度
        height:React.PropTypes.number,//高度
        selectAble:React.PropTypes.bool,// 是否显示选择，默认值 false
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
        headers:React.PropTypes.array.isRequired,//表头设置
        total:React.PropTypes.number,// 总条目数，默认为 0
        data:React.PropTypes.array,//当前页数据（json）

        url:React.PropTypes.string,//ajax地址
        backSource:React.PropTypes.string,//ajax的返回的数据源中哪个属性作为数据源,为null时直接后台返回的数据作为数据源
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
        ])//分页栏的位置
    },
    getDefaultProps:function(){
        return{
            width:document.documentElement.clientWidth,
            height:null,
            selectAble:false,
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
            backSource:"data.data",//
            totalSource:"data.total",//
            params:null,
            footer:null,//页脚
            onClick:null,
            onDoubleClick:null,
            onChecked:null,
            footerSource:"data.footer",//页脚数据源
            selectChecked:false,
            lang:"java",
            pagePosition:"bottom"//默认分页在底部


        }
    },
    getInitialState:function() {
        var data=[];
        if(this.props.data instanceof  Array)
        {
            data=this.props.data;
        }
        return {
            url:this.props.url,
            params:unit.clone( this.props.params),//这里一定要复制
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
<<<<<<< HEAD
            footer:this.props.footer,//页脚
            width:this.props.width,//用于滚动条的计算

=======
            footer:this.props.footer,
            width:this.props.width,//用于滚动条的计算
>>>>>>> 8df361be606d1dba67ec2c5af0684591c4242452
        }
    },
    componentWillReceiveProps:function(nextProps) {
        if(nextProps.url&&nextProps.url!="") {
            //如果存在url
            if (this.shouldUpdate(nextProps.url,this.state.pageSize, this.state.pageIndex, this.state.sortName, this.state.sortOrder, nextProps.params)) {
                //先判断是否有条件变化，没有则不更新
                this.updateHandler(nextProps.url,this.state.pageSize, this.state.pageIndex, this.state.sortName, this.state.sortOrder, nextProps.params);
            }

        }else
        {
            //没有url时，自定义更新事件
            if(nextProps.data!=null&&nextProps.data!=undefined&&nextProps.data instanceof Array)
            {
                this.setState({
                    data:(this.props.pagination==true? nextProps.data.slice(0,nextProps.pageSize):nextProps.data),
                    total:nextProps.total,
                    pageIndex:nextProps.pageIndex,
                    pageSize:nextProps.pageSize,
                    sortName:this.props.sortName,
                    sortOrder:nextProps.sortOrder,
                    loading:false,
                })
            }
        }
    },
    componentDidMount:function(){
        if(this.state.url&&this.state.url!="")
        {//如果存在url,
            this.updateHandler(this.state.url,this.state.pageSize,this.state.pageIndex,this.state.sortName,this.state.sortOrder)
        }
    },
    componentDidUpdate:function(){
        if(document.documentElement.clientHeight<document.documentElement.offsetHeight)
        {//有滚动条
           if(this.state.width==document.documentElement.clientWidth+10)
           {//没有设置固定宽度
               this.setState({
                   width:document.documentElement.clientWidth
               })
           }

        }

    },
    renderHeader :function() {
        //渲染表头
        if(this.props.headers instanceof  Array)
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

            headers.push(
                <th  key="headercheckbox" className="check-column">
                    <CheckBox {...props} ></CheckBox>
                </th>

            );
        }
        this.props.headers.map((header, index) => {
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
                        <th key={"header"+index.toString()} {...props}  className={""+sortOrder} style={{textAlign:(header.align?header.align:"left"), width:(header.width==null?"auto":header.width)}}>
                            {header.label}
                        </th>)
                }
            }

            }
        );


        return headers;
    },
    renderBody:function() {//渲染表体
        var trobj=[];
        if(this.state.data instanceof Array&&this.props.headers instanceof  Array)
        {

        }
        else
        {
            return ;
        }

        this.state.data.map((rowData,rowIndex)=> {
            let tds = [];

            if (this.props.selectAble) {
                let key=  this.getKey(rowIndex);
                let props={
                    value:this.state.checkedData.has(key)==true?key:null,
                    data:[{value:key,text:""}],
                    onSelect:this.onChecked.bind(this,rowIndex),
                    name:key,
                }
                tds.push(
                    <td  key ={"bodycheckbox"+rowIndex.toString()}  className="check-column">
                        <CheckBox {...props} ></CheckBox> </td>
                );

            }

            this.props.headers.map((header, columnIndex) => {
                if (header==null||header.hidden) {
                    return;
                }

                let content = header.content;
                if (typeof content === 'string') {
                    content =this. substitute(content, rowData);
                } else if (typeof content === 'function') {
                    try {
                        content = content(rowData,rowIndex);
                    }
                    catch (e)
                    {
                        content="";
                    }

                } else {
                    content = rowData[header.name];
                }
                if (columnIndex==0&&this.props.detailAble) {
                    //在第一列显示详情
                    tds.push( <td  onClick={this.detailHandler.bind(this,rowIndex,rowData)}  key={"col"+rowIndex.toString()+"-"+columnIndex.toString()} style={{textAlign:(header.align?header.align:"left")}}>{content}
                        <div style={{display:"inline",float:"left",paddingLeft:2}}> <LinkButton iconCls="icon-detail" tip="查看详情" onClick={this.detailHandler.bind(this,rowIndex,rowData)}></LinkButton></div>
                    </td>);
                }
                else
                {
                    tds.push( <td onClick={this.onClick.bind(this,rowData,rowIndex)} onDoubleClick={this.onDoubleClick.bind(this,rowData,rowIndex)}  key={"col"+rowIndex.toString()+"-"+columnIndex.toString()} style={{textAlign:(header.align?header.align:"left")}} >{content}</td>);
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
    substitute:function(str, obj) {
        //得到绑定字段的内容
        return str.replace((/\\?\{([^{}]+)\}/g), function(match, name){
            if (match.charAt(0) === '\\') {
                return match.slice(1);
            }
            return (obj[name] === null || obj[name] === undefined) ? '' : obj[name];
        });
    },
    renderTotal:function() {//渲染总记录数，当前记录的下标
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
    },
    renderPagination:function(type) {
        //显示分页控件
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
    divXScrollHandler:function(){//虚拟滚动条滚动事件
        var scrollLeft=this.refs.scrollX.scrollLeft;
        this.refs.tableTitle.scrollLeft=scrollLeft;
        this.refs.tableBody.scrollLeft=scrollLeft;

    },
    divYScrollHandler:function(){//虚拟滚动条滚动事件
        var scrollTop=this.refs.scrollX.scrollTop;
        this.refs.tableY.scrollTop=scrollTop;

    },
    paginationHandler:function(pageIndex) {
        if(pageIndex==this.state.pageIndex)
        {
            return ;
        }
        else
        {
            this.updateHandler(this.state.url,this.state.pageSize,pageIndex,this.state.sortName,this.state.sortOrder);
        }
        //跳转到指定页


    },
    prePaginationHandler:function() {//上一页
        if(this.state.pageIndex==1)
        {

        }
        else {
            this.paginationHandler(this.state.pageIndex-1);
        }

    },
    nextPaginationHandler:function() {//下一页
        var pageAll = ( parseInt(this.state.total / this.state.pageSize));//共多少页
        var lastPageNum = (this.state.total % this.state.pageSize);
        if (lastPageNum > 0) {
            pageAll++;
        }
        if(this.state.pageIndex==pageAll)
        {

        }
        else
        {
            this.paginationHandler(this.state.pageIndex+1);
        }
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
            this.props.headers.map((header,headerindex)=>
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
    sumHandler:function(footerModel){//计算某一列的总和
        var sum=null;
        if(this.state.data instanceof  Array)
        {
            this.state.data.map((rowData,rowIndex)=>
            {

                var footerModelValue=rowData[footerModel.name];//当前行当前列的值
<<<<<<< HEAD
                if(typeof footerModel.content==="function")
=======
                if(footerModel.content==="function")
>>>>>>> 8df361be606d1dba67ec2c5af0684591c4242452
                {//有函数则通过计算得到值
                    footerModelValue=footerModel.content(rowData,rowIndex);//
                }

                if(typeof (footerModelValue*1)=="number")

                {//如果值可以传为数值
                    if(sum==null)
                    {
                        sum=0;//可以计算则先设置为0
                    }
                    sum+=footerModelValue*1;
                }
                else {

                }
            });
        }
        else {
        }
<<<<<<< HEAD
        return sum;
=======
        if(sum!=null)
        {
            return <td key={footerModel.name}>{"总计:"+sum}</td>;
        }
        else {

            return <td key={footerModel.name}></td>;
        }
>>>>>>> 8df361be606d1dba67ec2c5af0684591c4242452


    },
    avgHandler:function(footerModel) {//计算某一列的平均值
        var sum=0; var avg=null;
        if(this.state.data instanceof  Array)
        {
            this.state.data.map((rowData,rowIndex)=> {
                var footerModelValue = rowData[footerModel.name];//当前行当前列的值
<<<<<<< HEAD
                if (typeof  footerModel.content === "function") {//有函数则通过计算得到值
=======
                if (footerModel.content === "function") {//有函数则通过计算得到值
>>>>>>> 8df361be606d1dba67ec2c5af0684591c4242452
                    footerModelValue = footerModel.content(rowData, rowIndex);//
                }

                if (typeof (footerModelValue * 1) == "number") {
                    if (sum == null) {
                        sum = 0;//可以计算则先设置为0
                    }
                    sum += footerModelValue * 1;
                } else {

                }

            });
            avg=(sum/this.state.data.length).toFixed(2);
        }
        else {
        }
<<<<<<< HEAD
        return avg;
=======
        if(avg!=null)
        {
            return <td key={footerModel.name}>{"平均值:"+avg}</td>;
        }
        else {

            return <td key={footerModel.name}></td>;
        }
>>>>>>> 8df361be606d1dba67ec2c5af0684591c4242452
    },
    onSort:function(sortName,sortOrder) {  //排序事件
        this.updateHandler(this.state.url,this.state.pageSize, 1, sortName, sortOrder);

    },
    updateHandler:function(url,pageSize,pageIndex,sortName,sortOrder,params){
        //更新事件

        if(url==undefined)
        {
            url=this.state.url;
        }
        if(url&&url!=="") {

            this.setState({
                loading:true,
            })

            var actualParams={};

            if(!params&&this.state.params&&typeof this.state.params =="object")
            {
                  actualParams=unit.clone(this.state.params);
            }
            else
            {
                if(this.props.pagination==true) {
                    actualParams.data = params;

                }
                else
                {
                    actualParams=params;
                }
            }

            if(this.props.pagination==true)
            {
                actualParams.pageSize=pageSize;
                actualParams.pageIndex=pageIndex;
                actualParams.sortName=sortName;
                actualParams.sortOrder=sortOrder;
            }
            else
            {
            }
            var fetchmodel=new FetchModel(url,this.loadSuccess.bind(this,url,pageSize,pageIndex,sortName,sortOrder,params),actualParams,this.loadError);
            fetchmodel.lang=this.props.lang;
              console.log("datagrid-",fetchmodel);
            unit.fetch.post(fetchmodel);
        }
        else {
            if (this.props.updateHandler != null) {
                this.setState({
                    loading:true,
                });
                this.props.updateHandler(pageSize, pageIndex, sortName, sortOrder);
            }
        }

    },
    loadSuccess:function(url,pageSize,pageIndex,sortName,sortOrder,params,data) {//数据加载成功
        var dataSource;
        var totalSource;
        var footerSource;
        if(this.props.backSource&&this.props.backSource!="") {
            if(this.props.pagination==false&&this.props.backSource=="data.data")
            {
                dataSource= unit.getSource( data,"data");
            }else {
                dataSource= unit.getSource( data,this.props.backSource);

            }

        }
        else {
            dataSource=data;
        }
        if(this.props.pagination&&this.props.totalSource&&this.props.totalSource!="") {

            totalSource=unit.getSource( data,this.props.totalSource);
        }
        else {
            totalSource=data.total;
        }
        if(this.props.footerSource&&this.props.footerSource!="")
        {
            footerSource= unit.getSource( data,this.props.footerSource);
        }
        if(totalSource>0 &&dataSource&& dataSource instanceof  Array&&dataSource.length==0&&totalSource>0&&pageIndex!=1)
        {
            //有总记录，没有当前记录数,不是第一页，继续查询转到上一页
            this.updateHandler(url,pageSize,pageIndex-1,sortName,sortOrder,params);
        }
        else {
            //查询成功
            if(dataSource&& dataSource instanceof  Array)
            {//是数组,
                dataSource= (this.props.pagination == true ? dataSource.slice(0, this.props.pageSize) : dataSource);
            }
            this.setState({
                url: url,
                pageSize: pageSize,
                params: unit.clone(params),//这里一定要复制
                pageIndex: pageIndex,
                sortName: sortName,
                sortOrder: sortOrder,
                data: dataSource,
                total: totalSource,
                footer: footerSource,
                loading: false,
                checkedData: this.clearCheck == true ? new Map() : this.state.checkedData
            })
            if (this.clearCheck == true) {
                this.clearCheck = false;
            }
        }

    },
    loadError:function(errorCode,message) {//查询失败
        Message. alert(message);
        this.setState({
            loading:false,
        })
    },
    reload:function(params) {//重新刷新数据
        if(!params||params=="reload")
        {

            params=this.state.params;
        }
        if(this.state.url==null||this.state.url==="")
        {
            return ;
        }
        else {
            this.clearCheck=true;//重载时清空选中的
            this.updateHandler(this.state.url,this.state.pageSize, this.state.pageIndex, this.state.sortName, this.state.sortOrder,params);

        }
     },
    clearData:function() {//清空数据
        this.setState({
            data:[],
            params:[],
        });
    },
    shouldUpdate:function(url,pageSize,pageIndex,sortName,sortOrder,params) {//判断是否更新

        let isupdate=false;
        if(url!=this.state.url)
        {
            isupdate=true;
            return isupdate;
        }
        if(pageSize!=this.state.pageSize)
        {
            isupdate=true;
            return isupdate;
        }
        if(pageIndex!=this.state.pageIndex)
        {
            isupdate=true;
            return isupdate;
        }
        if(sortName!=this.state.sortName)
        {
            isupdate=true;
            return isupdate;
        }
        if(sortOrder!=this.state.sortOrder)
        {
            isupdate=true;
            return isupdate;
        }
        if(!params&&!this.state.params)
        {//都为空
            isupdate=false;//
            return isupdate;
        }
       else if(params&&!this.state.params&&Object.keys(params).length==0)
        {//原来没有参数,现在有了参数,但参数个数为0
            isupdate=false;
            return isupdate;

        }
        else if(params&&!this.state.params&&Object.keys(params).length>0)
        {//原来没有参数,现在有了参数,但是参数个数不为0
<<<<<<< HEAD
=======
            isupdate=true;
            return isupdate;

        }
        else if(!params&&this.state.params)
        {//清空了参数
            isupdate=true;
            return isupdate;

        }
        else if(params&&this.state.params&&(Object.keys(params).length!=Object.keys(this.state.params).length))
        {//都有参数,但是参数个数已经不一样了
>>>>>>> 8df361be606d1dba67ec2c5af0684591c4242452
            isupdate=true;
            return isupdate;

        }
<<<<<<< HEAD
        else if(!params&&this.state.params)
        {//清空了参数
            isupdate=true;
            return isupdate;

        }
        else if(params&&this.state.params&&(Object.keys(params).length!=Object.keys(this.state.params).length))
        {//都有参数,但是参数个数已经不一样了
            isupdate=true;
            return isupdate;
        }
=======
>>>>>>> 8df361be606d1dba67ec2c5af0684591c4242452
        else
        { //有参数,但参数个数相同,对比

            for(var par in params)
        {
            try {


                if (params[par] == this.state.params[par]) {
                    continue;
                }
                else {
                    isupdate = true;
                    return isupdate;
                }
            }catch (e)
            {
                isupdate = true;
                return isupdate;
            }

        }

        }


    },
    getKey:function (index) {
        //获取指定行的关键字
        let key = this.state.pageIndex.toString() + "-" + index.toString();//默认用序号作为关键字
        if (this.state.data[index][this.props.keyField]) {
            key = this.state.data[index][this.props.keyField];//如果能获取关键字段，则用关键字段
        }

        return key;
    },
    onChecked:function(index,value) {//选中事件
        let checkedData=(this.state.checkedData);//已经选中的行
        let key=this.getKey(index);//获取关键字
        if(value&&value!=""){
            checkedData.set(key,this.state.data[index]);
        }else
        {
            checkedData.delete(key,this.state.data[index]);
        }
        this.setState({
            checkedData:checkedData
        })
        if(this.props.onChecked!=null)
        {
            var data=[];
            for (let value of checkedData.values()) {
                data.push(value);
            }
              this.props.onChecked(data);
        }
    },
    onMouseDown:function(index) {
        //一定要用鼠标按下事件,不保存在状态值中
        this.setState({
            focusIndex:index
        })
    },
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
    getFocusIndex:function() {

        return this.state.focusIndex;
    },
    getFocusRowData:function(index) {
        if(index!=null&&index!=undefined)
        {

        }
        else
        {
            index=this.state.focusIndex;
        }
        return this.state.data[index];
    },

    checkCurrentPageCheckedAll:function() {//判断当前页是否全部选中
        if(this.state.data instanceof Array )
        {

        }
        else
        {
            return ;
        }
        let length=this.state.data.length;
        if(length==0)
        {
            return  false;//如果没有数据，则不判断，直接返回
        }
        var ischeckall=true;
        for(let i=0;i<length;i++)
        {
            if(!this.state.checkedData.has(this.getKey(i)))
            {
                ischeckall=false;
                break;
            }
        }
        return ischeckall;
    },
    checkedAllHandler:function(value){//全选按钮的单击事件
        if(this.state.data instanceof  Array)
        {

        }
        else
        {
            return;
        }
        let length=this.state.data.length;
        let checkedData=this.state.checkedData;
        for(let i=0;i<length;i++)
        {
            let key=this.getKey(i);
            if(value=="yes") {
                if (!checkedData.has(key)) {
                    checkedData.set(key, this.state.data[i]);//添加
                }
            }
            else {
                if (checkedData.has(key)) {
                    checkedData.delete(key, this.state.data[i]);//删除
                }
            }
        }


        this.setState({checkedData:checkedData});
        if(this.props.onChecked!=null)
        {
            var data=[];
            for (let value of checkedData.values()) {
                data.push(value);
            }
            this.props.onChecked(data);
        }

    },
    getChecked:function() {
        //获取选中的行数据
        var data=[];
        for (let value of this.state.checkedData.values()) {
            data.push(value);
        }
        return data;
    },
    getFooterData:function() {//获取得页脚的统计值
        return this.footerActualData;
    },
    updateRow:function(rowIndex,rowData) {//更新某一行数据
        if(rowIndex>=0&&rowIndex<this.state.pageSize) {
            var newData = this.state.data;
            newData[rowIndex] = rowData;
            this.setState({data:newData});
        }

    },
    addRow:function(rowData) {//添加一行
        let newData=this.state.data;
        newData.push(rowData);
        this.setState({
            data:newData
        });
    },
    detailHandler:function(rowIndex, rowData) {//执行显示详情功能
        var key=this.getKey(rowIndex);
        if(key==this.state.detailIndex)
        {
            this.setState({
                detailIndex: null,
                detailView: null,
            })
        }
        else {
            if (this.props.detailHandler != null) {
                var detail = this.props.detailHandler(rowData);
                var colSpan = this.props.headers.length;


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
    },
    render:function() {
        var padddingRight;
        var tableDefinedWidth=this.state.width;//自定义宽度
        var className="table table-no-bordered";
        if(this.props.borderAble===true)
        {
            className="table";
        }
        return (<div className="wasabi-table"    >
            <div className="wasabi-table-pagination"
                 style={{width:tableDefinedWidth,display:(this.props.pagePosition=="top"||this.props.pagePosition=="both")?this.props.pagination?"block":"none":"none"}}>
                {this.renderTotal()}
                <div style={{width:tableDefinedWidth,display:(this.props.pagination?"block":"none")}}>
                    {this.renderPagination("top")}
                </div>
            </div>
            <table  className={className} style={{width:tableDefinedWidth}}>
                <thead>
                <tr>
                    {this.renderHeader()}
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


            <div className="wasabi-table-pagination"
                 style={{width:tableDefinedWidth,display:(this.props.pagination?"block":(this.props.pagePosition=="bottom"||this.props.pagePosition=="both")?"block":"none")}}>
                {this.renderTotal()}
            <div style={{width:tableDefinedWidth,display:(this.props.pagination?"block":"none")}}>
                {this.renderPagination()}
            </div>
                </div>
            <div className="table-loading" style={{display:this.state.loading==true?"block":"none"}}></div>
            <div className="load-icon"  style={{display:this.state.loading==true?"block":"none"}}></div>
        </div>);
    }
});
module .exports=DataGrid;
