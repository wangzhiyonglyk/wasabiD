/**
 * create by wangzhiyong
 * date:2020-12-20
 */
import React from "react";
import func from "../../../libs/func.js";
import Msg from "../../../Info/Msg"
// import excel from "../../../libs/excel.js";
export default {
    /**
    * 专门用于交叉表与树表格
    * @param {*} id 
    */
    setClick(id) {
        for (let i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i]["id"] == id) {
                this.setState({
                    focusIndex: i
                })
                break;
            }
        }
    },

    /**
     * 清空数据
     */
    clearData: function () {//清空数据
        this.setState({
            data: [],
            params: [],
        });
    },
    /**
     *获取焦点行下标
     */
    getFocusIndex: function () { //只读函数,用于父组件获取数据

        return this.state.focusIndex;
    },
    /**
     * 获取焦点行数据
     */
    getFocusRowData() {
        this.getRowData();
    },
    /**
     * 获取指定行数据
     * @param {*} index 
     */
    getRowData: function (index) {//获取当前焦点行的数据
        if (index != null && index != undefined) {

        }
        else {
            index = this.state.focusIndex;
        }
        return this.state.data && this.state.data[index || 0];
    },
    /**
     * 获取勾选的数据
     */
    getChecked: function () {
        //获取选中的行数据
        var data = [];
        for (let value of this.state.checkedData.values()) {
            data.push(value);
        }
        return data;
    },
    /**
     * 设置勾选的值
     */
    setChecked: function (checkedRowData = []) {
        if (checkedRowData instanceof Array && checkedRowData.length > 0) {
            if (this.props.priKey) {
                let data = this.state.data;
                let checkedData = new Map();
                let checkedIndex = new Map();
                for (let i = 0; i < checkedRowData.length; i++) {
                    let findIndex = data.findIndex((rowData, index) => {
                        return rowData[this.props.priKey] == checkedRowData[i][this.props.priKey]
                    })
                    if (findIndex > -1) {
                        checkedIndex.set(findIndex + "", findIndex);
                        let key = this.getKey(findIndex);//获取关键字
                        checkedData.set(key + "", data[findIndex])
                    }
                }
                this.setState({
                    checkedData,
                    checkedIndex
                })

            }
            else {
                Msg.error("没有设置主键,无法自定义勾选");
            }
        }

    },
    /**
     * 通过行号来设置勾选
     * @param {*} rowIndexs 行号集合
     */
    setCheckedByIndex: function (rowIndexs = []) {
        let checkedData = new Map();
        let checkedIndex = new Map();
        for (let i = 0; i < rowIndexs.length; i++) {
            if (rowIndexs[i] * 1 > -1 && rowIndexs[i] * 1 < this.data.length) {
                //合格
                checkedIndex.set(rowIndexs[i] + "", rowIndexs[i] * 1);
                let key = this.getKey(rowIndexs[i] * 1);//获取关键字
                checkedData.set(key + "", this.state.data[findIndex])
            }
        }
        this.setState({
            checkedData,
            checkedIndex
        })
    },
    /**
     * 清除勾选
     */
    clearChecked: function () {
        this.checkedAllHandler("no");
    },
    /**
     * 添加一行
     * @param {*} rowData 数据
     * @param {*} editAble 是否可编辑
     */
    addRow: function (rowData = {}, editAble = false) {//
        let newData = func.clone(this.state.data);
        newData.push(rowData || {});
        let addData = func.clone(this.state.addData) || [];
        this.state.addData.set(this.getKey(newData.length - 1), rowData);//添加到脏数据里
        this.setState({
            ... this.setHeaderEditor(),//设置表头
            data: newData,
            total: this.state.total + 1,
            addData: addData,
            editAble: editAble || this.state.editAble,
            editIndex: editAble ? (newData.length - 1).toString() + "-0" : this.state.editIndex,
        }, () => {
            this.focusCell(this.state.data.length - 1, 0);
        });
    },
    /**
     * 删除某一行
     * @param {*} rowIndex 
     */
    deleteRow: function (rowIndex) {//删除指定行数据
        //todo这里没处理当前页全部删除的情况
        let data = func.clone(this.state.data);
        let deleteData = func.clone(this.stat.deleteData) || [];
        deleteData.push(data.splice(rowIndex, 1));
        this.setState({
            data: data,
            total: this.state.total - 1,
            deleteData: deleteData
        });
    },
    /**
     *  更新某一行数据
     * @param {*} rowIndex 行号
     * @param {*} rowData 数据
     * @param {*} editAble 是否可编辑
     */
    updateRow: function (rowIndex, rowData, editAble = false) {
        if (rowData && typeof rowData === "object") {
            this.state.updateData.set(this.getKey(rowIndex), rowData);//更新某一行
            if (rowIndex >= 0 && rowIndex < this.state.data.length) {
                let newData = func.clone(this.state.data);
                if (rowData && typeof rowData === "object") {//如果有值，则取新值
                    newData[rowIndex] = rowData;
                }
                this.setState(
                    {
                        ... this.setHeaderEditor(),//设置表头
                        data: newData,
                        updateData: this.state.updateData,
                        editAble: editAble || this.state.editAble,
                        editIndex: editAble ? rowIndex + "-0" : this.state.editIndex
                    }, () => {
                        this.focusCell(rowIndex, 0);
                    });
            }
        }

    },
   

    /**
     * 清除脏数据
     */
    clearDirtyData: function () {//
        this.setState({
            addData: new Map(),
            updateData: new Map(),
            deleteData: [],
        })
    },

    /**
     * 获取新增的数据
     * @returns 
     */
    getAddData: function () {//获取新增数据
        let addData = [];
        for (let value of this.state.addData.values()) {
            addData.push(value);
        }
        return addData;
    },
    /**
     * 获取更新的数据
     * @returns 
     */
    getUpdateData: function () {
        this.setState({
            editIndex: null,//
        })
        let updateData = [];
        for (let value of this.state.updateData.values()) {
            updateData.push(value);
        }
        return updateData;
    },
    /**
     * 获取删除的数据
     * @returns 
     */
    getDeleteData: function () {//获取被删除的数据
        return this.state.deleteData;
    },

    /**
   * 更新方法
   * @param {*} params 
   * @param {*} url 
   */
    reload: function (params = null, url = "") {//重新查询数据,
        url = url || this.state.url;//得到旧的url
        params = params || this.state.params;//如果不传则用旧的
        if (!url) {//没有url,不自行加载，则调用更新事件
            if (this.props.onUpdate) {//用户自定义了更新事件
                this.props.onUpdate(this.state.pageSize, this.state.pageIndex, this.state.sortName, this.state.sortOrder);
            }
        }
        else {//传了url        
            if (func.diff(params, this.state.params)) {//为参数发生改变,从第一页查起           
                this.onUpdate(url, this.state.pageSize, 1, this.state.sortName, this.state.sortOrder, params);
            }
            else {//从当前页查起，就是刷新
                this.onUpdate(url, this.state.pageSize, this.state.pageIndex, this.state.sortName, this.state.sortOrder, params);
            }

        }
    },

    /**
     * 导出
     * @param {*} selected 是否只导出选择行
     * @param {*} title 导出标题
     */
    export(selected = false, title = "grid-") {
        let realTable = document.getElementById(this.state.realTableid);
        title = title + func.dateformat(new Date(), "yyyy-MM-dd");
        let json = {
            headers: [],
            body: [],
        }
        //导出表头

        for (let rowIndex = 0; rowIndex < realTable.children[1].children.length; rowIndex++) {

            for (let columnIndex = 0; columnIndex < realTable.children[1].children[rowIndex].children.length; columnIndex++) {
                let html = realTable.children[1].children[rowIndex].children[columnIndex].outerHTML;
                if (html.indexOf("wasabi-detail-column") > -1 || html.indexOf("wasabi-order-column") > -1 || html.indexOf("wasabi-check-column") > -1 || html.indexOf("wasabi-noexport") > -1) {//除去序号列与选择列及不需要导出的列
                    continue;
                }
                json.headers.push(realTable.children[1].children[rowIndex].children[columnIndex].children[0].innerText);
            }

        }
        //导出表体
        if (selected) {//导出选择的行
            for (let value of this.state.checkedIndex.values()) {
                let row = [];
                for (let columnIndex = 0; columnIndex < realTable.children[2].children[value].children.length; columnIndex++) {
                    let html = realTable.children[2].children[value].children[columnIndex].outerHTML;
                    if (html.indexOf("wasabi-detail-column") > -1 || html.indexOf("wasabi-order-column") > -1 || html.indexOf("wasabi-check-column") > -1 || html.indexOf("wasabi-noexport") > -1) {//除去序号列与选择列及不需要导出的列
                        continue;
                    }
            
                    row.push(html)
                }
                json.body.push(row);
            }


        }
        else {//导出全部行
            for (let rowIndex = 0; rowIndex < this.state.data.length; rowIndex++) {
                let row = [];
                for (let columnIndex = 0; columnIndex < realTable.children[2].children[rowIndex].children.length; columnIndex++) {
                    if (realTable.children[2].children.length > rowIndex) {
                        let html = realTable.children[2].children[rowIndex].children[columnIndex].outerHTML;
                        if (html.indexOf("wasabi-detail-column") > -1 || html.indexOf("wasabi-order-column") > -1 || html.indexOf("wasabi-check-column") > -1 || html.indexOf("wasabi-noexport") > -1) {//除去序号列与选择列及不需要导出的列
                            continue;
                        }

                        row.push(realTable.children[2].children[rowIndex].children[columnIndex].children[0].innerText)
                    }
                }
                json.body.push(row);
            }
        }
        let csv = excel.json2csv(json);
        let sheet = excel.csv2sheet(csv);
        func.download(excel.sheet2blob(sheet), title);

    },


}