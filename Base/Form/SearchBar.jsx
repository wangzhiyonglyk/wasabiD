//create by wangzy
//date:2016-04-05后开始独立改造
//desc:页面筛选条件组件
require("../../sass/Base/Form/SearchBar.scss");
var React=require("react");
var Input=require("./Input.jsx");
var Button=require("../Buttons/Button.jsx");
var unit=require("../../libs/unit.js");
var shouldComponentUpdate=require("../../Mixins/shouldComponentUpdate.js");
var SearchBar=React.createClass({
    mixins:[shouldComponentUpdate],
    propTypes: {
        model:React.PropTypes.array.isRequired,
        searchTitle:React.PropTypes.string,
        searchHide:React.PropTypes.bool,
        filterHandler:React.PropTypes.func.isRequired,
        expandHandler:React.PropTypes.func,
        width:React.PropTypes.number,

    },
    getDefaultProps:function() {
        return {
            model: [],//表单数据模型
            searchTitle:"查询",//查询按钮的标题
            searchHide:false,//是否隐藏按钮
            filterHandler: null,//提交成功后的回调事件
            className:"",
            expandHandler:null,//展开与折叠事件

        }

    },
    getInitialState:function() {
        this. allWidth=this.props.width?this.props.width:document.documentElement.clientWidth-15;//总宽度,除去滚动条

        return{
            model:(this.props.model),
            dropType:"wasabi-button wasabi-searchbar-down"//折叠按钮样式
        }
    },
    componentWillReceiveProps:function(nextProps) {
        this.setState({
        model:(nextProps.model),
        style:nextProps.style,
        className:nextProps.className,

    });
        //this.forceUpdate();//?强制刷新
    },
    changeHandler:function(value,text,name) {
        //子组件值发生改变时
        var newModel=this.state.model;
        for(var i=0;i<newModel.length;i++)
        {
            if(newModel[i].name==name)
            {
                newModel[i].value=value;
                newModel[i].text=text;
                break ;
            }
        }
        this.setState({
            model:newModel
        })
    },
    clearData:function() {//清空数据
        var newModel=this.state.model;
        for(let i=0;i<newModel.length;i++)
        {
            newModel[i].value=null;
            newModel[i].text=null;
        }
        this.setState({
            model:newModel
        })
    },
    getData:function() {
        var data={}
        for(let v in this.refs) {
            if(this.refs[v].props.type=="button")
            {
                continue;//如果按钮则跳过
            }
            if(this.refs[v].props.name.indexOf(",")>-1)
            {//含有多个字段
                var nameSplit=this.refs[v].props.name.split(",");
                if(this.refs[v].state.value&&this.refs[v].state.value!="")
                {
                    var valueSplit=this.refs[v].state.value.split(",");
                    for(let index =0;index<nameSplit.length;index++)
                    {
                        if(index<valueSplit.length)
                        {
                            data[nameSplit[index]]=valueSplit[index];
                        }
                    }

                }
                else {
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
        for(let v in this.refs)
        {
            if(this.refs[v].props.name.indexOf(",")>-1) {//含有多个字段
                var nameSplit=this.refs[v].props.name.split(",");
                if(this.refs[v].state.value&&this.refs[v].state.value!="")
                {

                    var textSplit=this.refs[v].state.text.split(",");//文本值
                    for(let index =0;index<nameSplit.length;index++)
                    {
                        if(index<textSplit.length)
                        {
                            textData[nameSplit[index]]=textSplit[index];
                        }
                    }

                }  else {
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
    onSubmit:function() {
    //筛选查询开始
        var data={};//各个字段对应的值
        var textData={};//各个字段对应的文本值
        let isva=true;
        for(let v in this.refs) {
            if(isva) {
                //验证成功，则继续验证
                isva = this.refs[v].validate();
            }else
            {//不成功则继续验证但不再回执
                this.refs[v].validate();
            }
            if(this.refs[v].props.name.indexOf(",")>-1)
            {//含有多个字段
                var nameSplit=this.refs[v].props.name.split(",");
                if(this.refs[v].state.value&&this.refs[v].state.value!="")
                {
                    var valueSplit=this.refs[v].state.value.split(",");
                    var textSplit=this.refs[v].state.text.split(",");//文本值
                    for(let index =0;index<nameSplit.length;index++)
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
                data[this.refs[v].props.name]=this.refs[v].state.value;
                textData[this.refs[v].props.name]=this.refs[v].state.text;

            }

        }
        if(isva) {
            this.props.filterHandler(data,textData);
        }
    },
    getComponentData:function(name) {//只读属性，获取对应的字段的数据源
        return JSON.parse( window.localStorage.getItem(name+"data"));
    },
    expandHandler:function() {
        var expand=false;
     if(this.state.dropType=="wasabi-button wasabi-searchbar-down") {
         this.setState({
             dropType:"wasabi-button wasabi-searchbar-up"

         });
         expand=true;
     }
        else {
         this.setState({
             dropType:"wasabi-button wasabi-searchbar-down"
         });
     }
        if(this.props.expandHandler!=null)
        {
          this.props.expandHandler(expand);
        }

    },
    setStypeAndWidth:function() {//计算样式，并把返回值


        let leftWidth=this.allWidth-125;//左侧input宽度 选项总宽度
       let columns=0;//每一行的列数
        let columnClass="";//
        let  rows=0;//行数
        if(leftWidth<=610) {//一列
            columns=1;
            columnClass="oneline";
        }
        else if(leftWidth>=611&&leftWidth<=909) {//两列
            columns=2;
            columnClass="twoline";
        }
        else if(leftWidth>=910&&leftWidth<=1229) {//三列
            columns=3;
            columnClass="threeline";
        }
        else if(leftWidth>=1230) {//四列
            columns=4;
            columnClass="fourline";
        }

        if(this.state.model.length<columns)
        {//如果列数小于计算结果
            switch (this.state.model.length)
            {
                case 1:
                    leftWidth=300;
                    columnClass="oneline";
                    columns=1;
                    break;
                case 2:
                    leftWidth=611;
                    columnClass="twoline";
                    break;
                case 3:
                    leftWidth=910;
                    columnClass="threeline";
                    break;
            }
            this.allWidth=leftWidth+125;//重新计算总宽度
            columns=  this.state.model.length;//重新计算列数
        }
        rows=Math.ceil(this.state.model.length/columns);//计算行数

        let  style=null;//样式
        if(this.props.style)
        {
           style=this.props.style;
        }else
        {
           style={};
        }
        let height=40*parseInt (this.state.model.length/4)+14;//当前高度
        if(this.state.model.length>4&&this.state.model.length % 4 > 0) {
           height = height + 40;
        }
        this.state.dropType=="wasabi-button wasabi-searchbar-down"?style.height=44:style.height=height;
        style.width=this.allWidth;
        return{
            style:style,
            leftWidth:leftWidth,
            columns:columns,
            columnClass:columnClass
        }
    },
    render:function() {
        if(  this.state.model instanceof  Array) {

        }
        else {
            return null;
        }
        var searchbarStype=this.setStypeAndWidth();
        let props={
            className:"wasabi-searchbar "+searchbarStype. columnClass+" "+this.props.className,
            style:searchbarStype.style
        };
        return (<div {...props}>
                <div  className="leftform" style={{width:searchbarStype.leftWidth}}  >
                {
                    this.state.model.map(  (child,index)=> {
                        let position=index%searchbarStype.columns;
                        if(position==0)
                        {
                            position="left";
                        }
                        else if(position==searchbarStype.columns-1)
                        {
                            position="right";
                        }
                        else {
                            position="default";
                        }
                   return(   <div className="wasabi-searchbar-item" key={index}
                                  style={{display:(this.state.dropType=="wasabi-button wasabi-searchbar-down"?((index<searchbarStype.columns)?"inline":"none"):"inline")}}><Input ref={child.name}
                              key={child.name+index.toString()}
                              {...child}
                              position={position}
                              backFormHandler={this.changeHandler}
                        ></Input></div>);

                    })
                }
            </div>
            <div className="rightbutton" >
                            <button className={this.state.dropType} style={{float:"left",display:(searchbarStype.columns<this.state.model.length)?"inline":"none"}} onClick={this.expandHandler}  ></button>
                            <Button  onClick={this.onSubmit.bind(this,"submit")} theme="green" style={{ float:"right",marginTop:((searchbarStype.columns<this.state.model.length)?-22:0),display:this.props.searchHide==true?"none":null}} title={this.props.searchTitle}   >
                                {this.props.searchTitle}
                            </Button>
                </div>
             </div>
        )
    }
});
module.exports=SearchBar;
