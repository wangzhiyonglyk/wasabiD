/**
 * create by wangzhiyong 树型表格视图
 * date:2022-01-06 因为虚拟列表的原因，要容器与视图拆分
 * 2022-01-06 修复树表格的单击事件的bug
 */


 import React, { Component } from 'react';

 import func from "../../libs/func";
 import DataGrid from "../DataGrid";
 import TreeView from "../Tree/TreeView";
 import "./index.css"
 import config from './config';
 class TreeGrid extends React.PureComponent {
     constructor(props) {
         super(props);
         this.grid=React.createRef();
         this.state = {
           
         }
        
         this.dataGridClick=this.dataGridClick.bind(this);
         
     }
     static getDerivedStateFromProps(props, state) {
         let newState = {};
         if (props.data && props.data instanceof Array && func.diff(props.data, state.rawData)) {
             newState.rawData = (props.data);
             let flatData = func.treeDataToFlatData(props.data)
             newState.data = func.clone(props.data);
             return newState;
 
         }
         return null;
 
     }
    
     /**
      * 表格的单击事件
      * @param {*} rowData 
      * @param {*} rowIndex 
      */
     dataGridClick(rowData, rowIndex) {
         this.props.onClick && this.props.onClick(rowData[this.props.priKey]);
 
     }
     /**
      * 设置焦点行
      * @param {*} id 
      */
     setFocus(id){
         this.grid.current.setFocus(id);
     }
     render() {
         let treeTopHeight = 0;
         if (this.props.headers instanceof Array && this.props.headers.length > 0) {
             if (this.props.headers[0] instanceof Array) {
                 treeTopHeight = this.props.headers.length * config.topHeight;
             }
             else {
                 treeTopHeight = config.topHeight;;
             }
         }
 
         return <div className={"wasabi-treegrid "}>
             <div className="wasabi-treegrid-left" style={{width:config.leftWidth}}>
                 <div className="wasabi-treegrid-configuration" style={{ height: treeTopHeight ,lineHeight:treeTopHeight+"px"}}>
                     {this.props.treeHeader}
                 </div>
                 <div className="wasabi-treegrid-rowsData" >
                     <TreeView {...this.props}
                    //  取消虚线
                     dotted={false}
                     ></TreeView>
                 </div>
             </div>
             <div className="wasabi-treegrid-right">
                 <DataGrid ref={this.grid}  pagination={false} rowNumber={false}
                     headers={this.props.headers} data={this.props.visibleData}
                    onClick={this.dataGridClick}
                   ></DataGrid>
             </div>
         </div>
     }
 }

 
 export default TreeGrid;