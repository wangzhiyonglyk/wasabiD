/*
create by wangzhiyong 树组件业务容器
 创建 date:2022-01-06 树组件业务容器，用于tree,treegrid,pivot，操作逻辑是一样的
date :2022-01-07 修复tregrid单击联动的bug
  2022-01-18 将tree组件全部改为hook
 */
import React, { useState, useReducer, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import PropTypes from "prop-types";
import func from "../../libs/func.js";
import { setChecked, setRadioChecked, findNodeById, clearChecked, checkedAll, removeNode, renameNode, moveAterNode, moveBeforeNode, moveInNode, setOpen, appendChildren, getChecked, filter,updateNode } from "./treeFunc";
import propsTran from "../../libs/propsTran";
import api from "wasabi-api"
import "./tree.css"
import config from "./config";
import TreeView from "./TreeView";
import TreeGridView from "../TreeGrid/TreeGridView";
import Msg from "../../Info/Msg.jsx";
const { treeDataToFlatData, getSource, uuid, clone } = func;
const { preprocess,preprocessNode } = propsTran;
/**
 * 容器高度
 */
let containerHeight;
/**
 * 根据高度得到可见数及初始下标
 * @param {*} containerid 容器id
 * @returns 
 */
const getVisibleCount = function (containerid) {
    if (!containerHeight) {
        containerHeight = document.getElementById(containerid).clientHeight || window.innerHeight;
    }
    let visibleDataCount = Math.ceil(containerHeight / config.rowDefaultHeight);
    let scrollTop = document.getElementById(containerid).scrollTop || 0;
    let startIndex = Math.floor(scrollTop / config.rowDefaultHeight) || 0;
    let endIndex = (startIndex + config.bufferScale * visibleDataCount);
    return {
        visibleDataCount,
        startIndex,
        endIndex
    }
}

/**
 * 处理可见数据 保证在滚动过程中只切割，不处理数据加工 
 * @param {*} state 旧的状态值
 * @param {*} sliceBeginIndex 切割开始下标，
 * @param {*} sliceEndIndex 切割结束下标
 * @param {*} newData 新的数据源
 * @param {*} newFilterValue 新的筛选数据
 * @returns 
 */
const handlerVisibleData = function (state, sliceBeginIndex, sliceEndIndex, newData = null, newFilterValue = null) {
    let visibleData = [];
    let filterData = state.filterData;
    let flatData = state.flatData;
    if ((newFilterValue ?? "").toString() !== "") {//有新的过滤条件
        filterData = filter(state.flatData, newFilterValue);
        //切割,得到可见数据
        visibleData = filterData.slice(sliceBeginIndex, sliceEndIndex);

    }
    else if ((state.filterValue ?? "").toString() !== "") {
        //有旧的筛选，切割,得到可见数据
        visibleData = filterData.slice(sliceBeginIndex, sliceEndIndex);
    }
    else {//没有过滤操作
        //1.如果有新的扁平化数据，则从新扁平化数据中取
        //2.如果有新数据，说明数据源本身改变了，则做扁平化处理
        //3.否则直接从原来的中取
        flatData = (newData && treeDataToFlatData(newData)) || state.flatData;
        //切割,得到可见数据
        visibleData = flatData.slice(sliceBeginIndex, sliceEndIndex);
    }
    return {
        ...state,
        filterValue: newFilterValue,
        data: newData,
        filterData: filterData,
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
 * @param {*} headers 头部
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
/**
 * 处理请求后数据
 * @param {*} res 返回的数据
 * @param {*} props 属性
 */
const handerLoadData = function (res = [], props) {
    let realData;//得到最终的数据
    try {
        //异步加载时的根节点，没有则为树节点 
        let row = window.sessionStorage.getItem("async-tree-node");
        row = row ? JSON.parse(row) : {};//没有则
        if (typeof props.loadSuccess === "function") {
            //正确返回
            let resData = props.loadSuccess(res);
            realData = resData && resData instanceof Array ? resData : res;
        } else {
            //程序自行处理
            realData = getSource(res, props.dataSource);

        }
        //预处理数据
        return preprocess(realData, row.id, row._path, props.idField, props.parentField, props.textField, props.childrenField, props.simpleData);
    }
    catch (e) {
        console.error("handerLoadData", e);
    }
    return [];

}
//防止重复执行，原因不详
let preAction;
let preState;
//状态值
const myReducer = function (state, action) {
    try {
        if (preAction === action) {
            return preState;
        }
        preAction = action;//防止重复执行
        let data = null;
        let payload = action.payload;
        switch (action.type) {
            //节点加载
            case "loading":
                preState = {
                    ...state,
                    ...payload
                };
                break;
            //单击，双击
            case "onClick":
            case "onDoubleClick":
                preState = {
                    ...state,
                    clickId: payload
                };
                break;
            //勾选
            case "onChecked":
                let checked = (payload.id + "") === (payload.checkValue + "");
                data = [];
                if (payload.checkStyle === "checkbox") {
                    data = setChecked(state.data, payload.row, checked, payload.checkType);
                }
                else if (payload.checkStyle === "radio") {
                    data = setRadioChecked(state.data, payload.row, checked, payload.radioType);
                }
                preState = handlerVisibleData(state, state.sliceBeginIndex, state.sliceEndIndex, data);
                break;
            //设置勾选
            case "setChecked":
                if (payload.id) {
                    //先找到节点
                    let node = findNodeById(state.data, payload.id);
                    if (node) {
                        if (payload.checkStyle === "checkbox") {
                            data = setChecked(state.data, node, !!payload.checked, payload.checkType);
                        }
                        else if (payload.checkStyle === "radio") {
                            data = setRadioChecked(state.data, node, !!payload.checked, payload.radioType);
                        }
                        preState = handlerVisibleData(state, state.sliceBeginIndex, state.sliceEndIndex, data);
                    }

                }
                else {
                    preState = state;
                }
                break;
            //全部清除
            case "clearChecked":
                data = clearChecked(state.data);
                preState = handlerVisibleData(state, state.sliceBeginIndex, state.sliceEndIndex, data);
                break;
            //全选
            case "checkedAll":
                data = checkedAll(state.data);
                preState = handlerVisibleData(state, state.sliceBeginIndex, state.sliceEndIndex, data);
                break;

            //重命名
            case "onRename":
                data = renameNode(state.data, payload.row, payload.newText);
                preState = handlerVisibleData(state, state.sliceBeginIndex, state.sliceEndIndex, data);
                break;
            //移除
            case "onRemove":
                data = removeNode(state.data, payload.row);
                preState = handlerVisibleData(state, state.sliceBeginIndex, state.sliceEndIndex, data);

                break;
            //停靠
            case "onDrop":
                const { dragNode, dropNode, dragType } = payload;

                if (dragNode.id !== dropNode.id) {
                    data = null;
                    if (dragType === "in") {
                        if (dragNode.pId !== dropNode.id) {
                            data = moveInNode(state.data, dragNode, dropNode);
                        }
                    }
                    else if (dragType === "before") {
                        data = moveBeforeNode(state.data, dragNode, dropNode);
                    }
                    else if (dragType === "after") {
                        data = moveAterNode(state.data, dragNode, dropNode);
                    }
                    if (data) {
                        preState = handlerVisibleData(state, state.sliceBeginIndex, state.sliceEndIndex, data);
                    }
                    else {
                        preState = state;
                    }

                } else {
                    preState = state;
                }


                break;
            /**
             * 虚拟列表 todo
             */
            case "showVisibleData":
                preState = handlerVisibleData(state, payload.sliceBeginIndex, payload.sliceEndIndex, payload.data, payload.filterValue);
                break;
            //设置折叠或展开
            case "setOpen":
                data = setOpen(state.data, payload.row, payload.open);
                preState = handlerVisibleData(state, state.sliceBeginIndex, state.sliceEndIndex, data);
                break;
            case "remove":
                data = removeNode(state.data, payload);
                preState = handlerVisibleData(state, state.sliceBeginIndex, state.sliceEndIndex, data);
                break;
            //追加
            case "append":
                const { children, row } = payload;
                data = appendChildren(state.data, children, row);
                preState = handlerVisibleData(state, state.sliceBeginIndex, state.sliceEndIndex, data);
                break;
            //更新
            case "update":
                data = updateNode(state.data, payload);
                preState = handlerVisibleData(state, state.sliceBeginIndex, state.sliceEndIndex, data);
                break;
            default:
                preState = state;
                break;
        }
        return preState;
    }
    catch (e) {
        console.log("reduce error", e)
    }
    return state;
}
function TreeContainer(props, ref) {
    const [treecontainerid] = useState(uuid());
    const [treeid] = useState(uuid());
    const treegrid = useRef(null);
    const [state, dispatch] = useReducer(myReducer, {

    });

    //定义事件
    const onClick = useCallback((id, text, row) => {
        dispatch({ type: "onClick", payload: id });
        treegrid?.current?.setFocus(id);  //如果是树表格或者交叉表
        props.onClick && props.onClick(id, text, row);
    }, [treegrid, props]);
    const onDoubleClick = useCallback((id, text, row) => { dispatch({ type: "onDoubleClick", payload: id }); props.onDoubleClick && props.onDoubleClick(id, text, row); }, [props]);
    const onChecked = useCallback((id, text, row, checkValue) => {
        dispatch(
            {
                type: "onChecked",
                payload: { id, text, row, checkValue, checkType: props.checkType, checkStyle: props.checkStyle, radioType: props.radioType }
            }
        );
        let checked = (id ?? "").toString() === (checkValue ?? "").toString();
        props.onChecked && props.onChecked(checked, id, text, row);
    }, [props]);
    const onRemove = useCallback((id, text, row) => {
        Msg.confirm("您确定删除【" + text + "]吗", () => {
            dispatch({ type: "onRemove", payload: { id, text, row } })
            props.onRemove && props.onRemove(id, text, row);
        })
    }, [props]);
    const onRename = useCallback((id, text, row, newText) => {
        dispatch({ type: "onRename", payload: { id, text, row, newText } });
        props.onRename && props.onRename(id, text, row, newText);
    }, [props]);
    const onDrop = useCallback((dragNode, dropNode, dragType) => { dispatch({ type: "onDrop", payload: { dragNode, dropNode, dragType } }) }, []);

    //加载子节点成功
    const loadSuccess = useCallback((res) => {
        try {
            if (state.loadingId !== null && state.loadingId !== undefined) {//如果之前存在，则设置，否则不设置
                dispatch({
                    type: "loading", payload: {
                        loadingId: null,
                    }
                });//
            }
            let asyncChildrenData = handerLoadData(res, props);
            //判断是否为父节点请求
            let row = window.sessionStorage.getItem("async-tree-node");
            row = row ? JSON.parse(row) : null;//没有
            dispatch({ type: "append", payload: { children: asyncChildrenData, row: row } })
        }
        catch (e) {
            console.error("loadSuccess", e);
        }
        finally {
            window.sessionStorage.removeItem("async-tree-node");//删除
        }

    }, [props]);

    //加载子节点失败
    const loadError = useCallback(() => {
        dispatch({
            type: "loading", payload: {
                loadingId: null,
            }
        });//
    }, [props]);

    //展开节点
    const onExpand = useCallback((open, id, text, row) => {
        //先设置折叠或者展开
        dispatch({ type: "setOpen", payload: { row, open } });//设置折叠与展开
        if (props.asyncAble && (!row.children || row.children.length === 0)) {//没有数据
            let asyncChildrenData = [];
            if (props.onAsync && typeof props.onAsync === "function") {//自行处理
                //得到子节点
                asyncChildrenData = props.onAsync(id, text, row);//得到数据
                if (Array.isArray(asyncChildrenData)) {
                    //格式化数据
                    asyncChildrenData = handerLoadData(asyncChildrenData, props);
                    dispatch({ type: "append", payload: { children: asyncChildrenData, row: row } })

                }
            }
            else if (props.url) {
                //没有设置异步函数
                dispatch({
                    type: "loading", payload: {
                        loadingId: id,
                    }
                });//
                //先保存节点数据
                window.sessionStorage.setItem("async-tree-node", JSON.stringify(row));
                //请求数据
                let params = clone(props.params) || {};
                params[props.idField || "id"] = id;
                getData(props.url, props.httpType, props.contentType, props.headers, params, loadSuccess, loadError)

            }

        }

        props.onExpand && props.onExpand(open, id, text, row);
    }, [props, loadSuccess, loadError, state.sliceBeginIndex, state.sliceEndIndex]);//
    /**
  * 渲染当前可见数据
  * @param {*} startIndex 可见区数据的开始下标
  * @param {*} endIndex 可见区数据的结束下标
  */

    const scrollShowVisibleData = useCallback(
        (startIndex, endIndex, visibleDataCount, data = null, filterValue = null) => {
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
            dispatch({ type: "showVisibleData", payload: { sliceBeginIndex, sliceEndIndex, data: data, filterValue } });
        },
        [treeid],
    )
    /**
     * 滚动事件
     */
    const onScroll = useCallback(
        () => {
            let visiData = getVisibleCount(treecontainerid);
            scrollShowVisibleData(visiData.startIndex, visiData.endIndex, visiData.visibleDataCount)
        }, [treecontainerid, scrollShowVisibleData]);

    //对外接口
    useImperativeHandle(ref, () => ({
        /**
         * 设置值
         * @param {*} newValue 
         */
        getChecked() {
            return getChecked(state.data);
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
            if(id&&id!==state.clickId)
            {
                dispatch({ type: "setClick", payload: id });
                treegrid?.current?.setFocus(id);  //如果是树表格或者交叉表
                onScroll();
            }
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
            document.getElementById(treecontainerid).scrollTop = 0;//回归到顶部
            //显示当前数据
            let visiData = getVisibleCount(treecontainerid);
            scrollShowVisibleData(visiData.startIndex, visiData.endIndex, visiData.visibleDataCount, state.data, value)
        },
        /**
         *追加节点
         * @param {*} children 
         * @param {*} node 
         */
        append(children, node = null) {
            if (children && children.length > 0) {
                dispatch({ type: "append", payload: { children: children, row: node } })
            }
        },
       /**
        * 更新
        * @param {*} node 
        */
        update(node){
            if(node){
                node= preprocessNode(node, props.idField, props.parentField, props.textField, props.childrenField);
                dispatch({ type: "update", payload:node })
            }
        },
        /**
         * 调整容器
         */
        adjust() {
            onScroll();
        }
    }))
    //父组件加载数据
    useEffect(() => {
        if (props.url) {
            //初始化，要重新设置切割下标
            let visiData = getVisibleCount(treecontainerid);
            //当前切割的数据开始下标
            let sliceBeginIndex = visiData.startIndex - config.bufferScale * visiData.visibleDataCount;
            sliceBeginIndex = sliceBeginIndex < 0 ? 0 : sliceBeginIndex;
            // //当前切割的数据结束下标
            let sliceEndIndex = visiData.endIndex + config.bufferScale * visiData.visibleDataCount;

            dispatch({
                type: "loading", payload: {
                    sliceBeginIndex: sliceBeginIndex,
                    sliceEndIndex: sliceEndIndex
                }
            });
            //再请求数据
            getData(props.url, props.httpType, props.contentType, props.headers, props.params, loadSuccess, loadError)
        }
        else {//注意了，空数据也可以
            //预处理数据
            let data = preprocess(props.data, "", [], props.idField, props.parentField, props.textField, props.childrenField, props.simpleData);
            //显示当前数据
            let visiData = getVisibleCount(treecontainerid);
            scrollShowVisibleData(visiData.startIndex, visiData.endIndex, visiData.visibleDataCount, data || []);
        }
    }, [props])


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
    return <div id={treecontainerid} onScroll={onScroll}
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
    childrenField: PropTypes.string,//字节点字段
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
    draggAble: PropTypes.bool,//是否允许拖动，
    dropAble: PropTypes.bool,//是否允许停靠
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
    childrenField: "children",
    dataSource: "data",
    dotted: true,
    simpleData: false,//默认为真
    selectAble: false,
    checkStyle: "checkbox",
    checkType: { "y": "ps", "n": "ps" },//默认勾选/取消勾选都影响父子节点，todo 暂时还没完成
    radioType: "all",//todo 



}
export default React.memo(TreeContainer);