import React, { Component } from 'react';

import GridHeader from "./GridHeader";
import GridBody from "./GridBody"
import GridColGroup from "./GridColGroup"
import Pagination from '../../Pagination';
import GridLoading from './GridLoading'
import func from "../../../libs/func"
import Table from "../../Table/Table"
class Grid extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
           
        }
        this.onHeaderMouseDown = this.onHeaderMouseDown.bind(this);
        this.onDivideMouseMove = this.onDivideMouseMove.bind(this);
        this.onDivideMouseUp = this.onDivideMouseUp.bind(this);
    }

    componentDidMount(){
    }
    /**
     * 表头鼠标按下事件
     * @param {*} headerColumnIndex 
     * @param {*} event 
     */
    onHeaderMouseDown(headerColumnIndex, event) {
        this.chosedHeaderColumnIndex = headerColumnIndex;
        let container = document.getElementById(this.props.containerid);
        this.left = container.getBoundingClientRect().left;
        this.beginLeft = event.clientX;
        container.style.userSelect = "none";
        container.style.cursor = "ew-resize";
        let divide = document.getElementById(this.props.divideid);
        divide.style.display = "block";
        divide.style.left = (event.clientX - this.left) + "px";//这个位置才是相对容器的位置
        document.addEventListener("mousemove", this.onDivideMouseMove);
        document.addEventListener("mouseup", this.onDivideMouseUp);
    }
    /**
     * 分隔线的拖动事件
     * @param {*} event 
     */
    onDivideMouseMove(event) {
        if (this.chosedHeaderColumnIndex !==null) {
            let divide = document.getElementById(this.props.divideid);
            divide.style.left = (event.clientX - this.left) + "px";//这个位置才是相对容器的位置
        }
    }
    /**
     * 分隔线的鼠标松开事件
     * @param {*} event 
     */
    onDivideMouseUp(event) {
        if (this.chosedHeaderColumnIndex !==null) {
            let chosedHeaderColumnIndex=this.chosedHeaderColumnIndex;
            if (this.props.detailAble) {chosedHeaderColumnIndex++;}
            if (this.props.rowNumber){chosedHeaderColumnIndex++;}
            if (this.props.selectAble){chosedHeaderColumnIndex++;}
            try {         
                if(document.getElementById(this.props.realTableId)){
                    let nodes = document.getElementById(this.props.realTableId).children[0].children;
                    let tableWidth=0;//不能直接拿 【realTableId】表格的宽度，不准
                    let width=nodes[chosedHeaderColumnIndex].getAttribute("width")*1;
                    if (nodes) {
                        for (let i = 0; i < nodes.length; i++) {
                            tableWidth+= nodes[i].getAttribute("width") * 1 || 0;
                        }
                        nodes[chosedHeaderColumnIndex].setAttribute("width", Math.ceil( width + event.clientX - this.beginLeft));
                    }   
                   document.getElementById(this.props.realTableId).style.width=Math.ceil(tableWidth + event.clientX - this.beginLeft)+"px";
                   document.getElementById(this.props.fixTableId).style.width=Math.ceil(tableWidth + event.clientX - this.beginLeft)+"px";
                   document.getElementById(this.props.fixTableId).children[0].children[chosedHeaderColumnIndex].setAttribute("width", Math.ceil( width  + event.clientX - this.beginLeft));
               
                }
               
            }
            catch (e) {
                console.log("error",e)
            }
            this.chosedHeaderColumnIndex = null;
            let divide = document.getElementById(this.props.divideid);
            divide.style.display = "none";
            let container = document.getElementById(this.props.containerid);
            container.style.userSelect = null;
            container.style.cursor = "pointer";
            event.target.style.cusor="pointer";
            document.removeEventListener("mousemove", this.onDivideMouseMove);
            document.removeEventListener("mouseup", this.onDivideMouseUp);
        }



    }
    /**
     *渲染列的样式
     */
    renderColGruop() {
        return <GridColGroup
            headerWidth={this.props.headerWidth}
            containerid={this.props.containerid}
            realTableId={this.props.realTableId}
            fixTableId={this.props.fixTableId}
            headers={this.props.headers}
            selectAble={this.props.selectAble}
            rowNumber={this.props.rowNumber}
            detailAble={this.props.detailAble}
            perColumnWidth={this.props.perColumnWidth} >
        </GridColGroup>
    }

    /**
    * 处理非固定表头
    */
    renderHeader() {
        return <GridHeader
            headers={this.props.headers}
            headerWidth={this.props.headerWidth}
            borderAble={this.props.borderAble}
            selectAble={this.props.selectAble}
            singleSelect={this.props.singleSelect}
            rowNumber={this.props.rowNumber}
            detailAble={this.props.detailAble}
            sortName={this.props.sortName}
            sortOrder={this.props.sortOrder}
            checkedAllHandler={this.props.checkedAllHandler}
            isCheckAll={this.props.checkCurrentPageCheckedAll && this.props.checkCurrentPageCheckedAll()}
            onHeaderMouseDown={this.onHeaderMouseDown}
            onSort={this.onSort}>
        </GridHeader>
    }

    /**
     * 处理表体
     */
    renderBody() {
        return <GridBody
             headerWidth={this.props.headerWidth}
            headers={this.props.headers}
            data={this.props.visibleData}
            borderAble={this.props.borderAble}
            priKey={this.props.priKey}
            checkedData={ func.clone(this.props.checkedData)}//这个属性要对比
            pageIndex={this.props.pageIndex}
            pageSize={this.props.pageSize}
            selectAble={this.props.selectAble}
            singleSelect={this.props.singleSelect}
            rowNumber={this.props.rowNumber}
            detailAble={this.props.detailAble}
            editIndex={this.props.editIndex}
            detailIndex={this.props.detailIndex}
            detailView={this.props.detailView}
            focusIndex={this.props.focusIndex}
            rowAllowChecked={this.props.rowAllowChecked}
            getKey={this.props.getKey}
            onClick={this.props.onClick}
            onDoubleClick={this.props.onDoubleClick}
            onChecked={this.props.onChecked}
            tableCellEditHandler={this.props.tableCellEditHandler}
            onSort={this.props.onSort}
            onDetail={this.props.onDetail}
            onPaste={this.props.onPaste}
        >

        </GridBody>
    }


    /**
     * 表尾 todo
     */
    renderFooter() {
        return null;
    }
    /**
     * 真实的表格
     */
    renderTable(height) {
        let colgroup = this.renderColGruop();
        let headerControl = this.renderHeader();
        return <div className='wasabi-table-container' key="wasabi-table-container" onScroll={this.props.onVirtualScroll} id={this.props.containerid} style={{ height: height }}  >
            {/* 表头独立是为了在紧凑表格宽度不够时 更好看一点*/}
            <div className="table-fixedth">
            <Table 
                className={this.props.borderAble ? ' ' : ' table-no-bordered '}
                id={this.props.fixTableId} >
                     {
                    /**colgroup */
                    colgroup
                }
                     {/* 表头 */}
                    {headerControl}
                    </Table>
            </div>
            {/* 真实的表格  */}   
           <Table 
                className={this.props.borderAble ? ' ' : ' table-no-bordered '}
                id={this.props.realTableId}  >
                {
                    /**colgroup */
                    colgroup
                }
                {/* 表体 */}
                {this.renderBody()}
                {/* 表尾 todo */}
                {/* <tfoot>{this.renderFooter()}</tfoot> */}
            </Table>
            <div className="wasabi-virtual-height" ></div>
    
            {/* 拖动列时的分隔线  */}
            <div className="wasabi-grid-divide" id={this.props.divideid}></div>
        </div >
    }
    /**
     * 渲染全部网格组件
     */
    render() {
        let grid = [];
        let style = func.shallowClone(this.props.style) || {};
        let height = style.height || null;
        
        style.height = null;//清空height,因为height是用设置表格的高度
        let pageTotal = this.props.data.length < this.props.total ? this.props.data.length : this.props.total;
        /* 头部分页 */
        grid.push(this.props.pagination && (this.props.pagePosition == 'top' || this.props.pagePosition == 'both') ? <Pagination key="p1" reload={this.props.reload} exportAble={this.props.exportAble} export={this.props.export} onChange={this.props.paginationHandler} pageIndex={this.props.pageIndex} pageSize={this.props.pageSize} pageTotal={pageTotal} total={this.props.total}></Pagination> : null)
        {/* 真实表格容器 */ }
        grid.push(this.renderTable(height))
        {/* 底部分页 */ }
        grid.push(this.props.pagination && (this.props.pagePosition == 'bottom' || this.props.pagePosition == 'both') ? <Pagination key="p2" reload={this.props.reload} exportAble={this.props.exportAble} export={this.props.export} onChange={this.props.paginationHandler} pageIndex={this.props.pageIndex} pageSize={this.props.pageSize} pageTotal={pageTotal} total={this.props.total}></Pagination> : null)
        /* 加载动画 */
        grid.push(this.props.loading ? <GridLoading key="loading"></GridLoading> : null)

        return <div onDragOver={this.props.editAble ? this.props.onDragOver : null} onDrop={this.props.editAble ? this.props.onDrop : null}
         className={'wasabi-grid' + (this.props.className || "")}
            style={style}>{grid}</div>
    }
}

export default Grid;