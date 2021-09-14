/**
 * Created by wangzhiyong on 2016/10/25.
 * edit by wangzhiyong 2020-05-09 修复分页的问题
 * 将DataGrid拆分,基本处理事件存在这里
 */
import React, { Component } from "react";
import func from "../../../libs/func.js";
import FetchModel from "../../../Model/FetchModel.js";
import Msg from "../../../Info/Msg.jsx";
import api from "wasabi-api"
export default {

    /**
        * 获取当行的key
        * @param {*} rowIndex 
        * @param {*} pageIndex 
        */
    getKey: function (rowIndex, pageIndex) {//todo 暂时以下标
        let key = "";
        if (!pageIndex) {
            pageIndex = this.state.pageIndex;
        }
        if (rowIndex == null && rowIndex == undefined) {
            console.log(new Error("index 值传错"));
        }
        else {
            if (this.props.priKey) {
                key = this.state.data[rowIndex][this.props.priKey];
            }
            else {
                key = pageIndex.toString() + "-" + rowIndex.toString();//默认用序号作为关键字
            }

        }
        return key + "";
    },

    /**
     * 勾选事件
     * @param {*} index 
     * @param {*} value 
     */
    onChecked: function (index, value) {//选中事件

        let checkedData = (this.state.checkedData);//已经选中的行
        let checkedIndex = (this.state.checkedIndex);//已经选中的行的序号，用于导出
        if (this.props.singleSelect == true) {//单选则清空
            checkedData = new Map();//单选先清空之前的选择
            checkedIndex = new Map();
        }
        let key = this.getKey(index);//获取关键字
        if (value && value != "") {
            checkedData.set(key, this.state.data[index]);
            checkedIndex.set(index + "", index);
        } else {
            checkedData.delete(key);
            checkedIndex.delete(index + "");
        }

        this.setState({
            checkedData: checkedData,
            checkedIndex: checkedIndex
        })
        if (this.props.onChecked != null) {
            var data = [];
            for (let value of checkedData.values()) {
                data.push(value);
            }
            this.props.onChecked(data);//用于返回
        }
    },

    /**
     * 判断当前页是否全部选中
     */
    checkCurrentPageCheckedAll: function () {//
        if (this.state.data instanceof Array) {

        }
        else {
            return;
        }
        let length = this.state.data.length;
        if (length == 0) {
            return false;//如果没有数据，则不判断，直接返回
        }
        var ischeckall = true;
        for (let i = 0; i < length; i++) {
            if (!this.state.checkedData.has(this.getKey(i))) {
                ischeckall = false;
                break;
            }
        }
        return ischeckall;
    },
    /**
     * 全选事件
     * @param {*} value 
     */
    checkedAllHandler: function (value) {//全选按钮的单击事件
        if (this.state.data instanceof Array) {

        }
        else {
            return;
        }
        let length = this.state.data.length;
        let checkedData = this.state.checkedData;
        let checkedIndex = this.state.checkedIndex;
        for (let i = 0; i < length; i++) {
            let key = this.getKey(i);


            if (value == "yes") {
                if (!checkedData.has(key)) {
                    checkedIndex.set(i + "", i);
                    checkedData.set(key, this.state.data[i]);//添加
                }
            }
            else {
                if (checkedData.has(key)) {
                    checkedIndex.delete(i + "");
                    checkedData.delete(key);//删除
                }
            }
        }
        this.setState({ checkedData: checkedData, checkedIndex: checkedIndex });
        if (this.props.onChecked != null) {//执行父组件的onchecked事件
            var data = [];
            for (let value of checkedData.values()) {
                data.push(value);
            }
            this.props.onChecked(data);
        }

    },

    /**
     * 单击事件
     * @param {*} rowData 行数据
     * @param {*} rowIndex 行号
     * @param {*} columnIndex 列号
     * @param {*} event 
     */
    onClick: function (rowData, rowIndex, columnIndex) {
        this.setState({
            focusIndex: rowIndex
        })
        if (this.props.selectChecked == true) {

            let key = this.getKey(rowIndex);//获取关键字
            if (this.state.checkedData.has(key)) {
                this.onChecked(rowIndex, "");
            }
            else {
                this.onChecked(rowIndex, key);
            }
        }
        if (this.state.editAble) {//没有自定义,允许编辑表格
            this.setState({
                ...this.setHeaderEditor(),//设置表头
                editIndex: rowIndex + "-" + columnIndex,
            }, () => {
                this.focusCell(rowIndex, columnIndex);
            })

        }
        this.props.onClick && this.props.onClick(rowData, rowIndex, columnIndex);//

    },


    /**
     * 双击事件
     * @param {*} rowData 行数据
     * @param {*} rowIndex 行号
     * @param {*} columnIndex 列号
     * @param {*} event 
     */
    onDoubleClick: function (rowData, rowIndex, columnIndex) {
        this.props.onDoubleClick && this.props.onDoubleClick(rowData, rowIndex, columnIndex);
    },
    /**
     * 编辑的单元格获取得焦点
     * @param {*} rowIndex 
     * @param {*} columnIndex 
     */
    focusCell(rowIndex, columnIndex) {
        try {
            if (this.props.rowNumber) { columnIndex++ };
            if (this.props.detailAble) { columnIndex++ };
            if (this.props.selectAble) { columnIndex++ };
            
            let f = document.getElementById(this.state.realTableid).children[2].querySelector(".focus");
            if (f) { f.className = "" };
            document.getElementById(this.state.realTableid).children[2].children[rowIndex].children[columnIndex].className = "focus";
            document.getElementById(this.state.realTableid).children[2].children[rowIndex].children[columnIndex].querySelector("input").focus()
        }
        catch (e) {

        }

    },
    /**
     * 真实表格的鼠标滚动事件，用于固定列左右移动的时候
     */
    onRealTableScoll: function (event) {
        setTimeout(() => {
            try {
                //固定列的表格 纵向
                if (document.getElementById(this.state.fixedTableContainerid)) {
                    document.getElementById(this.state.fixedTableContainerid).style.top =
                        (0 - document.getElementById(this.state.realTableContainerid).scrollTop) + "px";

                }

                //固定表头 横向
                if (document.getElementById(this.state.fixedthcontainerid)) {
                    document.getElementById(this.state.fixedthcontainerid).style.left =
                        (0 - document.getElementById(this.state.realTableContainerid).scrollLeft) + "px";
                }
            }
            catch (e) {

            }


        }, 0);

    },


    /**
     * 页号,与大小改变
     * @param {*} pageIndex 
     */
    paginationHandler: function (pageIndex, pageSize) {//分页处理函数
        if (pageIndex == this.state.pageIndex && this.pageSize == this.state.pageSize) {//当前页,不处理
            return;
        }
        else {//跳转到指定页

            this.onUpdate(this.state.url, pageSize, pageIndex, this.state.sortName, this.state.sortOrder, this.state.params);
        }
    },



    /**
    * 编辑时设置单元格的编辑样式
    */
    setHeaderEditor() {
        //如果没有设置编辑，则设置
        let headers = func.clone(this.state.headers);
        if (headers && headers.length > 0) {
            if(this.state.single){
                for (let i = 0; i < headers.length; i++) {
                    headers[i].editor = headers[i].editor ? headers[i].editor : {
                        type: "text"
                    }
                }
            }
            else{
               for(let i=0;i<headers.length;i++){
                   if(headers[i] instanceof Array &&headers[i].length>0){
                       for(let j=0;j<headers[i].length;j++){
                           if(headers[i][j].colSpan&&headers[i][j].colSpan>1){
                               //跨行的列不设置
                               continue;
                           }
                           else{
                            headers[i][j].editor =  headers[i][j].editor ? headers[i][j].editor : {
                                type: "text"
                            }
                           }
                       }
                   }
               }
            }
            
        }
        let fixedHeaders = [];
        if (this.state.fixedHeaders && this.state.fixedHeaders.length > 0) {
            fixedHeaders = func.clone(this.state.fixedHeaders);
            for (let i = 0; i < fixedHeaders.length; i++) {
                fixedHeaders[i].editor = fixedHeaders[i].editor ? fixedHeaders[i].editor : {
                    type: "text"
                }
            }
        }
        return {
            headers: headers,
            fixedHeaders: fixedHeaders
        }
    },
    /**
       * 排序事件
       * @param {*} sortName 
       * @param {*} sortOrder 
       */
    onSort: function (sortName, sortOrder) {  //排序事件
        this.onUpdate(this.state.url, this.state.pageSize, 1, sortName, sortOrder);

    },
    /**
    * 添加一条
    */
    onAdd() {
        let rowData = {};
        for (let i = 0; i < this.state.headers.length; i++) {
            rowData[this.state.headers[i].name] = "";
        }
        this.addRow(rowData, true);//添加的是空数据，允许编辑
    },
    /**
     * 保存
     */
    onSave() {
        this.setState({
            editIndex: null
        })
        let addData = this.getAddData();
        let updateData = this.getUpdateData();
        let deleteData = this.getDeleteData();
        console.log({
            addData: addData,
            updateData,
            deleteData
        })
        this.props.onSave && this.props.onSave({
            addData: addData,
            updateData,
            deleteData
        });

    },
    /**
     * 点击弹出详情
     * @param {*} rowData 
     * @param {*} rowIndex 
     */
    onDetail: function (rowData, rowIndex) {//执行显示详情功能       
        const key = this.getKey(rowIndex);//获取关键值
        if (key == this.state.detailIndex) {
            this.setState({
                detailIndex: null,
                detailView: null,
            })
        }
        else {
            if (this.props.onDetail != null) {
                const detail = this.props.onDetail(rowData, rowIndex);
                if (!detail) {
                    this.setState({
                        detailIndex: null,//方便下次操作
                        detailView: null,
                    })
                }
                else {
                    let colSpan = this.columnSum + 1;//总列数+1,因为本身存在详情列

                    if (this.props.selectAble) {
                        colSpan++;
                    }
                    if (this.props.rowNumber) {
                        colSpan++;
                    }

                    this.setState({
                        detailIndex: key,
                        detailView: <tr key={key + "detail"}>
                            <td colSpan={colSpan}><div className="wasabi-detail" >{detail}</div></td>
                        </tr>,
                    })
                }

            }
        }
    },

    /**
     * 单元格编辑事件
     * @param {*} rowIndex 行的序号
     * @param {*} columnIndex 真正的列序号
     * @param {*} headerRowIndex 表头的行号
     * @param {*} headerColumnIndex 表头的列号
     * @param {func} callBack 自定义的回调函数
     * @param {*} value 值
     * @param {*} text 文本值
     * @param {*} name 对字段名
     */
    tableCellEditHandler: function (rowIndex, callBack, value, text, name) {  //编辑时单元格内的表单onchange的监听事件 
        if (this.state.addData.has(rowIndex)) {//说明是属于新增的
            this.state.addData.set(this.getKey(rowIndex), this.state.data[rowIndex]);
        }
        else {//属于修改的
            this.state.updateData.set(this.getKey(rowIndex), this.state.data[rowIndex]);
        }
        let data = func.clone(this.state.data);
        data[rowIndex][name] = value;
        this.setState({
            data: data,
            addData: this.state.addData,
            updateData: this.state.updateData
        })
        //自定义的回调函数
        if (callBack && typeof callBack == "function") {
            callBack(value, text, name);
        }


    },

    /**
     * 数据更新处理
     * @param {*} url 请求的url
     * @param {*} pageSize 分页大小
     * @param {*} pageIndex 页号
     * @param {*} sortName  排序字段
     * @param {*} sortOrder  排序方式
     * @param {*} params 参数
     */
    onUpdate: function (url, pageSize, pageIndex, sortName, sortOrder, params) {////数据处理函数,更新
        if (this.state.addData.size > 0 || this.state.deleteData.size > 0 || this.state.updateData.size > 0) {
            Msg.confirm("有脏数据,是否继续更新列表?", () => {
                this.onUpdateConfirm(url, pageSize, pageIndex, sortName, sortOrder, params);
            })

        }
        else {
            this.onUpdateConfirm(url, pageSize, pageIndex, sortName, sortOrder, params);
        }
    },
    /**
     * 更新确认函数
     * @param {*} url 请求的url
     * @param {*} pageSize 分页大小
     * @param {*} pageIndex 页号
     * @param {*} sortName  排序字段
     * @param {*} sortOrder  排序方式
     * @param {*} params 参数
     */
    onUpdateConfirm: function (url, pageSize, pageIndex, sortName, sortOrder, params) {
        /*
     url与params而url可能是通过reload方法传进来的,并没有作为状态值绑定
     headers可能是后期才传了,见Page组件可知
     所以此处需要详细判断
     */

        url = url || this.state.url;
        if (url) {
            this.setState({
                loading: true,
                url: url,//更新,有可能从reload那里直接改变了url
            })
            let httpParams = typeof params == "object" ? func.clone(params) : {};//本次请求的参数
            if (this.props.pagination == true) {
                if (!httpParams) {
                    httpParams = {};
                }
                httpParams.pageSize = pageSize;
                httpParams.pageIndex = pageIndex;
                httpParams.sortName = sortName;
                httpParams.sortOrder = sortOrder;
            }

            /*
             在查询失败后可能要继续调用onUpdate查询前一页数据,所以传url,以便回调,
             而pageSize,pageIndex,sortName,sortOrder,params这些参数在查询成功后再更新
             所以回传
             */

            let type = this.props.httpType ? this.props.httpType : "POST";
            type = type.toUpperCase();
            let fetchmodel = new FetchModel(url, this.loadSuccess.bind(this, url, pageSize, pageIndex, sortName, sortOrder, params), httpParams, this.loadError, type, this.props.httpHeaders);
            fetchmodel.headers = this.props.httpHeaders;
            if (this.props.contentType) {
                //如果传contentType值则采用传入的械
                //否则默认

                fetchmodel.contentType = this.props.contentType;
                fetchmodel.data = fetchmodel.contentType == "application/json" ? fetchmodel.data ? JSON.stringify(fetchmodel.data) : "{}" : fetchmodel.data;
            }

            console.log("datagrid-开始查询:", fetchmodel);
            let wasabi_api = window.api || api;
            wasabi_api.ajax(fetchmodel);

        }
        else {
            //没有传url,判断用户是否自定义了更新函数
            if (this.props.onUpdate != null) {

                this.props.onUpdate(pageSize, pageIndex, sortName, sortOrder);
            }
            else {
                if (this.state.rawData.length > (pageIndex * pageSize)) {
                    //说明父传的数据就是全部的
                    this.setState({
                        pageSize: pageSize,
                        pageIndex: pageIndex,
                        sortName: sortName,
                        sortOrder: sortOrder,
                        data: this.state.rawData.slice((pageIndex - 1) * pageSize, (pageIndex - 1) * pageSize + pageSize - 1)
                    })
                }
            }
        }

    },
    /**
     * 加载成功事件
     * @param {*} url 
     * @param {*} pageSize 
     * @param {*} pageIndex 
     * @param {*} sortName 
     * @param {*} sortOrder 
     * @param {*} params 
     * @param {*} result 
     */
    loadSuccess(url, pageSize, pageIndex, sortName, sortOrder, params, result) {//数据加载成功
        if (typeof this.props.loadSuccess === "function") {
            //如果父组件指定了数据加载后的方法，先执行，然后再处理数据
            let resultData = this.props.loadSuccess(result);
            //有正确的返回值
            result = resultData && typeof resultData instanceof Array ? resultData : result;
        }
        var dataResult;//最终数据
        var totalResult;//最终总共记录
        var footerResult;//最终统计数据
        var dataSource = this.props.dataSource;//数据源

        if (dataSource && typeof dataSource === "string") {//需要重新指定数据源
            dataResult = func.getSource(result, dataSource || "data");
        }
        else {
            dataResult = result;
        }
        if (this.props.pagination && this.props.totalSource) {//分页而且需要重新指定总记录数的数据源
            totalResult = func.getSource(result, this.props.totalSource || "total");
        }
        else if (this.props.pagination) {//分页了,没有指定,使用默认的
            if (result.total) {
                totalResult = result.total;
            }
            else {
                totalResult = dataResult.length;
                throw ("datagrid分页了,但返回的数据没有指定total");
            }

        }
        else {//不分页
            totalResult = dataResult.length;
        }

        if (this.props.footerSource)//需要重新指定页脚的数据源
        {
            footerResult = func.getSource(result, this.props.footerSource || "footer");
        }
        else {//没有指定，
            if (result.footer) {
                footerResult = result.footer;//默认的
            }
            else {

            }


        }
        if (!footerResult) {
            footerResult = this.state.footer;
        }
        console.log("datagrid-fetch结果", {
            "原数据": result,
            "处理后的数据": dataResult
        });
        if (totalResult > 0 && dataResult && dataResult instanceof Array && dataResult.length == 0 && totalResult > 0 && pageIndex != 1) {
            //有总记录，没有当前记录数,不是第一页，继续查询转到上一页
            this.onUpdate(url, pageSize, pageIndex - 1, sortName, sortOrder, params);
        }
        else {
            //查询成功
            if (dataResult && dataResult instanceof Array) {//是数组,
                dataResult = (this.props.pagination == true ? dataResult.slice(0, pageSize) : dataResult);
            }


            this.setState({
                url: url,
                pageSize: pageSize,
                params: func.clone(params),//这里一定要复制,只有复制才可以比较两次参数是否发生改变没有,防止父组件状态任何改变而导致不停的查询
                pageIndex: pageIndex,
                sortName: sortName,
                sortOrder: sortOrder,
                data: dataResult,
                total: totalResult,
                footer: footerResult,
                loading: false,
                detailIndex: null,//重新查询要清空详情
                detailView: null,
            })

        }

    },

    /**
     * 加载失败
     * @param {*} message 
     */
    loadError: function (message) {//查询失败
        console.log("datagrid-error", message);
        Msg.error(message);
        this.setState({
            loading: false,
        })
    },

}
