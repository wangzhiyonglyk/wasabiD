/*
create by wangzhiyong 树组件业务容器
 创建 date:2022-01-06 树组件业务容器,用于tree,treegrid,pivot,操作逻辑是一样的
date :2022-01-07 修复tregrid单击联动的bug
   2022-01-18 将tree组件全部改为hook
   2022-02-10 修复bug
   2022-07-21 重新整体数据管理，修复各类函数bug
 */
import React, {
  useState,
  useReducer,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import PropTypes from "prop-types";
import api from "wasabi-api";
import func from "../../libs/func";
import {
  findNodeById,
  findLinkNodesByPath,
  getChecked,
  setChildrenPath,
} from "./treeFunc";
import { myReducer, handlerData, treeScrollTop } from "./handlerData";
import config from "./config";
import TreeView from "./TreeView";
const uuid = func.uuid;
const clone = func.clone;
const treeDataToFlatData = func.treeDataToFlatData;
import message from "../../Info/Msg";
import "./tree.css";

/**
 * 根据高度得到可见数及初始下标
 * @param {*} containerid 容器id
 * @returns
 */
const getVisibleCount = function (containerid) {
  let containerHeight = document.getElementById(containerid).clientHeight;
  let visibleDataCount = Math.ceil(containerHeight / config.rowDefaultHeight);
  let scrollTop = document.getElementById(containerid).scrollTop || 0;
  let startIndex = Math.floor(scrollTop / config.rowDefaultHeight) || 0;
  let endIndex = startIndex + config.bufferScale * visibleDataCount;

  return {
    visibleDataCount,
    startIndex,
    endIndex,
  };
};

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
const getData = function (
  url,
  httpType,
  contentType,
  headers,
  params = {},
  loadSuccess = null,
  loadError = null
) {
  //请求数据
  let fetchmodel = {
    type: httpType || "post",
    contentType: contentType,
    url: url,
    headers: headers || {},
    data: params,
    success: loadSuccess,
    error: loadError,
  };
  api.ajax(fetchmodel);
  console.log("tree async-fetch", fetchmodel);
};
/**
 * 处理请求后数据
 * @param {*} res 返回的数据
 * @param {*} props 属性
 */
const handerLoadData = function (res, dataSource, loadSuccess) {
  let realData = null; //得到最终的数据
  try {
    //异步加载时的根节点，没有则为树节点
    let row = window.sessionStorage.getItem("async-tree-node");
    row = row ? JSON.parse(row) : {}; //没有则
    if (typeof loadSuccess === "function") {
      //正确返回
      let resData = loadSuccess(res);
      realData = resData && resData instanceof Array ? resData : res;
    } else {
      //程序自行处理
      realData = getSource(res, dataSource);
    }
    return realData;
  } catch (e) {
    console.error("handerLoadData", e);
  }
  return [];
};
/*
注意了默认值不能给对象,否则在useeffect在父组件没传值时每次都认为是最新的
*/
const TreeContainer = React.forwardRef(function (
  {
    componentType = "tree",
    style,
    className,
    url,
    httpType,
    contentType,
    headers,
    params,
    data = null,
    dataSource = "data",
    idField = "id",
    parentField = "pId",
    textField = "text",
    childrenField = "children",
    dottedAble = true,
    selectAble,
    draggAble,
    dropAble,
    renameAble,
    removeAble,
    asyncAble,
    foldBroAble,
    dropType,
    isSimpleData,
    checkStyle,
    checkType,
    radioType,
    loadSuccess,
    onClick,
    onDoubleClick,
    onChecked,
    onRemove,
    onRename,
    onDrop,
    onDrag,
    onExpand,
    onAsync,
    beforeDrag,
    beforeRemove,
    beforeDrop,
    beforeRename,
  },
  ref
) {
  // 节点在树的位置映射
  const [treecontainerid] = useState(uuid());
  const [treeid] = useState(uuid());
  const [state, dispatch] = useReducer(myReducer, {});
  const [options] = useState({
    idField,
    parentField,
    textField,
    childrenField,
    isSimpleData,
  }); // 配置节点参数
  //全局参数
  const gobalData = useRef({
    visibleDataArgs: {
      startIndex: 0, //可见开始下标
      endIndex: 0, //可见结束下标］
      sliceBeginIndex: 0, //切割起始下标
      sliceEndIndex: 0, //切割的结束下标
      visibleDataCount: 0, //可见数据个数
    },
    data: null, // 原始数据
    flatData: null, // 扁平化的数据
    filterData: null, // 过滤后的数据
    hashData: new Map(), //hash路径数据
  });
  /**
   * 单击事件
   */
  const onTreeClick = useCallback(
    (id, text, node) => {
      dispatch({ type: "onClick", payload: id }); //延迟响应，方便获取所有勾选节点
      setTimeout(() => {
        onClick && onClick(id, text, node);
      }, 100);
    },
    [onClick]
  );
  /**
   * 双击事件
   */
  const onTreeDoubleclick = useCallback(
    (id, text, node) => {
      dispatch({ type: "onDoubleClick", payload: id });
      onDoubleClick && onDoubleClick(id, text, node);
    },
    [onDoubleClick]
  );
  /**
   * 勾选事件
   */
  const onTreeChecked = useCallback(
    (id, text, node, checkValue) => {
      handlerData(
        gobalData,
        {
          type: "onChecked",
          payload: {
            id,
            text,
            node: node,
            checkValue,
            checkType: checkType,
            checkStyle: checkStyle,
            radioType: radioType,
          },
        },
        dispatch
      );
      const isChecked = (id ?? "").toString() === (checkValue ?? "").toString();
      //延迟响应，方便获取所有勾选节点
      setTimeout(() => {
        onChecked && onChecked(isChecked, id, text, node);
      }, 100);
    },
    [onChecked, checkType, checkStyle, radioType]
  );
  /**
   * 删除事件
   */
  const onTreeRemove = useCallback(
    (id, text, node) => {
      message.confirm("您确定删除[" + text + "］吗", () => {
        handlerData(
          gobalData,
          {
            type: "onRemove",
            payload: { id, options },
          },
          dispatch
        );
        onRemove && onRemove(id, text, node);
      });
    },
    [onRemove]
  );
  /**
   * 重命名
   */
  const onTreeRename = useCallback(
    (id, text, node, newText) => {
      handlerData(
        gobalData,
        {
          type: "onRename",
          payload: { id, newText, options },
        },
        dispatch
      );
      onRename && onRename(id, text, node, newText);
    },
    [onRename]
  );
  /**
   * 停靠
   */
  const onTreeDrop = useCallback(
    (e_dragNode, e_dropNode, e_dragType) => {
      handlerData(
        gobalData,
        {
          type: "onDrop",
          payload: {
            dragNode: e_dragNode,
            dropNode: e_dropNode,
            dragType: e_dragType,
            options: options,
          },
        },
        dispatch
      );
      onDrop && onDrop(e_dragNode, e_dropNode, e_dragType);
    },
    [onDrop]
  );

  /**
   *展开节点
   */
  const onTreeExpand = useCallback(
    (isOpened, id, text, node) => {
      // 先设置折叠或者展开
      handlerData(
        gobalData,
        { type: "setOpen", payload: { id, isOpened, foldBroAble } },
        dispatch
      );
      if (asyncAble && (!node.children || node.children.length === 0)) {
        //没有数据
        let asyncChildrenData = [];
        if (onAsync && typeof onAsync === "function") {
          //自行处理
          asyncChildrenData = onAsync(id, text, node); //得到数据
          if (Array.isArray(asyncChildrenData)) {
            handlerData(
              gobalData,
              {
                type: "append",
                payload: { asyncChildrenData, id, options },
              },
              dispatch
            );
          }
        } else if (url) {
          //没有设置异步函数
          dispatch({
            type: "loading",
            payload: {
              loadingId: id,
            },
          }); //
          //先保存节点数据
          window.sessionStorage.setItem(
            "async-tree-node",
            JSON.stringify(node)
          );
          //请求数据
          let newParams = clone(params) || {};
          newParams[idField || "id"] = id;
          getData(url, httpType, contentType, headers, newParams, (res) => {
            asyncChildrenData = onAsync(id, text, node); //得到数据
            if (Array.isArray(asyncChildrenData)) {
              handlerData(
                gobalData,
                {
                  type: "append",
                  payload: { asyncChildrenData, id, options },
                },
                dispatch
              );
            }
          });
        }
      }

      onExpand && onExpand(isOpened, id, text, node);
    },
    [idField, parentField, textField, childrenField, isSimpleData, onExpand]
  );
  /** 
滚动事件
*/
  const onScroll = useCallback(() => {
    const vis = getVisibleCount(treecontainerid);

    showVisibleData(vis.startIndex, vis.endIndex, vis.visibleDataCount);
  }, [treecontainerid]);

  /**
 * 渲染当前可见数据
 @param {*} startIndex 可见区数据的开始下标
 @param {*} endIndex 可见区数据的结束下标
 @param {*} visibleDataCount 可见区数据的数量
 */
  const showVisibleData = useCallback(
    (startIndex, endIndex, visibleDataCount) => {
      //这里的滚动不能单独弄成函数调整，原因不清楚
      // treeScrollTop(
      //   treeid,
      //   startIndex,
      //   visibleDataCount,
      //   config.rowDefaultHeight
      // );
      let startOffset;
      if (startIndex >= 1) {
        // 减去上部预留的高度
        const size =
          startIndex * config.rowDefaultHeight -
          (startIndex - config.bufferScale * visibleDataCount >= 0
            ? (startIndex - config.bufferScale * visibleDataCount) *
              config.rowDefaultHeight
            : 0);
        startOffset = startIndex * config.rowDefaultHeight - size;
      } else {
        startOffset = 0;
      }

      document.getElementById(
        treeid
      ).style.transform = `translate3d(0,${startOffset}px,0)`;

      // 当前切割的数据开始下标
      let sliceBeginIndex = startIndex - config.bufferScale * visibleDataCount;
      sliceBeginIndex = sliceBeginIndex < 0 ? 0 : sliceBeginIndex;
      // //当前切割的数据结束下标
      const sliceEndIndex = endIndex + config.bufferScale * visibleDataCount;
      gobalData.current.visibleDataArgs = { sliceBeginIndex, sliceEndIndex };
      dispatch({
        type: "showVisibleData",
        payload: { sliceBeginIndex, sliceEndIndex, gobalData },
      });
    },
    [treecontainerid]
  );
  // 对外接口
  useImperativeHandle(ref, () => ({
    /** 
  获取某个节点
  @param {*} id
  @returns
*/
    findNode(id) {
      return findNodeById(
        gobalData.current.hashData,
        gobalData.current.data,
        id
      );
    },
    /** 
获取某个节点整个链路树
* @param {*} id
*/
    findParents(id) {
      const node = findNodeById(
        gobalData.current.hashData,
        gobalData.current.data,
        id
      );
      return node && node._path
        ? findLinkNodesByPath(gobalData.current.data, node._path)
        : [];
    },
    /*获取所有节点
@returns
*/
    getData() {
      return gobalData.current.data;
    },
    /*设置值
@param {*} newValue
*/
    getChecked() {
      return getChecked(gobalData.current.data);
    },
    /**
    设置勾选
    @param {*} id
    @param {*}  isChecked 是否勾选
  
*/
    setChecked(id, isChecked) {
      handlerData(
        gobalData,
        {
          type: "setChecked",
          payload: {
            id,
            isChecked: isChecked,
            checkType: checkType,
            checkStyle: checkStyle,
            radioType: radioType,
          },
        },
        dispatch
      );
    },
    /*** 
清除勾选
*/
    clearChecked() {
      handlerData(gobalData, { type: "clearChecked" }, dispatch);
    },
    /*** 
全部勾选
*/
    checkedAll() {
      handlerData(gobalData, { type: "checkedAll" }, dispatch);
    },
    /*选中节点
     */
    selectNode(id) {
      //先将父节点全部展开
      handlerData(gobalData, { type: "setLinkOpen", payload: id }, dispatch);
      //再设置选中
      dispatch({ type: "selectNode", payload: { gobalData, id } });
    },
    /*
展开所有父节点
@param {*} id
*/
    setLinkOpen(id) {
      handlerData(gobalData, { type: "setLinkOpen", payload: id }, dispatch);
    },
    /** 
移除某个／多个节点[数组]

@param {string,array} ids
*/
    remove(ids) {
      handlerData(
        gobalData,
        { type: "remove", payload: { ids, options } },
        dispatch
      );
    },
    /**
移除所有

*/
    removeAll() {
      handlerData(gobalData, { type: "removeAll" }, dispatch);
    },

    /**
     * 筛选
@param {*} value
*/
    filter(value) {
      document.getElementById(treecontainerid).scrollTop = 0; //回归到顶部
      //处理数据
      handlerData(gobalData, { type: "filter", payload: value });
      onScroll();
    },
    /**
追加节点
@param {*} children
@param {*} pId 父节点为空，即更新所有
*/
    append(children, pId) {
      if (Array.isArray(children)) {
        if (!pId) {
          document.getElementById(treecontainerid).scrollTop = 0; // 回归到顶部
        }
        handlerData(
          gobalData,
          {
            type: "append",
            payload: { children, pId, options },
          },
          dispatch
        );
        onScroll(); //重新渲染
      }
    },
    /** 
更新节点,不会更新节点id，父id
@param {*} nodes  一个或多个(数组)
*/
    update(nodes) {
      if (nodes) {
        //格式化节点防止有些属性没传而影响后
        handlerData(
          gobalData,
          { type: "update", payload: { nodes: nodes, options } },
          dispatch
        );
      }
    },
    /**
更新所有
*/
    updateAll(newData) {
      document.getElementById(treecontainerid).scrollTop = 0; // 回归到顶部
      //处理数据
      handlerData(
        gobalData,
        {
          type: "updateAll",
          payload: { options, data: newData, containerid: treecontainerid },
        },
        dispatch
      ); //显示可见数据
      onScroll(); //重新渲染
    },
    /**
     * 移动到节点内部
     * @param {*} dragId 移动节点
     * @param {*} dropId 停靠节点
     */
    moveIn(dragId, dropId) {
      handlerData(
        gobalData,
        {
          type: "moveIn",
          payload: { dragId, dropId, options },
        },
        dispatch
      );
    },
    /**
     * 移动到节点前面
     * @param {*} dragId 移动节点
     * @param {*} dropId 停靠节点
     */
    moveBefore(dragId, dropId) {
      handlerData(
        gobalData,
        {
          type: "moveBefore",
          payload: { dragId, dropId, options },
        },
        dispatch
      );
    },
    /**
     * 移动到节点后面
     * @param {*} dragId 移动节点
     * @param {*} dropId 停靠节点
     */
    moveAfter(dragId, dropId) {
      handlerData(
        gobalData,
        {
          type: "moveAfter",
          payload: { dragId, dropId, options },
        },
        dispatch
      );
    },
    /**
     * 调整容器 用于容器高度发生变化
     */
    adjust() {
      onScroll();
    },
  }));
  //加载数据
  useEffect(() => {
    if (url) {
      //第一次初始化 请求数据
      getData(url, httpType, contentType, headers, params, (res) => {
        gobalData.current.data = setChildrenPath(
          gobalData.current.hashData,
          "",
          [],
          handerLoadData(res, dataSource, loadSuccess),
          options
        );
        gobalData.current.flatData = treeDataToFlatData(gobalData.current.data);
        onScroll();
      });
    } else {
      //注意了，空数据也可以
      gobalData.current.data = setChildrenPath(
        gobalData.current.hashData,
        "",
        [],
        data,
        options
      );
      gobalData.current.flatData = treeDataToFlatData(gobalData.current.data);
      onScroll();
    }
  }, [data, url]);

  /**
   *滚动到指定位置
   */
  useEffect(() => {
    if (state.scrollIndex && state.scrollIndex.index >= 0) {
      const vis = getVisibleCount(treecontainerid);
      if (
        state.scrollIndex.index > vis.endIndex ||
        state.scrollIndex.index < vis.startIndex
      ) {
        //不在可见范围内
        document.getElementById(treecontainerid).scrollTop =
          (state.scrollIndex.index - 1) * config.rowDefaultHeight;
      }
    }
  }, [state.scrollIndex]);
  /**
   * 需要传下去的属性
   */
  const treeProps = {
    componentType,
    dottedAble,
    selectAble,
    checkStyle,
    renameAble,
    removeAble,
    draggAble,
    dropAble,
    dropType,
    asyncAble,
    clickId: state.clickId,
    loadingId: state.loadingId,
  };
  //需要下传的事件
  const treeEvents = {
    beforeDrag: beforeDrag,
    beforeRemove: beforeRemove,
    beforeDrop: beforeDrop,
    beforeRename: beforeRename,
    onDrag: onDrag,
    onClick: onTreeClick,
    onDoubleClick: onTreeDoubleclick,
    onChecked: onTreeChecked,
    onRemove: onTreeRemove,
    onExpand: onTreeExpand,
    onRename: onTreeRename,
    onDrop: onTreeDrop,
  };
  let control;
  if (!componentType || componentType === "tree") {
    control = (
      <TreeView
        {...treeProps}
        {...state}
        {...treeEvents}
        treeid={treeid}
      ></TreeView>
    );
  } else if (componentType === "treegrid") {
    // control = <TreeGridView ref={treegrid} {...treeProps} {...props} {...state} {...treeEvents} treeid={treeid} ></TreeGridView>
  }
  return (
    <div
      id={treecontainerid}
      onScroll={onScroll}
      className={"wasabi-tree-parent " + (className ?? "")}
      style={style}
    >
      {control}
      <div
        style={{
          left: 0,
          top: 0,
          height:
            gobalData.current.flatData &&
            gobalData.current.flatData.length * config.rowDefaultHeight,
          position: "absolute",
          width: 1,
        }}
      ></div>
    </div>
  );
});
TreeContainer.propTypes = {
  componentType: PropTypes.oneOf(["tree", "treegrid"]), //类型
  name: PropTypes.string, //树名称
  style: PropTypes.object, //style,
  className: PropTypes.string, //
  idField: PropTypes.string, //数据字段值名称
  parentField: PropTypes.string, //数据字段父节点名称
  textField: PropTypes.string, //数据字段文本名称
  childrenField: PropTypes.string, //字节点字段
  dottedAble: PropTypes.bool, //是否有虚线
  url: PropTypes.string, //后台查询地址

  params: PropTypes.object, //向后台传输的额外参数
  dataSource: PropTypes.string, //ajax的返回的数据源中哪个属性作为数据源,为null时直接后台返回的数据作为数据源
  headers: PropTypes.array, //表头
  data: PropTypes.array, //节点数据
  isSimpleData: PropTypes.bool, //是否使用简单的数据格式
  selectAble: PropTypes.bool, //是否允许勾选
  checkStyle: PropTypes.oneOf(["checkbox", "radio", PropTypes.func]), //单选还是多选
  checkType: PropTypes.object, //勾选对于父子节点的关联关系
  radioType: PropTypes.oneOf(["level", "all"]), //单选时影响的层级
  renameAble: PropTypes.bool, //是否允许重命名
  removeAble: PropTypes.bool, //是否允许移除
  draggAble: PropTypes.bool, //是否允许拖动，
  dropAble: PropTypes.bool, //是否允许停靠
  dropType: PropTypes.array, //停靠的模式["before","in","after"]
  asyncAble: PropTypes.bool, //是否可以异步加载数据
  foldBroAble: PropTypes.bool, //展开节点时是否折叠兄弟节点
  //after事件
  onClick: PropTypes.func, //单击的事件
  onDoubleClick: PropTypes.func, //双击事件
  onCheck: PropTypes.func, //勾选/取消勾选事件
  onExpand: PropTypes.func, //展开事件
  onRename: PropTypes.func, //重命名事件
  onRemove: PropTypes.func, //删除事件
  onRightClick: PropTypes.func, //右键菜单
  onDrag: PropTypes.func, //拖动事件
  onDrop: PropTypes.func, //停靠事件
  onAsync: PropTypes.func, //异步查询
  loadSuccess: PropTypes.func, //查询数据后的成功事件

  //before 事件
  beforeDrag: PropTypes.func, //拖动前事件
  beforeDrop: PropTypes.func, //停靠前事件
  beforeRemove: PropTypes.func, //删除前事件
  beforeRename: PropTypes.func, //重命名前事件
  beforeRightClick: PropTypes.func, //鼠标右键前事件
};
TreeContainer.defaultProps = {
  componentType: "tree",
  idField: "id",
  parentField: "pId",
  textField: "text",
  childrenField: "children",
  dataSource: "data",
  dottedAble: true,
  checkStyle: "checkbox",
  checkType: { y: "ps", n: "ps" }, //默认勾选/取消勾选都影响父子节点，
  radioType: "all",
};
export default React.memo(TreeContainer);
