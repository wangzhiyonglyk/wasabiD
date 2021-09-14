/**
 * create by wangzhiyong
 * date:2020-12-21
 * desc 交叉表
 * desc
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import func from "../../libs/func";
import DataGrid from "../DataGrid"
import Tree from "../Tree";
import Configuration from "./Configuration";
import mixins from "../../Mixins/mixins"
import dataHandler from "./dataHandler"
import("./index.css")
class Pivot extends Component {
    constructor(props) {
        super(props);
        this.grid=React.createRef();
        this.tree=React.createRef();
        let p = {
            fields: func.clone(this.props.fields),//所有的字段
            rows: func.clone(this.props.rows),//行维度
            columns: func.clone(this.props.columns),//列维度
            values: func.clone(this.props.values),//统计参数
            filters: func.clone(this.props.filters),//筛选条件
            data: func.clone(this.props.data),//数据
            headers: [],//列纬度的表头
            realData: [],//真实的数据
            rowsTreeData: [],//行纬度的数据
        }
        let s = {};
        for (let key in p) {
            s[key] = p[key];
            s["old" + key] = p[key];//保留一份方便更新
        }
        this.state = s;
        this.initData=this.initData.bind(this)
    }
    static getDerivedStateFromProps(props, state) {
        let newState = {};
        for (let key in props) {
            if (state.hasOwnProperty(["old" + key]) &&func. diff(state["old" + key], props[key])) {
                //更新此字段
                newState["old" + key] = props[key];
                newState[key] = props[key];
            }
        }
        if (func.isEmptyObject(newState)) {
            return null;
        }
        else {
            newState.ischange = true;//数据有改变
            return newState;
        }

    }

    componentDidMount() {
        this.initData();//
    }

    componentDidUpdate() {
        if (this.state.ischange) {
            this.initData();
        }
    }

    initData() {
        this.setRowsAndColunmsAndData(this.state.columns, this.state.rows, this.state.values, this.state.data);
    }
    dataGridClick(rowData, rowIndex) {
        
        this.tree.current.setClickNode(rowData._id);

    }
    treeClick(_id) {
       this.grid.current.setClick(_id);
    }
    render() {

        let treeTop = 0;
        if (this.state.headers instanceof Array && this.state.headers.length > 0) {
            if (this.state.headers[0] instanceof Array) {
                treeTop = this.state.headers.length * 41;
            }
            else {
                treeTop = 41;
            }
        }
        return <div className="wasabi-pivot">
            <div className="wasabi-pivot-left">
                <Configuration height={treeTop}></Configuration>
                <div className="wasabi-pivot-rowsData" >
                    <Tree checkAble={this.props.checkAble} ref={this.tree} onClick={this.treeClick.bind(this)} isPivot={true} data={this.state.rowsTreeData} simpleData={true} ></Tree>
                </div>
            </div>
            <div className="wasabi-pivot-right">
                <DataGrid ref={this.grid} pagination={this.props.pagination} rowNumber={false}
                    headers={this.state.headers} data={this.state.realData} isPivot={true} onClick={this.dataGridClick.bind(this)}></DataGrid>
            </div>
        </div>
    }
}


Pivot.propTypes = {
    fields: PropTypes.array,//所有的字段
    rows: PropTypes.array,//行维度
    columns: PropTypes.array,//列维度
    values: PropTypes.array,//统计参数
    filters: PropTypes.array,//筛选条件
    data: PropTypes.array,//数据,
    checkAble:PropTypes.bool,//是否可以勾选
    applyHandler: PropTypes.func,//请求数据处理
  
}


mixins(Pivot, [dataHandler])
export default Pivot;