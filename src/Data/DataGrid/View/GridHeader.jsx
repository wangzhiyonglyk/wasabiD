/**
 * 拆分datagrid,表头组件
 * 2021-05-28
 * 2022-01-08 解决ref报错的bug
 */
/**
 * :[[
    {name:'itemid',label:'Item ID',rowSpan:2,width:80,sortAble:true},
    {name:'productid',label:'Product ID',rowSpan:2,width:80,sortAble:true},
    {label:'Item Details',colSpan:4}
],[
    {name:'listprice',label:'List Price',width:80,align:'right',sortAble:true},
    {name:'unitcost',label:'Unit Cost',width:80,align:'right',sortAble:true},
    {name:'attr1',label:'Attribute',width:100},
    {name:'status',label:'Status',width:60}
]]
 */
import React from "react";

import { TableCell, TableHead, TableRow } from "../../Table";
import CheckBox from "../../../Form/CheckBox"
import config from "../config";
import func from "../../../libs/func";
class GridHeader extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
        this.chosedHeaderColumnIndex = null;
        this.getHeaderProps = this.getHeaderProps.bind(this);
        this.getHeaderContent = this.getHeaderContent.bind(this);
        this.setOrderAndSelectAndDetailHeader = this.setOrderAndSelectAndDetailHeader.bind(this);
        this.onSort = this.onSort.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
    }
    /**
     * 表头的鼠标监听事件
     * @param {*} event 
     */
    onMouseMove(event) {
        try {
            let offsetX = event && event.nativeEvent && event.nativeEvent.offsetX;
            let width = event.target.getBoundingClientRect().width;
            if (width - offsetX <= 4) {
                event.target.style.cursor = "ew-resize";
            }
            else {
                event.target.style.cursor = "pointer";

            }
        }
        catch (e) {

        }

    }
    onMouseDown(headerColumnIndex, event) {
        if (event.target.style.cursor === "ew-resize") {
            let offsetX = event && event.nativeEvent && event.nativeEvent.offsetX;
            //满足拖动条件，回传父组件处理
            this.props.onHeaderMouseDown && this.props.onHeaderMouseDown(offsetX <= 2 ? headerColumnIndex - 1 : headerColumnIndex, event);
        }
    }
    /**
    * 得到头部相关属性
    */
    getHeaderProps(header) {
        //排序样式

        let props = {}; //设置单击事件
        props.iconCls = header.sortAble == true ? this.props.sortName == header.name ? "icon-sort-" + this.props.sortOrder : 'icon-sort' : '';
        props.className = (header.export === false ? " wasabi-noexport" : "");
        props.onClick = header.sortAble == true ? this.props.sortName == header.name
            ? this.onSort.bind(this, header.name, this.props.sortOrder == 'asc' ? 'desc' : 'asc')
            : this.onSort.bind(this, header.name, 'asc')
            : null;
        props.content = this.getHeaderContent(header)
        return props;
    }
    /**
     * 获取头部内容
     * @param {*} header 
     */
    getHeaderContent(header) {
        //内容
        let content = header.headerContent;//自定义内容
        if (typeof content === 'function') {
            //函数
            try {
                content = content(header.name, header.label);
            } catch (e) {
                console.log('生成自定列出错,原因', e.message);
                content = '';
            }
        } else {
            //为空时
            content = header.label || "";
        }
        return content;

    }
    /**
    * 设置表头的详情，序号，选择列
    */
    setOrderAndSelectAndDetailHeader(rowSpan = 1) {
        let stickyLeft = 1;//偏移量,表格左边有border
        let control = [];
        //处理详情列
        if (this.props.detailAble) {
            control.push(<TableCell rowSpan={rowSpan} key='headerdetail' position="header" className="wasabi-detail-column"
                thStyle={{ position: "sticky", left: this.props.borderAble ? stickyLeft : stickyLeft, zIndex: 1 }}></TableCell>)
            stickyLeft += config.detailWidth;
        }
        //处理序号列
        if (this.props.rowNumber) {
            control.push(
                <TableCell rowSpan={rowSpan} key='headerorder' position="header" className="wasabi-order-column"
                    thStyle={{ position: "sticky", left: this.props.borderAble ? stickyLeft : stickyLeft, zIndex: 1 }} >
                    序号
                </TableCell>
            );
            stickyLeft += config.orderWidth;
        }
        //处理选择列
        if (this.props.selectAble) {
            let props = {
                //设置checkbox的属性
                value: this.props.isCheckAll == true ? 'yes' : null, //判断当前页是否选中
                data: [{ value: 'yes', text: '' }],
                onSelect: this.props.checkedAllHandler,
                name: 'datagrid-check-all',
                rnd:func.uuid()//加个随机数，保证每次重新渲染，否则会报 ref错误，原因不详
            };
            control.push(
                <TableCell rowSpan={rowSpan} key='headercheckbox' position="header" className='wasabi-select-column'
                    thStyle={{ position: "sticky", left: this.props.borderAble ? stickyLeft : stickyLeft, zIndex: 1 }} >
                    {this.props.singleSelect ? null : <CheckBox {...props} ></CheckBox>}
                </TableCell>

            );
            stickyLeft += config.selectWidth;
        }


        return control;
    }

    /**
   * 设置表头单元格
   * @param {*} header 
   * @param {*} headerRowIndex 
   * @param {*} headerColumnIndex 
   * @param {*} props 
   * @param {*} stickyLeft 
   * @returns 
   */
    setHeaderCell(header, headerRowIndex, headerColumnIndex, props, stickyLeft) {
        return <TableCell
            rowIndex={headerRowIndex}
            columnIndex={headerColumnIndex}
            name={header.name || header.label}
            key={"header-" + headerRowIndex + "-" + headerColumnIndex.toString()}
            position="header"
            align={header.align}
            thStyle={{ position: header.sticky ? "sticky" : null, left: header.sticky ? this.props.borderAble ? stickyLeft : stickyLeft : null, zIndex: header.sticky ? 1 : null }}
            rowSpan={header.rowSpan}
            colSpan={header.colSpan}
            className={props.className || ""}
            onClick={props.onClick || null}
            onMouseMove={this.onMouseMove}
            onMouseDown={this.onMouseDown.bind(this, headerColumnIndex)} >
            {props.content}
            <i className={props.iconCls}></i>

        </TableCell>;
    }
    /**
     * 排序事件
     * @param {*} name 
     * @param {*} sortOrder 
     */
    onSort(name, sortOrder) {
        this.props.onSort && this.props.onSort(name, sortOrder);
    }
   
    render() {
        if (!(this.props.headers instanceof Array) || this.props.headers.length === 0) {
            //格式不正确，或者数据为空
            return null;
        }
        let headerControl = [];
        let maxRowSpan = 1;
        let trcontrol = [];
        let stickyLeft = 1;//偏移量,表格左边有border
        if (this.props.detailAble) { stickyLeft += config.detailWidth; }
        if (this.props.rowNumber) { stickyLeft += config.orderWidth; }
        if (this.props.selectAble) { stickyLeft += config.selectWidth; }
        //处理表头
        this.props.headers.map((trheader, headerRowIndex) => {
            if (trheader instanceof Array) {
                maxRowSpan = this.props.headers.length;//多行时
                trheader.map((header, headerColumnIndex) => {
                    let props = this.getHeaderProps(header);
                    trcontrol.push(this.setHeaderCell(header, headerRowIndex, headerColumnIndex, props, stickyLeft));
                    let width = header.width ? header.width : this.props?.headerWidth && this.props?.headerWidth[header.name] || config.minWidth;
                    stickyLeft += header.sticky ? width : 0;
                })
                headerControl.push(trcontrol)
                trcontrol = [];//清空
            }
            else {//只有一行
                let props = this.getHeaderProps(trheader);
                trcontrol.push(this.setHeaderCell(trheader, 0, headerRowIndex, props, stickyLeft));
                let width = trheader.width ? trheader.width : this.props?.headerWidth && this.props?.headerWidth[trheader.name] || config.minWidth;
                stickyLeft += trheader.sticky ? width : 0;
            }
        })
        if (trcontrol.length > 0) {
            headerControl.push(trcontrol);//说明只有一行
        }
        if (this.props.headers && this.props.headers.length > 0) {
            //设置表头的详情，序号，选择列,空白列

            let control = this.setOrderAndSelectAndDetailHeader(maxRowSpan);

            headerControl[0] = [].concat(control, headerControl[0]);
        }
        return <TableHead style={{ position: "sticky", top: 0, zIndex: 1 }}>
            {
                headerControl && headerControl.map((tritem, rowindex) => {
                    return <TableRow key={rowindex}>{tritem}</TableRow>
                })}
        </TableHead>
    }
}

export default GridHeader;