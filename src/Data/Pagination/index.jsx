
/**
 * 分页组件
 * create by wangzhiyong
 * date:2021-04,从datagrid独立出来
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "./pagination.css"
import func from '../../libs/func.js';
import pageSizeList from './pageSizeList.js';


class Pagination extends React.Component {
    constructor(props) {
        super(props);
     
        this.state = {
            oldProps: func.clone(this.props),
            total: this.props.total,//总记录数
            pageTotal: this.props.pageTotal,//当前页数据量
            pageSize: this.props.pageSize,//分页大小，
            pageIndex: this.props.pageIndex,//分页号
        }
        this.paginationHandler = this.paginationHandler.bind(this);
        this.prePaginationHandler = this.prePaginationHandler.bind(this);
        this.nextPaginationHandler = this.nextPaginationHandler.bind(this);
        this.nextPaginationHandler = this.nextPaginationHandler.bind(this);
        this.pageSizeHandler = this.pageSizeHandler.bind(this)
    }
    static getDerivedStateFromProps(props, state) {
        if (func.diff(props, state.oldProps)) {
            return {
                oldProps: func.clone(props),
                total: props.total,
                pageTotal: props.pageTotal,
                pageSize: props.pageSize,
                pageIndex: props.pageIndex,

            }
        }
        return null;

    }
    /**
   * 页号改变
   * @param {*} pageIndex 
   */
    paginationHandler(pageIndex) {//分页处理函数
        if (pageIndex == this.state.pageIndex) {//当前页,不处理
            return;
        }
        else {//跳转到指定页
            this.props.onChange && this.props.onChange(pageIndex, this.state.pageSize);

        }
    }
    /**
     * 上一页数据
     */
    prePaginationHandler() {

        if (this.state.pageIndex == 1) {

        }
        else {
            this.props.onChange && this.props.onChange(this.state.pageIndex - 1, this.state.pageSize);
        }

    }
    /**
     * 下一页
     */
    nextPaginationHandler() {

        var pageAll = (parseInt(this.state.total / this.state.pageSize));//共多少页
        var lastPageNum = (this.state.total % this.state.pageSize);
        if (lastPageNum > 0) {
            pageAll++;
        }
        if (this.state.pageIndex == pageAll) {

        }
        else {
            this.props.onChange && this.props.onChange(this.state.pageIndex + 1, this.state.pageSize);
        }
    }
    /**
     * 页号大小改变
     * @param {*} event 
     */
    pageSizeHandler(event) {
        this.props.onChange && this.props.onChange(1, event.target.value * 1);
    }

    /**
     * 渲染总记录数
     */
    renderTotal() {
        //渲染总记录数，当前记录的下标
        let beginOrderNumber = 1;
        let endOrderNumber = 0; //数据开始序号与结束序号
        let total = this.state.total || 0; //总记录数
        let pageTotal = 1;//共多少页
        if (this.props.pagination) {
            //有分页,计算当前页序号
            pageTotal = parseInt(this.state.total / this.state.pageSize); //
            pageTotal = this.state.total % this.state.pageSize > 0 ? pageTotal + 1 : pageTotal; //求余后得到最终总页数
            beginOrderNumber =
                this.state.pageSize * (this.state.pageIndex - 1) + 1;
            endOrderNumber =
                this.state.pageSize * (this.state.pageIndex - 1) + this.state.pageTotal;
        } else {
            //无分页
            endOrderNumber = this.state.pageTotal;
        }
        return (
            <div key='pagination-info' className='pagination-info'>
                显示&nbsp;{beginOrderNumber} &nbsp;至&nbsp; {endOrderNumber}&nbsp;项&nbsp;共&nbsp; {total} &nbsp;项记录
                <div
                    style={{ display: this.props.pagination ? 'inline-block' : 'none' }}
                >每页&nbsp;
                    <select className='pagination-select'value={this.state.pageSize}onChange={this.pageSizeHandler}
>
                        {
                            pageSizeList.map((item,index)=>{
                                return   <option key={index} value={item}>{item}</option>
                            })
                        }
                      
                       
                    </select>&nbsp;条&nbsp;&nbsp;

                    {<i title="刷新" style={{ fontSize: 16, cursor: "pointer" }} className="icon-refresh" onClick={this.props.reload}></i>}
                    &nbsp;&nbsp;
                    {
                        this.props.exportAble ? <div style={{ display: "inline-block", height: 20, position: "relative", width: 30 }}> <i title="导出" style={{ cursor: "pointer", fontSize: 20, position: "absolute", top: 5 }} className="icon-excel" onClick={this.props.export}></i></div> : null
                    }
                </div>
            </div>
        );

    }
    /**
     * 分页
     */
    renderPagination() {
        //显示分页控件
        let paginationComponent = null;
        if (this.props.pagination) {
            let pageAll = parseInt(this.state.total / this.state.pageSize); //共多少页
            if (this.state.total % this.state.pageSize > 0) {
                pageAll++; //求余后得到最终总页数
            }
            if (pageAll == 0) {
                //数据为空，直接返回
                return null;
            }

            if (pageAll > 7) {
                //大于7页，
                let pageComponent = []; //分页组件
                let firstIndex = 0; //第一个显示哪一页
                let lastIndex = 0; //最后一个显示哪一页
                let predisabledli = (
                    <li key='predis' className='paginate_button disabled'>
                        <a>...</a>
                    </li>
                ); //多余的分页标记
                let lastdisabledli = (
                    <li key='lastdis' className='paginate_button disabled'>
                        <a>...</a>
                    </li>
                ); //多余的分页标记
                if (this.state.pageIndex >= 4 && this.state.pageIndex <= pageAll - 3) {
                    //当前页号处于中间位置
                    firstIndex = this.state.pageIndex - 2;
                    lastIndex = this.state.pageIndex + 2;
                } else {
                    //非中间位置
                    if (this.state.pageIndex < 4) {
                        //靠前的位置
                        firstIndex = 2;
                        lastIndex = 6;
                        predisabledli = null; //设置为空
                    } else {
                        //靠后的位置
                        if (this.state.pageIndex > pageAll - 3) {
                            firstIndex = pageAll - 5;
                            lastIndex = pageAll - 1;
                            lastdisabledli = null; //设置为空
                        }
                    }
                }
                for (let i = firstIndex; i <= lastIndex; i++) {
                    pageComponent.push(
                        <li
                            key={'li' + i}
                            className={
                                'paginate_button ' +
                                (this.state.pageIndex * 1 == i ? 'active' : '')
                            }
                        >
                            <a onClick={this.paginationHandler.bind(this, i)}>{i}</a>
                        </li>
                    );
                }
                pageComponent.unshift(predisabledli);
                pageComponent.push(lastdisabledli);

                paginationComponent = (
                    <div key="pagination-number" className='pagination-number'>
                        <ul className='pagination'>
                            <li key={'lipre'} className='paginate_button '>
                                <a onClick={this.prePaginationHandler}>上一页</a>
                            </li>
                            <li
                                key={'lifirst'}
                                className={
                                    'paginate_button  ' +
                                    (this.state.pageIndex * 1 == 1 ? 'active' : '')
                                }
                            >
                                <a onClick={this.paginationHandler.bind(this, 1)}>{1}</a>
                            </li>
                            {pageComponent}

                            <li
                                key='lilast'
                                className={
                                    'paginate_button previous ' +
                                    (this.state.pageIndex * 1 == pageAll ? 'active' : '')
                                }
                            >
                                <a onClick={this.paginationHandler.bind(this, pageAll)}>
                                    {pageAll}
                                </a>
                            </li>
                            <li key='linext' className='paginate_button next'>
                                <a onClick={this.nextPaginationHandler}>下一页</a>
                            </li>
                        </ul>
                    </div>
                );
            } else {
                //小于7页直接显示

                let pagearr = [];

                for (let i = 0; i < pageAll; i++) {
                    let control = (
                        <li
                            key={'li' + i}
                            className={
                                'paginate_button ' +
                                (this.state.pageIndex * 1 == i * 1 + 1 ? 'active' : '')
                            }
                        >
                            <a onClick={this.paginationHandler.bind(this, i + 1)}>{i + 1}</a>
                        </li>
                    );
                    pagearr.push(control);
                }
                paginationComponent = (
                    <div key="pagination-number" className='pagination-number'>
                        <ul className='pagination'>
                            <li key={'lipre'} className='paginate_button previous'>
                                <a onClick={this.prePaginationHandler}>上一页</a>
                            </li>
                            {pagearr}
                            <li key='linext' className='paginate_button next'>
                                <a onClick={this.nextPaginationHandler}>下一页</a>
                            </li>
                        </ul>
                    </div>
                );
            }
        }
        return paginationComponent;
    }

   
    render() {
        return <div className='wasabi-pagination '>
            {this.renderTotal()}{this.renderPagination()}
        </div>
    }
}
Pagination.propTypes = {
    pagination: PropTypes.bool,//是否分页
    pageIndex: PropTypes.number,//页号
    pageSize: PropTypes.number,//页大小
    pageTotal: PropTypes.number,//当前数据量
    total: PropTypes.number,//总记录数
    onChange: PropTypes.func,//回调函数
}
Pagination.defaultProps = {
    pagination: true,
    pageIndex: 1,
    pageSize: 20,
    pageTotal: 0,
    total: 0,
}

export default Pagination;