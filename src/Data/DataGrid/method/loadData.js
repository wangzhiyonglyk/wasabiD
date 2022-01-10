/**
 * create by wangzhiyong
 * date:2021-12-28
 * desc:将分页加载数据独立出来
 * 
 */

 import React from "react";
 import func from "../../../libs/func.js";
 import Msg from "../../../Info/Msg.jsx";
 import api from "wasabi-api"
import config from "../config.js";
 export default {
      /**
     * 分页加载数据
     * @param {*} url 请求的url
     * @param {*} pageSize 分页大小
     * @param {*} pageIndex 页号
     * @param {*} sortName  排序字段
     * @param {*} sortOrder  排序方式
     * @param {*} params 参数
     */
    loadData: function (url, pageSize, pageIndex, sortName, sortOrder, params) {////数据处理函数,更新
        if (this.state.addData.size > 0 || this.state.deleteData.size > 0 || this.state.updateData.size > 0) {
            Msg.confirm("有脏数据,是否继续更新列表?", () => {
                this.loadDataConfirm(url, pageSize, pageIndex, sortName, sortOrder, params);
            })

        }
        else {
            this.loadDataConfirm(url, pageSize, pageIndex, sortName, sortOrder, params);
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
    loadDataConfirm: function (url, pageSize, pageIndex, sortName, sortOrder, params) {
        /*
     url与params而url可能是通过reload方法传进来的,并没有作为状态值绑定
     headers可能是后期才传了,见Page组件可知
     所以此处需要详细判断
     */
        if (url) {
            this.setState({
                urlLoadData: false,
                loading: true,
                url: url,//更新,有可能从reload那里直接改变了url
            })
            let httpParams = func.clone(params) || {};//本次请求的参数
            if (this.props.pagination == true) {//追加这四个参数
                httpParams.pageSize = pageSize;
                httpParams.pageIndex = pageIndex;
                httpParams.sortName = sortName;
                httpParams.sortOrder = sortOrder;
            }

            /*
             在查询失败后可能要继续调用loadData查询前一页数据,所以传url,以便回调,
             而pageSize,pageIndex,sortName,sortOrder,params这些参数在查询成功后再更新
             所以回传
             */
            let fetchmodel =
            {
                url: url,
                data: httpParams,
                success: this.loadSuccess.bind(this, url, pageSize, pageIndex, sortName, sortOrder, params),
                error: this.loadError,
                type: this.props.httpType ? this.props.httpType.toUpperCase() : "POST",
                headers: this.props.httpHeaders || {},
                contentType: this.props.contentType || null,
            }
            console.log("datagrid-开始查询:", fetchmodel);
            let wasabi_api = window.api || api;
            wasabi_api.ajax(fetchmodel);

        } else {//没有传url
            if (this.props.onUpdate) {
                this.props.onUpdate(this.state.pageSize, this.state.pageIndex, this.state.sortName, this.state.sortOrder);
            } else {
                //判断传的
                if (this.state.rawData.length >= (pageSize || 20) * (pageIndex - 1)) {
                    this.setState({
                        data: this.state.rawData.slice(((pageIndex || 1) - 1) * (pageSize || 20), (pageIndex || 1) * (pageSize || 20)),
                        pageIndex: pageIndex,
                        pageSize: pageSize
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
        let dataSource = this.props.dataSource;//数据源
        let dataResult;//最终数据
        let totalResult;//最终总共记录
        let footerResult;//最终统计数据
        
        //找到数据源
        if (typeof this.props.loadSuccess === "function") {
            //如果父组件指定了数据加载后的方法，先执行，然后再处理数据
            let resultData = this.props.loadSuccess(result);
            //有正确的返回值
            dataResult = resultData && typeof resultData instanceof Array ? resultData : result;
        }
        else if (dataSource && typeof dataSource === "string") {//需要重新指定数据源
            dataResult = func.getSource(result, dataSource || "data");
        }
        //找到总记录数
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
            //有总记录，没有当前记录数,不是第一页，继续查询转到上一页,
            //目的是为了防止手动换页时，到最后一页根本没有数据
            this.loadData(url, pageSize, pageIndex - 1, sortName, sortOrder, params);
        }
        else {
            //查询成功
            if (dataResult && dataResult instanceof Array) {//是数组,
                //分页时查询的数据过多，切除掉
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
                initVirtualConfig:dataResult.length<config.minDataTotal?null:true,//小于配置值则不设置，重新设置虚拟列表
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