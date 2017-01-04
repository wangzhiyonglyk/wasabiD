//create by wangzy
//date:2016-04-05后开始独立改造
//desc:表单组件
require("../Sass/Form/Form.scss");
var React=require("react");
var Input=require("./Input.jsx");
var Button=require("../Buttons/Button.jsx");
var unit=require("../libs/unit.js");
var shouldComponentUpdate=require("../Mixins/shouldComponentUpdate.js");
var Form=React.createClass({
    mixins:[shouldComponentUpdate],
    propTypes: {
        model:React.PropTypes.array.isRequired,//表单数据模型
        width:React.PropTypes.number,///宽度
        height:React.PropTypes.number,//高度
        className:React.PropTypes.string ,//自定义样式
        disabled:React.PropTypes.bool,//是否只读
        submitTitle:React.PropTypes.string,//提交按钮标题
        closeTitle:React.PropTypes.string,//关闭按钮标题
        submitHide:React.PropTypes.bool,//提交按钮是否隐藏
        closeHide:React.PropTypes.bool,//关闭按钮是否隐藏
        submitHandler:React.PropTypes.func,//提交成功后的回调事件
        closeHandler:React.PropTypes.func,//关闭事件的回调事件
        submitTheme:React.PropTypes.oneOf([//提交按钮默认主题
            "primary",
            "default",
            "success",
            "info",
            "warning",
            "danger",
            "green",
            "cancel"
        ]),
        closeTheme:React.PropTypes.oneOf([//关闭按钮默认主题
            "primary",
            "default",
            "success",
            "info",
            "warning",
            "danger",
            "green",
            "cancel"
        ]),
        columns:React.PropTypes.oneOf([//表单的列数，为none则系统不自动排版，为null则系统自动排版，为数字则指定列数
            "none",//不处理
            1,
            2,
            3,
            4
        ]),
    },
    getDefaultProps:function() {
        return {
            model: [],//表单数据模型
            width:null,//默认宽度
            height:null,//高度
            className:"" ,//自定义样式
            disabled:false,//是否只读
            submitTitle:"提交",//提交按钮标题
            closeTitle:"关闭",//关闭按钮标题
            submitHide:false,//提交按钮是否隐藏
            closeHide:false,//关闭按钮是否隐藏
            submitHandler: null,//提交成功后的回调事件
            closeHandler:null,//关闭事件的回调事件
            submitTheme:"green",//提交按钮默认主题
            closeTheme:"cancel",//关闭按钮默认主题
            columns:null,//null系统自行处理列数
        }

    },
    getInitialState:function() {
        this.isChange=false;
        //初始化时就获取可用宽度,如果每次更新获取,会产生晃动
        if(window.screen.availWidth<document.documentElement.clientWidth)
        {//屏幕可用宽度小,有滚动条
            this.availWidth=window.screen.availWidth;
        }
        else {
            //没有滚动条
            this.availWidth=window.screen.availWidth-10;//防止后期出现滚动条,而产生样式变形,先减去滚动条宽度
        }
        return{
            model:(this.props.model),//一定复制
            pickerRowModel:new Map(),//下拉框中选中的完整数据
            disabled:this.props.disabled,//是否只读
            columns:this.props.columns,//自定义列数

        }
    },
    componentWillReceiveProps:function(nextProps) {
        this.showUpdate=false;//清除自身标记
        this.setState({
            model: ( nextProps.model),
            disabled: nextProps.disabled,
            columns: nextProps.columns,
        })
    },
    componentDidUpdate:function () {
        if(this.isChange&&this.showUpdate)
        {
            this.showUpdate=false;
            if (this.props.changeHandler) {//用于父组件监听是否表单是否有修改，用于立即更新父组件中的按钮的权限之类的,
                this.props.changeHandler();
            }
        }
        else
        {

        }

    },
    changeHandler:function(value,text,name,data) {//
        var newModel = this.state.model;
        var pickerRowModel = this.state.pickerRowModel;
        for (var i = 0; i < newModel.length; i++) {
            if (newModel[i].name == name) {
                newModel[i].value = value;
                newModel[i].text = text;
                if (newModel[i].type == "select" || newModel[i].type == "gridpicker") {
                    pickerRowModel.set(newModel[i].name, data);
                }
                break;
            }
        }
        this.isChange=true;//用于对外标记
        this.showUpdate=true;//用于自身标记

        this.setState({
            model: ( newModel),
            pickerRowModel: (pickerRowModel),

        })



    },
    getState:function () {//只读方法，用于父组件其他方法里来获取表单是否发生改变
         if(this.isChange) {
             return true;
         }
         else {
             return false;
         }
    },
    clearDirtyData:function () {//清除组件的表单脏数据状态
        this.isChange=false;
    },
    getData:function() {//获取当前表单的数据，没有验证
        var data={};
        let isva=true;
        for(let v in this.refs)
        {
            if(isva) {
                //验证成功，则继续验证
                isva = this.refs[v].validate(this.refs[v].state.value);
            }else
            {//不成功则继续验证但不再回执
                this.refs[v].validate(this.refs[v].state.value);
            }

            if(this.refs[v].props.name.indexOf(",")>-1)
            {//含有多个字段
                var nameSplit=this.refs[v].props.name.split(",");
                if(this.refs[v].state.value&&this.refs[v].state.value!="")
                {
                    var valueSplit=this.refs[v].state.value.split(",");
                    for(let index =0;index<valueSplit.length;index++) {//有可能分离的值比字段少
                        if(index<valueSplit.length)
                        {
                            data[nameSplit[index]]=valueSplit[index];
                        }
                    }

                }
                else
                {
                    for(let index =0;index<nameSplit.length;index++)
                    {
                        data[nameSplit[index]]=null;
                    }
                }
            }
            else
            {
                data[this.refs[v].props.name]=this.refs[v].state.value;
            }

        }
        return data;

    },
    setData:function(data) {//设置值,data是对象
        this.isChange=false;
        if(!data)
        {
            return ;
        }
        var newModel=this.state.model;
        for(let i=0;i<newModel.length;i++)
        {
            if(data[newModel[i].name])
            {
                if(typeof  data[newModel[i].name]==="object")
                {//键值对
                    try
                    {
                        if(data[newModel[i].name].value)
                        {
                            newModel[i].value=  data[newModel[i].name].value;
                        }
                        if(data[newModel[i].name].text)
                        {
                            newModel[i].text=  data[newModel[i].name].text;
                        }
                    }
                    catch (e)
                    {
                        throw new Error(e.message);
                        return;
                    }

                }
                else
                {//文本型
                    newModel[i].value=  data[newModel[i].name];
                    newModel[i].text=  data[newModel[i].name];
                }

            }
        }
        this.setState({
            model:newModel
        })
    },
    getTextData:function() {
        var textData={};//各个字段对应的文本值
        let isva=true;
        for(let v in this.refs)
        {
            if(isva) {
                //验证成功，则继续验证
                isva = this.refs[v].validate(this.refs[v].state.value);
            }else
            {//不成功则继续验证但不再回执
                this.refs[v].validate(this.refs[v].state.value);
            }
            if(this.refs[v].props.name.indexOf(",")>-1) {//含有多个字段
                var nameSplit=this.refs[v].props.name.split(",");
                if(this.refs[v].state.value&&this.refs[v].state.value!="")
                {

                    var textSplit=this.refs[v].state.text.split(",");//文本值
                    for(let index =0;index<textSplit.length;index++) {//有可能分离的值比字段少
                        if(index<textSplit.length)
                        {
                            textData[nameSplit[index]]=textSplit[index];
                        }
                    }

                }
                else
                {
                    for(let index =0;index<nameSplit.length;index++)
                    {
                        textData[nameSplit[index]]="";
                    }
                }
            }
            else
            {
                textData[this.refs[v].props.name]=this.refs[v].state.text;


            }

        }
        return textData;
    },
    getRowDataByName:function(name) {
        return this.state.pickerRowModel.get(name);
    },
    getModel:function() {
        //获取当前表单数据model
        var newmodel=(this.state.model);//
        return newmodel;
    },
    validate:function() {
        var data={}
        let isva=true;
        for(let v in this.refs)
        {
            if(isva) {
                //验证成功，则继续验证,这样就可以显示所有验证样式
                isva = this.refs[v].validate();
            }else
            {//不成功则继续验证但不再回执
                this.refs[v].validate();
            }
            data[this.refs[v].props.name]=this.refs[v].state.value;
        }
        return isva;
    },
    getComponentData:function(name) {//只读属性，获取对应的字段的数据源
        return  JSON.parse(window.localStorage.getItem(name+"data"))
    },
    clearData:function() {//清空数据
        this.isChange=false;//清除脏数据状态
        var newModel=this.state.model;
        for(let i=0;i<newModel.length;i++)
        {
            if( newModel[i].readonly)
            {

            }
            else {
                newModel[i].value=null;
                newModel[i].text=null;
            }

        }
        this.setState({
            model:newModel
        })
    },

    submitHandler:function() {
        //提交 数据
        var data={};//各个字段对应的值
        var textData={};//各个字段对应的文本值
        let isva=true;
        for(let v in this.refs) {
            if(this.refs[v].props.type=="button")
            {
                continue;//如果按钮则跳过
            }
            if(isva) {
                //验证成功，则继续验证
                isva = this.refs[v].validate();
            }else
            {//不成功则继续验证但不再回执
                this.refs[v].validate();
            }
            if(this.refs[v].props.name.indexOf(",")>-1) {//含有多个字段
                var nameSplit=this.refs[v].props.name.split(",");
                if(this.refs[v].state.value&&this.refs[v].state.value!="")
                {
                    var valueSplit=this.refs[v].state.value.split(",");
                    var textSplit=this.refs[v].state.text.split(",");//文本值
                    for(let index =0;index<valueSplit.length;index++)//有可能分离的值比字段少
                    {
                        if(index<valueSplit.length)
                        {
                            data[nameSplit[index]]=valueSplit[index];
                            textData[nameSplit[index]]=textSplit[index];
                        }
                    }

                }
                else {
                    for(let index =0;index<nameSplit.length;index++)
                    {
                        data[nameSplit[index]]=null;
                        textData[nameSplit[index]]="";
                    }
                }
            }
            else
            {
                data[this.refs[v].props.name] = this.refs[v].state.value;
                textData[this.refs[v].props.name] = this.refs[v].state.text;

            }

        }

        if(isva) {

            if (this.props.submitHandler != null) {
                this.props.submitHandler(data, textData);
            }

        }
    },
    closeHandler:function() {//关闭事件
        if(this.props.closeHandler!=null)
        {
            this.props.closeHandler();
        }
    },
    setColumns:function () {//计算列数及样式
        var style={};//表单栏样式
        if(this.props.style)
        {
            style=this.props.style;
        }

        let columns=0;//每一行的列数

        //表单实际宽度
        let  actualWidth=this.props.width?this.props.width:this.availWidth;//总宽度
        let columnClass="";//列排版样式
        if(this.state.columns)
        {//如果自定义了,则以自定义为标准
            columns=this.state.columns;
        }
        else if(this.state.columns==null){//没设置，则自动计算
            if (actualWidth <= 610) {//一列
                columns = 1;

            }
            else if (actualWidth >= 611 && actualWidth <= 909) {//两列
                columns = 2;

            }
            else if (actualWidth >= 910 && actualWidth <= 1229) {//三列
                columns = 3;

            }
            else if (actualWidth >= 1230) {//四列
                columns = 4;

            }
        }
        else  if(this.state.columns=="none"||this.state.columns==0)
        {//不处理

        }
        if(this.state.model.length<columns) {//如果数据小于列数
            columns = this.state.model.length;
        }
        if(columns>0) {//需要处理列的排版
            switch (columns) {
                case 1:
                    columnClass = "oneline";
                    break;
                case 2:
                    columnClass = "twoline";
                    break;
                case 3:
                    columnClass = "threeline";
                    break;
                case 4:
                    columnClass = "fourline";
                    break;
            }
        }



        style.width=actualWidth;//设置表单的宽度
        style.height=this.props.height;//设置表单的高度

        let result={
            style:style,
            columns:columns,
            columnClass:columnClass
        }
        return result;
    },
    render:function() {
        if(this.state.model  instanceof  Array ) {

        }
        else {
            return ;
        }
        let result=  this.setColumns();//得计算列的结果
        let formSubmitVisible=true;//按钮行是否可见
        if(this.state.disabled||(this.props.submitHide&&this.props.closeHide))
        {
            formSubmitVisible=false;
        }
        else {

        }
        let orderIndex=0;//表单组件在表单的序号
        return (
            <div className={"wasabi-form "+result.columnClass+" "+this.props.className } style={result.style}>
                <div  className={"form-body  "}>
                    {

                        this.state.model.map((child,index) =>{
                            let position="right";//默认都靠右

                            if(result.columns) {//需要计算列的位置
                                position = orderIndex % result.columns;//求余,计算在表单中列位置
                                if (position == 0) {
                                    position = "left";
                                }
                                else if (position == result.columns - 1) {
                                    position = "right";
                                }
                                else {
                                    position = "default";
                                }
                            }
                            var size="default";//列的大小
                            child.onlyline == true ? "onlyline" : child.size;
                            if(result.columns) {//需要计算列的大小

                                if (child.hide == true) {//如果隐藏的话，不计算序号

                                }
                                else {
                                    if (size == "default") {
                                        orderIndex++;
                                    }
                                    else if (size == "large" || size == "two") {

                                        if (result.columns == 1) {
                                            orderIndex++;//每行只有一列,算一列
                                        }
                                        else {
                                            orderIndex += 2;//算两列
                                        }

                                    }
                                    else if (size == "three") {

                                        if (result.columns == 1 || result.columns == 2) {
                                            orderIndex++;//每行只有一列或者两列,算一列
                                        }
                                        else {
                                            orderIndex += 3;//算三列
                                        }

                                    }
                                    else if (size == "onlyline") {
                                        orderIndex += result.columns;
                                    }
                                }
                            }


                            return(
                                <Input ref={child.name}
                                       key={child.name+index.toString()}
                                       {...child}
                                       position={position}
                                       readonly={this.state.disabled==true?true:child.readonly}
                                       backFormHandler={this.changeHandler}
                                ></Input>
                            );
                        })
                    }

                    <div className="clear">
                        {
                            //解决子级用css float浮动 而父级div没高度不能自适应高度
                        }
                    </div>
                </div>
                <div className="form-submit" style={{display:(formSubmitVisible==true?"block":"none")}}>
                    <Button theme={this.props.submitTheme} onClick={this.submitHandler}  title={this.props.submitTitle}  hide={this.state.disabled==true?true:this.props.submitHide==true?true:false}  >
                    </Button>
                    <Button  theme={this.props.closeTheme} onClick={this.closeHandler}  title={this.props.closeTitle}  hide={this.state.disabled==true?true:this.props.closeHide==true?true:false}   >
                    </Button>
                </div>
            </div>
        )
    }
});
module.exports=Form;