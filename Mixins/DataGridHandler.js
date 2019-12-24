/**
 * Created by wangzhiyong on 2016/10/25.
 * 将DataGrid拆分,基本处理事件存在这里
 */
import React, { Component } from "react";
import   unit from "../libs/unit.js";
import FetchModel from "../Model/FetchModel.js";
import Message from "../Unit/Message.jsx";
let DataGridHandler={

    //列表自用处理函数
    paginationHandler:function(pageIndex) {//分页处理函数
        if(pageIndex==this.state.pageIndex) {//当前页,不处理
            return ;
        }
        else {//跳转到指定页
         
            this.updateHandler(this.state.url,this.state.pageSize,pageIndex,this.state.sortName,this.state.sortOrder,null,null);
        }
    },
    prePaginationHandler:function() {//上一页
       
        if(this.state.pageIndex==1)
        {

        }
        else {
            this.paginationHandler(this.state.pageIndex-1);
        }

    },
    nextPaginationHandler: function() {//下一页
       
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
    pageSizeHandler: function(event) {

        this.updateHandler(this.state.url,event.target.value*1,this.state.pageIndex,this.state.sortName,this.state.sortOrder,null);
    },
    sumHandler:function(footerModel) {//计算某一列的总和
        var sum=null;
        if(this.state.data instanceof  Array)
        {
            this.state.data.map((rowData,rowIndex) =>{

                var footerModelValue=rowData[footerModel.name];//当前行当前列的值
            if(typeof footerModel.content==="function")
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
        return sum;


    },
    avgHandler:function(footerModel) {//计算某一列的平均值
        var sum=0; var avg=null;
        if(this.state.data instanceof  Array)
        {
            this.state.data.map((rowData,rowIndex) =>{
                var footerModelValue = rowData[footerModel.name];//当前行当前列的值
            if (typeof  footerModel.content === "function") {//有函数则通过计算得到值
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
        return avg;
    },
    onSort:function(sortName,sortOrder) {  //排序事件
        this.updateHandler(this.state.url,this.state.pageSize, 1, sortName, sortOrder);

    },

    //更新函数
    updateHandler:function(url,pageSize,pageIndex,sortName,sortOrder,params) {////数据处理函数,更新


        if(this.state.addData.length>0||this.state.deleteData.length>0||this.state.updatedData.length>0) {
            Message.confirm("有脏数据,是否继续更新列表?", this.updateHandlerConfirm.bind(this, url, pageSize, pageIndex, sortName, sortOrder, params), ()=>  {
                return;
            })

        }
        else{
            this.updateHandlerConfirm(url, pageSize, pageIndex, sortName, sortOrder, params);
        }
    },
    updateHandlerConfirm:function(url, pageSize, pageIndex, sortName, sortOrder, params) {
        /*
     url与params而url可能是通过reload方法传进来的,并没有作为状态值绑定
     headers可能是后期才传了,见Page组件可知
     所以此处需要详细判断
     */
        if(!url)
        {//如果为空,先取状态值中...
            url=this.state.url;
        }

        if(url) {
            this.setState({
                loading:true,
                url:url,//更新,有可能从reload那里直接改变了url
                pageSize:pageSize,
                pageIndex:pageIndex,
            })
            var actualParams={};
            if(!params&&this.state.params&&typeof this.state.params =="object")
            {//新的参数为null或者undefined，旧参数不为空
                actualParams = (this.state.params);
                params=this.state.params;//保存以便下一次更新
            }
            else
            {//新参数不为空
                actualParams=params;
            }

            if(this.props.pagination==true)
            {
                if(!actualParams)
                    {
                        actualParams={};
                    }
                actualParams.pageSize=pageSize;
                actualParams.pageIndex=pageIndex;
                actualParams.sortName=sortName;
                actualParams.sortOrder=sortOrder;
            }
            else
            {
            }
            /*
             在查询失败后可能要继续调用updateHandler查询前一页数据,所以传url,以便回调,
             而pageSize,pageIndex,sortName,sortOrder,params这些参数在查询成功后再更新
             所以回传
             */
            var fetchmodel=new FetchModel(url,this.loadSuccess.bind(this,url,pageSize,pageIndex,sortName,sortOrder,params),actualParams,this.loadError);
            console.log("datagrid-开始查询:",fetchmodel);
            unit.fetch.post(fetchmodel);
        }
        else {
            //没有传url,判断用户是否自定义了更新函数
            if (this.props.updateHandler != null) {

                this.props.updateHandler(pageSize, pageIndex, sortName, sortOrder);
            }
        }

    },
    loadSuccess:function(url,pageSize,pageIndex,sortName,sortOrder,params,result) {//数据加载成功
        var dataResult;//最终数据
        var totalResult;//最终总共记录
        var footerResult;//最终统计数据
        var dataSource=this.props.dataSource;//数据源
        if(dataSource=="data"&&this.props.backSource!="data"&&this.props.backSource!="data.data")
        {//dataSource属性为默认,backSource不为默认又不是旧版的data.data默认值,说明是旧版本中自定义的,
            dataSource=this.props.backSource;
        }
        if(dataSource) {//需要重新指定数据源
            dataResult= unit.getSource( result,dataSource);
        }
        else {
            dataResult=result;
        }
        if(this.props.pagination&&this.props.totalSource) {//分页而且需要重新指定总记录数的数据源
            totalResult = unit.getSource(result, this.props.totalSource);
        }
        else if(this.props.pagination)
        {//分页了,没有指定,使用默认的
            if(result.total)
            {
                totalResult=result.total;
            }
            else
            {
                totalResult=null;
                throw ("datagrid分页了,但返回的数据没有指定total");
            }

        }
        else {//不分页
            totalResult=dataResult.length;
        }

        if(this.props.footerSource)//需要重新指定页脚的数据源
        {
            footerResult= unit.getSource( result,this.props.footerSource);
        }
        else
        {//没有指定，
            if(result.footer)
            {
                footerResult=result.footer;//默认的
            }
            else
            {

            }


        }
        if(!footerResult)
        {
            footerResult=this.state.footer;
        }
        console.log("datagrid-fetch结果",{
            "原数据":result,
            "处理后的数据":dataResult
        });
        if(totalResult>0 &&dataResult&& dataResult instanceof  Array&&dataResult.length==0&&totalResult>0&&pageIndex!=1)
        {
            //有总记录，没有当前记录数,不是第一页，继续查询转到上一页
            this.updateHandler(url,pageSize,pageIndex-1,sortName,sortOrder,params);
        }
        else {
            //查询成功
            if(dataResult&& dataResult instanceof  Array)
            {//是数组,
                dataResult= (this.props.pagination == true ? dataResult.slice(0, this.state.pageSize) : dataResult);
            }
            var checkedData=this.state.checkedData;//之前被选择的数据
            if(this.props.clearChecked==false) {//不清除之前的选择
                for (let dataIndex = 0; dataIndex < dataResult; dataIndex++) {
                    let currentKey = this.getKey(dataIndex, pageIndex);//得到当前的key
                    if (checkedData.has(currentKey)) {//如果被选择则修改数据源
                        checkedData.set(currentKey, dataResult[dataIndex]);
                    }
                }
            }
            this.setState({
                pageSize: pageSize,
                params: unit.clone(params),//这里一定要复制,只有复制才可以比较两次参数是否发生改变没有,防止父组件状态任何改变而导致不停的查询
                pageIndex: pageIndex,
                sortName: sortName,
                sortOrder: sortOrder,
                data: dataResult,
                total: totalResult,
                footer: footerResult,
                loading: false,
                checkedData:this.props.clearChecked==true?new Map():checkedData,
                detailIndex: null,//重新查询要清空详情
                detailView: null,


            })

        }

    },
    loadError:function(errorCode,message) {//查询失败
        console.log("datagrid-error",errorCode,message);
        Message. error(message);
        this.setState({
            loading:false,
        })
    },
    //选择处理函数
    getKey: function(index,pageIndex) {//获取指定行的关键字，没有指定页号则为当前页
        let key;//TODO
        if(!pageIndex) {
           
            pageIndex = this.state.pageIndex;
        }
        if(index==null&&index==undefined)
        {
            console.log(new Error("index 值传错"));
        }
        else
        {
             key = pageIndex.toString() + "-" + index.toString();//默认用序号作为关键字
        }



        return key;
    },
    onChecked:function(index,value) {//选中事件
        let checkedData=(this.state.checkedData);//已经选中的行
        if(this.props.singleSelect==true)
        {//单选则清空
            checkedData=new Map();//单选先清空之前的选择
        }
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
            this.props.onChecked(data);//用于返回
        }
    },
    onTRMouseDown:function(index,event) {//行事件，一定要用鼠标按下事件,不保存在状态值中
        if(this.props.focusAble) {
            let node = event.target;
            while (node.nodeName.toLowerCase() != "tr" && node.nodeName.toLowerCase() != "body") {
                node = node.parentElement;
            }
            var trs=this.refs.realTable.children[1].children;
            for(var i=0;i<trs.length;i++)
            {
                trs[i].className=trs[i].className.replace("selected","");//先去掉
            }
            if (node.className.indexOf("selected") > -1) {

            }
            else {
                node.className ="selected"+( node.className?" "+node.className:"") ;
            }
        }
         this.focusIndex=index;//不更新状态值，否则导致频繁的更新

    },
    checkCurrentPageCheckedAll: function() {//判断当前页是否全部选中
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
    checkedAllHandler:function(value) {//全选按钮的单击事件
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
        {//执行父组件的onchecked事件
            var data=[];
            for (let value of checkedData.values()) {
                data.push(value);
            }
            this.props.onChecked(data);
        }

    },

    //只读函数,父组件通过refs调用
    clearData:function() {//清空数据
        this.setState({
            data:[],
            params:[],
        });
    },
    reload:function(params,url) {//重新查询数据,

        //存在用户第一次没有传url,第二次才传url
        if(!url) {//如果为空,则使用旧的
            url=this.state.url;//得到旧的url
        }
        if(!url)
        {//没有传url
            if(this.props.updateHandler)
            {//用户自定义了更新事件
                this.props.updateHandler(this.state.pageSize,this.state.pageIndex,this.state.sortName,this.state.sortOrder);
            }
        }
        else {//传了url
            if( this.showUpdate(params,this.state.para))
            {//参数发生改变,从第一页查起
                this.updateHandler(url,this.state.pageSize, 1, this.state.sortName, this.state.sortOrder,params);
            }
            else
            {//从当前页查起
                this.updateHandler(url,this.state.pageSize, this.state.pageIndex, this.state.sortName, this.state.sortOrder,params);
            }

        }
    },
    getFocusIndex: function() { //只读函数,用于父组件获取数据

        return this.focusIndex;
    },
    getFocusRowData:function(index) {//获取当前焦点行的数据
        if(index!=null&&index!=undefined)
        {

        }
        else
        {
            index=this.focusIndex;
        }
        return this.state.data[index];
    },
    getChecked: function() {
        //获取选中的行数据
        var data=[];
        for (let value of this.state.checkedData.values()) {
            data.push(value);
        }
        return data;
    },
    getFooterData: function() {//获取得页脚的统计值
        return this.footerActualData;
    },
    detailHandler:function(rowIndex,rowData ) {//执行显示详情功能
        var key=this.getKey(rowIndex);//获取关键值
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
                if(!detail) {
                    this.setState({
                        detailIndex: null,//方便下次操作
                        detailView: null,
                    })
                }
                else {
                    var colSpan = this.state.headers.length;
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
        }
    }
}
export default DataGridHandler;