//create by wangzhiyong
//date:2016-04-05后开始独立改造
//desc:页面筛选条件组件

import React, { Component } from "react";
import PropTypes from "prop-types";
import LinkButton from "../../Buttons/LinkButton";
import func from "../../libs/func"
import propsTran from "../../libs/propsTran"
import "./searchbar.css"
class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.inputs = [];//ref
    this.state = {
      dropType: this.props.expand
        ? "icon-arrow-up"
        : "icon-arrow-down"
    };
    this.validate = this.validate.bind(this);
    this.getData = this.getData.bind(this);
    this.setData = this.setData.bind(this);
    this.clearData = this.clearData.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getRefs = this.getRefs.bind(this);
    this.computerLabelWidth = this.computerLabelWidth.bind(this)
    this.expandHandler = this.expandHandler.bind(this);
  }
  /**
      * 合并两种refs引用方式
      * @returns 
      */
  getRefs() {
    let combinxRefs = [];//合并新旧语法
    for (let i = 0; i < this.inputs.length; i++) {
      let cref = this.inputs[i].current;
      if (cref) {
        combinxRefs.push(cref);
      }
    }
    for (let r in this.refs) {
      combinxRefs.push(this.refs[r]);
    }
    return combinxRefs;
  }
  /**
   * 验证
   * @returns 
   */
  validate() {
    let isva = true;
    let combinxRefs = this.getRefs();
    for (let i = 0; i < combinxRefs.length; i++) {
      let cref = combinxRefs[i];
      if (isva) {//如果验证是正确的，继续获取值
        isva = cref && cref.validate ? cref.validate() : isva;
      }
      else {//如果前一个验证失败，则验证不拿值
        cref && cref.validate ? cref.validate() : void (0);
      }

    }
    return isva;
  }
  /**
   * 获取值
   * @returns 
   */
  getData() {
    var data = {}
    let combinxRefs = this.getRefs();
    for (let i = 0; i < combinxRefs.length; i++) {
      let cref = combinxRefs[i];
      if (cref && cref.props.name && cref.getValue) {//说明是表单控件
        if (cref.props.name.indexOf(",") > -1) {//含有多个字段
          var nameSplit = cref.props.name.split(",");
          if (cref.getValue()) {
            var valueSplit = cref.getValue().split(",");
            for (let index = 0; index < nameSplit.length; index++) {
              if (index < valueSplit.length) {
                data[nameSplit[index]] = valueSplit[index];
              }
            }

          }
          else {
            for (let index = 0; index < nameSplit.length; index++) {
              data[nameSplit[index]] = "";
            }
          }
        }
        else {
          data[cref.props.name] = cref.getValue();
        }
      }
      else if (cref.getData) {//布局组件或者表单组件
        data = Object.assign({}, data, cref.getData())
      }


    }
    return data;
  }
  /**
   * 设置值
   * @param {*} data 
   * @returns 
   */
  setData(data) {//设置值,data是对象

    if (!data) {
      return;
    }
    let combinxRefs = this.getRefs();
    for (let i = 0; i < combinxRefs.length; i++) {
      let cref = combinxRefs[i];
      if (cref && cref.props.name && data[cref.props.name] != null && data[cref.props.name] != undefined) {
        cref.setValue && cref.setValue(data[cref.props.name]);
      }
      else if (cref && cref.setData) {//表单或者布局组件
        cref.setData(data);
      }
    }
  }
  /**
   * 清除数据
   */
  clearData() {
    let combinxRefs = this.getRefs();
    for (let i = 0; i < combinxRefs.length; i++) {
      let cref = combinxRefs[i];
      cref && cref.setValue && cref.setValue("");
      cref && cref.clearData && cref.clearData();
    }
  }
  onSubmit() {
    //提交 数据
    var data = {};//各个字段对应的值
    let isva = true;
    let combinxRefs = this.getRefs();
    for (let i = 0; i < combinxRefs.length; i++) {
      let cref = combinxRefs[i];
      if (cref) {
        //如果没有验证方法说明不是表单控件，保留原来的值
        if (isva) {//如果验证是正确的，继续获取值
          isva = cref.validate ? cref.validate() : isva;
        }
        else {//如果前一个验证失败，则验证不拿值
          cref.validate ? cref.validate() : void (0);
        }

        if (cref.props.name && cref.getValue) {//说明是表单控件

          if (cref.props.name.indexOf(",") > -1) {//含有多个字段

            var nameSplit = cref.props.name.split(",");
            let value = cref.getValue();
            if (value) {
              var valueSplit = value.split(",");
              for (let index = 0; index < valueSplit.length; index++)//有可能分离的值比字段少
              {
                if (index < valueSplit.length) {
                  data[nameSplit[index]] = valueSplit[index];

                }
              }

            }
            else {
              for (let index = 0; index < nameSplit.length; index++) {
                data[nameSplit[index]] = "";

              }
            }
          }
          else {
            data[cref.props.name] = cref.getValue();
          }
        } else if (cref.getData) {//布局组件或者表单组件
          data = Object.assign(data, cref.getData())
        }
      }

    }
    if (isva) {
      if (this.props.onSubmit) {//如果没有提交事件
        this.props.onSubmit(data);
      }
      else {
        return data;
      }

    }
  }
  expandHandler() {
    this.setState({
      dropType:
        this.state.dropType == "icon-arrow-down"
          ? "icon-arrow-up"
          : "icon-arrow-down"
    });
  }
  /**
     * 得到表单中标签的最大宽度，方便对齐
     */
  computerLabelWidth() {
    let maxWidth = 0;//得到最大宽度
    React.Children.map(this.props.children, (child, index) => {

      if (child && child.props && child.props.label) {
        let labelStyle = func.clone(child.labelStyle) || {};
        if (labelStyle && labelStyle.width) {
          //如果设置宽度，则不参与计算
        } else {
          let width = func.charWidth(child.props.label);
          maxWidth = maxWidth < width ? width : maxWidth;
          maxWidth = maxWidth > 160 ? 160 : maxWidth;//超过160就不管了，否则很难看
        }

      }
    })
    return maxWidth;
  }
  render() {
    this.inputs = [];//先清空
    let maxWidth = this.computerLabelWidth();
    return (
      <div
        className={"wasabi-searchbar clearfix " + this.props.className}
        style={this.props.style}
      >
        <div className='inputcontainer' cols={this.props.cols}>
          {React.Children.map(this.props.children, (child, index) => {
            if (child) {
              if (typeof child.type !== "function") {
                //非react组件
                return child;
              } else {


                //这里有个问题，value与text在第二次会被清除,防止数据丢失
                let data = child.props.data
                  ? JSON.parse(JSON.stringify(child.props.data))
                  : null;

                //统一处理标签样式问题，方便对齐
                let labelStyle = propsTran.handlerLabelStyle(child.labelStyle, maxWidth);
                let ref = child.ref ? child.ref : React.createRef();
                typeof ref === "object" ? this.inputs.push(ref) : void (0);//如果对象型添加，字符型（旧语法）事后通过refs来获取
                return React.cloneElement(child,
                  {
                    data: data,
                    labelStyle: labelStyle,
                    readOnly: this.state.disabled ? this.state.disabled : child.props.readOnly,
                    key: index, ref: ref
                  })

              }
            }
            else {
              return child;
            }

          })}

        </div>
        <div className='buttoncontainer'>
          <LinkButton
            iconCls={this.state.dropType}
            style={{
              display:
                this.props.children && React.Children.count(this.props.children) > this.props.cols
                  ? "inline"
                  : "none"
            }}
            onClick={this.expandHandler}
          ></LinkButton>
          <LinkButton
            onClick={this.onSubmit.bind(this, "search")}
            theme={this.props.submitTheme}
            hide={this.props.onSubmit ? false : true}
            iconCls='icon-search'
            style={this.props.submitStyle}
            title={this.props.submitTitle}
          >
            {this.props.submitTitle || "搜索"}
          </LinkButton>{
            this.props.addAble ?
              <LinkButton
                onClick={this.props.onAdd}
                theme={this.props.submitTheme}
                iconCls='icon-add'
                style={this.props.submitStyle}
                title={this.props.addTitle}
              >
                {this.props.addTitle || "添加"}
              </LinkButton> : null
          }
        </div>
      </div>
    );
  }
}
SearchBar.propTypes = {
  style: PropTypes.object, //样式
  className: PropTypes.string, //自定义样式
  submitTitle: PropTypes.string,//查询按钮的标题
  addTitle: PropTypes.string,//添加按钮的标题
  submitHide: PropTypes.bool,//是否隐藏按钮
  addAble: PropTypes.bool,//是否有添加按钮
  submitTheme: PropTypes.string,
  submitStyle: PropTypes.object,
  cols: PropTypes.number, //多余几个隐藏
  onSubmit: PropTypes.func,//提交事件
  expand: PropTypes.bool //是否默认展开
};
SearchBar.defaultProps = {
  submitTitle: "搜索", //查询按钮的标题
  addTitle: "添加", //查询按钮的标题
  submitTheme: "primary", //主题
  cols: 3, //一行排几个
};

export default SearchBar;
