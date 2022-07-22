/*
create by wangzhiyong 树下拉选择
 date:2016-07
create by wangzhiyong 创建树组件
 edit 2020-10 参照ztree改造
 2021-06-16 重新优化
 2021-11-28 完善组件，修复bug，将样式拆分为两种，树的高度小一点，这样好看一点，树表格则与表格对齐,增加连线，调整勾选，图标，文字等样式
 2022-01-04 将树扁平化，增加虚拟列表
 2022-01-06 增加选中滚动的功能，增加自定义勾选组件，修复onCheck的bug
 2022-01-06 增加虚线可配功能
  2022-01-06 拆分业务与视图 将业务容器适用于tree,treegrid,pivot等组件
   2022-01-07 修复树节点中文本节点宽度的bug
   2022-01-11 将tree组件独立出来
   2022-01-18 将tree组件全部改为hook
   2022-01-27 优化代码
 */
import React from "react";
import TreeContainer from "./TreeContainer";

function Tree(props, ref) {
  return <TreeContainer {...props} ref={ref} componentType={"tree"}></TreeContainer>
}
export default React.memo(React.forwardRef(Tree));
