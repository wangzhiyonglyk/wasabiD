/**
 * Created by wangzhiyong on 2016/10/30.
 * edit 2021-01-15
 * 创建单表应用组件
 */
import React from 'react';
import PropTypes from 'prop-types';
import SearchBar from '../../Form/SearchBar/index.jsx';
import Input from "../../Form/Input";
import Toolbar from '../../Buttons/Toolbar';
import DataGrid from '../../Data/DataGrid';
import Modal from '../../Layout/Modal.jsx';
import mixins from '../../Mixins/mixins';
import SingleModelMixins from './SingleModelMixins.jsx';
import SingleHandlerMixins from './SingleHandlerMixins.jsx';
import func from '../../libs/func.js';
import Form from '../../Form/Form/index.jsx';
import "./index.css"
class Single extends React.Component {
    constructor(props) {
        super(props);
        this.searchbar = React.createRef();
        this.datagrid = React.createRef();
        this.form = React.createRef();
        this.modal = React.createRef();
        this.toolbar = React.createRef();
        let newState = {};
        newState = this.initState(props);
        newState.model = func.clone(props.model);
        this.state = {
            opType: "",//操作类型
            rawModel: [],//原始数据
            model: [],
            submitButton: [
                {
                    name: "wasabi-save",
                    title: "提交",
                    size: "small",
                    iconCls: "icon-save"
                }
            ],
            filterModel: [],
            attachParams: this.props.attachParams,//列表初始化的筛选条件
            params: func.clone(this.props.attachParams), //列表初始化的筛选条件
            disabled: false,//表单是否只读
            ...newState
        }
        //绑定事件
        let baseCtors = [SingleModelMixins, SingleHandlerMixins];
        baseCtors.forEach(baseCtor => {
            Object.getOwnPropertyNames(baseCtor).forEach(name => {
                if (typeof baseCtor[name] == 'function') {
                    this[name] = this[name].bind(this);
                }
            });
        });

    }
    /**
     * 刷新
     */
    reload() {
        this.modal.current&&this.modal.current.close();
        this.datagrid.current&&this.datagrid.current.reload(); //刷新列表
        this.form.current&&this.form.current.clearData();
    }
    render() {
        console.log("this",this.props.pageHandler)
        let modalStyle = this.props.modalStyle || { width: 1600, height: 800, top: 20 };
        return (
            <div className="wasabi-single">
                <div
                    style={{
                        display:
                            this.state.filterModel == null ||
                                (this.state.filterModel instanceof Array &&
                                    this.state.filterModel.length == 0)
                                ? 'none'
                                : 'block'
                    }}
                >
                    <SearchBar
                        ref={this.searchbar}
                        model={this.state.filterModel}
                        onSubmit={this.filterHandler}
                        addAble={this.props.addAble ? true : false}
                        onAdd={this.addOpen}
                        cols={4}
                    >
                        {
                            this.state.filterModel && this.state.filterModel instanceof Array && this.state.filterModel.map((item, index) => {
                                return <Input {...item} key={index}></Input>
                            })
                        }
                    </SearchBar>
                </div>
                <div
                    style={{
                        display:
                            this.props.buttons == null ||
                                (this.props.buttons instanceof Array &&
                                    this.props.buttons.length == 0)
                                ? 'none'
                                : 'block'
                    }}
                >
                    <Toolbar
                        ref={this.toolbar}
                        buttons={this.props.buttons}
                        buttonClick={this.btnHandler}
                    ></Toolbar>
                </div>
                <DataGrid
                    ref={this.datagrid}
                    dataSource={this.props.dataSource}
                    totalSource={this.props.totalSource}
                    contentType={this.props.contentType}
                    httpHeaders={this.props.httpHeaders}
                    url={typeof this.props.pageHandler === "string" ? this.props.pageHandler : ""}
                    params={this.state.params}
                    headers={this.state.headers}
                    onUpdate={typeof this.props.pageHandler === "function" ? this.props.pageHandler : null}
                    rowNumber={true}
                    selectAble={this.props.selectAble}
                    data={this.props.data}
                ></DataGrid>
                <Modal style={modalStyle}
                    ref={this.modal} OKHandler={ this.modalOKHandler}>
                    {
                        this.props.autoOp ? <Form ref={this.form}
                            disabled={this.state.opType == "search" ? true : false}
                            cols={this.props.cols || 3}
                            style={this.props.formStyle || null}>
                            {
                                this.state.model && this.state.model.length > 0 && this.state.model.map((item, index) => {
                                    if (this.state.opType === "add" && item.addAble) {
                                        return <Input key={index} {...item} value={item.value || ""}></Input>
                                    }
                                    else if ((this.state.opType === "edit" || this.state.opType === "search") && item.editAble) {
                                        return <Input key={index} {...item} value={item.value || ""} ></Input>
                                    }
                                })
                            }
                        </Form> : null
                    }
                    {
                        this.props.children
                    }
                </Modal>
            </div>
        );
    }
}
Single.propTypes = {
    keyField: PropTypes.string, //主键名称
    title: PropTypes.string.isRequired, //页面的标题
    model: PropTypes.array.isRequired,//模型
    contentType: PropTypes.string,//请求的类型
    httpHeaders: PropTypes.object,//请求时多余的头部
    headers: PropTypes.array,//表头
    dataSource: PropTypes.string,//后台数据哪个字段是数据源
    totalSource: PropTypes.string,//后台数据哪个字段是总记录
    attachParams: PropTypes.object, //默认的筛选条件
    autoOp: PropTypes.bool,//是否可以自动操作（新增，编辑,删除）
    addAble: PropTypes.bool,//是否可以新增
    editAble: PropTypes.bool,//是否可以编辑
    deleteAble:PropTypes.bool,//是否可以删除
    detailAble: PropTypes.bool,//是否可以查看详情
    selectAble:PropTypes.bool,//是否可以勾选
    //事件
    openAddHandler: PropTypes.func,//打开新增窗口
    addHandler: PropTypes.func, //新增地址函数
    deleteHandler: PropTypes.func, //修改函数
    openonUpdate: PropTypes.func,//打开编辑窗口
    onUpdate: PropTypes.func, //更新函数
    pageHandler: PropTypes.oneOfType([PropTypes.string, PropTypes.func]), //分页查询url或者函数
    onDetail: PropTypes.func, //详情查询函数
    buttons: PropTypes.array, //自定义的页面按钮
  
    btnHandler: PropTypes.func,//自定义的按钮的单击事件
   
    modalStyle: PropTypes.object,//弹出层样式
    formStyle: PropTypes.object,//弹出层样式
    cols: PropTypes.number,//表单列数
}
Single.defaultProps = {
    keyField: "id",
    title: '',
    model: [],
    contentType: "application/x-www-form-urlencoded",//表单
    httpHeaders: {},
    headers: [],
    dataSource: "data",
    totalSource: "total",
    attachParams: null, //默认条件为空
    autoOp: true,
    addAble: true,
    deleteAble:true,
    editAble: true,
    detailAble: true,
    selectAble:true,
    openAddHandler: null,
    addHandler: null,
    deleteHandler: null,
    openonUpdate: null,
    onUpdate: null,
    pageHandler: null,
    onDetail: null,
    buttons: [],//操作按钮
    btnHandler: null,
    modalStyle: null,
    formStyle: null,
    cols: 3

}
mixins(Single, [SingleModelMixins, SingleHandlerMixins]);
export default Single;
