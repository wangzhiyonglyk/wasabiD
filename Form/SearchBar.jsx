//create by wangzy
//date:2016-04-05后开始独立改造
//desc:页面筛选条件组件
require("../Sass/Form/SearchBar.scss");
var React=require("react");
var Input=require("./Input.jsx");
var Button=require("../Buttons/Button.jsx");
var unit=require("../libs/unit.js");
var shouldComponentUpdate=require("../Mixins/shouldComponentUpdate.js");
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
            width:null,
        }

    },
    getInitialState:function() {
        //初始化时就获取可用宽度,如果每次更新获取,会产生晃动
        if(window.screen.availWidth<document.documentElement.clientWidth)
        {//屏幕可用宽度小,有滚动条
            this.availWidth=window.screen.availWidth;
        }
        else {
            //没有滚动条
            this.availWidth=window.screen.availWidth-50;//防止后期出现滚动条,而产生样式变形,先减去滚动条宽度
        }

        return{
            model:(this.props.model),
            dropType:"wasabi-button wasabi-searchbar-down"//折叠按钮样式
        }
    },
    componentWillReceiveProps:function(nextProps) {
        //屏幕可用宽度,


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
    setColumns:function () {//计算列数及样式
        var style={};//表单栏样式
        if(this.props.style)
        {
            style=this.props.style;
        }

        let columns=0;//每一行的列数
        //表单实际宽度
        let  actualWidth=this.props.width?this.props.width:this.availWidth;//总宽度

        let leftWidth=actualWidth-130;//左侧表单宽度

        let columnClass="";//列样式
        if(this.state.columns)
        {//如果自定义了,则以自定义为标准
            columns=this.state.columns;
        }
        else {//否则自动计算
            if (leftWidth <= 610) {//一列
                columns = 1;

            }
            else if (leftWidth >= 611 && leftWidth <= 909) {//两列
                columns = 2;

            }
            else if (leftWidth >= 910 && leftWidth <= 1229) {//三列
                columns = 3;

            }
            else if (leftWidth >= 1230) {//四列
                columns = 4;

            }
        }
        if(this.state.model.length<columns) {//如果数据小于列数
            columns = this.state.model.length;
            if(columns<=2)
            {//如果只有两列的话,重新定义宽度
                actualWidth=800;
                leftWidth=actualWidth-130;

            }
        }
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
        style.width=actualWidth;//设置表单的宽度

        this.state.dropType=="wasabi-button wasabi-searchbar-down"?style.height=54:style.height=null;//判断高度

        let result={
            style:style,
            columns:columns,
            columnClass:columnClass,
            leftWidth:leftWidth
        }

        return result;
    },

    render:function() {
        if(  this.state.model instanceof  Array) {

        }
        else {
            return null;
        }
        var result=this.setColumns();//得计算列的结果
        let props={
            className:"wasabi-searchbar "+result. columnClass+" "+this.props.className,
            style:result.style
        };
        let orderIndex=0;//表单组件在表单的序号,
        return (<div {...props}>
                <div  className="leftform" style={{width:result.leftWidth}}  >
                    {
                        this.state.model.map((child,index) =>{
                            let position=orderIndex%result.columns;//求余,计算在表单中列位置
                            if(position==0)
                            {
                                position="left";
                            }
                            else if(position==result.columns-1)
                            {
                                position="right";
                            }
                            else {
                                position="default";
                            }
                            var size=child.onlyline==true?"onlyline":child.size;//组件大小
                            if(size=="default")
                            {
                                orderIndex++;
                            }
                            else if(size=="large"||size=="two")
                            {

                                if(result.columns==1)
                                {
                                    orderIndex++;//每行只有一列,算一列
                                }
                                else {
                                    orderIndex+=2;//算两列
                                }

                            }
                            else if(size=="three")
                            {

                                if(result.columns==1||result.columns==2)
                                {
                                    orderIndex++;//每行只有一列或者两列,算一列
                                }
                                else {
                                    orderIndex+=3;//算三列
                                }

                            }
                            else if(size=="onlyline")
                            {
                                orderIndex+=result.columns;
                            }
                            //因为orderIndex代表的是下一个序号,所以要小于等于来判断是否隐藏

                            return(  <div className="wasabi-searchbar-item" key={(orderIndex)}
                                          style={{display:(this.state.dropType=="wasabi-button wasabi-searchbar-down"?(((orderIndex)<=result.columns)?"inline":"none"):"inline")}}>
                                    <Input ref={child.name}
                                           key={child.name+index.toString()}
                                        {...child}
                                           position={position}
                                           readonly={this.state.disabled==true?true:child.readonly}
                                           backFormHandler={this.changeHandler}
                                    ></Input></div>
                            );
                        })
                    }
                    <div className="clear">
                        {
                            //解决子级用css float浮动 而父级div没高度不能自适应高度
                        }
                    </div>
                </div>
                <div className="rightbutton" >
                    <button className={this.state.dropType} style={{float:"left",display:(result.columns<this.state.model.length)?"inline":"none"}} onClick={this.expandHandler}  ></button>
                    <Button  onClick={this.onSubmit.bind(this,"submit")} theme="green" style={{ float:"right",marginTop:((result.columns<this.state.model.length)?-22:0),display:this.props.searchHide==true?"none":null}} title={this.props.searchTitle}   >
                        {this.props.searchTitle}
                    </Button>
                </div>
                <div className="clear">
                    {
                        //解决子级用css float浮动 而父级div没高度不能自适应高度
                    }
                </div>
            </div>
        )
    }
});
module.exports=SearchBar;
