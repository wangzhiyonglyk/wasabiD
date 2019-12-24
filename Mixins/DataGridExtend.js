/**
 * Created by wangzhiyong on 2016/10/25.
 * 将原有的单击与双击事件
 * 将新增,修改,粘贴,鼠标右键,滚动,固定表头,固定列,等功能
 * 作为DataGrid扩展功能
 */
import React, { Component } from "react";
import unit from "../libs/unit.js";
import FetchModel from "../Model/FetchModel.js";
import Message from "../Unit/Message.jsx";
let DataGridExtend= {
    //列表常用操作
    onClick: function (rowIndex,rowData) {

        if (this.props.selectChecked == true) {
            let key = this.getKey(rowIndex);//获取关键字
            if (this.state.checkedData.has(key)) {
                this.onChecked(rowIndex, "");
            }
            else {
                this.onChecked(rowIndex, key);
            }
        }
        if (this.props.onClick != null) {
            this.props.onClick(rowData,rowIndex);//注意参数换了位置,因为早期版本就是这样子
        }

    },
    onDoubleClick: function (rowIndex,rowData ) {
        if (this.props.onDoubleClick != null) {//如果自定义了,
            this.props.onDoubleClick(rowData,rowIndex );

        }
        else if(this.state.editAble) {//没有自定义,允许编辑表格
            if (this.state.editIndex != null && this.state.editIndex != rowIndex) {//说明上一行编辑完成
                this.remoteUpdateRow(rowIndex);
            }
            else {//没有上一行
                this.setState({
                    editIndex: rowIndex
                })
            }
        }
    },
    pageUpdateHandler:function (pageSize,pageIndex) {//改变分页大小，或者跳转
        this.updateHandler(this.state.url,pageSize*1, pageIndex*1, this.state.sortName, this.state.sortOrder, null, null);
    },
    //详情页面
    detailViewHandler: function (detail) {
        var colSpan = this.state.headers.length;

        var key = this.getKey(this.focusIndex);
        if (this.props.selectAble == true) {
            colSpan++;
        }
        this.setState({
            detailIndex: key,
            detailView: <tr key={key+"detail"}>
                <td colSpan={colSpan}>
                    <div className="wasabi-detail">{detail}</div>
                </td>
            </tr>,
        })
    },




    /**与表头右键菜单相关事件 */

     headerContextMenuHandler:function(event) {//显示菜单
        if(this.refs.headermenu.style.display=="block") {//已经出现了,不处理

        }
        else {//
            this.menuHeaderName = event.target.getAttribute("name");//保存当前列名
            //调整菜单位置
            this.refs.headermenu.style.left = (event.clientX - this.refs.grid.getBoundingClientRect().left) + "px";
            this.refs.headermenu.style.top = (event.clientY - this.refs.grid.getBoundingClientRect().top) + "px";
            this.refs.headermenu.style.display = "block";
            event.preventDefault();//阻止默认事件

        }
        this.bindClickAway();//绑定全局单击事件

    },

    gridMouseDownHandler:function(event){//全局列表鼠标按下事件

      
        if(event.button!=2)
        {//不是鼠标右键
            if(event.target.className=="header-menu-item")
            {//点击中的就是菜单项不处理

            }
            else
            {
                this.hideMenuHandler();//隐藏菜单
            }

        }
        else
        {//又是鼠标右键
            if(event.target.className=="header-menu-item")
            {//点击中的就是菜单项不处理

            }
            else
            {//隐藏
                this.hideMenuHandler();//隐藏菜单
            }
        }

    },
    hideMenuHandler:function (event) {//隐藏菜单，远程更新某一行
        this.refs.headermenu.style.display="none";//表头菜单隐藏
        this.menuHeaderName=null;//清空全局列名
        //this.unbindClickAway();//卸载全局单击事件
    },
    
    headerMouseDownHandler: function (event) {//表头列,鼠标按下事件
            this.refs.headermenu.style.display="none";//隐藏菜单
            // 设置为空
            this.moveHeaderName = null;
        
        


    },
   
    menuHideHandler:function(event) {//菜单面板中的处理事件 没有使用单击事件,用户有可能继续使用鼠标右键,隐藏某一列的事件
        let headers = this.state.headers;//列表数据
        let headerMenu=this.state.headerMenu;
        for (let index = 0; index < headers.length; index++) {
            //使用label,因为多个列可能绑定一个字段
            if (headers[index].label == this.menuHeaderName) {//需要隐藏的列
                headerMenu.push(this.menuHeaderName);//放入隐藏列中
                headers[index].hide=true;
                this.hideMenuHandler();//隐藏菜单
            }

        }
        this.setState({
            headers:headers,
            headerMenu:headerMenu
        })

    },
    menuShowHandler:function(itemIndex,label) {//菜单面板中的处理事件 没有使用单击事件,用户有可能继续使用鼠标右键,显示某列

        let headers = this.state.headers;//列表数据
        let headerMenu=this.state.headerMenu;


        for (let index = 0; index < headers.length; index++) {
            //使用label,因为多个列可能绑定一个字段
            if (headers[index].label == label) {//需要显示的列
                headerMenu.splice(itemIndex,1);//从隐藏列中删除
                headers[index].hide=false;//显示此列
                this.hideMenuHandler();//隐藏菜单

            }

        }
        this.setState({
            headers:headers,
            headerMenu:headerMenu
        })
    },
    /**与表头右键菜单相关事件 */
  

    /**列表样式问题 */
    tableBodyScrollHandler: function (event) {//监听列表的横向滚动的事件,以便固定表头可以一同滚动
        this.refs.fixedTableContainer.style.left = "-" + event.target.scrollLeft + "px";

    },


    resizeTableWidthHandler:function () { //表格宽度调整
        this.setCellAlign();//调整单元格对齐问题

    },
    setCellAlign:function () {//调整单元格对齐问题
        //处理对齐问题
        var fixedTableHeaderth = this.refs.fixedTable.children[0].children[0].children;
        //列表的原始表头的列
        var realTableHeaderth = this.refs.realTable.children[0].children[0].children;

        for (let index = 0; index < realTableHeaderth.length; index++) {//遍历，如果原始表头的列的宽度与固定表头对应列不一样,就设置
            //设置th的宽度
            if (realTableHeaderth[index].getBoundingClientRect().width != fixedTableHeaderth[index].getBoundingClientRect().width) {
                let thwidth = realTableHeaderth[index].children[0].getBoundingClientRect().width;
                //设置cell
                fixedTableHeaderth[index].children[0].style.width = ( thwidth) + "px";
                realTableHeaderth[index].children[0].style.width = (thwidth) + "px";
            }
        }
    },

      /**列表样式问题 */

    /**扩展功能 自定义操作面板，粘贴 */
    getHeaderDataHandler:function (headerUrl) {//从后台获取自定义列
        if(!headerUrl){
            headerUrl=this.state.headerUrl;
        }
        if(headerUrl)
        {
            var fetchmodel=new FetchModel(headerUrl,this.getHeaderDataHandlerSuccess,{url:this.state.url},this.ajaxError);
            console.log("datagrid-header-get:",fetchmodel);
            unit.fetch.post(fetchmodel);
        }
        this.setState({
            loading:true,//正在加载
        })

    },
    getHeaderDataHandlerSuccess:function (result) {
        if(result.rows)
        {
            result.data=result.rows;
        }
      var filterResult=  this.headerFilterHandler(result.data);
        //更新
        this.setState({
            headers: filterResult.headers,
            remoteHeaders: filterResult.remoteHeaders,
            loading: false,//正在加载
        })

    },

    panelShow:function () {//操作面板面板显示/隐藏
        this.setState({
            panelShow:!this.state.panelShow
        })
    },
     //excel粘贴事件
    onPaste: function (event) { //excel粘贴事件   
        //调用公共用的粘贴处理函数
        this.pasteHandler(event, this.pasteSuccess);
    },
        //粘贴事件
    pasteSuccess: function (data) {
     typeof this.props.pasteSuccess =="function" &&this.props.pasteSuccess();
    },
    /**扩展功能 自定义操作面板，粘贴 */
    

    /****新增，修改，删除*/
    addRow:function(rowData,editAble) {//添加一行,如果editable为true，说明添加以后处理编辑状态
        let newData=this.state.data;
        newData.unshift(rowData);
        this.state.addData.set(this.getKey(0),rowData);//添加到脏数据里
        this.focusIndex=0;
        this.setState({
            detailIndex: null,
            detailView: null,
            data:newData,
            total:this.state.total+1,
            addData:this.state.addData,
            editIndex:editAble?0:null,
        });
    },
    deleteRow:function (rowIndex) {//删除指定行数据

        this.state.deleteData.push(this.state.data.splice(rowIndex,1));
        let newData=this.state.data.splice(rowIndex,1);

        this.setState({
            data:newData,
            total:this.state.total-1,
            deleteData:this.state.deleteData
        });
    },
    editRow:function (rowIndex) {//让某一个处理编辑状态

        this.setState({
            editIndex:rowIndex
        })

    },
    updateRow:function(rowIndex,rowData) {// //只读函数,更新某一行数据
        this.state.updatedData.set(this.getKey(rowIndex),rowData);//更新某一行

        if(rowIndex>=0&&rowIndex<this.state.data.length) {
            var newData = this.state.data;
            newData[rowIndex] = rowData;
            this.setState(
                {
                    data: newData,
                    updatedData: this.state.updatedData
                });
        }
    },
    rowEditHandler:function (columnIndex,value, text, name, data) {  //编辑时单元格内的表单onchange的监听事件
          if (this.state.headers[columnIndex].editor && typeof this.state.headers[columnIndex].editor.edited === "function") {
              //得到新的一行数据
              this.state.data[this.state.editIndex] = this.state.headers[columnIndex].editor.edited(value, text, this.state.data[this.state.editIndex]);//先将值保存起来，不更新状态

          }
          else if(this.state.headers[columnIndex].editor ) {
              //没有则默认以value作为值
              this.state.data[this.state.editIndex][name] = value;//先将值保存起来，不更新状态值
          }

        if(this.state.addData.has(this.state.editIndex))
        {//说明是属于新增的
            this.state.addData.set(this.getKey(this.state.editIndex),this.state.data[this.state.editIndex]);
        }
        else {//属于修改的
            this.state.updatedData.set(this.getKey(this.state.editIndex),this.state.data[this.state.editIndex]);
        }
    },

    getAddData:function () {//获取新增数据
        var addData=[];
        for (let value of this.state.addData.values()) {
            addData.push(value);
        }
        return addData;
    },
    getUpdateData:function () {//获取被修改过的数据
        var updatedData=[];
        for (let value of this.state.updatedData.values()) {
            updatedData.push(value);
        }
        return updatedData;
    },
    getDeleteData:function () {//获取被删除的数据
      return this.state.deleteData;
    },
    clearDirtyData:function () {//清除脏数据

        //清除脏数据
        this.setState({
            addData:new Map(),
            updatedData:new Map(),
            deleteData:[],
        })
    },
     remoteUpdateRow:function (newEditIndex) {//远程提交某一行数据
        if (this.state.updateUrl) {//定义url,保存上一行
            var fetchmodel = new FetchModel(this.state.updateUrl, this.remoteUpdateRowuccess.bind(this,newEditIndex), {model: this.state.data[this.state.editIndex]}, this.ajaxError);
            console.log("datagrid-updateRow:", fetchmodel);
            unit.fetch.post(fetchmodel);
        }
        else {//没有定义url
            if(this.state.addData.has(this.getKey(this.state.editIndex)))
            {//说明是属于新增的
                this.state.addData.set(this.getKey(this.state.editIndex),this.state.data[this.state.editIndex]);
            }
            else {//属于修改的
                this.state.updatedData.set(this.getKey(this.state.editIndex),this.state.data[this.state.editIndex]);
            }
            this.setState({
                editIndex: newEditIndex,
                data:this.state.data,
                addData:this.state.addData,
                updatedData:this.state.updatedData
            })
        }
    },
    remoteUpdateRowuccess:function (newEditIndex,result) {//远程提交某一行数据
        if(this.state.addData.has(this.getKey(this.state.editIndex)))
        {//说明是属于新增的
            this.state.addData.delete(this.getKey(this.state.editIndex));
        }
        else {//属于修改的
            this.state.updatedData.delete(this.getKey(this.state.editIndex));
        }
        if (result.success) {
            this.setState({
                editIndex: newEditIndex,
            })
        }
    },
    //错误处理事件
    ajaxError:function (errorCode,message) {//错误处理事件
        Message.error(message);
    }
      /****新增，修改，删除*/
}
export default DataGridExtend;

