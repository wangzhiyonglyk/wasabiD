//create by wangzy
//date:2016-04-05后开始独立改造
//desc:表单组件
require("../../sass/Base/Form/Form.scss");
var React=require("react");
var Input=require("./Input.jsx");
var Button=require("../Buttons/Button.jsx");
var unit=require("../../libs/unit.js");
var shouldComponentUpdate=require("../../Mixins/shouldComponentUpdate.js");
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


    },
    getDefaultProps:function() {
      return {
          model: [],//表单数据模型
          width:document.body.clientWidth,//默认宽度
          height:null,//高度
          className:"" ,//自定义样式
          disabled:false,//是否只读
          submitTitle:"提交",//提交按钮标题
          closeTitle:"关闭",//关闭按钮标题
          submitHide:false,//提交按钮是否隐藏
          closeHide:false,//关闭按钮是否隐藏
          submitHandler: null,//提交成功后的回调事件
          closeHandler:null,//关闭事件的回调事件

      }

    },
    getInitialState:function() {
        return{
            model:(this.props.model),//一定复制
            pickerRowModel:new Map(),//下拉框中选中的完整数据
            disabled:this.props.disabled

        }
    },
    componentWillReceiveProps:function(nextProps) {
        this.setState({
            model:( nextProps.model),
            disabled:nextProps.disabled
        })
    },
    changeHandler:function(value,text,name,data) {
        //子组件值发生改变时
      var newModel=this.state.model;
        var pickerRowModel=this.state.pickerRowModel;
        for(var i=0;i<newModel.length;i++)
        {
            if(newModel[i].name==name)
            {
                newModel[i].value=value;
                newModel[i].text=text;
                if(newModel[i].type=="select"||(newModel[i].type=="picker"))
                {
                    pickerRowModel.set(newModel[i].name,data);

                }
                break ;
            }
        }
        this.setState({
            model:newModel,
            pickerRowModel:pickerRowModel
        })
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
                //验证成功，则继续验证
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
    render:function() {
        if(this.state.model  instanceof  Array ) {

        }
        else {
            return ;
        }
        var style={};
        if(this.props.style)
        {
            style=this.props.style;
        }
        let rows=0;//行数
        let columns=0;//每一行的列数
        let  allwidth=this.props.width?this.props.width:document.body.clientWidth;//总宽度
        let allheight=0;//表单总高度
        let columnClass="";//列样式
        if(allwidth<=610) {//一列
            columns=1;
            columnClass="oneline";
        }
        else if(allwidth>=611&&allwidth<=909) {//两列
            columns=2;
            columnClass="twoline";
        }
        else if(allwidth>=910&&allwidth<=1229) {//三列
            columns=3;
            columnClass="threeline";
        }
        else if(allwidth>=1230) {//四列
            columns=4;
            columnClass="fourline";
        }
        if(this.state.model.length==1)
        {
            columns=1;
            columnClass="oneline";
        }
        rows=Math.ceil(this.state.model.length/columns);//计算行数
        allheight=rows*44;
        let formSubmitVisible=true;
        if(this.state.disabled||(this.props.submitHide&&this.props.closeHide))
        {
            formSubmitVisible=false;
        }
        else {
            allheight+=50;//加上按钮的高度
        }
        style.width=allwidth;//设置表单的宽度
        style.height=this.props.height!=null?this.props.height: allheight;//设置表单的高度


        let virtualIndex=0;//表单组件在表单的虚拟下标,用于计算在表单中的位置
        return (
            <div className={"wasabi-form "+columnClass+" "+this.props.className } style={style}>
                        <div  className={"form-body  "}>
                            {

                                this.state.model.map((child,index) =>{

                                  let position=virtualIndex%columns;//计算在表单中的位置
                                    if(position==0)
                                    {
                                        position="left";
                                    }
                                    else if(position==columns-1)
                                    {
                                        position="right";
                                    }
                                    else {
                                        position="default";
                                    }
                                    var size=child.onlyline==true?"onlyline":child.size;//组件大小
                                    if(size=="default")
                                    {
                                        virtualIndex++;
                                    }
                                    else if(size=="large")
                                    {

                                        if(columns==1)
                                        {
                                            virtualIndex++;//每行只有一列
                                        }
                                        else {
                                            virtualIndex+=2;
                                        }

                                    }
                                    else if(size=="onlyline")
                                    {
                                        virtualIndex+=columns;
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

                        </div>
                        <div className="form-submit" style={{display:(formSubmitVisible==true?"block":"none")}}>
                    <Button theme="green" onClick={this.submitHandler} title={this.props.submitTitle}  hide={this.state.disabled==true?true:this.props.submitHide==true?true:false}  >
                    </Button>
                    <Button  theme="cancel" onClick={this.closeHandler}  title={this.props.closeTitle}  hide={this.state.disabled==true?true:this.props.closeHide==true?true:false}   >
                    </Button>
                </div>
                </div>
        )
    }
});
module.exports=Form;