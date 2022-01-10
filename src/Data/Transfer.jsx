/*
 create by wangzhiyong
 date:2016-12-19
 edit 2020-11-06
 edit 2021-05-10需要重构
 */
import React from "react";
import PropTypes from "prop-types";
import propsTran from "../libs/propsTran";
import LinkButton from "../Buttons/LinkButton";
import api from "wasabi-api";
import func from "../libs/func";
import "../Sass/Data/Transfer.css"
class Transfer extends React.Component {

    constructor(props) {
        super(props);
        this.transfer = React.createRef();
        this.up = React.createRef();
        this.down = React.createRef();
        let realData = propsTran.formatterData("transfer", "", this.props.data, this.props.valueField, this.props.textField);
        let realSelectData = propsTran.formatterData("transfer", "", this.props.selectData, this.props.valueField, this.props.textField);
        this.state = {
            name: this.props.name,
            data: realData,
            selectData: realSelectData,
            leftOnIndex: null,//左边被点中的数据
            rightOnIndex: null,//右边被点中的数据
            textField: this.props.textField,
            valueField: this.props.valueField,
            reloadData: false,
        }

    }

    static getDerivedStateFromProps(props, state) {
        let newState = {};
        if (props.url && props.params &&
            func.diff(props.params, state.params)) {//如果有url
            newState = {
                reloadData: true,//重新加载
                url: props.url,
                params: func.clone(props.params),
            }
        }
        if (props.data && props.data instanceof Array && func.diff(props.data, state.data)) {
            //如果传了死数据
            newState.data = propsTran.setComboxValueAndText("transfer", "", props.data, state.valueField, state.textField);
            newState.data = newState.data.data;
            newState.selectData = propsTran.setComboxValueAndText("transfer", "", props.selectData, state.valueField, state.textField);
            newState.selectData = newState.selectData.data;
        }
        if (func.isEmptyObject(newState)) {
            return null;
        }
        else {
            return newState;
        }
    }
    componentDidUpdate() {
        if (this.state.reloadData) {
            this.setState({
                realData: false
            })
            this.loadData(this.state.url, this.state.params);
        }
    }
    componentDidMount() {
        this.loadData(this.state.url, this.state.params);
    }
    loadData(url, params) {
        if (url) {
            let fetchmodel =
            {
                url: url,
                data: params,
                success:  this.loadSuccess,
                error: this.loadError,
                type: this.props.httpType ? this.props.httpType.toUpperCase() : "POST",
                headers: this.props.httpHeaders || {},
                contentType: this.props.contentType || null,
            }
            console.log("transfer-fetch", fetchmodel);
            let wasabi_api = window.api || api;
            wasabi_api.ajax(fetchmodel);
        }


    }
    loadSuccess(data) {//数据加载成功
        let realData = data;
        if (this.props.dataSource == null) {
        }
        else {
            realData = unit.getSource(data, this.props.dataSource);
        }
        if (realData instanceof Array) {
            for (let i = 0; i < realData.length; i++) {
                realData[i].text = realData[i][this.props.textField ? this.props.textField : "text"];
                realData[i].value = realData[i][this.props.valueField ? this.props.valueField : "value"];

            }
        }
        this.setState({
            data: realData,
        })
    }
    loadError(message) {//查询失败
        console.log("treepicker-error", message);
        Msg.error(message);
    }
    itemClickHandler(type, index) {
        if (type == "left") {
            if (this.ctrl) {//多选
                let leftOnIndex = [];
                if (this.state.leftOnIndex instanceof Array) {
                    leftOnIndex = this.state.leftOnIndex;
                }
                else if (this.state.leftOnIndex) {
                    leftOnIndex.push(this.state.leftOnIndex);
                }
                if (leftOnIndex.indexOf(index) > -1) {
                    leftOnIndex.splice(leftOnIndex.indexOf(index), 1);
                }
                else {
                    leftOnIndex.push(index);
                }
                if (leftOnIndex.length == 0) {//没有选择
                    leftOnIndex = null;
                }
                else if (leftOnIndex.length == 1) {//只选择了一个
                    leftOnIndex = leftOnIndex[0];
                }
                this.setState({
                    leftOnIndex: leftOnIndex,
                    rightOnIndex: null,
                })
            }
            else {
                this.setState({
                    leftOnIndex: index,
                    rightOnIndex: null,
                })
            }

        }
        else {
            if (this.ctrl) {//多选
                let rightOnIndex = [];
                if (this.state.rightOnIndex instanceof Array) {
                    rightOnIndex = this.state.rightOnIndex;
                }
                else if (this.state.rightOnIndex) {
                    rightOnIndex.push(this.state.rightOnIndex);
                }
                if (rightOnIndex.indexOf(index) > -1) {
                    rightOnIndex.splice(rightOnIndex.indexOf(index), 1);
                }
                else {
                    rightOnIndex.push(index);
                }
                if (rightOnIndex.length == 0) {//没有选择
                    rightOnIndex = null;
                }
                else if (rightOnIndex.length == 1) {//只选择了一个
                    rightOnIndex = rightOnIndex[0];
                }

                this.setState({
                    leftOnIndex: null,
                    rightOnIndex: rightOnIndex,
                })
            }
            else {
                this.setState({
                    leftOnIndex: null,
                    rightOnIndex: index,
                })
            }
        }
    }
    itemDblClickHandler(direction, indexArray) {
        if (indexArray == null) {
            return;
        }
        else {
            if (indexArray instanceof Array) {//按住了ctrl键

                if (direction == "right") {//向右
                    let data = [];
                    this.state.data.map((item, index) => {
                        if (indexArray.indexOf(index) > -1) {
                            this.state.selectData.push(item);
                        }
                        else {
                            data.push(item);
                        }
                    });
                    this.state.data = data;
                }
                else {
                    let selectData = [];
                    this.state.selectData.map((item, index) => {
                        if (indexArray.indexOf(index) > -1) {
                            this.state.data.push(item);
                        }
                        else {
                            selectData.push(item);
                        }
                    });
                    this.state.selectData = selectData;
                }
            }
            else {
                if (direction == "right") {//向右
                    this.state.selectData.push(this.state.data.splice(indexArray, 1)[0]);


                }
                else {
                    this.state.data.push(this.state.selectData.splice(indexArray, 1)[0]);

                }

            }


            this.setState({
                data: this.state.data,
                selectData: this.state.selectData,
                leftOnIndex: null,
                rightOnIndex: null,
            }, () => {
                this.props.onSelect && this.props.onSelect(this.state.selectData, this.state.data)
            })
        }

    }
    itemUpHandler() {//向上
        if (this.state.leftOnIndex && !(this.state.leftOnIndex instanceof Array)) {//左边
            this.state.data.splice(this.state.leftOnIndex - 1, 2, this.state.data[this.state.leftOnIndex], this.state.data[this.state.leftOnIndex - 1]);
            this.setState({
                data: this.state.data,
                leftOnIndex: this.state.leftOnIndex - 1,
                rightOnIndex: null,
            }, () => {
                this.props.onSelect && this.props.onSelect(this.state.selectData, this.state.data)
            })
        }
        else if (this.state.rightOnIndex && !(this.state.rightOnIndex instanceof Array)) {//右边
            this.state.selectData.splice(this.state.rightOnIndex - 1, 2, this.state.selectData[this.state.rightOnIndex], this.state.selectData[this.state.rightOnIndex - 1]);

            this.setState({
                selectData: this.state.selectData,
                leftOnIndex: null,
                rightOnIndex: this.state.rightOnIndex - 1
            }, () => {
                this.props.onSelect && this.props.onSelect(this.state.selectData, this.state.data)
            })
        }
    }
    itemDownHandler() {//向下
        if (this.state.leftOnIndex != null && !(this.state.leftOnIndex instanceof Array) && this.state.leftOnIndex < this.state.data.length - 1) {//左边

            this.state.data.splice(this.state.leftOnIndex, 2, this.state.data[this.state.leftOnIndex + 1], this.state.data[this.state.leftOnIndex]);
            this.setState({
                data: this.state.data,
                leftOnIndex: this.state.leftOnIndex + 1,
                rightOnIndex: null,
            }, () => {
                this.props.onSelect && this.props.onSelect(this.state.selectData, this.state.data)
            })
        }
        else if (this.state.rightOnIndex != null && !(this.state.rightOnIndex instanceof Array) && this.state.rightOnIndex < this.state.selectData.length - 1) {//右边
            this.state.selectData.splice(this.state.rightOnIndex, 2, this.state.selectData[this.state.rightOnIndex + 1], this.state.selectData[this.state.rightOnIndex]);
            this.setState({
                selectData: this.state.selectData,
                leftOnIndex: null,
                rightOnIndex: this.state.rightOnIndex + 1,
            }, () => {
                this.props.onSelect && this.props.onSelect(this.state.selectData, this.state.data)
            })
        }
    }
    onKeyDown(event) {

        if (event.keyCode == 17 || event.keyCode == 91) {
            this.ctrl = true;
            this.up.current.setDisabled(true);
            this.down.current.setDisabled(true);
        }
        else {

        }

    }
    onKeyUp() {
        this.ctrl = false;
        if (this.state.leftOnIndex instanceof Array || this.state.rightOnIndex instanceof Array) {

        }
        else {
            this.up.current.setDisabled(false);
            this.down.current.setDisabled(false);
        }

    }
    onMouseOver(event) {
        this.transfer.current.focus();
    }
    render() {

        let leftControl = [];
        let rightControl = [];
        this.state.data.map((item, index) => {
            leftControl.push(<li className={(this.state.leftOnIndex == index || (this.state.leftOnIndex instanceof Array && this.state.leftOnIndex.indexOf(index) > -1)) ? "on" : ""} key={index} onDoubleClick={this.itemDblClickHandler.bind(this, "right", index)} onClick={this.itemClickHandler.bind(this, "left", index)}>{item.text}</li>);
        })
        this.state.selectData.map((item, index) => {
            rightControl.push(<li className={(this.state.rightOnIndex == index || (this.state.rightOnIndex instanceof Array && this.state.rightOnIndex.indexOf(index) > -1)) ? "on" : ""} key={index} onDoubleClick={this.itemDblClickHandler.bind(this, "left", index)} onClick={this.itemClickHandler.bind(this, "right", index)}>{item.text}</li>);
        })
        return <div className="wasabi-transfer" ref={this.transfer} tabIndex="0" onKeyUp={this.onKeyUp} onKeyDown={this.onKeyDown} onMouseOver={this.onMouseOver}>
            <ul className="wasabi-transfer-left">
                {leftControl}
            </ul>
            <div className="wasabi-transfer-middle">
                <LinkButton name="up" title="向上" iconCls={"icon-up"} onClick={this.itemUpHandler} ref={this.up} disabled={(this.state.leftOnIndex instanceof Array || this.state.rightOnIndex instanceof Array) ? true : false} />
                <LinkButton name="down" title="向下" iconCls={"icon-down"} onClick={this.itemDownHandler} ref={this.down} disabled={(this.state.leftOnIndex instanceof Array || this.state.rightOnIndex instanceof Array) ? true : false} />
                <LinkButton name="right" title="向右" iconCls={"icon-right"} onClick={this.itemDblClickHandler.bind(this, "right", this.state.leftOnIndex)} />
                <LinkButton name="left" title="向左" iconCls={"icon-left"} onClick={this.itemDblClickHandler.bind(this, "left", this.state.rightOnIndex)} />

            </div>
            <ul className="wasabi-transfer-right">
                {rightControl}
            </ul>
        </div>
    }
}
Transfer.propTypes = {
    name: PropTypes.string,//名称
    valueField: PropTypes.string,//数据字段值名称
    textField: PropTypes.string,//数据字段文本名称
    url: PropTypes.string,//后台查询地址
    params: PropTypes.object,//向后台传输的额外参数
    dataSource: PropTypes.string,//ajax的返回的数据源中哪个属性作为数据源,为null时直接后台返回的数据作为数据源
    data: PropTypes.array,//节点数据
    selectData: PropTypes.array,//选中的数据
    onSelect: PropTypes.func,//选中后的事件

};
Transfer.defaultProps = {
    valueField: "value",
    textField: "text",
    dataSource: "data",
};
export default Transfer;