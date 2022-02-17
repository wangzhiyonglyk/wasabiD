/*
create by wangzhiyong 创建树组件
 date:2016-07
 edit 2020-10 参照ztree改造
 2021-06-16 重新优化
 2021-11-28 完善组件，修复bug，将样式拆分为两种，树的高度小一点，这样好看一点，树表格则与表格对齐,增加连线，调整勾选，图标，文字等样式
 2022-01-04 将树扁平化，增加虚拟列表
 2022-01-06 增加选中滚动的功能，增加自定义勾选组件，修复onCheck的bug
 2022-01-06 增加虚线可配功能
 2022-01-07 增加类型
 */
import React from "react";
import TreeNode from "./TreeNode.jsx";
function TreeView(props) {
    let nodeControl = [];
    //全局属性
    const { componentType,  selectAble, checkStyle, renameAble, removeAble, draggAble,dropAble, asyncAble } = props;
    //得到传下去的属性
    const treeProps = { componentType,selectAble, checkStyle, renameAble, removeAble,draggAble,dropAble,  asyncAble, clickId: props.clickId, loadingId: props.loadingId };
    //全局事件
    const treeEvents = {
        beforeDrag: props.beforeDrag,
        beforeRemove: props.beforeRemove,
        beforeDrop: props.beforeDrop,
        beforeRename: props.beforeRename,
        onClick: props.onClick,
        onDoubleClick: props.onDoubleClick,
        onChecked: props.onChecked,
        onRemove: props.onRemove,
        onExpand: props.onExpand,
        onRename: props.onRename,
        onDrop: props.onDrop,
        onDrag: props.onDrag,
        textFormatter:props.textFormatter,
    }
    let data =props.visibleData;
    if (Array.isArray(data)) {
      nodeControl=  data.map((item, index) => {
            let isParent = false;//是否为父节点
            if (item.isParent === true || (Array.isArray(item.children)&&item.children.length>0)) {//如果明确规定了，或者子节点不为空，则设置为父节点
                isParent = true;
            }
        return (<TreeNode
                key={"treenode-" + item.id}
                {
                ...treeProps
                }
                {...item}
                isParent={isParent}
                {
                ...treeEvents
                }
            />);
        });
    }
    return <ul id={props.treeid} className={"wasabi-tree clearfix " + (props.dotted === false ? " nodotted " : "") }>
            {nodeControl}
         </ul>
}
export default React.memo(TreeView);