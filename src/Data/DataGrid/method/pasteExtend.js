/**
 * Created by wangzhiyong on 2016/11/8.
 * 将复制粘贴功能独立出来
 */

import Msg from "../../../Info/Msg";
import excel from "../../../libs/excel";
import fileType from "../../../libs/fileType";
import func from "../../../libs/func";
import pageSizeList from "../../Pagination/pageSizeList.js";
export default {
    /**
   * 停靠
   * @param {*} event 
   */
    onDragOver(event) {//在ondragover中一定要执行preventDefault()，否则ondrop事件不会被触发
        event.preventDefault();
    },
    /**
     * 文件拖动
     * @param {*} event 
     */
    onDrop(event) {
        event.preventDefault();
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0 && this.props.importAble) {
            try {
                if (fileType.filter("excel", event.dataTransfer.files[0])) {

                    excel.readFile(event.dataTransfer.files[0]).then((workbook) => {
                        let json = excel.workbook2json(workbook);
                        this.json2data(json,this.state.data.length);

                    })
                } else {
                    Msg.error("只接受excel文件");
                }

            }
            catch (e) {

            }

        }

    },
  
    //excel粘贴事件
    onPaste: async function (rowIndex, columnIndex, event, oldValue) { //excel粘贴事件  
        try {
            let text = await window.navigator.clipboard.readText();
            if (text.indexOf("\t") > -1 || text.indexOf("\n") > -1) {
                text = text.replace(/\r\n/g, "\n").replace(/\t/g, ",");//转成xlsx脚本的可操作的csv格式
                //说明是csv数据，不包含头部
                this.json2data(excel.csv2json(text, false), rowIndex, columnIndex);
            }
        }
        catch (e) {

        }
    },
    /**
     * 
     * @param {*} json 
     * @param {*} rowIndex 
     * @param {*} columnIndex 
     */
    json2data(json, rowIndex, columnIndex=0) {
        rowIndex=rowIndex===null||rowIndex===undefined?this.state.data.length:rowIndex;
        if (json && json.body) {
            const {headers} = this.setHeaderEditor();//设置表头
         
            let addData = [];
            let oldData = func.clone(this.state.data);
            let beginRowIndex = rowIndex;//开始的行下标
            let beginColumnIndex = 0;//开始的列下标
            for (let i = 0; i < json.body.length; i++) {
                let rowData = {};
                beginColumnIndex = 0;
                for (let j = columnIndex || 0; j < headers.length; j++) {
                    if (headers[j] instanceof Array) {
                        for (let k = 0; i < headers[j][k].length; k++) {
                            if (headers[j][k].colSpan > 1) {
                                continue;
                            } else {
                                if (beginColumnIndex < json.body[i].length) {
                                    rowData[headers[j][k].name] = json.body[i][beginColumnIndex];
                                    beginColumnIndex++;
                                }
                            }
                        }                 
                    } else {
                        if (beginColumnIndex < json.body[i].length) {
                            rowData[headers[j].name] = json.body[i][beginColumnIndex];
                            beginColumnIndex++;
                        }
                    }
                }

                if (beginRowIndex < oldData.length) {
                    //替换
                    oldData[beginRowIndex] = {
                        ...oldData[beginRowIndex],
                        ...rowData
                    }
                    this.state.updateData.set(this.getKey(beginRowIndex), {
                        ...oldData[beginRowIndex],
                        ...rowData
                    });//更新某一行
                }
                else {
                    addData.push(rowData)
                    this.state.addData.set(this.getKey(beginRowIndex), rowData);//更新某一行
                }
                beginRowIndex++;
            }

            let newData = [].concat(oldData, addData);
            let pageSize = this.state.pageSize;
            if (this.props.pagination) {//分页时，追加了数据，扩展分页大小，防止翻页出错
                if (newData.length > pageSize) {
                    for (let i = 0; i < pageSizeList.length; i++) {
                        pageSize = pageSizeList[i];//取最大值
                        if (pageSizeList[i] >= newData.length) {
                            break;
                        }
                    }
                }
            }
            this.setState({
                headers: headers,
                data: newData,
                total: newData.length,
                pageSize: pageSize,
                adjustHeight: true,
                editAble: true,//允许编辑
                editIndex: rowIndex !== null && rowIndex !== undefined ? rowIndex + "-" + columnIndex : this.state.editIndex,
                addData: this.state.addData,
                updateData: this.state.updateData,
            }, () => {
           
                this.focusCell(rowIndex || 0, columnIndex || 0);
            })

        }
    }
}
