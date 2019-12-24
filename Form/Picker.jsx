/*
 create by wangzy
 date:2016-05-23
 desc:级联选择组件
 采用了es6语法
 edit 2017-08-17n TODO
 */
import React, {Component} from "react";
import PropTypes from "prop-types";


import  unit from "../libs/unit.js";

import  FetchModel from "../Model/FetchModel.js";
import  PickerModel from "../Model/PickerModel.js";
import  validation from "../Lang/validation.js";

import  validate from "../Mixins/validate.js";
import  showUpdate from "../Mixins/showUpdate.js";
import  Label from "../Unit/Label.jsx";
import  Message from "../Unit/Message.jsx";
 import  ClickAway from "../Unit/ClickAway.js";
import propType from "./config/propType.js";
import defaultProps from "./config/defaultProps.js";
import ("../Sass/Form/picker.css");
class   Picker  extends  Component{
  constructor(props)
  {
      super(props)
      this.state={
        hide:this.props.hide,
        value:this.props.value,
        text:this.props.text,
      
        data:this.props.data,
        //其他属性
        params:unit.clone( this.props.params),
        provinceActiveIndex:null,//一级激活节点下标
        cityActiveIndex:null,//二级激活节点下标
        distinctActiveIndex:null,//三级激活节点下标
        show:false,//是否显示
        //其他属性
        secondParams:this.props.secondParams,
        secondParamsKey:this.props.secondParamsKey,
        thirdParams:this.props.thirdParams,
        thirdParamsKey:this.props.thirdParamsKey,
        //验证
      
        validateClass:"",//验证的样式
        helpShow:"none",//提示信息是否显示
        helpTip:validation["required"],//提示信息
        invalidTip:"",
      }
      this.validate=this.validate.bind(this);
      this.showUpdate=this.showUpdate.bind(this);
      this.setValue=this.setValue.bind(this);
      this.getValue=this.getValue.bind(this);
      this.loadProvince=this.loadProvince.bind(this);
      this.loadProvinceSuccess=this.loadProvinceSuccess.bind(this);
      this.loadError=this.loadError.bind(this);
      this.changeHandler=this.changeHandler.bind(this);
      this.onBlur=this.onBlur.bind(this);
      this.showPicker=this.showPicker.bind(this);
      this.hidePicker=this.hidePicker.bind(this);
      this.clearHandler=this.clearHandler.bind(this);
      this.setPickerModel=this.setPickerModel.bind(this);
      this.activeHot=this.activeHot.bind(this);
      this.flodChildren=this.flodChildren.bind(this);
      this.activeProvince=this.activeProvince.bind(this);
      this.loadCitySuccess=this.loadCitySuccess.bind(this);
      }
   
    componentWillReceiveProps(nextProps) {
        if (nextProps.url) {

            if (nextProps.url != this.props.url) {
                this.loadProvince(nextProps.url, nextProps.params);
            }
            else if (this.showUpdate(nextProps.params, this.props.params)) {//如果不相同则更新
                this.loadProvince(nextProps.url, nextProps.params);
            }

        } else if (nextProps.data && nextProps.data instanceof Array) {//又传了数组
            if (nextProps.data.length != this.props.data.length) {
                    this.setState({
                        data:nextProps.data,
                        value:"",
                        text:""
                    })
            }else{
                let newData=[];
                for(let i=0;i<nextProps.data.length;i++)
            {
                let obj=nextProps.data[i];
                obj.text=nextProps.data[i][this.props.textField];
                obj.value=nextProps.data[i][this.props.valueField];
              
                newData.push(obj);
            }
            if(newData[0].text!=this.state.data[0].text||newData[newData.length-1].text!=this.state.data[this.state.data.length-1].text)
            {this.setState({
                data:nextProps.data,
                value:"",
                text:""
            })

            }
        }
        }
    }
    componentDidMount(){
        if(this.props.url!=null) {
            var fetchmodel=new FetchModel(this.props.url,this.loadProvinceSuccess,this.state.params,this.loadError);
            console.log("picker",fetchmodel);
            unit.fetch.post(fetchmodel);
        }
       // this.registerClickAway(this.hidePicker, this.refs.picker);//注册全局单击事件
    }
    validate(value){
        validate.call(this,value);
    }
    showUpdate(newParam, oldParam) {
        showUpdate.call(this, newParam, oldParam);
    }
     setValue(value) {
        let text = "";
        for (let i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].value == value) {
                text = this.state.data[i].text;
                break;
            }
        }
            this.setState({
                value: value,
                text: text
            })
        

    }
    getValue() {
        return this.state.value;

    }
    loadProvince(url, params) {

       
        if (url != null && url != "") {
            if (params == null) {
                var fetchmodel = new FetchModel(url, this.loadProvinceSuccess, null, this.loadError);

                unit.fetch.get(fetchmodel);
            }
            else {
                var fetchmodel = new FetchModel(url, this.loadProvinceSuccess, params, this.loadError);

                unit.fetch.post(fetchmodel);
            }
            console.log("checkbox", fetchmodel);
        }
    }
    loadProvinceSuccess(data) {//一级节点的数据加载成功
        let provinceData=[];//一级节点数据
        var realData=data;
        //获取真实数据
        if(this.props.dataSource==null) {
        }
        else {
            realData=unit.getSource(data,this.props.dataSource);
        }
        provinceData=   this.setPickerModel(realData);//生成标准格式model
        this.setState({
            data:provinceData
        })
    }
    loadError(errorCode,message) {//查询失败
        console.log("picker-error",errorCode,message);
        Message. error(message);
    }
    changeHandler(event) {

    }
    onBlur () {
        this.refs.label.hideHelp();//隐藏帮助信息
    }
    showPicker(type) {//显示选择
        if (this.props.readonly) {
            //只读不显示
            return;
        }
        else {
            this.setState({
                show: type==1?!this.state.show:true
            })
        }
        //this.bindClickAway();//绑定全局单击事件
    }
    hidePicker () {
        this.setState({
            show: false
        })
      //  this.unbindClickAway();//卸载全局单击事件
    }
    clearHandler() {//清除数据
        this.setState({
            value:"",
            text:"",
        })
       this.props.onSelect&& this.props.onSelect("","",this.props.name,null);
       
    }
    setPickerModel(data) {//根据数据生成标准格式
        let realData = [];
        for (let index = 0; index < data.length; index++) {
            let pickerModel = new PickerModel(data[index][this.props.valueField],data[index][this.props.textField]);
            realData.push(pickerModel);
        }
        return realData;
    }
    activeHot(value,text) {
        this.setState({
            show:false,
            value:value,
            text:text,
        });
        this.validate(value);//验证
        if (this.props.onSelect != null) {

            this.props.onSelect(value, text, this.props.name);
        }
    }

    flodChildren (data) {//将节点折叠起来
        for(var index=0;index<data.length;index++)
        {
            data[index].expand=false;
            if(data[index].children &&data[index].children instanceof  Array)
            {
                data[index].children=  this.flodChildren(data[index].children);//遍历
            }
        }
        return data;
    }
    activeProvince (currentProvinceIndex,currentProvinceValue) {//一级节点激活
        let show=true;
        var newData=this.state.data;
        let selectValue=this.state.value;
        let selectText=this.state.text;
        if(this.state.provinceActiveIndex===currentProvinceIndex) {//当前节点为激活节点
            var newData=this.state.data;
            if((newData[currentProvinceIndex].children instanceof  Array)&&newData[currentProvinceIndex].children.length>0) {
                //有子节点则不执行选中事件
                var expand=newData[currentProvinceIndex].expand;
                newData=  this.flodChildren(newData);//折叠
                newData[currentProvinceIndex].expand=!expand;//如果为展开状态则隐藏,否则展开

            }
            else {//没有则立即执行选中事件
                selectValue=newData[currentProvinceIndex].value;
                selectText=newData[currentProvinceIndex].text;
                show=false;
                if (this.props.onSelect != null) {
                    this.props.onSelect(selectValue, selectText, this.props.name,null);
                }

            }
            this.validate(selectValue);//验证
            this.setState({
                show:show,
                value:selectValue,
                text:selectText,
                data:newData,
                provinceActiveIndex:currentProvinceIndex,
                cityActiveIndex:null,
                distinctActiveIndex:null,
            })
        }
        else {
            //当前节点不是激活节点
            if(this.props.secondUrl!=null&&this.state.data[currentProvinceIndex].children==null) {//存在二级节点url并且没有查询过

                let url=this.props.secondUrl;
                let params=this.state.secondParams;
                if(typeof  params =="object")
                {//判断是否为对象
                    params[this.state.secondParamsKey]=currentProvinceValue;
                }
                else
                {
                    params={};
                    if(this.state.secondParamsKey!=null)
                    {
                        params[this.state.secondParamsKey]=currentProvinceValue;
                    }

                }
                var fetchmodel=new FetchModel(url,this.loadCitySuccess.bind(this,currentProvinceIndex),params,this.loadError);
                console.log("picker-second",fetchmodel);
                unit.fetch.post(fetchmodel);
            }
            else {//没有二级节点的url
                var newData=this.state.data;

                var expand= newData[currentProvinceIndex].expand;
                newData= this.flodChildren(newData);//折叠
                newData[currentProvinceIndex].expand=!expand;

                if((newData[currentProvinceIndex].children instanceof  Array)&&newData[currentProvinceIndex].children.length>0) {
                    //有子节点则不执行选中事件
                }
                else {//没有则立即执行选中事件
                    selectValue=newData[currentProvinceIndex].value;
                    selectText=newData[currentProvinceIndex].text;
                    show=false;
                    if (this.props.onSelect != null) {
                        this.props.onSelect(selectValue, selectText, this.props.name,null);
                    }

                }
                this.validate(selectValue);//验证
                this.setState({
                    show:show,
                    value:selectValue,
                    text:selectText,
                    data:newData,
                    provinceActiveIndex:currentProvinceIndex,
                    cityActiveIndex:null,
                    distinctActiveIndex:null,
                })
            }
        }


    }
    loadCitySuccess(currentProviceIndex,data) {//二级节点的数据加载成功
        let cityData=[];//当前一级节点的二级节点数据
        var realData=data;
        var newData=this.state.data;
        let selectValue=this.state.value;
        let selectText=this.state.text;
        //获取真实数据
        if(this.props.dataSource==null) {
        }
        else {
            realData=unit.getSource(data,this.props.dataSource);
        }
        cityData=this.setPickerModel(realData);//生成二级节点数据模型
        if(cityData instanceof  Array &&cityData.length>0) {//有数据
            newData[currentProviceIndex].children=cityData;//将查询的二级节点赋值给一级激活节点
            var expand=newData[currentProviceIndex].expand;
            newData=this.flodChildren(newData);//折叠
            newData[currentProviceIndex].expand=!expand;//当前一级节点展开


        }
        else {//没有数据,则直接执行选择事件
            selectValue=newData[currentProviceIndex].value;
            selectText=newData[currentProviceIndex].text;
            if (this.props.onSelect != null) {
                this.props.onSelect(selectValue, selectText, this.props.name,null);
            }
        }
        this.validate(selectValue);//验证
        this.setState({
            value:selectValue,
            text:selectText,
            data:newData,
            provinceActiveIndex:currentProviceIndex,
            cityActiveIndex:null,
            distinctActiveIndex:null,
        })

    }
    activeCity(currentProvinceIndex,currentCityIndex,currentCityValue) {//二级节点激活
        let show=true;
        var newData=this.state.data;
        let selectValue=this.state.value;
        let selectText=this.state.text;
        if(this.state.provinceActiveIndex===currentProvinceIndex&&this.state.cityActiveIndex===currentCityIndex){
            //当前节点为激活节点
            if((newData[this.state.provinceActiveIndex].children[currentCityIndex].children instanceof  Array)&&newData[this.state.provinceActiveIndex].children[currentCityIndex].children.length>0) {
                //有子节点(三级节点)则不执行选中事件
                var expand=newData[this.state.provinceActiveIndex].children[currentCityIndex].expand;
                newData=this.flodChildren(newData);//折叠
                newData[this.state.provinceActiveIndex].expand=true;//一级节点展开
                newData[this.state.provinceActiveIndex].children[currentCityIndex].expand=!expand;//如果为展开状态则隐藏,否则展开
            }
            else {//没有则立即执行选中事件
               show=false;
                selectValue=newData[this.state.provinceActiveIndex].value+","+newData[this.state.provinceActiveIndex].children[currentCityIndex].value;
                selectText=newData[this.state.provinceActiveIndex].text+","+newData[this.state.provinceActiveIndex].children[currentCityIndex].text;
                if (this.props.onSelect != null) {
                    this.props.onSelect(selectValue, selectText, this.props.name,newData[this.state.provinceActiveIndex]);
                }
            }
            this.validate(selectValue);//验证
            this.setState({
                show:false,
                value:selectValue,
                text:selectText,
                data:newData,
                cityActiveIndex:currentCityIndex,
                distinctActiveIndex:null,
            });


        }
        else
        {
            if(this.props.thirdUrl!=null&&(this.state.data[this.state.provinceActiveIndex].children[currentCityIndex].children==null)) {//存在三级节点url并且没有查询过
                let url=this.props.thirdUrl;
                let params=this.state.thirdParams;
                if(typeof  params =="object")
                {//判断是否为对象
                    params[this.state.thirdParamsKey]=currentCityValue;
                }
                else
                {
                    params={};
                    if(this.state.thirdParamsKey!=null)
                    {
                        params[this.state.thirdParamsKey]=currentCityValue;
                    }
                }
                var fetchmodel=new FetchModel(url,this.loadDistinctSuccess.bind(this,currentCityIndex),params,this.loadError);
                console.log("picker-third",fetchmodel);
                unit.fetch.post(fetchmodel);
            }
            else {

                for(let index=0;index<newData[this.state.provinceActiveIndex].children.length;index++)
                {
                    newData[this.state.provinceActiveIndex].children[index].expand=false;
                }
                var expand=newData[this.state.provinceActiveIndex].children[currentCityIndex].expand;
                newData= this.flodChildren(newData);//折叠

                newData[this.state.provinceActiveIndex].expand=true;//一级节点展开
                newData[this.state.provinceActiveIndex].children[currentCityIndex].expand=!expand;

                if((newData[this.state.provinceActiveIndex].children[currentCityIndex].children instanceof  Array)&&newData[this.state.provinceActiveIndex].children[currentCityIndex].children.length>0) {
                    //有子节点(三级节点)则不执行选中事件
                }
                else {//没有则立即执行选中事件
                   show=false;
                    selectValue=newData[this.state.provinceActiveIndex].value+","+newData[this.state.provinceActiveIndex].children[currentCityIndex].value;
                    selectText=newData[this.state.provinceActiveIndex].text+","+newData[this.state.provinceActiveIndex].children[currentCityIndex].text;
                    if (this.props.onSelect != null) {
                        this.props.onSelect(selectValue, selectText, this.props.name,newData[this.state.provinceActiveIndex]);
                    }
                }
                this.validate(selectValue);//验证
                this.setState({
                    show:show,
                    value:selectValue,
                    text:selectText,
                    data:newData,
                    cityActiveIndex:currentCityIndex,
                    distinctActiveIndex:null,
                });
            }
        }

    }
    loadDistinctSuccess(currentCityIndex,data){//三级节点查询成功
        let distinctData=[];//当前二级节点的二级节点数据
        var realData=data;
        let selectValue=this.state.value;
        let selectText=this.state.text;
        //获取真实数据
        if(this.props.dataSource==null) {
        }
        else {
            realData=unit.getSource(data,this.props.dataSource);
        }
        distinctData=this.setPickerModel(realData);//生成二级节点数据模型
        var newData=this.state.data;
        if(distinctData instanceof  Array &&distinctData.length>0) {//有数据
            for(var index=0;index<newData[this.state.provinceActiveIndex].children.length;index++)
            {
                newData[this.state.provinceActiveIndex].children[index].expand=false;
            }
            newData[this.state.provinceActiveIndex].children[currentCityIndex].children=distinctData;//将查询的三级节点赋值给二级激活节点
            var expand=  newData[this.state.provinceActiveIndex].children[currentCityIndex].expand;
            newData= this.flodChildren(newData);//折叠
            newData[this.state.provinceActiveIndex].expand=true;//一级节点展开
            newData[this.state.provinceActiveIndex].children[currentCityIndex].expand=!expand;

        }
        else
        {
            selectValue=newData[this.state.provinceActiveIndex].value+","+newData[this.state.provinceActiveIndex].children[currentCityIndex].value;
            selectText=newData[this.state.provinceActiveIndex].text+","+newData[this.state.provinceActiveIndex].children[currentCityIndex].text;
            if (this.props.onSelect != null) {
                this.props.onSelect(selectValue, selectText, this.props.name,null);
            }
        }
        this.validate(selectValue);//验证
        this.setState({
            value:selectValue,
            text:selectText,
            data:newData,
            cityActiveIndex:currentCityIndex,
            distinctActiveIndex:null,

        })

    }
    activeDistinct(currentDistinctIndex) {//三级节点激活
        let show=false;
        var newData=this.state.data;
        let selectValue=this.state.value;
        let selectText=this.state.text;
        for(let index=0;index< newData[this.state.provinceActiveIndex].children[this.state.cityActiveIndex].children.length;index++)
        {
            newData[this.state.provinceActiveIndex].children[this.state.cityActiveIndex].children[index].expand=false;
        }
        newData=this.flodChildren(newData);//折叠
        newData[this.state.provinceActiveIndex].expand=true; newData[this.state.provinceActiveIndex].children[this.state.cityActiveIndex].expand=true;
        newData[this.state.provinceActiveIndex].children[this.state.cityActiveIndex].children[currentDistinctIndex].expand=true;
        selectValue=newData[this.state.provinceActiveIndex].value +","
            +newData[this.state.provinceActiveIndex].children[this.state.cityActiveIndex].value+","
            +newData[this.state.provinceActiveIndex].children[this.state.cityActiveIndex].children[currentDistinctIndex].value;
        selectText=newData[this.state.provinceActiveIndex].text +","
            +newData[this.state.provinceActiveIndex].children[this.state.cityActiveIndex].text+","
            +newData[this.state.provinceActiveIndex].children[this.state.cityActiveIndex].children[currentDistinctIndex].text;

        if (this.props.onSelect != null) {
            this.props.onSelect(selectValue, selectText, this.props.name,newData[this.state.provinceActiveIndex]);
        }
        this.validate(selectValue);//验证
        this.setState({
            show:show,
            value:selectValue,
            text:selectText,
            data:newData,
            distinctActiveIndex:currentDistinctIndex,
        })
    }
    renderHot() {//热门选择
        if (this.props.hotData instanceof Array) {
            var controlArray = [];
            this.props.hotData.map((item, index)=> {
                controlArray.push(< li  key={"hot"+item.text} className="hot-item" onClick={this.activeHot.bind(this,item.value,item.text)} title={item.text}>{item.text}</li>);
            });
            return <div>
                <div className="hot-wrap">
                    <p style={{display:(this.props.hotTitle&&this.props.hotTitle!="")?"block":"none"}}>{this.props.hotTitle}</p>
                    <ul>{controlArray}</ul></div>
                <div className= "line" > </div >
            </div>
        }
        else {
            return null;
        }
    }
    renderProvince() {//一级节点渲染
        var provinceComponents=[];
       
        if(this.state.data instanceof  Array)
        {
           
            this.state.data.map((child,index)=>
            {
                var left=(index%5)*-65;

                provinceComponents.push (<li key={"province"+index} className={"picker-container  "+(child.expand?"expand":"")}>
                        <ul className="picker-container-wrap" style={{display:(child.expand?"block":"none"),left:left}}>
                            {
                                this.renderCity(index,child.children)
                            }
                        </ul>
                        <div className={"picker-container-name "+(child.expand?"expand":"")} onClick={this.activeProvince.bind(this,index,child.value)} title={child.text}>{child.text}</div>
                    </li>
                );
            });
            return provinceComponents;
        }
        else
        {
            return null;
        }
    }
    renderCity(provinceIndex,cityData) {//二级节点渲染
        var cityComponents=[];
        if(cityData instanceof  Array)
        {
            cityData.map((child,index)=>{
                var left=(index%4)*-80;
                if(index%4==0)
                {
                    left=-14;
                }

                cityComponents.push (
                    <li key={"city"+index} className={"picker-container  "+(child.expand?"expand":"")}>
                        <ul className="picker-container-wrap" style={{display:(child.expand?"block":"none"),left:left}}>
                            {
                                this.renderDistinct(child.children)
                            }
                        </ul>
                        <div className={"picker-container-name "+(child.expand?"expand":"")} onClick={this.activeCity.bind(this,provinceIndex,index,child.value)} title={child.text}>{child.text}</div>
                    </li>
                )
            });
            return cityComponents;
        }else
        {
            return null;
        }

    }
    renderDistinct(distinctData) {//三级节点渲染
        var distinctComponents=[];
        if(distinctData instanceof  Array)
        {
            distinctData.map((child,index)=>{
                distinctComponents.push (
                    <li key={"distinct"+index} className={"pickeritem "+(this.state.distinctActiveIndex===index?"expand":"")}  onClick={this.activeDistinct.bind(this,index,child.value)} title={child.text}>{child.text}</li>
                )
            });
            return distinctComponents;
        }else
        {
            return null;
            return null;
        }

    }
    clearHandler() {//清除数据
        this.setState({
            value:"",
            text:"",
        })
        this.props.onSelect&&this.props.onSelect("","",this.props.name,null);
    }
    render() {
        var componentClassName=  "wasabi-form-group ";//组件的基本样式 
      let inputProps=
            {
                readOnly:this.props.readonly==true?"readonly":null,
                style:this.props.style,
                name:this.props.name,
                placeholder:(this.props.placeholder===""||this.props.placeholder==null)?this.props.required?"必填项":"":this.props.placeholder,
                className:"wasabi-form-control  "+(this.props.className!=null?this.props.className:""),
                title:this.props.title,

            }//文本框的属性
        var control=this.renderProvince();


        return (
            <div className={componentClassName+this.state.validateClass}  ref="picker"  style={{display:this.state.hide==true?"none":"block"}}>
                <Label name={this.props.label} ref="label" style={this.props.labelStyle} required={this.props.required}></Label>
                <div className={ "wasabi-form-group-body"} style={{width:!this.props.label?"100%":null}}>
                    <div className="combobox"     >
                        <i className={"picker-clear"} onClick={this.clearHandler} style={{display:this.props.readonly?"none":(this.state.value==""||!this.state.value)?"none":"inline"}}></i>
                        <i className={"pickericon " +(this.state.show?"rotate":"")} onClick={this.showPicker.bind(this,1)}></i>
                        <input type="text" {...inputProps} onBlur={this.onBlur} value={this.state.text} onClick={this.showPicker.bind(this,2)}  onChange={this.changeHandler}     />
                        <div className={"dropcontainter  picker "+this.props.position} style={{display:this.state.show==true?"block":"none"}}   >
                            <div className="picker">
                                {this.renderHot()}
                                <ul className="wrap" >
                                    <p>{this.props.placeholder}</p>
                                    {
                                        this.renderProvince()
                                    }
                                </ul>

                            </div>

                        </div>
                    </div>
                    <small className={"wasabi-help-block "} style={{display:(this.state.helpTip&&this.state.helpTip!="")?this.state.helpShow:"none"}}><div className="text">{this.state.helpTip}</div></small>
                </div>
            </div>


        )
    }
}
  
Picker. propTypes=propType;
Picker.defaultProps =Object.assign({type:"picker",defaultProps});

export default Picker;