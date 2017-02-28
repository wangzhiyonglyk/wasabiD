/*
create by wangzhiyong
date:2016-10-30
desc:单页面应用的事件处理模型
 */
let React=require("react");
let Message=require("../../Unit/Message.jsx");
let unit=require("../../libs/unit.js");
let FetchModel=require("../../Model/FetchModel.js");
let PageHandlerMixins={
    getHandler:function(id,disabled){//获取一个实例模型
        var getUrl=this.state.getUrl;
        if(getUrl.indexOf("?")>0) {//已经带了参数

            getUrl=getUrl+"&id="+id;
        }
        else {
            getUrl=getUrl+"?id="+id;
        }
        let fetchModel = new FetchModel(getUrl, this.getSuccess.bind(disabled), null, this.fetchErrorHandler);
        unit.fetch.get(fetchModel);
    },
    getSuccess:function(result,disabled) {//
     if(result.data)
     {
         var model=this.state.model;
         for(var index=0;index<model.length;index++) {
             if (result.data[model[index].name]) {
                 model[index].value = result.data[model[index].name];
             }
             else {
                 model[index].value = null;//清空
             }
         }
         this.setState({
             model:model,
             disabled:false,//非只读
             submitButton:this.submitButton(disabled),//提交按钮是否有效
         });
     }
    },
    addHandler:function(model) {//新增事件
        let fetchModel = new FetchModel(this.state.addUrl, this.addSuccess, model, this.fetchErrorHandler);
        unit.fetch.post(fetchModel);
    },
    addSuccess:function(result) {//新增成功
        this.refs.datagrid.reload();//刷新列表
    },
    deleteHandler:function(id){//删除事件
        Message.confirm("确定删除这条记录吗?",()=>{
            var deleteUrl=this.state.deleteUrl;
            if(deleteUrl.indexOf("?")>0)
            {//已经带了参数

                deleteUrl=deleteUrl+"&id="+id;
            }
            else
            {
                deleteUrl=deleteUrl+"?id="+id;
            }
            let fetchModel = new FetchModel(deleteUrl, this.deleteSuccess, null, this.fetchErrorHandler);
            unit.fetch.get(fetchModel);
        });

    },
    deleteSuccess:function(result) {//删除成功
        this.refs.datagrid.reload();//刷新列表
    },
    updateHandler:function(model) {//更新事件
        let fetchModel = new FetchModel(this.state.updateUrl, this.addSuccess, model, this.fetchErrorHandler);
        unit.fetch.post(fetchModel);
    },
    updateSuccess:function(result) {//更新成功
        this.refs.datagrid.reload();//刷新列表
    },
    filterHandler:function(params) {//筛选查询
     this.refs.datagrid.reload(params);
    },
    openSlideHandler:function(type,id) {//打开表单面板
        this.refs.form.clearData();//先清空原来值
         switch (type)
         {
             case "add":
                 //新增
                 this.setState({
                     disabled:false,//非只读
                     submitButton:this.submitButton(false),//提交按钮有效
                 });
                 break;
             case "update":
                 //更新
                 this.getHandler(id,false);//提交按钮有效
                 break;
             case "search":
                 //查询
                 this.getHandler(id,true);//提交按钮无效
                 break;
         }
    },
    submitHandler:function(type){//提交按钮事件
         var model=this.refs.form.getData();//获取数据
         switch (type)
         {
             case "add":
                 this.addHandler(model);
                 break;
             case "update":
                 this.updateHandler(model);
                 break;
         }
     },
    btnHandler:function(){

    },
    fetchErrorHandler:function(errorCode, errorMssage) {//统一错误处理
        console.log( errorCode,errorMssage);
        Message.error("操作失败，原因"+errorMssage);
    },
}
module .exports=PageHandlerMixins;