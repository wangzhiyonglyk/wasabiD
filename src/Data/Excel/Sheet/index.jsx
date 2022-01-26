/**
 * Sheet组件
 * create by wangzhiyong
 * date:2021-06-26
 * dom操作要优化
 */
import React from "react";

import { Table } from "../../Table";
import SheetBody from "./SheetBody";
import SheetHeader from "./SheetHeader";
import SheetColGroup from "./SheetColGroup";
import Tool from "./Tool"
import func from "../../../libs/func";
import RightMenu from "./RightMenu";
import File from "./File"
import sheetFunc from "../sheetFunc";
import regs from "../../../libs/regs";
class Sheet extends React.Component {
    constructor(props) {
        super(props);
        this.tool = React.createRef();
        this.menu = React.createRef();
        this.state = {
            sheetcontainerid: func.uuid(),
            tableid: func.uuid(),
            activeIndexTool: 0,
            //选择区间下标
            startRowIndex: null,
            startColumnIndex: null,
            endRowIndex: null,
            endColumnIndex: null,
            //选中的区别位置
            selection: {
                x: 0,
                y: 0,
                width: 0,
                height: 0,

            },
            sheet: {

            },
            fileVisible: false,
        }
        this.changeToolActive = this.changeToolActive.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.dotonMouseDown = this.dotonMouseDown.bind(this);
        this.dotHander = this.dotHander.bind(this);
        this.dotCellCopyHandler = this.dotCellCopyHandler.bind(this);
        this.dotIncreaseHandler = this.dotIncreaseHandler.bind(this);
        this.getRowColIndex = this.getRowColIndex.bind(this);
        this.cancelChosed = this.cancelChosed.bind(this);
        this.getSelectionPosition = this.getSelectionPosition.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
        this.onToolClick = this.onToolClick.bind(this);
        this.openFile = this.openFile.bind(this);
        this.closeFile = this.closeFile.bind(this);
        this.merge = this.merge.bind(this);
        this.changeProps = this.changeProps.bind(this);
    }
    componentDidMount() {
        if (this.props.active) {
            this.setState({
                sheet: func.clone(this.props.sheet)
            })
        }
    }
    /**
     * 改变工具栏选项
     * @param {*} index 
     */
    changeToolActive(index) {
        this.setState({
            activeIndexTool: index
        })
    }
    /**
     * 输入框
     * @param {*} event 
     */
    onChange(event) {
        let sheet = JSON.parse(JSON.stringify(this.state.sheet));
        if (this.state.startRowIndex !==null && this.state.startColumnIndex !==null) {
            //浅复制就行了
            sheet.cells[this.state.startRowIndex][this.state.startColumnIndex].label = event.target.value;
            sheet.cells[this.state.startRowIndex][this.state.startColumnIndex].value = event.target.value;
        }
        this.setState({
            value: event.target.value,
            sheet
        })
    }
    /**
     * 
     * @param {*} rowIndex 
     * @param {*} columnIndex 
     * @param {*} label 
     * @param {*} event 
     */
    onClick(rowIndex, columnIndex, label, event) {
        this.setState({
            value: label || "",
        })
        this.tool.current.focus();

    }
    /**
     * 
     * @param {*} rowIndex 
     * @param {*} columnIndex 
     * @param {*} label 
     * @param {*} event 
     */
    onDoubleClick(rowIndex, columnIndex, label, event) {

    }
    onMouseDown(rowIndex, columnIndex, label, event) {
        this.altKey=event.altKey;//记住按住
        if (event.button === 0) {//鼠标左键
            this.startRowIndex = event.shiftKey ? this.state.startRowIndex : rowIndex;//标记选择开始，不更新状态值
            this.startColumnIndex = event.shiftKey ? this.state.startColumnIndex : columnIndex;
            let table = document.getElementById(this.state.tableid);
            let f = table.children[2].querySelectorAll(".chosed");
            if (f.length > 0) {
                for (let i = 0; i < f.length; i++) {//todo这里有性能问题
                    f[i].className = (f[i].className || "").replace(" chosed ", "");
                }
            }
        }

    }
    /**
     * 结束选择
     * @param {*} rowIndex 
     * @param {*} columnIndex 
     * @param {*} rowSpan 
     * @param {*} colSpan 
     */
    onMouseUp(rowIndex, columnIndex, rowSpan, colSpan, event) {
        if (this.startRowIndex !==null && this.startRowIndex !==undefined) {
            let selectIndexs = this.getRowColIndex(rowIndex, columnIndex, rowSpan, colSpan);//得到真实的选择范围
            this.cancelChosed();//取消选择
            try {
                let begindom, enddom;
                begindom = document.getElementById(selectIndexs.startRowIndex + "-" + selectIndexs.startColumnIndex);
                enddom = document.getElementById(selectIndexs.endRowIndex + "-" + selectIndexs.endColumnIndex);
                //得到真实选择的区域面积，不通过单元格数量来计算，因为有换行,合并的情况
                let selection = {
                    x: begindom.offsetLeft,
                    y: begindom.offsetTop,
                    width: enddom.offsetLeft - begindom.offsetLeft + enddom.clientWidth,
                    height: enddom.offsetTop - begindom.offsetTop + enddom.clientHeight
                };

                this.setState({
                    ...selectIndexs,
                    selection: selection

                })
                //点的拖动
                this.dotHander(selectIndexs);
            }
            catch (e) {

            }
        }

    }
    onMouseMove(event) {
        if (this.startRowIndex !==null && this.startRowIndex !==undefined) {
            let rowIndex = event.target.getAttribute("data-rowindex") * 1;
            let columnIndex = event.target.getAttribute("data-columnindex") * 1;
            let rowSpan = event.target.getAttribute("rowspan") * 1;
            let colSpan = event.target.getAttribute("colspan") * 1;
            if (rowIndex !==null && columnIndex !==null && this.moveIndex !==(rowIndex + "-" + columnIndex)) {
                //防止重复处理,因为move事件在一个单元格会执行多次
                this.moveIndex = rowIndex + "-" + columnIndex;
                let selectIndexs = this.getRowColIndex(rowIndex, columnIndex, rowSpan, colSpan)
                this.cancelChosed();//取消选择
                for (let i = selectIndexs.startRowIndex; i <= selectIndexs.endRowIndex; i++) {
                    for (let j = selectIndexs.startColumnIndex; j <= selectIndexs.endColumnIndex; j++) {
                        try {
                            if (document.getElementById(i + "-" + j) && document.getElementById(i + "-" + j).className.indexOf("chosed") <= -1) {
                                document.getElementById(i + "-" + j).className += " chosed ";
                            }
                        }
                        catch (e) {
                            console.log("e", i, j, e)
                        }

                    }
                }
            }
        }
    }
    /**
     * 尾点
     */
    dotonMouseDown(event) {
        //又标记可以拖动选择
        this.startRowIndex = this.state.startRowIndex;
        this.startColumnIndex = this.state.startColumnIndex;
        //标记是点的拖动
        this.endRowIndex = this.state.endRowIndex;
        this.endColumnIndex = this.state.endColumnIndex;
    }
    //点的拖动后事件
    dotHander(selectIndexs) {

        try {
            if (this.endRowIndex !==undefined && this.endRowIndex !==null) {//是点的拖动
                if (selectIndexs.startColumnIndex === selectIndexs.endColumnIndex) {
                    //列的拖动
                    if (this.startRowIndex === this.endRowIndex && this.startColumnIndex === this.endColumnIndex) {
                        //原来只有一个单元格，内容复制
                        let sheet = this.dotCellCopyHandler(selectIndexs, this.state.sheet.cells[this.startRowIndex][this.startColumnIndex]);
                        this.setState({
                            sheet
                        })
                    }
                    else {
                        //递增
                        let sheet = this.dotIncreaseHandler(selectIndexs, this.state.sheet.cells[this.endRowIndex][this.startColumnIndex]);
                        this.setState({
                            sheet
                        })
                    }
                }
                else if (selectIndexs.startRowIndex === selectIndexs.endRowIndex) {
                    //行的拖动
                    if (this.startRowIndex === this.endRowIndex && this.startColumnIndex === this.endColumnIndex) {
                        //复制
                        let sheet = this.dotCellCopyHandler(selectIndexs, this.state.sheet.cells[this.startRowIndex][this.startColumnIndex]);
                        this.setState({
                            sheet
                        })
                    }
                    else {
                        //递增
                        let sheet = this.dotIncreaseHandler(selectIndexs, this.state.sheet.cells[this.startRowIndex][this.endColumnIndex]);
                        this.setState({
                            sheet
                        })
                    }
                }
            }
        } catch (e) {

        }
        finally {
            //清空
            this.startRowIndex = null;
            this.startColumnIndex = null;
            this.endRowIndex = null;
            this.endColumnIndex = null;
        }
    }
    /**
     * 复制
     * @param {*} selectIndexs 
     * @param {*} cell 
     * @returns 
     */
    dotCellCopyHandler(selectIndexs, cell) {
        let sheet = JSON.parse(JSON.stringify(this.state.sheet));
        try {
            for (let i = selectIndexs.startRowIndex; i <= selectIndexs.endRowIndex; i++) {
                for (let j = selectIndexs.startColumnIndex; j <= selectIndexs.endColumnIndex; j++) {
                    sheet.cells[i][j] = {
                        ...cell,
                        rowIndex: sheet.cells[i][j].rowIndex,
                        columnIndex: sheet.cells[i][j].columnIndex,
                        rowSpan: sheet.cells[i][j].rowSpan,
                        colSpan: sheet.cells[i][j].colSpan,
                    }
                }
            }
        }
        catch (e) {

        }

        return sheet;
    }
    /**
     * 递增
     * @param {*} selectIndexs 
     * @param {*} cell 
     * @returns 
     */
    dotIncreaseHandler(selectIndexs, cell) {
        let sheet = JSON.parse(JSON.stringify(this.state.sheet));
        try {
            //以数字作为结尾则递增，否则为复制
            let preValue = cell.value.match(/^\D+(.*\D)?/g) ? cell.value.match(/^\D+(.*\D)?/g) : "";
            let preLabel = cell.label.match(/^\D+(.*\D)?/g) ? cell.label.match(/^\D+(.*\D)?/g)[0] : "";
            let value = cell.value.match(/\d+(\.\d+)?$/g) ? cell.value.match(/\d+(\.\d+)?$/g)[0] : "";
            let label = cell.label.match(/\d+(\.\d+)?$/g) ? cell.label.match(/\d+(\.\d+)?$/g)[0] : "";
            console.log("preValue", preValue, preLabel, value, label)
            for (let i = cell.rowIndex; i <= selectIndexs.endRowIndex; i++) {
                for (let j = cell.columnIndex; j <= selectIndexs.endColumnIndex; j++) {
                    sheet.cells[i][j] = {
                        ...cell,
                        value: preValue + value,
                        label: preLabel + label,
                        rowIndex: sheet.cells[i][j].rowIndex,
                        columnIndex: sheet.cells[i][j].columnIndex,
                        rowSpan: sheet.cells[i][j].rowSpan,
                        colSpan: sheet.cells[i][j].colSpan,
                    }

                    if (regs.number.test(value)) {
                        value = (value * 1 + 1)
                    }
                    if (regs.number.test(label)) {
                        label = (label * 1 + 1);
                    }

                }
            }
        }
        catch (e) {
            console.log(e)
        }

        return sheet;
    }
    /**
     * 得到选择的区间下标
     * @param {*} rowIndex 
     * @param {*} columnIndex 
     * @param {*} rowSpan 
     * @param {*} colSpan 
     */
    getRowColIndex(rowIndex, columnIndex, rowSpan, colSpan) {
        let startRowIndex = this.startRowIndex > rowIndex ? rowIndex : this.startRowIndex;
        let endRowIndex = this.startRowIndex > rowIndex ? this.startRowIndex : rowIndex;
        let startColumnIndex = this.startColumnIndex > columnIndex ? columnIndex : this.startColumnIndex;
        let endColumnIndex = this.startColumnIndex > columnIndex ? this.startColumnIndex : columnIndex;
        //因为存在单元格合并的情况
        endRowIndex = endRowIndex < rowIndex + (rowSpan - 1) ? rowIndex + (rowSpan - 1) : endRowIndex;
        endColumnIndex = endColumnIndex < columnIndex + (colSpan - 1) ? columnIndex + (colSpan - 1) : endColumnIndex;
        return {
            startRowIndex,
            endRowIndex,
            startColumnIndex,
            endColumnIndex
        }
    }
    /**
     * 取消选择
     */
    cancelChosed() {//
        let table = document.getElementById(this.state.tableid);
        let f = table.children[2].querySelectorAll(".chosed");
        if (f.length > 0) {
            for (let i = 0; i < f.length; i++) {//todo这里有性能问题
                f[i].className = (f[i].className || "").replace(" chosed ", "");
            }

        }
    }

    /**
     * 设置激活区间
     * @returns 
     */
    getSelectionPosition() {
        let selection = this.state.selection;
        let layerStyle = {
            top: selection.width ? 0 : null
        }
        let topStyle = {
            left: selection.x,
            top: selection.y,
            width: selection.width + 2
        };
        let leftStyle = {
            left: selection.x,
            top: selection.y,
            height: selection.height
        }
        let rightStyle = {
            left: selection.x + selection.width + 2,
            top: selection.y,
            height: selection.height
        }
        let bottomStyle = {
            left: selection.x,
            top: selection.y + selection.height,
            width: selection.width + 2
        }
        let dotStyle = {
            width: selection.width ? 6 : 0,
            height: selection.width ? 6 : 0,
            left: selection.x + selection.width - 1,
            top: selection.y + selection.height - 1,
        }
        return {
            layerStyle,
            leftStyle,
            rightStyle,
            topStyle,
            bottomStyle,
            dotStyle
        }
    }
    /**
     * 右键
     */
    onContextMenu(event) {
        let rowIndex = event.target.getAttribute("data-rowindex") * 1;
        let columnIndex = event.target.getAttribute("data-columnindex") * 1;
        if (this.state.startRowIndex !==null && rowIndex >= this.state.startRowIndex && rowIndex <= this.state.endRowIndex && columnIndex >= this.state.startColumnIndex && columnIndex <= this.state.endColumnIndex) {
            //在区间内不处理
        }
        else {
            //重新设定选择的区间
            let begindom = document.getElementById(rowIndex + "-" + columnIndex);
            let selection = {
                x: begindom.offsetLeft,
                y: begindom.offsetTop,
                width: begindom.offsetLeft - begindom.offsetLeft + begindom.clientWidth,
                height: begindom.offsetTop - begindom.offsetTop + begindom.clientHeight
            };

            this.setState({
                selection,
                startRowIndex: rowIndex,
                endRowIndex: rowIndex,
                startColumnIndex: columnIndex,
                endColumnIndex: columnIndex
            })
        }
        this.menu.current.open(event);
    }
    /**
   * 工具栏的单击事件
   * @param {*} type 
   */
    onToolClick(type, props, value) {
        console.log("tool",type,props)
        try {
            this[type](props, value);
        }
        catch (e) {

        }

    }
    /**
     * 打开文件操作
     */
    openFile() {
        this.setState({
            fileVisible: true
        })
    }
    /**
     * 关闭文件操作
     */
    closeFile() {
        this.setState({
            fileVisible: false
        })
    }
    /**
     * 合并单元格   
     */
    merge() {
        if (this.state.startRowIndex !==null && (this.state.startRowIndex !==this.endRowIndex && this.state.startColumnIndex !==this.endColumnIndex)) {
            let sheet = JSON.parse(JSON.stringify(this.state.sheet));
            let { startRowIndex, endRowIndex, startColumnIndex, endColumnIndex } = this.state;
            for (let i = startRowIndex; i <= endRowIndex; i++) {
                for (let j = startColumnIndex; j <= endColumnIndex; j++) {
                    sheet.cells[i][j].hide = true;
                }
            }
            sheet.cells[startRowIndex][startColumnIndex].rowSpan = endRowIndex - startRowIndex + 1;
            sheet.cells[startRowIndex][startColumnIndex].colSpan = endColumnIndex - startColumnIndex + 1;
            sheet.cells[startRowIndex][startColumnIndex].hide = false;
            this.setState({
                sheet
            })
        }
    }
    /**
     * 改变单元格属性
     * @param {*} props 属性
     * @param {*} value 值
     */
    changeProps(props, value) {
        try{
            if (this.state.startRowIndex !==null) {
                let sheet = JSON.parse(JSON.stringify(this.state.sheet));
                let { startRowIndex, endRowIndex, startColumnIndex, endColumnIndex } = this.state;
                for (let i = startRowIndex; i <= endRowIndex; i++) {
                    for (let j = startColumnIndex; j <= endColumnIndex; j++) {
                        sheet.cells[i][j][props] = value;
                    }
                }
                this.setState({
                    sheet,
                })
    
            }
        }
        catch(e){
            console.log("error",e);
        }
        
    }
    /**
     * 改变单元格
     * @param {*} props 
     */
    changeCells(props) {
        let sheet = this.state.sheet;
        try {
            if (this.state.startRowIndex !==undefined && this.state.startRowIndex !==undefined) {
                switch (props) {
                    case "addCellDown":
                        break;
                    case "addCellRight":
                        break;
                    case "addRow":
                        sheet = sheetFunc.insertRow(this.state.startRowIndex, this.state.sheet);
                        break;
                    case "addColumn":
                        sheet = sheetFunc.insertColumn(this.state.startColumnIndex, this.state.sheet);
                        break;
                    case "deleteCellDown":
                        break;
                    case "deleteCellRight":
                        break;
                    case "deleteRow":
                        sheet = sheetFunc.deleteRow(this.state.startRowIndex, this.state.endRowIndex, this.state.sheet);
                        break;
                    case "deleteColumn":
                        sheet = sheetFunc.deleteColumn(this.state.startColumnIndex, this.state.endColumnIndex, this.state.sheet);
                        break;
                }
            }

        }
        catch (e) {
            console.log(e)
        }
        this.setState({
            sheet,
            startRowIndex: null,
            startColumnIndex: null,
            endRowIndex: null,
            endColumnIndex: null,
            //选中的区别位置
            selection: {
                x: 0,
                y: 0,
                width: 0,
                height: 0,

            },
        })
    }
    render() {
        if (this.props.active) {
            //取选中的单元格中的第一个单元格作为属性
            let selectionCellProps = this.state.startRowIndex !==null ? this.state.sheet.cells[this.state.startRowIndex][this.state.startColumnIndex] : {};
            let position = this.getSelectionPosition();
            return <div className="wasabi-excel-sheet" id={this.state.sheetcontainerid}>
                <Tool ref={this.tool} cellProps={selectionCellProps} value={this.state.value} onClick={this.onToolClick} onChange={this.onChange} activeIndex={this.state.activeIndexTool} changeToolActive={this.changeToolActive}></Tool>
                <div className="wasabi-table-realTable" onMouseMove={this.onMouseMove} onContextMenu={this.onContextMenu}>
                    <Table id={this.state.tableid}>
                        <SheetColGroup headers={this.state.sheet.headers || []}></SheetColGroup>
                        <SheetHeader headers={this.state.sheet.headers || []}></SheetHeader>
                        <SheetBody onClick={this.onClick}
                            onDoubleClick={this.onDoubleClick}
                            onMouseDown={this.onMouseDown}
                            onMouseUp={this.onMouseUp}
                            cells={this.state.sheet.cells || [[]]}></SheetBody>
                    </Table>
                    <div className="wasabi-excel-sheet-selection-layer" style={position.layerStyle}>
                        <div key="1" className="wasabi-excel-sheet-selection top" style={position.topStyle}></div>
                        <div key="2" className="wasabi-excel-sheet-selection left" style={position.leftStyle}></div>
                        <div key="3" className="wasabi-excel-sheet-selection right" style={position.rightStyle}></div>
                        <div key="4" className="wasabi-excel-sheet-selection bottom" style={position.bottomStyle}></div>
                        <div key="5" className="wasabi-excel-sheet-selection dot" style={position.dotStyle} onMouseDown={this.dotonMouseDown}></div>
                    </div>

                </div>
                <RightMenu ref={this.menu} onClick={this.onToolClick}></RightMenu>
                <File visible={this.state.fileVisible} closeFile={this.closeFile} ></File>
            </div>
        }
        else {
            return null;
        }

    }
}

export default Sheet;