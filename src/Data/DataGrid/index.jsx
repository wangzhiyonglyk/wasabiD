/**
 *Created by wangzhiyong on 2016-04-05
 * desc:列表组件,由此组件开始独立重构所有组件,不再依赖
 * wasabi框架的第一个组件
 * 2016-06-09后开始调整整个样式
 * 2017-01-04 注意了,这里渲染分页与复制的CopyDataGrid不一样，因为CopyDataGrid宽度比较小可能放不下
 *2017-09-30 将固定表头功能先隐藏掉
 *2020-11月 统一修改bug
 2020-12-19开始 重新扩展表格功能，扩展表头，表尾 固定表头，拖动列，固定列，高度，宽表的适应，编辑，粘贴，导入excel等功能 将表格拆分更细
 desc 简单表头，与复杂表头是为了处理兼容性问题
 2021-05-28 创建table组件， 重新改造datagrid，将view,event,data分离，组件单一责任原则
 2021-09-06 修复列拖动改变宽度的问题
 固定列，复杂表头仍然有bug，需要检查
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * 公共方法
 */
import func from '../../libs/func.js';

import mixins from '../../Mixins/mixins';



/**
 * 事件处理
 */
import eventHandler from './method/eventHandler.js';
import staticMethod from "./method/staticMethod"
import pasteExtend from './method/pasteExtend.js';
import Grid from "./View/Grid"
/**
 * 样式
 */
import('./datagrid.css');
import('./datagridetail.css');
class DataGrid extends Component {
    constructor(props) {
        super(props);
        this.containerWidth = 0;//表格的宽度 
        this.state = {
            fixedthcontainerid: func.uuid(),//固定表头容器
            fixedTableContainerid: func.uuid(),//固定表格的容器
            fixedTableid: func.uuid(),//固定的表格
            realTableContainerid: func.uuid(),//真实表格容器
            realTableid: func.uuid(),//真实表格
            url: null,
            rawUrl: null,
            params: null, //参数
            rawParams: null,//保留旧的，用于对比
            pageIndex: this.props.pageIndex,//页号
            pageSize: this.props.pageSize,//分页大小
            sortName: this.props.sortName,//排序名称
            sortOrder: this.props.sortOrder,//排序方式

            /************这几个字段在 getDerivedStateFromProps 处理逻辑，这样提升性能 */
            fixedHeaders: [],//固定列的表头
            rawFixedHeaders: [],//固定列的表头,保存用于更新
            headers: [], //表头会可能后期才传送,也会动态改变
            rawHeaders: [],//保存起来，用于更新
            rawData: [],//原始数据，在自动分页时与判断是否更新有用
            data: [],
            single: false,//是否简单表头
            headerChange: false,//表头是否有变化，用于更新
            /************这几个字段在 getDerivedStateFromProps 处理逻辑，这样提升性能 */

            checkedData: new Map(),//勾选的数据
            checkedIndex: new Map(),//勾选的下标
            detailView: null, //详情行,
            detailIndex: null, //显示详情的行下标
            total: 0, //总记录数
            loading: this.props.url ? true : false, //显示正在加载图示
            footer: this.props.footer, //页脚
            updateUrl: this.props.updateUrl,
            editAble: this.props.editAble || this.props.addAble || this.props.importAble,//如果允许添加或者导入，自然就允许编辑
            editIndex: null, //当前处理编辑的列
            addData: new Map(), //新增的数据,因为有可能新增一个空的，然后再修改
            updateData: new Map(), //被修改过的数据，因为要判断曾经是否修改
            deleteData: [], //删除的数据
            reloadData: false,//是否重新加载数据,用于强制刷新
            adjustHeight: false,//是否调整宽度

        };
        //绑定事件
        let baseCtors = [eventHandler, staticMethod, pasteExtend];
        baseCtors.forEach(baseCtor => {
            Object.getOwnPropertyNames(baseCtor).forEach(name => {
                if (typeof baseCtor[name] == 'function') {
                    this[name] = this[name].bind(this);
                }
            });
        });
        this.computeHeaderStyleAndColumnWidth = this.computeHeaderStyleAndColumnWidth.bind(this)
    }
    static getDerivedStateFromProps(props, state) {
        let newState = {};//新的状态值
        if ((props.url && props.url != state.rawUrl) || (props.params &&
            func.diff(props.params, state.rawParams))) {//父如果参数有变
            newState = {
                reloadData: true,
                url: props.url,
                rawUrl: props.url,
                rawParams: func.clone(props.params),
                params: func.clone(props.params),
            }
        }
        //处理Headers,因为交叉表的表头是后期传入的
        {
            //处理非固定列
            {
                let single = true;//默认是简单的表头
                for (let i = 0; i < props.headers.length; i++) {
                    if (props.headers[i] instanceof Array) {
                        single = false;//复杂表头
                    }
                }
                //是否是简单表头
                if (single != state.single) {
                    newState.single = single;
                }
                if (func.diff(props.headers, state.rawHeaders)) {
                    //有改变
                    newState.rawHeaders = props.headers;
                    newState.headers = func.clone(props.headers);
                }
            }
            {
                //处理固定列
                if (func.diff(props.fixedHeaders, state.rawFixedHeaders)) {
                    //有改变
                    newState.fixedHeaders = func.clone(props.fixedHeaders);
                    newState.rawFixedHeaders = props.fixedHeaders;
                    newState.headers = [].concat(newState.fixedHeaders, newState.headers);//合并列
                }
                else {//没有改变
                    if (props.fixedHeaders && props.fixedHeaders instanceof Array && props.fixedHeaders.length > 0) {//没有改变，但是有固定列

                        newState.headers = [].concat(state.fixedHeaders, newState.headers);//合并列
                    }
                }
            }
            if (newState.headers && func.diffOrder(newState.headers, state.headers)) {

                newState.adjustHeight = true;//表头有变化，调整宽度
            }
        }
        //todo 此处理还要仔细研究
        if (props.data && props.data instanceof Array && func.diff(props.data, state.rawData)) {
            //如果传了死数据
            newState.rawData = props.data;
            try {
                //防止数据切割的时候报错
                newState.data = props.pagination == true ? props.data.length > state.pageSize
                    ? props.data.slice(((state.pageIndex) - 1) * state.pageSize, state.pageSize)
                    : props.data : props.data;
            }
            catch (e) {
                newState.data = props.data;
            }
            newState.total = props.total || props.data.length || 0
        }
        if (func.isEmptyObject(newState)) {
            return null;
        }
        else {
            return newState;
        }

    }
    /**
     * 更新函数
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        //重新加数据
        if (this.state.reloadData) {
            this.setState({
                reloadData: false,
            })
            this.reload();
        }
        if (this.state.adjustHeight) {
            this.computeHeaderStyleAndColumnWidth();//需要调整宽度
        }
    }
    componentDidMount() {
        if (this.state.reloadData) {

            this.setState({
                reloadData: false,
            })
            this.reload();
        }

        //监听window.resize事件
        window.onresize = () => {
            this.computeHeaderStyleAndColumnWidth();//重新计算一下宽度
        }
        //延迟处理，因为有时候无法获取到真正的宽度
        setTimeout(() => {
            let containerWidth = document.getElementById(this.state.realTableContainerid).getBoundingClientRect().width;
            if (containerWidth > this.containerWidth + 2) {
                this.computeHeaderStyleAndColumnWidth();
            }
        }, 50);
    }

    /**
     * 计算出列的宽度
     *因为有固定表头，固定列，还有拖动列等，必须设置好列的宽度，否则对不齐
     */
    computeHeaderStyleAndColumnWidth() {
        //数据网格的宽度   
        this.containerWidth = document.getElementById(this.state.realTableContainerid).getBoundingClientRect().width;
        this.containerWidth = this.containerWidth - 2;//去掉两个像素
        this.columnSum = 0;//总列数
        this.fixedcolumnSum = 0;//固定列的总列数
        this.releaseWidth = this.containerWidth;//剩余可分配宽度
        this.releaseColumn = 0;//剩余要计算宽度的列
        this.fixedreleaseColumn = 0;//剩余要计算宽度的固定列
        this.perColumnWidth = 0;//每一列的宽度
        this.tableWidth = 0;//表格宽度，因为有可能表格列都设置宽度，总宽度与网格的整体宽表不同
        this.fixedTableWidth = 0;//固定表格的宽表
        if (this.containerWidth > 0 && this.state.headers && this.state.headers instanceof Array) {
            for (let i = 0; i < this.state.headers.length; i++) {
                if (this.state.headers[i] instanceof Array) {
                    for (let j = 0; j < this.state.headers[i].length; j++) {
                        if (this.state.headers[i][j].colSpan && this.state.headers[i][j].colSpan > 1) {
                            //不算一列
                            continue;
                        }
                        else {
                            //算一列
                            this.columnSum++;
                            if (i < this.state.fixedHeaders.length && j < this.state.fixedHeaders[i].length) {//固定列
                                this.fixedcolumnSum++;//算一列
                            }
                            if (this.state.headers[i][j].width) {
                                //设置了宽度
                                try {
                                    this.tableWidth += this.state.headers[i][j].width;//计算表格宽度
                                    if (i < this.state.fixedHeaders.length && j < this.state.fixedHeaders[i].length) {//固定列
                                        this.fixedTableWidth += this.state.headers[i][j].width;
                                        this.fixedreleaseColumn++;
                                    }
                                    this.releaseWidth = this.releaseWidth - parseFloat(this.state.headers[i][j].width);
                                    this.releaseColumn++;

                                }
                                catch (e) {
                                    console.error("宽度设置错误", e);
                                }

                            }
                            else {

                            }
                        }
                    }

                } else {
                    if (this.state.headers[i].colSpan && this.state.headers[i].colSpan > 1) {
                        continue;
                    }
                    else {
                        //算一列
                        this.columnSum++;
                        if (i < this.state.fixedHeaders.length) {//固定列

                            this.fixedcolumnSum++;//算一列
                        }
                        if (this.state.headers[i].width) {
                            //设置了宽度
                            try {
                                this.tableWidth += this.state.headers[i].width;//计算表格宽度
                                if (i < this.state.fixedHeaders.length) {//固定列
                                    this.fixedTableWidth += this.state.headers[i].width;
                                    this.fixedreleaseColumn++;//加上，后面做减法
                                }
                                this.releaseWidth = this.releaseWidth - parseFloat(this.state.headers[i].width);
                                this.releaseColumn++;//加上，后面做减法
                            }
                            catch (e) {
                                console.error("宽度设置错误", e);
                            }

                        }
                        else {

                        }
                    }
                }
            }
            if (this.props.detailAble) {//存在详情列
                this.releaseWidth -= 30;
                this.tableWidth += 30;
                this.fixedTableWidth += 30;
            }
            if (this.props.selectAble) {//存在勾选列
                this.releaseWidth -= 36;
                this.tableWidth += 36;
                this.fixedTableWidth += 36;
            }
            if (this.props.rowNumber) {////存在序号列
                this.releaseWidth -= 60;
                this.tableWidth += 60;
                this.fixedTableWidth += 60;
            }

            this.releaseColumn = this.columnSum - this.releaseColumn;//剩余要分配的列
            this.fixedreleaseColumn = this.fixedcolumnSum - this.fixedreleaseColumn;//剩余要分配的固定列
            if (this.releaseColumn) {//防止有0的情况
                try {
                    this.perColumnWidth = parseInt((this.releaseWidth) / this.releaseColumn);//得到剩余要分配的列的平均宽度

                    this.tableWidth += this.perColumnWidth * this.releaseColumn;//得到表格的宽度
                }
                catch (e) {
                    console.error("计算宽度报错", e);
                }

            }
            if (this.fixedreleaseColumn) {//还有剩下的列
                this.fixedTableWidth += this.fixedreleaseColumn * this.perColumnWidth;
            }
        }
        else if (this.containerWidth <= 0) {
            //防止父组件被隐藏了，datagrid无法得到真实的宽度
            this.timeout = setTimeout(this.computeHeaderStyleAndColumnWidth, 1000)
        }
        this.setState({
            adjustHeight: false,//调整完成
            headers:this.setHeaderWidth(),
            fixedHeaders:this.setFixedHeaderWidth(),
        })

    }
    /**
     * 通过计算得到每一列的宽度
     * @returns 
     */
    setHeaderWidth() {
        let headers;
        if (this.state.single) {
            headers = this.state.headers&&this.state.headers.map(item => {
                item.width = item.width || this.perColumnWidth;
                return item;
            })

        }
        else {
            headers = this.state.headers.map(trheader => {
                if (trheader instanceof Array) {
                    return trheader.map(item => {
                        if ((item.colSpan && header.colSpan > 1)) {
                            return item;
                        }
                        else {
                            item.width = item.width || this.perColumnWidth;
                            return item;
                        }
                    })
                }
                else {
                    trheader.width = trheader.width || this.perColumnWidth;
                }
            })
        }
        return headers;
    }
    setFixedHeaderWidth(){
        let headers;
        if (this.state.single) {
            headers =  this.state.fixedHeaders&&this.state.fixedHeaders.map(item => {
                item.width = item.width || this.perColumnWidth;
                return item;
            })

        }
        else {
            headers =  this.state.fixedHeaders&&this.state.fixedHeaders.map(trheader => {
                if (trheader instanceof Array) {
                    return trheader.map(item => {
                        if ((item.colSpan && header.colSpan > 1)) {
                            return item;
                        }
                        else {
                            item.width = item.width || this.perColumnWidth;
                            return item;
                        }
                    })
                }
                else {
                    trheader.width = trheader.width || this.perColumnWidth;
                }
            })
        }
        return headers;
    }
    componentWillUnmount() {
        this.timeout && clearTimeout(this.timeout)
    }
    render() {
        let style = func.clone(this.props.style) || {};
        let height = style.height;//通过高度来判断是否渲染固定的表头
        style.height = null;
        return <Grid
            {...this.props}
            {...this.state}
            style={style}
            height={height}
            tableWidth={this.tableWidth}
            fixedTableWidth={this.fixedTableWidth}
            perColumnWidth={this.perColumnWidth}
            checkedAllHandler={this.checkedAllHandler}
            checkCurrentPageCheckedAll={this.checkCurrentPageCheckedAll}
            getKey={this.getKey}
            onClick={this.onClick}
            onDoubleClick={this.onDoubleClick}
            onChecked={this.onChecked}
            tableCellEditHandler={this.tableCellEditHandler}
            onSort={this.onSort}
            onDetail={this.onDetail}
            onRealTableScoll={this.onRealTableScoll}
            paginationHandler={this.paginationHandler}
            onPaste={this.onPaste}
            exportAble={this.props.exportAble}
            reload={this.reload}
            export={this.export.bind(this, false, "grid-")}
            upload={this.upload}
            onAdd={this.onAdd}
            onSave={this.onSave}
            onDrop={this.onDrop}
            onDragOver={this.onDragOver}
        ></Grid>
    }
}

DataGrid.propTypes = {

    /**
     * 表格常用属性设置
     */
    style: PropTypes.object,//样式对象
    className: PropTypes.string,//样式
    selectAble: PropTypes.bool, // 是否显示选择，默认值 false
    singleSelect: PropTypes.bool, //是否为单选,默认值为 false
    detailAble: PropTypes.bool, //是否显示详情,默认值 false
    rowNumber: PropTypes.bool, //是否显示行号,true
    focusAble: PropTypes.bool, //是否显示焦点行，默认值 true
    borderAble: PropTypes.bool, //是否显示表格边框，默认值 false
    addAble: PropTypes.bool,//是否允许添加
    editAble: PropTypes.bool, //是否允许编辑
    importAble: PropTypes.bool,//是否允许导入
    selectChecked: PropTypes.bool, //选择行的时候是否同时选中,false
    exportAble: PropTypes.bool,//是否允许导出
    /**
     * 分页
     */
    pagePosition: PropTypes.oneOf(['top', 'bottom', 'both']), //分页栏的位置
    pagination: PropTypes.bool, //是否分页,默认值 true
    pageIndex: PropTypes.number, //当前页号
    pageSize: PropTypes.number, //分页大小，默认30
    sortName: PropTypes.string, //排序字段,
    sortOrder: PropTypes.oneOf(['asc', 'desc']), //排序方式,默认asc,


    /**
     * 数据设置
     */
    headers: PropTypes.array, //表头设置
    fixedHeaders: PropTypes.array, //固定列设置
    footer: PropTypes.array, //页脚,
    total: PropTypes.number, // 总条目数，有url没用，默认为 0
    data: PropTypes.array, //当前页数据（json）



    /**
     * ajax请求参数
     */
    url: PropTypes.string, //ajax地址
    updateUrl: PropTypes.string, //列更新的地址
    httpType: PropTypes.string,//请求类型
    contentType: PropTypes.string,//请求的参数传递类型
    httpHeaders: PropTypes.object,//请求的头部
    params: PropTypes.object, //查询条件


    /**
     * 数据源
     */
    dataSource: PropTypes.string, //ajax的返回的数据源中哪个属性作为数据源
    footerSource: PropTypes.string, //页脚数据源,
    totalSource: PropTypes.string, //ajax的返回的数据源中哪个属性作为总记录数源


    /**
     * 事件
     */
    onClick: PropTypes.func, //单击事件
    onDoubleClick: PropTypes.func, //双击事件
    onChecked: PropTypes.func, //监听表格中某一行被选中/取消
    onUpdate: PropTypes.func, //手动更新事件，父组件一定要有返回值,返回详情组件
    onDetail: PropTypes.func, //展示详情的函数，父组件一定要有返回值,返回详情组件
    onSave: PropTypes.func,//保存事件
    onPaste: PropTypes.func, //粘贴成功事件
    onDrop: PropTypes.func,//停靠事件
    loadSuccess: PropTypes.func,//异步加载数据后，对数据进行进一步加工

    /**
     * pivot 专门为交叉提供的属性
     */
    isPivot: PropTypes.bool,//是否是交叉表，需要设置最小宽度
};
DataGrid.defaultProps = {
    /**
     * 表格常用属性设置
     */


    selectChecked: false,
    exportAble: true,
    borderAble: true,

    /**
    * 分页
    */
    pagePosition: 'bottom', //默认分页在底部
    pagination: true,
    pageIndex: 1,
    pageSize: 20,
    sortName: 'id',
    sortOrder: 'desc',

    /**
   * 数据设置
   */
    headers: [],
    fixedHeaders: [],
    total: 0,
    /**
     * ajax请求参数
     */

    httpType: "POST",
    contentType: "application/x-www-form-urlencoded",

    /**
      * 数据源
      */
    dataSource: 'data', //
    footerSource: 'footer', //页脚数据源
    totalSource: 'total', //
};

mixins(DataGrid, [eventHandler, staticMethod, pasteExtend]);

export default DataGrid;
