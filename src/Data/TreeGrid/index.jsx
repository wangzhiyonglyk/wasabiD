/**
 * create by wangzhiyong 树型表格
 * date:2021-03-30
 * 2021-11-28 完善组件，修复bug，重新调整样式，完善下划线，文字，图标，勾选，选中样式
 *   2022-01-06 业务逻辑全部由tree组件实现,只保留与datagrid联动逻辑
 * 
 */


 import React, { Component } from "react";
 import TreeContainer from "../Tree/TreeContainer"
 import loadDataHoc from "../../loadDataHoc";

 export default loadDataHoc(TreeContainer, "treegrid");