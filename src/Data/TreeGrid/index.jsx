/**
 * create by wangzhiyong 树型表格
 * date:2021-03-30
 * 2021-11-28 完善组件，修复bug，重新调整样式，完善下划线，文字，图标，勾选，选中样式
 *   2022-01-06 业务逻辑全部由tree组件实现,只保留与datagrid联动逻辑
 * 2022-01-26 增加拖动宽度的功能
 */


import React, { Component } from "react";
import func from "../../libs/func";
import TreeContainer from "../Tree/TreeContainer"


function TreeGrid(props,ref) {
    return <TreeContainer {...props}  ref={ref} componentType={"treegrid"}></TreeContainer>
}
export default React.memo(React.forwardRef(TreeGrid), (pre, next) => { return !func.diff(pre, next, false) });
