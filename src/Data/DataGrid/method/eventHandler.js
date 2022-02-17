/**
 * Created by wangzhiyong on 2016/10/25.
 * edit by wangzhiyong 2020-05-09 修复分页的问题
 * 将DataGrid拆分,基本处理事件存在这里
 */
import React from "react";
import func from "../../../libs/func.js";
export default {

    /**
   * 获取当行的key
   * @param {*} rowIndex 行，
   * @param {*} pageIndex 页号
   */
    getKey: function (rowIndex) {
        let key = "";
        let pageIndex = this.state.pageIndex;
        if (rowIndex == null && rowIndex == undefined) {
            console.log(new Error("index 值传错"));
        }
        else {
            key =( this.state.data && this.state.data[rowIndex] && this.state.data[rowIndex][this.props.priKey])??pageIndex.toString() + "-" + rowIndex.toString()
            
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
        if (value && value !=="") {
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
        if (this.props.onChecked !==null) {
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
        if (!(this.state.data instanceof Array)) {
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
        if (!(this.state.data instanceof Array)) {
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
        if (this.props.onChecked !==null) {//执行父组件的onchecked事件
            var data = [];
            for (let value of checkedData.values()) {
                data.push(value);
            }
            this.props.onChecked(data);
        }

    },
    /**
     * 单元格单击事件
     * @param {*} rowData 行数据
     * @param {*} rowIndex 行号
     * @param {*} columnIndex 列号
     * @param {*} event 
     */
    onClick: function (rowData, rowIndex, columnIndex) {
        console.log("row",rowData,rowIndex,columnIndex)
        this.setState({
            focusIndex: rowIndex,
            focusColumnIndex:columnIndex
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
     * 页号,与大小改变
     * @param {*} pageIndex 
     */
    paginationHandler: function (pageIndex, pageSize) {//分页处理函数
        if (pageIndex == this.state.pageIndex && this.pageSize == this.state.pageSize) {//当前页,不处理
            return;
        }
        else {//跳转到指定页

            this.loadData(this.state.url, pageSize, pageIndex, this.state.sortName, this.state.sortOrder, this.state.params);
        }
    },
    /**
    * 编辑时设置单元格的编辑样式
    */
    setHeaderEditor() {
        //如果没有设置编辑，则设置
        let headers = func.clone(this.state.headers);
        if (headers && headers.length > 0) {

            for (let i = 0; i < headers.length; i++) {
                if (headers[i] instanceof Array) {
                    for (let j = 0; j < headers[i].length; j++) {
                        if (headers[i][j].colSpan && headers[i][j].colSpan > 1) {
                            //跨行的列不设置
                            continue;
                        }
                        else {
                            headers[i][j].editor = headers[i][j].editor ? headers[i][j].editor : {
                                type: "text"
                            }
                        }
                    }
                }
                else {
                    headers[i].editor = headers[i].editor ? headers[i].editor : {
                        type: "text"
                    }

                }
            }


        }
        return {
            headers: headers,
        }
    },
    /**
       * 排序事件
       * @param {*} sortName 
       * @param {*} sortOrder 
       */
    onSort: function (sortName, sortOrder) {  //排序事件
        this.loadData(this.state.url, this.state.pageSize, 1, sortName, sortOrder);
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
            if (this.props.onDetail !==null) {
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
                        detailView: <tr key={key + "-detail"}>
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

   
}
