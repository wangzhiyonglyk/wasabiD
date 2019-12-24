/**
 *Created by wangzhiyong on 3016-04-05
 * desc:列表组件,由此组件开始独立重构所组件,不再依赖
 * wasabi框架的第一个组件
 * 3016-06-09后开始调整整个样式
 * 3017-01-04 注意了,这里渲染分页与复制的CopyDataGrid不一样，因为CopyDataGrid宽度比较小可能放不下
 *3017-09-30 将固定表头功能先隐藏掉
 */



import React, {Component} from "react";
import PropTypes from "prop-types";

import unit from "../libs/unit.js";
import LinkButton from "../Buttons/LinkButton.jsx";
import CheckBox from "../Form/CheckBox.jsx";
import Input from "../Form/Input.jsx";
import Radio  from "../Form/Radio.jsx";

import DataGridHandler from "../Mixins/DataGridHandler.js";
import DataGridExtend from "../Mixins/DataGridExtend.js";
import pasteExtend  from "../Mixins/pasteExtend.js";
import ClickAway from "../Unit/ClickAway.js";
import showUpdate from "../Mixins/showUpdate.js";
import mixins from "../Mixins/mixins"
import ("../Sass/Data/DataGrid.css");
import ("../Sass/Data/DataGridDetail.css");
class DataGrid extends Component{
   // mixins: [DataGridHandler, DataGridExtend, pasteExtend, ClickAway, showUpdate],
   constructor(props)
   {
       super(props);
       this.clientHeight = document.documentElement.clientHeight;//先得到页面高度,防止后期页面发生晃动
       let data = [];
       if (this.props.data instanceof Array) {
           data = this.props.data;
       }
       this.state={
      
        url: this.props.url,

        params: unit.clone(this.props.params),//这里一定要复制,只有复制才可以比较两次参数是否发生改变没有,防止父组件状态任何改变而导致不停的查询
        pageIndex: this.props.pageIndex,
        pageSize: this.props.pageSize,
        sortName: this.props.sortName,
        sortOrder: this.props.sortOrder,
        data: (this.props.pagination == true ? data.slice(0, this.props.pageSize) : data),//只只保留当前的数据
        checkedData: new Map(),
        detailView: null,//详情行,
        detailIndex: null,//显示详情的行下标
        total: this.props.total,//总记录数
        loading: (this.props.url || this.props.headerUrl) ? true : false,//显示正在加载图示
        footer: this.props.footer,//页脚
        headers: this.props.headers,//表头会可能后期才传送,也会动态改变
        height: this.props.height,//如果没有设置高度还要从当前页面中计算出来空白高度,以适应布局
        headerMenu: [],//被隐藏的列
        panelShow: false,//列表的操作面板
        control: this.props.control,
        controlPanel: this.props.controlPanel,
        headerUrl: this.props.headerUrl,
        updateUrl: this.props.updateUrl,
        editAble: this.props.editAble,
        editIndex: null,//当前处理编辑的列
        addData: new Map(),//新增的数据,因为有可能新增一个空的，然后再修改
        updatedData: new Map(),//被修改过的数据，因为要判断曾经是否修改
        deleteData: [],//删除的数据
       }
       //绑定事件
     let baseCtors=[DataGridHandler, DataGridExtend, pasteExtend, showUpdate]
       baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor).forEach(name => {
            if(typeof baseCtor[name]=="function")
          
            {
            this[name]=this[name].bind(this);
            }
        });
    });

       this.substitute=this.substitute.bind(this);
     
     
   }
   
    componentWillReceiveProps (nextProps) {
        /*      
         headers可能是后期才传了,见Page组件可知
         所以此处需要详细判断
         */
        if (nextProps.headers && this.showUpdate(nextProps.headers, this.state.headers)) { //存在着这种情况,后期才传headers,所以要更新一下

            this.setState({
                headers: nextProps.headers,
            })
        }
        if (this.state.headerUrl != nextProps.headerUrl) {//有远程加载表头信息
            this.getHeaderDataHandler(nextProps.headerUrl);
        }
        if (nextProps.url && this.state.url != nextProps.url) {//url发生改变
            this.updateHandler(nextProps.url, this.state.pageSize, 1, this.state.sortName, this.state.sortOrder, nextProps.params);
        }
        else if (nextProps.data != null && nextProps.data != undefined && nextProps.data instanceof Array) {
            this.setState({
                data: (this.props.pagination == true ? nextProps.data.slice(0, nextProps.pageSize) : nextProps.data),
                total: nextProps.total,
                pageIndex: nextProps.pageIndex,
                pageSize: nextProps.pageSize,
                sortName: this.props.sortName,
                sortOrder: nextProps.sortOrder,
                loading: false,
                headers: nextProps.headers,//表头可能会更新
                controlPanel: nextProps.controlPanel,
            })
        }
    }
    componentDidMount () {
      
        //渲染后再开始加载数据
        if (this.state.headerUrl) {//如果存在自定义列
            this.getHeaderDataHandler();
        }
        if (this.state.url) {//如果存在url,
            this.updateHandler(this.state.url, this.state.pageSize, this.state.pageIndex, this.state.sortName, this.state.sortOrder)
        }
        //this.registerClickAway(this.hideMenuHandler, this.refs.grid);//注册全局单击事件
        // this.resizeTableWidthHandler();//固定的表头每一列的宽度
    }
    componentDidUpdate () {
        // this.resizeTableWidthHandler();//固定的表头每一列的宽度
    }
    renderHeader () {//渲染表头
        if (!(this.state.headers instanceof Array)) {
            return null;
        }
        let headers = [];
        if (this.props.rowNumber) {
            headers.push(
                <th key="headerorder" name="order" style={{ width: 50 }} >
                    <div className="wasabi-grid-cell"  name="order">序号</div>
                </th>
            );
        }
        if (this.props.selectAble) {
            let thCheckProps = {//设置checkbox的属性
                value: this.checkCurrentPageCheckedAll() == true ? "yes" : null,//判断当前页是否选中
                data: [{ value: "yes", text: "" }],
                onSelect: this.checkedAllHandler,
                name: "all",
            }
            headers.push(
                <th key="headercheckbox" name="check-column" style={{ width: 30 }}  >
                    <div className="wasabi-grid-cell"  name="check-column">{this.props.singleSelect ? null : <CheckBox {...thCheckProps} ></CheckBox>}</div>
                </th>
            );
        }
        this.state.headers.map((header, index) => {
            if (!header || header.hide == true) {
                //隐藏则不显示
                return;
            } else {
                //使用label,因为多个列可能绑定一个字段
                if (this.state.headerMenu.length > 0 && this.state.headerMenu.indexOf(header.label) > -1) {//父组件更新状态值，发现某一行处理被隐藏中，则不显示
                    return;
                }
                else {
                    let sortOrder = header.sortAble == true ? this.state.sortName == header.name ? this.state.sortOrder : "both" : "";//排序样式
                    let props = {};//设置单击事件
                    props.onClick = header.sortAble == true ? this.state.sortName == header.name ? this.onSort.bind(this, header.name, this.state.sortOrder == "asc" ? "desc" : "asc") : this.onSort.bind(this, header.name, "asc") : null;

                    //打开操作面板的图标
                    let panelIcon = (this.state.control && index == 0) ? <LinkButton key="control" style={{ fontSize: 12, position: "absolute" }} iconCls={"icon-catalog"} name="control" tip="菜单" onClick={this.panelShow} /> : null;
                    //表格处理编辑时的保存按钮
                    let saveIcon = (this.state.editIndex != null && index == 0) ? <LinkButton key="save" style={{ fontSize: 12, position: "absolute" }} iconCls={"icon-submit"} name="save" tip="保存" onClick={this.remoteUpdateRow.bind(this, null)} /> : null;
                    headers.push(
                        // 绑定右键菜单事件 
                        //使用label作为元素name属性，是因为可能有多个列对应同一个字段
                        <th key={"header" + index.toString()} name={header.label} {...props}
                            className={"" + sortOrder}
                            style={{
                                width: (header.width ? header.width : null),
                                textAlign: header.align
                            }}
                          
                            onContextMenu={this.headerContextMenuHandler}
                        >
                            <div className="wasabi-grid-cell" name={header.label}   style={{ textAlign: header.align }}><span>{header.label}</span>{panelIcon}{saveIcon}</div>
                        </th>)


                }
            }
        });


        return headers;
    }
    renderBody () {//渲染表体
        let trobj = [];
        if (!(this.state.data instanceof Array) || !(this.state.headers instanceof Array)) {
            return;
        }

        this.state.data.map((rowData, rowIndex) => {
            let tds = [];//当前的列集合
            let key = this.getKey(rowIndex);//获取这一行的关键值

            //序号列
            if (this.props.rowNumber) {
                tds.push(
                    <td key={"bodyorder" + rowIndex.toString()}  style={{ width: 50 }} >
                        <div className="wasabi-grid-cell" > {((this.state.pageIndex - 1) * this.state.pageSize + rowIndex+1).toString()}</div></td>
                );
            }
            //设置这一行的选择列
            if (this.props.selectAble) {
                let props = {
                    value: this.state.checkedData.has(key) == true ? key : null,
                    data: [{ value: key, text: "" }],
                    onSelect: this.onChecked.bind(this, rowIndex),
                    name: key,
                }

                if (this.props.singleSelect == true) {
                    tds.push(
                        <td key={"bodycheckbox" + rowIndex.toString()}  style={{ width: 30 }} className="check-column" >
                            <div className="wasabi-grid-cell"> <Radio {...props} ></Radio></div></td>
                    );

                }
                else {
                    tds.push(
                        <td key={"bodycheckbox" + rowIndex.toString()} style={{ width: 30 }} className="check-column" >
                            <div className="wasabi-grid-cell"  ><CheckBox {...props} ></CheckBox></div></td>
                    );
                }
            }

            //生成数据列

            this.state.headers.map((header, columnIndex) => {
                if (!header || header.hide) {
                    return;
                }
                if (this.state.headerMenu.length > 0 && this.state.headerMenu.indexOf(header.label) > -1) {//父组件更新状态值，发现某一行处理被隐藏中，则不显示
                    return;
                }

                let content = header.content;

                if (typeof content === 'string') {//指定的列
                    content = this.substitute(content, rowData);
                } else if (typeof content === 'function') {//函数
                    try {

                        content = content(rowData, rowIndex);

                    }
                    catch (e) {
                        console.log("生成自定列出错,原因",e.message);
                        content = "";
                    }

                } else {//为空时
                    content = rowData[header.name];
                }


                if (this.state.editIndex != null && this.state.editIndex == rowIndex && header.editor) {
                    let currentValue = rowData[header.name];
                    let currentText = rowData[header.name];
                    if (typeof header.editor.content === 'function') {
                        let valueResult = header.editor.content(rowData, rowIndex);
                        if (valueResult) {
                            currentValue = valueResult.value;
                            currentText = valueResult.text;

                        }
                    }
                    tds.push(<td onClick={this.onClick.bind(this, rowIndex, rowData)}
                        onDoubleClick={this.onDoubleClick.bind(this, rowIndex, rowData)}
                        key={"col" + rowIndex.toString() + "-" + columnIndex.toString()} style={{ width: (header.width ? header.width : null), textAlign: (header.align) }}
                    ><div className="wasabi-grid-cell" style={{ textAlign: (header.align) }}>
                            <Input {...header.editor.options} type={header.editor.type} value={currentValue} text={currentText} onChange={this.rowEditHandler.bind(this, columnIndex)}
                                onSelect={this.rowEditHandler.bind(this, columnIndex)} label={""}></Input>
                        </div></td>);
                }
                else {
                    if (columnIndex == 0 && this.props.detailAble) {

                        //在第一列显示详情
                        let iconCls = "icon-down";//详情列的图标
                        if (this.state.detailIndex == key) {
                            iconCls = "icon-up";//详情列-展开
                        }

                        tds.push(<td onClick={this.detailHandler.bind(this, rowIndex, rowData)}
                            key={"col" + rowIndex.toString() + "-" + columnIndex.toString()}>
                            <div className="wasabi-grid-cell" style={{ width: (header.width ? header.width : null), textAlign: (header.align) }}>
                                <div style={{ float: "left" }}> {content}</div><LinkButton iconCls={iconCls}
                                    tip="查看详情"></LinkButton>
                            </div>
                        </td>);
                    }
                    else {
                        tds.push(<td onClick={this.onClick.bind(this, rowIndex, rowData)}
                            onDoubleClick={this.onDoubleClick.bind(this, rowIndex, rowData)}
                            key={"col" + rowIndex.toString() + "-" + columnIndex.toString()}
                        ><div className="wasabi-grid-cell" style={{ width: (header.width ? header.width : null), textAlign: (header.align) }}>{content}</div></td>);
                    }
                }


            });
           
            let trClassName="";
            if ((rowIndex * 1) == this.focusIndex && this.props.focusAble) {
                trClassName = "selected";
            }
            trobj.push(<tr  key={"row" + rowIndex.toString()} onMouseDown={this.onTRMouseDown.bind(this, rowIndex)}>{tds}</tr>);

            if (this.state.detailIndex == key) {

                trobj.push(this.state.detailView);
            }

        });
        return trobj;

    }
    substitute (str, obj) {//得到绑定字段的内容
        return str.replace((/\\?\{([^{}]+)\}/g), function (match, name) {
            if (match.charAt(0) === '\\') {
                return match.slice(1);
            }
            return (obj[name] === null || obj[name] === undefined) ? '' : obj[name];
        });
    }
    renderTotal () {//渲染总记录数，当前记录的下标
        if (this.state.headers && this.state.headers.length > 0) {//设计了header
            let beginOrderNumber = 0; let endOrderNumber = 0;//数据开始序号与结束序号
            let total = this.state.total;//总记录数
            let pageTotal = (parseInt(this.state.total / this.state.pageSize));//共多少页
            pageTotal = (this.state.total % this.state.pageSize) > 0 ? pageTotal + 1 : pageTotal;//求余后得到最终总页数
            if (this.state.data instanceof Array && this.state.data.length > 0) {//计算开始序号与结束序号
                if (this.props.pagination) {//有分页,计算当前页序号
                    beginOrderNumber = this.state.pageSize * (this.state.pageIndex - 1) + 1;
                    endOrderNumber = this.state.pageSize * (this.state.pageIndex - 1) + this.state.data.length;
                }
                else {//无分页
                    endOrderNumber = this.state.data.length;
                }
            }
            return <div key="pagination-info" className=" pagination-info col-sm-6">显示 {beginOrderNumber} 至 {endOrderNumber} 项 共 {total} 项记录
                <div style={{ display: this.props.pagination ? "inline-block" : "none" }}> 每页  <select className="pagination-select" value={this.state.pageSize} onChange={this.pageSizeHandler}>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>  条</div>
            </div>;

        }
        else {
            return null;
        }

    }

    renderPagination () {//显示分页控件
        let paginationComponent = null;
        if (this.props.pagination) {

            let pageAll = (parseInt(this.state.total / this.state.pageSize));//共多少页
            if ((this.state.total % this.state.pageSize) > 0) {
                pageAll++;//求余后得到最终总页数
            }
            if (pageAll == 0) {//数据为空，直接返回
                return null;
            }

            if (pageAll > 7) {//大于7页，
                let pageComponent = [];//分页组件
                let firstIndex = 0;//第一个显示哪一页
                let lastIndex = 0;//最后一个显示哪一页
                let predisabledli = <li key="predis" className="paginate_button disabled"><a  >...</a></li>;//多余的分页标记
                let lastdisabledli = <li key="lastdis" className="paginate_button disabled"><a  >...</a></li>;//多余的分页标记
                if (this.state.pageIndex >= 4 && this.state.pageIndex <= pageAll - 3) {//当前页号处于中间位置
                    firstIndex = this.state.pageIndex - 2;
                    lastIndex = this.state.pageIndex + 2;
                }
                else {
                    //非中间位置
                    if (this.state.pageIndex < 4) {
                        //靠前的位置
                        firstIndex = 2;
                        lastIndex = 6;
                        predisabledli = null;//设置为空
                    } else {//靠后的位置
                        if (this.state.pageIndex > pageAll - 3) {
                            firstIndex = pageAll - 5;
                            lastIndex = pageAll - 1;
                            lastdisabledli = null;//设置为空
                        }
                    }
                }
                for (let i = firstIndex; i <= lastIndex; i++) {
                    pageComponent.push(<li key={"li" + i} className={"paginate_button " + ((this.state.pageIndex * 1) == (i) ? "active" : "")}><a
                          onClick={this.paginationHandler.bind(this, (i))}>{(i)}</a></li>);
                }
                pageComponent.unshift(predisabledli); pageComponent.push(lastdisabledli);

                paginationComponent = <div className="pagination-number col-sm-6">
                    <ul className="pagination">
                        <li key={"lipre"} className="paginate_button "><a   onClick={this.prePaginationHandler} >上一页</a></li>
                        <li key={"lifirst"} className={"paginate_button  " + ((this.state.pageIndex * 1) == (1) ? "active" : "")}><a
                              onClick={this.paginationHandler.bind(this, (1))}>{(1)}</a></li>
                        {
                            pageComponent
                        }

                        <li key="lilast" className={"paginate_button previous" + ((this.state.pageIndex * 1) == (pageAll) ? "active" : "")}><a   onClick={this.paginationHandler.bind(this, (pageAll))}>{(pageAll)}</a></li>
                        <li key="linext" className="paginate_button next"><a   onClick={this.nextPaginationHandler} >下一页</a></li>
                    </ul>
                </div>;
            }
            else {
                //小于7页直接显示

                let pagearr = [];
              
                for (let i = 0; i < pageAll; i++) {
                    let control = <li key={"li" + i} className={"paginate_button " + ((this.state.pageIndex * 1) == (i*1+1) ? "active" : "")}>
                        <a   onClick={this.paginationHandler.bind(this, (i + 1))}>{(i + 1)}</a></li>;
                    pagearr.push(control);
                }
                paginationComponent = (
                    <div className="pagination-number col-sm-6">
                        <ul className="pagination">
                        <li key={"lipre"} className="paginate_button previous"><a   onClick={this.prePaginationHandler} >上一页</a></li>
                            {
                                pagearr
                            }
                           <li key="linext" className="paginate_button next"><a   onClick={this.nextPaginationHandler} >下一页</a></li>
                        </ul>
                    </div>
                )

            }

        }
        return paginationComponent;

    }
    renderFooter () {//渲染页脚
        let tds = [];
        this.footerActualData = [];//,页脚的实际统计数据，用于返回
        if (this.state.footer instanceof Array && this.state.footer.length > 0) {
            //分页的情况下
            if (this.props.selectAble) {
                tds.push(
                    <td key="footerselect" className="check-column"></td>
                );
            }
            this.state.headers.map((header, headerindex) => {
                if (!header || header.hide) {
                    return;
                }
                if (this.state.headerMenu.length > 0 && this.state.headerMenu.indexOf(header.label) > -1) {//父组件更新状态值，发现某一行处理被隐藏中，则不显示
                    return;
                }

                let footerchild = this.state.footer.filter(function (d) {
                    return d.name == header.name;
                })
                if (footerchild && footerchild.length > 0) {
                    if (footerchild[0].value != null && footerchild[0].value != undefined) {//如果有值
                        let obj = {}; obj[header.name] = footerchild[0].value;
                        this.footerActualData.push(obj);
                        tds.push(<td key={headerindex + header.name}>{footerchild[0].value}</td>)
                    }
                    else {
                        //表明从本页数据统计
                        switch (footerchild[0].type) {
                            case "sum":
                                let obj = {}; obj[header.name] = this.sumHandler(footerchild[0]);
                                this.footerActualData.push(obj);
                                if (obj[header.name] != null) {
                                    tds.push(<td key={header.name} >{"总计：" + obj[header.name]}</td>);
                                }
                                else {
                                    tds.push(<td key={header.name} ></td>);
                                }
                                break;
                            case "avg":
                                let obj1 = {}; obj1[header.name] = this.avgHandler(footerchild[0]);
                                this.footerActualData.push(obj1);
                                if (obj[header.name] != null) {
                                    tds.push(<td key={headerindex + header.name} >{"平均值：" + obj1[header.name]}</td>);
                                }
                                else {
                                    tds.push(<td key={headerindex + header.name} ></td>);
                                }
                                break;
                            default:
                                tds.push(<td key={headerindex + header.name}></td>);
                        }
                    }
                }
                else {
                    tds.push(<td key={header.name + headerindex}></td>);
                }

            });

            return <tr key="footertr" style={{ height: 36 }}>{tds}</tr>;
        }


    }
    renderHeaderMenu() {//渲染表头右键菜单
        let headerMenuCotrol = [];//右键菜单中隐藏的列
        if (this.state.headerMenu.length > 0) {
            this.state.headerMenu.map((item, index) => {
                headerMenuCotrol.push(
                    <li key={index}><a  className="header-menu-item" onMouseDown={this.menuShowHandler.bind(this, index, item)} >{"显示[" + item + "]"}</a></li>)
            })
        }
        return headerMenuCotrol;
    }
   
    render () {
        let className = this.props.borderAble ? "table " : "table table-no-bordered";
        let headerControl = this.renderHeader();//渲染两次，所以定义一个变量
        return (
            /* excel粘贴事件 注册鼠标按下事件，从而隐藏菜单*/
            <div className="wasabi-grid" ref="grid"
                onPaste={this.onPaste}
                onMouseDown={this.gridMouseDownHandler}
                style={{ width: this.props.width }}  >
                {/* 头部分页 */}
                <div className="wasabi-pagination row" ref="toppagination"
                    style={{ display: (this.props.pagePosition == "top" || this.props.pagePosition == "both") ? "block" : "none" }}>
                    {this.renderTotal()}
                    {this.renderPagination()}

                </div>
                {/* 表格容器 */}
                <div className="table-container">
                    {/* 固定表头 */}
                    {/* <div className="table-fixed" ref="fixedTableContainer">
                        <table className={className} key="fixedTable" ref="fixedTable">
                            <thead>
                                <tr>
                                    {headerControl}
                                </tr>
                            </thead>
                        </table>
                    </div> */}
                    {/* 真实表格  监听滚动事件以便固定表头一起滚动*/}
                    <div className="table-realTable" ref="realTableContainer" style={{ height: this.state.height }}
                        onScroll={this.tableBodyScrollHandler}>
                        <table className={className} key="realTable" ref="realTable">
                            <thead >
                                <tr>
                                    {headerControl}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.renderBody()
                                }

                            </tbody>
                            <tfoot>
                                {
                                    this.renderFooter()
                                }
                            </tfoot>
                        </table>
                    </div></div>
                {/* 底部分页 */}
                <div className="wasabi-pagination row" ref="bottompagination"
                    style={{ display: (this.props.pagePosition == "bottom" || this.props.pagePosition == "both") ? "block" : "none" }}>
                    {this.renderTotal()}
                    {this.renderPagination()}
                </div>

                <div className="wasabi-grid-loading" style={{ display: this.state.loading == true ? "block" : "none" }}></div>
                <div className="wasabi-load-icon" style={{ display: this.state.loading == true ? "block" : "none" }}></div>
                {/* 菜单 没有使用单击事件,用户有可能继续使用鼠标右键*/}
                <div className="wasabi-header-menu-container" ref="headermenu">
                    <ul className="wasabi-header-menu">
                        <li key="first"><a   className="header-menu-item" onMouseDown={this.menuHideHandler} >隐藏此列</a></li>
                        {this.renderHeaderMenu()}
                    </ul>
                </div>
                {/* 表格空白面板用于进行自定义操作 */}
                <div className="wasabi-grid-panel" style={{ height: this.state.panelShow ? 350 : 0, border: this.state.panelShow ? null : "none" }}>
                    <div className="wasabi-grid-panel-body"> {this.state.menuPanel}</div>
                </div>
            </div>);
    }
}



DataGrid.propTypes= {
    width: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),//宽度
    height: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),//高度
    selectAble: PropTypes.bool,// 是否显示选择，默认值 false
    singleSelect: PropTypes.bool,//是否为单选,默认值为 false
    detailAble: PropTypes.bool,//是否显示详情,默认值 false
    rowNumber: PropTypes.bool,//是否显示行号,true
    focusAble: PropTypes.bool,//是否显示焦点行，默认值 true
    editAble: PropTypes.bool,//是否允许编辑
    borderAble: PropTypes.bool,//是否显示表格边框，默认值 false

    clearChecked: PropTypes.bool,//刷新数据后是否清除选择,true
    selectChecked: PropTypes.bool,//选择行的时候是否同时选中,false
    pagination: PropTypes.bool,//是否分页,默认值 true

    pageIndex: PropTypes.number,//当前页号
    pageSize: PropTypes.number,//分页大小，默认30
    sortName: PropTypes.string,//排序字段,
    sortOrder: PropTypes.oneOf([
        "asc",
        "desc",
    ]),//排序方式,默认asc,
    keyField: PropTypes.string,//关键字段
    headers: PropTypes.array,//表头设置
    footer: PropTypes.array,//页脚,
    total: PropTypes.number,// 总条目数，有url没用，默认为 0
    data: PropTypes.array,//当前页数据（json）

    url: PropTypes.string,//ajax地址
    backSource: PropTypes.string,//ajax的返回的数据源中哪个属性作为数据源(旧版本)
    dataSource: PropTypes.string,//ajax的返回的数据源中哪个属性作为数据源(新版本)
    footerSource: PropTypes.string,//页脚数据源,
    totalSource: PropTypes.string,//ajax的返回的数据源中哪个属性作为总记录数源

    params: PropTypes.object,//查询条件
    onClick: PropTypes.func,//单击事件
    onDoubleClick: PropTypes.func,//双击事件
    onChecked: PropTypes.func,//监听表格中某一行被选中/取消
    updateHandler: PropTypes.func,//手动更新事件，父组件一定要有返回值,返回详情组件
    detailHandler: PropTypes.func,//展示详情的函数，父组件一定要有返回值,返回详情组件
    pagePosition: PropTypes.oneOf([
        "top",
        "bottom",
        "both"
    ]),//分页栏的位置
    control: PropTypes.bool,//是否显示菜单按钮
    controlPanel: PropTypes.any,//菜单面板
    headerUrl: PropTypes.string,//自定义列地址
    updateUrl: PropTypes.string,//列更新的地址
    pasteSuccess: PropTypes.func,//粘贴成功事件

};
DataGrid.defaultProps= {
  
        width: "100%",
        height: null,
        selectAble: false,
        singleSelect: false,
        detailAble: false,
        rowNumber: true,
        focusAble: true,
        borderAble: true,
        clearChecked: true,//是否清空选择的
        selectChecked: false,
        pagination: true,
        pageIndex: 1,
        pageSize: 20,
        sortName: "id",
        sortOrder: "asc",
        keyField: "id",
        headers: [],
        total: 0,
        data: null,
        url: null,//
        backSource: "data",//
        dataSource: "data",//
        totalSource: "total",//
        params: null,
        footer: null,//页脚
        onClick: null,
        onDoubleClick: null,
        onChecked: null,
        updateHandler: null,
        detailHandler: null,
        footerSource: "footer",//页脚数据源
        pagePosition: "bottom",//默认分页在底部
        control: false,
        controlPanel: null,
        headerUrl: null,
        editAble: false,//是否允许编辑
        updateUrl: null,
        pasteSuccess: null

    
};

mixins(DataGrid,[DataGridHandler, DataGridExtend, pasteExtend, showUpdate]);

export default DataGrid;
