/**
 * create by wangzhiyong
 * date:2020-12-21
 * desc 交叉表
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import func from "../../../libs/func";
import LinkButton from "../../../Buttons/LinkButton";
import Button from "../../../Buttons/Button";
import Modal from "../../../Layout/Modal";
import Fields from "./Fields";
import Filters from "./Filters";
import Rows from "./Rows";
import Columns from "./Columns";
import Values from "./Values"

class Configuration extends Component {
    constructor(props) {
        super(props);
        this.modal=React.createRef();
        let p = {
            fields: func.clone(this.props.fields),//所有的字段
            rows: func.clone(this.props.rows),//行维度
            columns: func.clone(this.props.columns),//列维度
            values: func.clone(this.props.values),//统计参数
            filters: func.clone(this.props.filters),//筛选条件
        }
        let s = {};
        for (let key in p) {
            s[key] = p[key];
            s["old" + key] = p[key];//保留一份方便更新
        }
        this.state = s;
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.applyHandler = this.applyHandler.bind(this)
    }
    static getDerivedStateFromProps(props, state) {
        let newState = {};
        for (let key in props) {
            if (state.hasOwnProperty(["old" + key]) && func.diff(state["old" + key], props[key])) {
                //更新此字段
                newState["old" + key] = props[key];
                newState[key] = props[key];
            }
        }
        if (func.isEmptyObject(newState)) {
            return null;
        }
        else {
            return newState;
        }

    }
    initData() {

    }
    /**
     * 打开设置面板
     */
    open() {
        this.modal.current.open();
    }
    /**
     * 关闭设置面板
     */
    close() {
        this.modal.current.close();
    }
    /**
     * 提交变更
     */
    applyHandler() {
        this.modal.current.close();
        this.props.applyHandler && this.props.applyHandler(this.state.rows, this.state.columns, this.state.values, this.state.filters);

    }
    renderTool() {
        return <div style={{ position: "absolute", width: "calc(100% - 20px)", paddingRight: 10 }}>
            <span style={{ fontSize: 16, fontWeight: "bold", }}>交叉表配置</span>
            <div style={{ float: "right" }}>

                <Button key="cancel" theme="default" onClick={this.close}>取消</Button>
                <Button key="success" theme="success" onClick={this.applyHandler}>提交</Button>
            </div>
        </div>
    }
    render() {
        return <div>
            <div className="wasabi-pivot-configuration" onClick={this.props.applyHandler?this.open.bind(this):()=>{}} style={{ height: this.props.height, lineHeight: this.props.height + "px" }}>
             {this.props.applyHandler?
             <div><LinkButton iconCls="icon-setting" style={{ fontSize: 20, marginTop: -3 }}></LinkButton><span style={{ cursor: "pointer", fontSize: 16, fontWeight: "bold", marginLeft: 10 }}>单击此处设计</span></div> 
              :null
             }
            </div>
            <Modal ref={this.modal} style={{ width: 1000, height: 600, top: 10, left: 10 }} title={this.renderTool()} >
                {
                    <div className="wasabi-pivot-configuration-panel">
                        <Fields></Fields>
                        <div className="wasabi-pivot-configuration-set">
                            <Filters></Filters>
                            <Columns></Columns>
                            <Rows></Rows>
                            <Values></Values>
                        </div>
                    </div>


                }
            </Modal></div>;
    }
}


Configuration.propTypes = {
    fields: PropTypes.array,//所有的字段
    rows: PropTypes.array,//行维度
    columns: PropTypes.array,//列维度
    values: PropTypes.array,//统计参数
    filters: PropTypes.array,//筛选条件
    applyHandler: PropTypes.func,//请求数据
}

Configuration.defaultProps = {
    fields: [],//所有的字段
    rows: [],//行维度
    columns: [],//列维度
    values: [],//统计参数
    filters: [],//筛选条件
    applyHandler: null,//请求数据处理
}

export default Configuration;