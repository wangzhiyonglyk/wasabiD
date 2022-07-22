import func from "../../libs/func";
import {
  setChecked,
  setRadioChecked,
  clearChecked,
  checkedAll,
  removeNode,
  updateNode,
  renameNode,
  moveAterNode,
  moveBeforeNode,
  moveInNode,
  setOpen,
  appendChildren,
  filter,
  setChildrenPath,
  setLinkNodeOpen,
} from "./treeFunc";
import config from "./config";
const toTreeData = func.toTreeData;
const treeDataToFlatData = func.treeDataToFlatData;
/***************以下是处理数据的代码************************/

/**
统一处理数据
@param {*} gobalData 数据相关信息
@param {*} action 操作
@param dispatch 设置更新后的状态值
*/
export function handlerData(gobalData, action, dispatch) {
  const current = gobalData.current;
  const payload = action.payload;
  let isChecked = false;
  switch (action.type) {
    //勾选
    case "onChecked":
      isChecked = payload.id + "" === payload.checkValue + "";
      if (payload.checkStyle === "checkbox") {
        current.data = setChecked(
          current.hashData,
          current.data,
          payload.id,
          isChecked,
          payload.checkType
        );
      } else if (payload.checkstyle === "radio") {
        current.data = setRadioChecked(
          current.hashData,
          current.data,
          payload.id,
          isChecked,
          payload.radioType
        );
      }
      break;
    // 重命名
    case "onRename":
      current.data = renameNode(
        current.hashData,
        current.data,
        payload.id,
        payload.newText,
        payload.options
      );

      break;
    // 移除
    case "onRemove":
      current.data = removeNode(
        current.hashData,
        current.data,
        payload.id,
        payload.options
      );
      current.flatData = treeDataToFlatData(current.data);
      break;
    // 停靠
    case "onDrop":
      if (payload.dragType === "in") {
        current.data = moveInNode(
          current.hashData,
          current.data,
          payload.dragNode,
          payload.dropNode,
          payload.options
        );
      } else if (payload.dragType === "before") {
        current.data = moveBeforeNode(
          current.hashData,
          current.data,
          payload.dragNode,
          payload.dropNode,
          payload.options
        );
      } else if (payload.dragType === "after") {
        current.data = moveAterNode(
          current.hashData,
          current.data,
          payload.dragNode,
          payload.dropNode,
          payload.options
        );
      }
      current.flatData = treeDataToFlatData(current.data);
      break;
    /**
     * 以下父组件调用的
     */
    //过滤
    case "filter":
      if ((payload ?? "").toStrng() !== "") {
        //查询条件不为空
        current.filterData = filter(current.flatData, payload);
      }
      break;
    //设置折叠或展开
    case "setOpen":
      current.data = setOpen(
        current.hashData,
        current.data,
        payload.id,
        payload.isOpened,
        payload.foldBroAble
      );
      current.flatData = treeDataToFlatData(current.data);
      break;
    //设置勾选
    case "setChecked":
      if (payload.id) {
        if (payload.checkStyle === "checkbox") {
          current.data = setChecked(
            current.hashData,
            current.data,
            payload.id,
            !!payload.isChecked,
            payload.checkType
          );
        } else if (payload.checkStyle === "radio") {
          current.data = setRadioChecked(
            current.hashData,
            current.data,
            payload.id,
            !!payload.isChecked,
            payload.radioType
          );
        }
      }
      break;
    //全部清除
    case "clearChecked":
      current.data = clearChecked(current.data);
      break;
      //全选
      I;
    case "checkedAll":
      current.data = checkedAll(current.data);
      break;
    // 追加
    case "append":
      current.data = appendChildren(
        current.hashData,
        current.data,
        payload.pId,
        payload.children,
        payload.options
      );
      current.flatData = treeDataToFlatData(current.data);
      break;
    //删除节点
    case "remove":
      if (Array.isArray(payload.ids)) {
        payload.ids.forEach((item) => {
          current.data = removeNode(
            current.hashData,
            current.data,
            item,
            payload.options
          );
        });
      } else {
        current.data = removeNode(
          current.hashData,
          current.data,
          payload.ids,
          payload.options
        );
      }
      current.flatData = treeDataToFlatData(current.data);
      break;
    //删除所有
    case "removeAll":
      current.data = nullIcurrent.filterData = null;
      current.hashData = new Map(); //这个要初始化
      break;
    //更新某个，或者某一组
    case "update":
      if (Array.isArray(payload.nodes)) {
        payload.nodes.forEach((item) => {
          current.data = updateNode(
            current.hashData,
            current.data,
            item.id,
            item,
            payload.options
          );
        });
      } else {
        current.data = updateNode(
          current.hashData,
          current.data,
          payload.nodes.id,
          payload.nodes,
          payload.options
        );
      }
      current.flatData = treeDataToFlatData(current.data);
      break;
    //更新所有
    case "updateAll":
      current.hashData = new Map(); //先清空hash表
      //如果是简单数据，则转成树结构
      current.data = payload.options.isSimpleData
        ? toTreeData(
            payload.data,
            payload.options.idField,
            payload.options.parentField,
            payload.options.textField
          )
        : payload.data;
      //设置路径
      current.data = setChildrenPath(
        current.hashData,
        "",
        [],
        current.data,
        payload.options
      ); //设置路径等信息
      current.flatData = treeDataToFlatData(current.data);
      break;
    //移动节点到内部
    case "moveIn":
      current.data = moveInNode(
        current.hashData,
        current.data,
        { id: payload.dragId },
        { id: payload.dropId },
        payload.options
      );
      current.flatData = treeDataToFlatData(current.data);
      break;
    //移动节点到前面
    case "moveBefore":
      current.data = moveBeforeNode(
        current.hashData,
        current.data,
        { id: payload.dragId },
        { id: payload.dropId },
        payload.options
      );
      current.flatData = treeDataToFlatData(current.data);
      break;
    //移动节点到后面
    case "moveAfter":
      current.data = moveAterNode(
        current.hashData,
        current.data,
        { id: payload.dragId },
        { id: payload.dropId },
        payload.options
      );
      current.flatData = treeDataToFlatData(current.data);
      break;
    //展开所有父节点
    case "setLinkOpen":
      dispatch({ type: "update", payload: { gobalData } });
      current.data = setLinkNodeOpen(current.hashData, current.data, payload);
      current.flatData = treeDataToFlatData(current.data);
      break;
    default:
      break;
  }
  /**
   * 异步执行，保证多条操作合并成一个action
   */
  if (dispatch) {
    clearTimeout(current.asyncAction);
    current.asyncAction = setTimeout(() => {
      dispatch({ type: "update", payload: { gobalData } });
    }, 10);
  }
}

/************************以上是处理数据的代码*************************/

/******************下面是reduce的代码******************/
/**
 * 处理可见数据 保证在滚动过程中只切割，不处理数据加工
 * @param {*} current 全局缓存的数据
 * @returns
 */
function getVisibleData(current) {
  let visibleData = [];
  try {
    if (current.filterData) {
      // 有新的过滤条件
      //有旧的筛选，切割，得到可见数据
      visibleData = current.filterData.slice(
        current.visibleDataArgs.sliceBeginIndex,
        current.visibleDataArgs.sliceEndIndex
      );
    } else {
      //切割，得到可见数据
      visibleData = current.flatData.slice(
        current.visibleDataArgs.sliceBeginIndex,
        current.visibleDataArgs.sliceEndIndex
      );
    }
  } catch (e) {}
  return visibleData;
}

/**
 树滚动到指定位置，
@param {*} treeid 树组件的id
@param {*} startIndex 可见的起始下标
@param {*} visibleDataCount 可见个数
*/
export function treeScrollTop(
  treeid,
  startIndex,
  visibleDataCount,
  rowDefaultHeight
) {
  let startOffset;
  if (startIndex >= 1) {
    // 减去上部预留的高度
    let size =
      (startIndex + 1) * rowDefaultHeight -
      (startIndex - config.bufferScale * visibleDataCount >= 0
        ? (startIndex - config.bufferScale * visibleDataCount) *
          rowDefaultHeight
        : 0);
    startOffset = startIndex * rowDefaultHeight - size;
  } else {
    startOffset = 0;
  }
  document.getElementById(
    treeid
  ).style.transform = `translate3d(θ,${startOffset}px,0)`;
}

/** 
注意了选中某个节点，与滚动事件是单独处理 因为这里只是切割数据，不用数据加工
*/
//防止重复执行，原因不详
let preAction;
let preState; //状态值
export function myReducer(state, action) {
  try {
    if (preAction === action) {
      return preState;
    }
    preAction = action; //防止重复执行
    const payload = action.payload;
    const current = payload?.gobalData?.current;
    switch (action.type) {
      //加载
      case "loading":
        preState = {
          ...state,
          loadingId: payload.loadingId,
        };
        break;
      // 单击，双击
      case "onClick":
      case "onDoubleClick":
        preState = {
          ...state,
          clickId: payload,
        };
        break;
      /**
       *滚动事件
       */
      case "showVisibleData":
        preState = {
          ...state,
          visibleData: getVisibleData(current),
        };
        break;
      /** 
            设置某个节点选中
            */

      case "selectNode":
        preState = {
          ...state,
          clickId: payload.id,
          //判断是否要滚动
          scrollIndex: {
            index: current.flatData.findIndex((item) => {
              return item.id === payload.id;
            }),
          }, // 设为对象，方便判断刷新
        };
        break;
      /*
            更新数据
            */
      case "update":
        preState = {
          ...state,
          visibleData: getVisibleData(current),
        };
        break;
      default:
        break;
    }
    return preState;
  } catch (e) {
    console.log("reduce error", e);
  }
  return state;
}
/***下面是reduce的代码******************/
