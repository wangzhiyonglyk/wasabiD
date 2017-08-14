/*
 create by wangzy
 date:2016-05-23
 desc:级联选择组件
 采用了es6语法
 */
let React=require("react");
require("../Sass/Form/picker.scss");
let unit=require("../libs/unit.js");

let FetchModel=require("../Model/FetchModel.js");
let PickerModel=require("../Model/PickerModel.js");
var validation=require("../Lang/validation.js");
let setStyle=require("../Mixins/setStyle.js");
var validate=require("../Mixins/validate.js");
var showUpdate=require("../Mixins/showUpdate.js");
var shouldComponentUpdate=require("../Mixins/shouldComponentUpdate.js");
var Label=require("../Unit/Label.jsx");
var Message=require("../Unit/Message.jsx");
var ClickAway=require("../Unit/ClickAway.js");
import props from "./config/props.js";
import defaultProps from "./config/defaultProps.js";
let  Picker =  React.createClass({
    mixins:[setStyle,validate,showUpdate,shouldComponentUpdate,ClickAway],
    propTypes:props,
    getDefaultProps :function(){
        return defaultProps;


    },
    getInitialState:function() {
        return {
            hide:this.props.hide,
            value:this.props.value,
            text:this.props.text,
            readonly:this.props.readonly,

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
            required:this.props.required,
            validateClass:"",//验证的样式
            helpShow:"none",//提示信息是否显示
            helpTip:validation["required"],//提示信息
            invalidTip:"",
        }
    },
    componentWillReceiveProps:function(nextProps) {
        if(nextProps.data!=null&&nextProps.data instanceof  Array &&(!nextProps.url||nextProps.url=="")) {
            this.setState({
                hide:nextProps.hide,
                data:nextProps.data,
                value:nextProps.value,
                text:nextProps.text,
                readonly: nextProps.readonly,
                required: nextProps.required,
                params:unit.clone( nextProps.params),
                secondParams:nextProps.secondParams,
                secondParamsKey:nextProps.secondParamsKey,
                thirdParams:nextProps.thirdParams,
                thirdParamsKey:nextProps.thirdParamsKey,
                validateClass:"",//重置验证样式
                helpTip:validation["required"],//提示信息
                show:false,

            })
        }
        else {
            if(this.showUpdate(nextProps.params))
            {//如果不相同则更新
                var fetchmodel=new FetchModel(this.props.url,this.loadProvinceSuccess,nextProps.params,this.loadError);
                console.log("picker",fetchmodel);
                unit.fetch.post(fetchmodel);
            }
            else
            {

            }
            this.setState({
                hide:nextProps.hide,
                value:nextProps.value,
                text: nextProps.text,
                readonly: nextProps.readonly,
                required: nextProps.required,

                params:unit.clone(nextProps.params),
                secondParams:nextProps.secondParams,
                secondParamsKey:nextProps.secondParamsKey,
                thirdParams:nextProps.thirdParams,
                thirdParamsKey:nextProps.thirdParamsKey,
                validateClass:"",//重置验证样式
                helpTip:validation["required"],//提示信息
                show:false,
            })



        }
    },
    componentDidMount:function(){
        if(this.props.url!=null) {
            var fetchmodel=new FetchModel(this.props.url,this.loadProvinceSuccess,this.state.params,this.loadError);
            console.log("picker",fetchmodel);
            unit.fetch.post(fetchmodel);
        }
        this.registerClickAway(this.hidePicker, this.refs.picker);//注册全局单击事件
    },
     setValue(value) {
        let text = "";
        for (let i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].value == value) {
                text = item;
                break;
            }
        }

        if (text) {
            this.setState({
                value: value,
                text: text
            })
        }

    },
    getValue() {
        return this.state.value;

    },
    
    loadProvinceSuccess:function(data) {//一级节点的数据加载成功
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
    },
    loadError:function(errorCode,message) {//查询失败
        console.log("picker-error",errorCode,message);
        Message. error(message);
    },
    changeHandler:function(event) {

    },
    onBlur:function () {
        this.refs.label.hideHelp();//隐藏帮助信息
    },
    showPicker:function(type) {//显示选择
        if (this.state.readonly) {
            //只读不显示
            return;
        }
        else {
            this.setState({
                show: type==1?!this.state.show:true
            })
        }
        this.bindClickAway();//绑定全局单击事件
    },
    hidePicker:function () {
        this.setState({
            show: false
        })
        this.unbindClickAway();//卸载全局单击事件
    },
    clearHandler:function() {//清除数据
        if(this.props.onSelect!=null)
        {
            this.props.onSelect("","",this.props.name,null);
        }
        else
        {
            this.setState({
                value:null,
                text:null,
            })
        }
    },
    setPickerModel:function(data) {//根据数据生成标准格式
        let realData = [];
        for (let index = 0; index < data.length; index++) {
            let pickerModel = new PickerModel(data[index][this.props.valueField],data[index][this.props.textField]);
            realData.push(pickerModel);
        }
        return realData;
    },
    activeHot:function(value,text) {
        this.setState({
            show:false,
            value:value,
            text:text,
        });
        this.validate(value);//验证
        if (this.props.onSelect != null) {

            this.props.onSelect(value, text, this.props.name);
        }
    },

    flodChildren:function (data) {//将节点折叠起来
        for(var index=0;index<data.length;index++)
        {
            data[index].expand=false;
            if(data[index].childrens &&data[index].childrens instanceof  Array)
            {
                data[index].childrens=  this.flodChildren(data[index].childrens);//遍历
            }
        }
        return data;
    },
    activeProvince :function(currentProvinceIndex,currentProvinceValue) {//一级节点激活
        var newData=this.state.data;
        let selectValue=this.state.value;
        let selectText=this.state.text;
        if(this.state.provinceActiveIndex===currentProvinceIndex) {//当前节点为激活节点
            var newData=this.state.data;
            if((newData[currentProvinceIndex].childrens instanceof  Array)&&newData[currentProvinceIndex].childrens.length>0) {
                //有子节点则不执行选中事件
                var expand=newData[currentProvinceIndex].expand;
                newData=  this.flodChildren(newData);//折叠
                newData[currentProvinceIndex].expand=!expand;//如果为展开状态则隐藏,否则展开

            }
            else {//没有则立即执行选中事件
                selectValue=newData[currentProvinceIndex].value;
                selectText=newData[currentProvinceIndex].text;
                if (this.props.onSelect != null) {
                    this.props.onSelect(selectValue, selectText, this.props.name,null);
                }

            }
            this.validate(selectValue);//验证
            this.setState({
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
            if(this.props.secondUrl!=null&&this.state.data[currentProvinceIndex].childrens==null) {//存在二级节点url并且没有查询过

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

                if((newData[currentProvinceIndex].childrens instanceof  Array)&&newData[currentProvinceIndex].childrens.length>0) {
                    //有子节点则不执行选中事件
                }
                else {//没有则立即执行选中事件
                    selectValue=newData[currentProvinceIndex].value;
                    selectText=newData[currentProvinceIndex].text;
                    if (this.props.onSelect != null) {
                        this.props.onSelect(selectValue, selectText, this.props.name,null);
                    }

                }
                this.validate(selectValue);//验证
                this.setState({
                    value:selectValue,
                    text:selectText,
                    data:newData,
                    provinceActiveIndex:currentProvinceIndex,
                    cityActiveIndex:null,
                    distinctActiveIndex:null,
                })
            }
        }


    },
    loadCitySuccess:function(currentProviceIndex,data) {//二级节点的数据加载成功
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
            newData[currentProviceIndex].childrens=cityData;//将查询的二级节点赋值给一级激活节点
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

    },
    activeCity:function(currentProvinceIndex,currentCityIndex,currentCityValue) {//二级节点激活

        var newData=this.state.data;
        let selectValue=this.state.value;
        let selectText=this.state.text;
        if(this.state.provinceActiveIndex===currentProvinceIndex&&this.state.cityActiveIndex===currentCityIndex){
            //当前节点为激活节点
            if((newData[this.state.provinceActiveIndex].childrens[currentCityIndex].childrens instanceof  Array)&&newData[this.state.provinceActiveIndex].childrens[currentCityIndex].childrens.length>0) {
                //有子节点(三级节点)则不执行选中事件
                var expand=newData[this.state.provinceActiveIndex].childrens[currentCityIndex].expand;
                newData=this.flodChildren(newData);//折叠
                newData[this.state.provinceActiveIndex].expand=true;//一级节点展开
                newData[this.state.provinceActiveIndex].childrens[currentCityIndex].expand=!expand;//如果为展开状态则隐藏,否则展开
            }
            else {//没有则立即执行选中事件
                selectValue=newData[this.state.provinceActiveIndex].value+","+newData[this.state.provinceActiveIndex].childrens[currentCityIndex].value;
                selectText=newData[this.state.provinceActiveIndex].text+","+newData[this.state.provinceActiveIndex].childrens[currentCityIndex].text;
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
            });


        }
        else
        {
            if(this.props.thirdUrl!=null&&(this.state.data[this.state.provinceActiveIndex].childrens[currentCityIndex].childrens==null)) {//存在三级节点url并且没有查询过
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

                for(let index=0;index<newData[this.state.provinceActiveIndex].childrens.length;index++)
                {
                    newData[this.state.provinceActiveIndex].childrens[index].expand=false;
                }
                var expand=newData[this.state.provinceActiveIndex].childrens[currentCityIndex].expand;
                newData= this.flodChildren(newData);//折叠

                newData[this.state.provinceActiveIndex].expand=true;//一级节点展开
                newData[this.state.provinceActiveIndex].childrens[currentCityIndex].expand=!expand;

                if((newData[this.state.provinceActiveIndex].childrens[currentCityIndex].childrens instanceof  Array)&&newData[this.state.provinceActiveIndex].childrens[currentCityIndex].childrens.length>0) {
                    //有子节点(三级节点)则不执行选中事件
                }
                else {//没有则立即执行选中事件
                    selectValue=newData[this.state.provinceActiveIndex].value+","+newData[this.state.provinceActiveIndex].childrens[currentCityIndex].value;
                    selectText=newData[this.state.provinceActiveIndex].text+","+newData[this.state.provinceActiveIndex].childrens[currentCityIndex].text;
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
                });
            }
        }

    },
    loadDistinctSuccess:function(currentCityIndex,data){//三级节点查询成功
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
            for(var index=0;index<newData[this.state.provinceActiveIndex].childrens.length;index++)
            {
                newData[this.state.provinceActiveIndex].childrens[index].expand=false;
            }
            newData[this.state.provinceActiveIndex].childrens[currentCityIndex].childrens=distinctData;//将查询的三级节点赋值给二级激活节点
            var expand=  newData[this.state.provinceActiveIndex].childrens[currentCityIndex].expand;
            newData= this.flodChildren(newData);//折叠
            newData[this.state.provinceActiveIndex].expand=true;//一级节点展开
            newData[this.state.provinceActiveIndex].childrens[currentCityIndex].expand=!expand;

        }
        else
        {
            selectValue=newData[this.state.provinceActiveIndex].value+","+newData[this.state.provinceActiveIndex].childrens[currentCityIndex].value;
            selectText=newData[this.state.provinceActiveIndex].text+","+newData[this.state.provinceActiveIndex].childrens[currentCityIndex].text;
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

    },
    activeDistinct:function(currentDistinctIndex) {//三级节点激活
        var newData=this.state.data;
        let selectValue=this.state.value;
        let selectText=this.state.text;
        for(let index=0;index< newData[this.state.provinceActiveIndex].childrens[this.state.cityActiveIndex].childrens.length;index++)
        {
            newData[this.state.provinceActiveIndex].childrens[this.state.cityActiveIndex].childrens[index].expand=false;
        }
        newData=this.flodChildren(newData);//折叠
        newData[this.state.provinceActiveIndex].expand=true; newData[this.state.provinceActiveIndex].childrens[this.state.cityActiveIndex].expand=true;
        newData[this.state.provinceActiveIndex].childrens[this.state.cityActiveIndex].childrens[currentDistinctIndex].expand=true;
        selectValue=newData[this.state.provinceActiveIndex].value +","
            +newData[this.state.provinceActiveIndex].childrens[this.state.cityActiveIndex].value+","
            +newData[this.state.provinceActiveIndex].childrens[this.state.cityActiveIndex].childrens[currentDistinctIndex].value;
        selectText=newData[this.state.provinceActiveIndex].text +","
            +newData[this.state.provinceActiveIndex].childrens[this.state.cityActiveIndex].text+","
            +newData[this.state.provinceActiveIndex].childrens[this.state.cityActiveIndex].childrens[currentDistinctIndex].text;

        if (this.props.onSelect != null) {
            this.props.onSelect(selectValue, selectText, this.props.name,null);
        }
        this.validate(selectValue);//验证
        this.setState({
            value:selectValue,
            text:selectText,
            data:newData,
            distinctActiveIndex:currentDistinctIndex,
        })
    },
    renderHot:function() {//热门选择
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
    },
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
                                this.renderCity(index,child.childrens)
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
    },
    renderCity:function(provinceIndex,cityData) {//二级节点渲染
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
                                this.renderDistinct(child.childrens)
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

    },
    renderDistinct:function(distinctData) {//三级节点渲染
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

    },
    render:function() {
        var size=this.props.onlyline==true?"onlyline":this.props.size;//组件大小
        var componentClassName=  "wasabi-form-group "+size;//组件的基本样式
        var style =this.setStyle("input");//设置样式
        var controlStyle=this.props.controlStyle?this.props.controlStyle:{};
        controlStyle.display = this.state.hide == true ? "none" : "block";
        let inputProps=
            {
                readOnly:this.state.readonly==true?"readonly":null,
                style:style,
                name:this.props.name,
                placeholder:(this.props.placeholder===""||this.props.placeholder==null)?this.state.required?"必填项":"":this.props.placeholder,
                className:"wasabi-form-control  "+(this.props.className!=null?this.props.className:""),
                title:this.props.title,

            }//文本框的属性
        var control=this.renderProvince();


        return (
            <div className={componentClassName+this.state.validateClass}  ref="picker"  style={ controlStyle}>
                <Label name={this.props.label} ref="label" hide={this.state.hide} required={this.state.required}></Label>
                <div className={ "wasabi-form-group-body"} style={{width:!this.props.label?"100%":null}}>
                    <div className="combobox"  style={{display:this.props.hide==true?"none":"block"}}   >
                        <i className={"picker-clear"} onClick={this.clearHandler} style={{display:this.state.readonly?"none":(this.state.value==""||!this.state.value)?"none":"inline"}}></i>
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
                    <small className={"wasabi-help-block "+this.props.position} style={{display:(this.state.helpTip&&this.state.helpTip!="")?this.state.helpShow:"none"}}><div className="text">{this.state.helpTip}</div></small>
                </div>
            </div>


        )
    }
});
module .exports=Picker;