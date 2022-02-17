/**
 * Created by wangzhiyong on 2020-11-07
 * 数据处理基类
 * todo 
 * edit 2021-04-26
 */

import React from "react"
import func from "../libs/func";
import api from "wasabi-api";
import propsTran from "../libs/propsTran";
import propTypes from "../propsConfig/propTypes";
/**
 * 预处理各类数据
 * @param {*} Widget 组件
 * @param {*} componentType 类型
 */
const loadDataHoc = function (Widget, componentType = "select") {
    class loadDataHocCompnent extends React.Component {
        constructor(props) {
            super(props);
            this.input = React.createRef();
            this.state = {
                url: null,
                params: null,//参数 
                rawParams: null,
                rawData: [],//原始数据,用于判断是否通过父组件强制更新数据源         
                data: [],//处理后的数据
                filterText: "",//筛选文本
                filterData: [],//筛选的数据
                loadDataStatus: null,//标记如何加载数据
                idField: this.props.idField,//for tree treepicker
                valueField: this.props.valueField,
                textField: this.props.textField,
            }
            this.handlerData = this.handlerData.bind(this);
            this.getValue = this.getValue.bind(this);
            this.setValue = this.setValue.bind(this);
            this.reload = this.reload.bind(this);
            this.loadData = this.loadData.bind(this);
            this.loadSuccess = this.loadSuccess.bind(this);
            this.loadError = this.loadError.bind(this);
        }
        static getDerivedStateFromProps(props, state) {
            let newState = { };       
            if (props.data && props.data instanceof Array && func.diff(props.data, state.rawData)) {
                // //如果传了数据，并且发生改变
                newState = {
                    loadDataStatus: "data",//通过data加载数据
                }
                newState.rawData = props.data;//保留原始数据,用于后期对比       
            }
          
            else if (props.url && props.url !==state.url || func.diff(props.params, state.rawParams)) {
                //传的请求参数发生改变
                newState = {
                    loadDataStatus: "url",//通过url加载数据
                    url: props.url,
                    rawParams: func.clone(props.params),
                    params: func.clone(props.params),
                }
            }
          
            return newState;
        }
        componentDidMount() {
            this.handlerData();//处理数据
        }
        componentDidUpdate() {
            this.handlerData();//处理数据
        }
        /**
         * 统一加工数据
         */
        handlerData() {
            if (this.state.loadDataStatus === "url") {
                this.loadData();
            }
            else if (this.state.loadDataStatus === "data") {
                let formatData = propsTran.preprocessForm(this.state.rawData,this.props.valueField, this.props.textField );
                this.setState({
                    data: formatData,
                    loadDataStatus: null,//处理完成
                  
                })

            }
        }
        /**
     * 加载数据
     * @param {*} url 
     * @param {*} params 
     */
        loadData() {
            if (this.state.url) {
                let fetchmodel = { type: this.props.httpType || "post", url: this.state.url, success: this.loadSuccess, data: this.state.params, error: this.loadError };
                fetchmodel.headers = this.props.httpHeaders;
                fetchmodel.contentType = this.props.contentType;
                let wasabi_api = window.api || api;
                wasabi_api.ajax(fetchmodel);
                console.log("combobox-fetch", fetchmodel);
            }
        }
        /**
         * 
         * @param {*} message 
         */
        loadError(message) {//查询失败
            console.log("combobox-error", message);
            Msg.error(message);
        }
        /**
         * 数据加载成功
         * @param {*} data 
         */
        loadSuccess(res) {//数据加载成功
            if (typeof this.props.loadSuccess === "function") {
                //有正确处理的数据
                let resData = this.props.loadSuccess(res);
                res = resData && resData instanceof Array ? resData : res;
            }
            let realData = func.getSource(res, this.props.dataSource || "data");
            let formatData =propsTran.preprocessForm(realData,this.props.valueField,this.props.textField );
             this.setState({
                loadDataStatus: null,
                rawData: realData,//保存方便对比
                data: formatData,
           
            })
        }

        //以下方法方便给父组件，ref调用
        /**
         * 
         * @param {*} value 
         */
        setValue(value) {
            this.input.current && this.input.current.setValue && this.input.current.setValue(value);
        }
        /**
         * 获取值
         * @returns 
         */
        getValue() {
            return this.input.current && this.input.current.getValue && this.input.current.getValue();
        }
        /**
         * 刷新
         * @param {*} params 
        * @param {*} url 
         */
        reload(params, url) {

            if(this.input.current.reload){
                this.input.current.reload();
            }
            else{
                url = url || this.props.url;
                params = params || this.state.params;
                this.setState({
                    loadDataStatus: "url",
                    params: params
                })
            }
           
        }
        getChecked(){
            return  this.input.current&&this.input.current.getChecked();
         }
         setChecked(id,checked){
             return  this.input.current&&this.input.current.setChecked(id,checked);
         }
         clearChecked(){
             return  this.input.current&&this.input.current.clearChecked();
         }
         checkedAll(){
             return  this.input.current&&this.input.current.checkedAll();
         }
         setClick(id){
             return  this.input.current&&this.input.current.setClick(id);
         }
         remove(node){
             return  this.input.current&&this.input.current.remove(node);
         }
         append(children,node){
             return  this.input.current&&this.input.current.append(children,node);
         }
         filter(value)
         {
             return  this.input.current&&this.input.current.filter(value);
         }
         adjust(){
             return  this.input.current&&this.input.current.adjust();
         }
    
        render() {
            return <Widget
                {...this.props}
                componentType={componentType}
                ref={this.input}
                reload={this.reload}
                data={this.state.filterText ? this.state.filterData : this.state.data}
            ></Widget>
        }
    }
    loadDataHocCompnent.propTypes = propTypes;
    return loadDataHocCompnent;
}
export default loadDataHoc;
