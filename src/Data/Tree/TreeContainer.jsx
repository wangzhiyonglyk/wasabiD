/*
create by wangzhiyong 树组件业务容器
 创建 date:2022-01-06 树组件业务容器，用于tree,treegrid,pivot，操作逻辑是一样的
date :2022-01-07 修复tregrid单击联动的bug
  2022-01-18 将tree组件全部改为hook
 */
import React, { useState, useReducer, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import PropTypes from "prop-types";
import func from "../../libs/func.js";
import treeFunc from "./treeFunc";
import propsTran from "../../libs/propsTran";
import api from "wasabi-api"
import "./tree.css"
import config from "./config";
import TreeView from "./TreeView";
import TreeGridView from "../TreeGrid/TreeGridView";
import Msg from "../../Info/Msg.jsx";

/**
 * 加工数据
 * @param {*} state 旧的状态值
 * @param {*} data 数据源
 * @param {*} filterValue 筛选值 
 * @param {*} sliceBeginIndex 切割开始下标，
 * @param {*} sliceEndIndex 切割结束下标
 * @returns 
 */
const handlerLoadData = function (state, data, filterValue, sliceBeginIndex, sliceEndIndex) {

    //同时处理筛选数据保持一致 
    let filter = treeFunc.filter(data, filterValue);
    //数据扁平化
    let flatData = func.treeDataToFlatData(filterValue ? filter : data);
    //切割
    let sliceData = flatData.slice(sliceBeginIndex, sliceEndIndex);
    //设置可见的数据的操作相关属性，因为对数据的checked,open,都是存在data中
    let visibleData = treeFunc.setVisibleDataProps(sliceData, data);

    return {
        ...state,
        filter: filter,
        data: data,
        flatData: flatData,
        visibleData: visibleData,
        sliceBeginIndex: sliceBeginIndex,
        sliceEndIndex: sliceEndIndex,
        loadingId: null
    }
}

/**
 * 请求数据
 * @param {*} url 
 * @param {*} httpType 
 * @param {*} contentType 
 *  * @param {*} headers 头部
 * @param {*} params 参数
 * @param {*} loadSuccess 
 * @param {*} loadError 
 */
const getData = function (url, httpType, contentType, headers, params = {}, loadSuccess = null, loadError = null) {
    //请求数据
    let fetchmodel = {
        type: httpType || "post",
        contentType: contentType,
        url: url,
        headers: headers || {},
        data: params,
        success: loadSuccess,
        error: loadError
    };
    let wasabi_api = window.api || api;
    wasabi_api.ajax(fetchmodel);
    console.log("tree async-fetch", fetchmodel);
}
//状态值
const myReducer = function (state, action) {
    try {
        let data = null;
        let payload = action.payload;
        switch (action.type) {
            //节点加载
            case "loading":
                return {
                    ...state,
                    loadingId: payload
                }
            //单击，双击
            case "onClick":
            case "onDoubleClick":
                return {
                    ...state,
                    clickId: payload
                }
            //勾选
            case "onChecked":
                let checked = (payload.id + "") === (payload.checkValue + "");
                data = [];
                if (payload.checkStyle === "checkbox") {
                    data = treeFunc.setChecked(state.data, payload.row, checked, payload.checkType);
                }
                else if (payload.checkStyle === "radio") {
                    data = treeFunc.setRadioChecked(state.data, payload.row, checked, payload.radioType);
                }
                return handlerLoadData(state, data, state.filterValue, state.sliceBeginIndex, state.sliceEndIndex);
            //设置勾选
            case "setChecked":
                if (payload.id) {
                    //先找到节点
                    let node = treeFunc.findNodeById(state.data, payload.id);
                    if (node) {
                        if (payload.checkStyle === "checkbox") {
                            data = treeFunc.setChecked(state.data, payload.node, !!payload.checked, payload.checkType);
                        }
                        else if (payload.checkStyle === "radio") {
                            data = treeFunc.setRadioChecked(state.data, payload.node, !!payload.checked, payload.radioType);
                        }
                        return handlerLoadData(state, data, state.filterValue, state.sliceBeginIndex, state.sliceEndIndex);
                    }
                }
            //全部清除
            case "clearChecked":
                data = treeFunc.clearChecked(state.data);
                return handlerLoadData(state, data, state.filterValue, state.sliceBeginIndex, sliceEndIndex);
            //全选
            case "checkedAll":
                data = treeFunc.checkedAll(state.data);
                return handlerLoadData(state, data, state.filterValue, state.sliceBeginIndex, state.sliceEndIndex);

            //重命名
            case "onRename":
                data = treeFunc.renameNode(state.data, payload.row, payload.newText);
                return handlerLoadData(state, data, state.filterValue, state.sliceBeginIndex, state.sliceEndIndex);
            //移除
            case "onRemove":
                data = treeFunc.removeNode(state.data, payload.row);
                return handlerLoadData(state, data, state.filterValue, state.sliceBeginIndex, state.sliceEndIndex);

            //停靠
            case "onDrop":
                const { dragNode, dropNode, dragType } = payload;

                if (dragNode.id !== dropNode.id) {
                    data = null;
                    if (dragType == "in") {
                        if (dragNode.pId !== dropNode.id) {

                            data = treeFunc.moveInNode(state.data, dragNode, dropNode);
                        }
                    }
                    else if (dragType == "before") {
                        data = treeFunc.moveBeforeNode(state.data, dragNode, dropNode);
                    }
                    else if (dragType == "after") {
                        data = treeFunc.moveAterNode(state.data, dragNode, dropNode);
                    }
                    if (data) {
                        return handlerLoadData(state, data, state.filterValue, state.sliceBeginIndex, state.sliceEndIndex);
                    }
                    else {
                        return state;
                    }

                }
            /**
             * 虚拟列表
             */
            case "showVisibleData":
                return handlerLoadData(state, payload.data, payload.filterValue, payload.sliceBeginIndex, payload.sliceEndIndex);
            //设置折叠或展开
            case "setOpen":
                data = treeFunc.setOpen(state.data, payload.row, payload.open);
                return handlerLoadData(state, data, state.filterValue, state.sliceBeginIndex, state.sliceEndIndex);
            case "remove":
                data = treeFunc.removeNode(state.data, a);
                return handlerLoadData(state, data, state.filterValue, state.sliceBeginIndex, state.sliceEndIndex);
            //追加
            case "append":
                const { children, row } = payload;
                data = treeFunc.appendChildren(state.data, children, row);
                return handlerLoadData(state, data, state.filterValue, state.sliceBeginIndex, state.sliceEndIndex);
            //筛选
            case "filter":
                return handlerLoadData(state, state.data, payload, state.sliceBeginIndex, state.sliceEndIndex);
            default:
                return state;
        }
    }
    catch (e) {
        console.log("reduce error", e)
    }

}
function TreeContainer(props, ref) {
    const [treecontainerid] = useState(func.uuid());
    const treeid = useState(func.uuid());
    const treegrid = useRef(null);
    const [state, dispatch] = useReducer(myReducer, {
        filter: null,//过滤的数据
        data: null,//源数据
        flatData: null,//扁平化数据
        visibleData: null,//可见数据
        sliceBeginIndex: 0,//切割开始下标，
        sliceEndIndex: 0,//切割结束下标，
        loadingId: null,//加载的节点id
        clickId: null//选中的节点id
    });

    //定义事件
    const onClick = useCallback((id,text,row) => {
        dispatch({ type: "onClick", payload: id }),
        treegrid?.current?.setFocus(id);  //如果是树表格
        props.onClick&&props.onClick(id,text,row);
    }, [state.clickId]);
    const onDoubleClick = useCallback((id,text,row) => { dispatch({ type: "onDoubleClick", payload: id });   props.onDoubleClick&&props.onDoubleClick(id,text,row); }, []);
    const onChecked = useCallback((id, text, row, checkValue) => {
        dispatch(
            {
                type: "onChecked",
                payload: { id, text, row, checkValue, checkType: props.checkType, checkStyle: props.checkStyle, radioType: props.radioType }
            }
        );
        let checked = (id + "") === (checkValue + "");
        props.onChecked && props.onChecked(checked, id, text, row);
    }, []);
    const onRemove = useCallback((id, text, row) => {
        if (Msg.confirm("您确定删除【" + text + "]吗")) {
            dispatch({ type: "onRemove", payload: { id, text, row } })
            props.onRemove && props.onRemove(id, text, row);
        }
    }, []);
    const onRename = useCallback((id, text, row, newText) => {
        dispatch({ type: "onRename", payload: { id, text, row, newText } });
        props.onRename && props.onRename(id, text, row, newText);
    }, []);
    const onDrop = useCallback((dragNode, dropNode, dragType) => { dispatch({ type: "onDrop", payload: { dragNode, dropNode, dragType } }) }, []);

    //加载子节点成功
    const loadSuccess = useCallback((res) => {
        dispatch({ type: "loading", payload: null });//
        if (typeof props.loadSuccess === "function") {
            //正确返回
            let resData = props.loadSuccess(res);
            res = resData && resData instanceof Array ? resData : res;
        }
        let realData = func.getSource(res, props.dataSource || "data");
        let row = window.sessionStorage.getItem("async-tree-node");
        row = JSON.parse(row);
        //格式化数据
        let asyncChildrenData = propsTran.formatterData("tree", "", realData, props.idField || "id", props.textField || "text", props.parentField || "pId", props.simpleData);
        dispatch({ type: "append", payload: { children: asyncChildrenData, row: row } })
    }, []);

    //加载子节点失败
    const loadError = useCallback(() => {
        dispatch({ type: "loading", payload: null });//
    }, []);

    //展开节点
    const onExpand = useCallback((open, id, text, row) => {
        //先设置折叠或者展开
        dispatch({ type: "setOpen", payload: { row, open } });//设置折叠与展开
        if (props.asyncAble && (!row.children || row.children.length == 0)) {//没有数据
            let asyncChildrenData = [];
            if (props.onAsync && typeof props.onAsync === "function") {//自行处理
                //得到子节点
                asyncChildrenData = props.onAsync(id, text, row);//得到数据
                if (asyncChildrenData && asyncChildrenData instanceof Array && asyncChildrenData.length > 0) {
                    //格式化数据
                    asyncChildrenData = propsTran.formatterData("tree", "", asyncChildrenData, props.idField || "id", props.textField || "text", props.parentField || "pId", props.simpleData);
                    dispatch({ type: "append", payload: { children: asyncChildrenData, row: row } })

                }
            }
            else if (props.url) {
                //没有设置异步函数
                dispatch({ type: "loading", payload: id });//
                //先保存节点数据
                window.sessionStorage.setItem("async-tree-node", JSON.stringify(row));
                //请求数据
                let params = func.clone(props.params) || {};
                params[props.idField || "id"] = id;
                getData(props.url, props.httpType, props.contentType, props.headers, params, loadSuccess, loadError)

            }

        }

        props.onExpand && props.onExpand(open, id, text, row);
    }, [props.url, props.httpType, props.contentType, props.params, props.headers, props.idField]);//

    /**
     * 滚动事件
     */
    const onScroll = useCallback(
        (data) => {
            let height = document.getElementById(treecontainerid).clientHeight || window.innerHeight;
            let visibleDataCount = Math.ceil(height / config.rowDefaultHeight);
            let scrollTop = document.getElementById(treecontainerid).scrollTop
            let startIndex = Math.floor(scrollTop / config.rowDefaultHeight);
            let endIndex = startIndex + config.bufferScale * visibleDataCount;
            scrollShowVisibleData(startIndex, endIndex, visibleDataCount, data)
        }, []);
    /**
   * 渲染当前可见数据
   * @param {*} startIndex 可见区数据的开始下标
   * @param {*} endIndex 可见区数据的结束下标
   */

    const scrollShowVisibleData = useCallback(
        (startIndex, endIndex, visibleDataCount, data = null) => {
            let startOffset;
            if (startIndex >= 1) {
                //减去上部预留的高度
                let size = (startIndex + 1) * config.rowDefaultHeight - (startIndex - config.bufferScale * visibleDataCount >= 0 ? (startIndex - config.bufferScale * visibleDataCount) * config.rowDefaultHeight : 0);
                startOffset = startIndex * config.rowDefaultHeight - size;
            } else {
                startOffset = 0;
            }
            document.getElementById(treeid).style.transform = `translate3d(0,${startOffset}px,0)`;

            //当前切割的数据开始下标
            let sliceBeginIndex = startIndex - config.bufferScale * visibleDataCount;
            sliceBeginIndex = sliceBeginIndex < 0 ? 0 : sliceBeginIndex;
            // //当前切割的数据结束下标
            let sliceEndIndex = endIndex + config.bufferScale * visibleDataCount;
            dispatch({ type: "showVisibleData", payload: { sliceBeginIndex, sliceEndIndex, filterValue: state.filterValue, data: data } });
        },
        [state.filterValue],
    )
    //对外接口
    useImperativeHandle(ref, () => ({
        /**
         * 设置值
         * @param {*} newValue 
         */
        getChecked() {
            return treeFunc.getChecked(state.data);
        },
        /**
         * 设置勾选
         * @returns 
         */
        setChecked(id, checked) {
            if (id !== null && id !== undefined && id !== "") {
                dispatch({ type: "setChecked", payload: { id, checked, checkType: props.checkType, checkStyle: props.checkStyle, radioType: props.radioType } })
            }
        },
        /**
    * 清除勾选
    */
        clearChecked() {
            dispatch({ type: "clearChecked" });
        },
        /**
         * 全部勾选
         */
        checkedAll() {
            dispatch({ type: "checkedAll" });
        },
        /**
         * 单击节点
         */
        setClick(id) {
            dispatch({ type: "setClick", payload: id });
            treegrid?.current?.grid?.current.setFocus(id);  //如果是树表格或者交叉表

            onscroll();
        },
        /**
         * 展开或折叠节点
         * @param {*} id 
         * @param {*} open 
         */
        setOpen(id, open) {
            dispatch({ type: "setOpen", payload: { id, open } });
        },
        /**
         * 移除某个节点
         * @param {*} row 
         */
        remove(node) {
            dispatch({ type: "remove", payload: node });
        },
        /**
         * 筛选
         * @param {*} value 
         */
        filter(value) {
            dispatch({ type: "filter", payload: value });
        },
        /**
         *追加节点
         * @param {*} children 
         * @param {*} node 
         */
        append(children, node = null) {
            if (children && children.length > 0) {
                dispatch({ type: "append", payload: { children: children, node } })
            }
        },
        /**
         * 
         */
        adjust() {
            onscroll();
        }
    }))
    //父组件加载数据
    useEffect(() => {
        if (props.url) {
            //先记住下标
            onScroll([]);
            //再请求数据
            getData(props.url, props.httpType, props.contentType, props.headers, props.params, loadSuccess, loadError)
        }
        else {//注意了，空数据也可以
            let height = document.getElementById(treecontainerid).clientHeight || window.innerHeight;
            let visibleDataCount = Math.ceil(height / config.rowDefaultHeight);
            let scrollTop = document.getElementById(treecontainerid).scrollTop
            let startIndex = Math.floor(scrollTop / config.rowDefaultHeight);
            let endIndex = startIndex + config.bufferScale * visibleDataCount;
            let data = propsTran.formatterData("tree", null, props.data, props.idField, props.textField, props.parentField, props.simpleData);
            //如果拿不到高度则给默认值,防止因为元素隐藏等原因
            scrollShowVisibleData(startIndex, endIndex || config.visibleCount, visibleDataCount || config.visibleCount, data || []);
        }
    }, [props.url, props.data])


    //需要下传的事件
    const treeEvents = {
        beforeDrag: props.beforeDrag,
        beforeRemove: props.beforeRemove,
        beforeDrop: props.beforeDrop,
        beforeRename: props.beforeRename,
        onDrag: props.onDrag,
        onClick: onClick,
        onDoubleClick: onDoubleClick,
        onChecked: onChecked,
        onRemove: onRemove,
        onExpand: onExpand,
        onRename: onRename,
        onDrop: onDrop,

    }
    let control;
    if (!props.componentType || props.componentType === "tree") {
        control = <TreeView {...props} {...state} {...treeEvents} treeid={treeid}></TreeView>
    }
    else if (props.componentType === "treegrid") {

        control = <TreeGridView ref={treegrid} {...props} {...state} {...treeEvents} treeid={treeid} ></TreeGridView>
    }
    return <div id={treecontainerid} onScroll={onScroll.bind(this, state.data)}
        className={"wasabi-tree-parent " + (props.className || "")}
        style={props.style}>
        {control}
        <div style={{ left: 0, top: 0, height: state.flatData && state.flatData.length * config.rowDefaultHeight, position: "absolute", width: 1 }}></div>
    </div>

}
TreeContainer = React.forwardRef(TreeContainer)
TreeContainer.propTypes = {
    componentType: PropTypes.oneOf(["tree", "treegrid"]),//类型
    name: PropTypes.string,//树名称
    idField: PropTypes.string,//数据字段值名称
    parentField: PropTypes.string,//数据字段父节点名称
    textField: PropTypes.string,//数据字段文本名称
    dotted: PropTypes.bool,//是否有虚线
    url: PropTypes.string,//后台查询地址

    params: PropTypes.object,//向后台传输的额外参数
    dataSource: PropTypes.string,//ajax的返回的数据源中哪个属性作为数据源,为null时直接后台返回的数据作为数据源
    headers: PropTypes.array,//表头
    data: PropTypes.array,//节点数据
    simpleData: PropTypes.bool,//是否使用简单的数据格式
    selectAble: PropTypes.bool,//是否允许勾选
    checkStyle: PropTypes.oneOf(["checkbox", "radio", PropTypes.func]),//单选还是多选
    checkType: PropTypes.object,//勾选对于父子节点的关联关系
    radioType: PropTypes.oneOf(["level", "all"]),//单选时影响的层级
    renameAble: PropTypes.bool,//是否允许重命名
    removeAble: PropTypes.bool,//是否允许移除
    asyncAble: PropTypes.bool,//是否可以异步加载数据

    //after事件
    onClick: PropTypes.func,//单击的事件
    onDoubleClick: PropTypes.func,//双击事件
    onCheck: PropTypes.func,//勾选/取消勾选事件
    onExpand: PropTypes.func,//展开事件
    onRename: PropTypes.func,//重命名事件
    onRemove: PropTypes.func,//删除事件
    onRightClick: PropTypes.func,//右键菜单
    onDrag: PropTypes.func,//拖动事件
    onDrop: PropTypes.func,//停靠事件
    onAsync: PropTypes.func,//异步查询

    //before 事件
    beforeDrag: PropTypes.func,//拖动前事件
    beforeDrop: PropTypes.func,//停靠前事件
    beforeRemove: PropTypes.func,//删除前事件
    beforeRename: PropTypes.func,//重命名前事件
    beforeRightClick: PropTypes.func,//鼠标右键前事件

}
TreeContainer.defaultProps = {
    componentType: "tree",
    idField: "id",
    parentField: "pId",
    textField: "text",
    dataSource: "data",
    dotted: true,
    simpleData: true,//默认为真
    selectAble: true,
    checkStyle: "checkbox",
    checkType: { "y": "ps", "n": "ps" },//默认勾选/取消勾选都影响父子节点，todo 暂时还没完成
    radioType: "all",//todo 



}
export default React.memo(TreeContainer);