/*
 create by wangzhiyong
 date:2016-12-19
 */
let React=require("react");
require("../Sass/Data/Transfer.scss");
let unit=require("../libs/unit.js");
let LinkButton=require("../Buttons/LinkButton.jsx");
var showUpdate=require("../Mixins/showUpdate.js");

let Transfer=React.createClass({
    mixins:[showUpdate],
    propTypes: {
        name:React.PropTypes.string,//名称
        valueField: React.PropTypes.string,//数据字段值名称
        textField:React.PropTypes.string,//数据字段文本名称
        url:React.PropTypes.string,//后台查询地址
        params:React.PropTypes.object,//向后台传输的额外参数
        dataSource:React.PropTypes.string,//ajax的返回的数据源中哪个属性作为数据源,为null时直接后台返回的数据作为数据源
        data:React.PropTypes.array,//节点数据
        selectData:React.PropTypes.array,//选中的数据
        onSelect:React.PropTypes.func,//选中后的事件

    },
    getDefaultProps:function() {
        return {
            name:null,
            valueField:"value",
            textField:"text",
            url:null,
            params:null,
            dataSource:"data",
            data:[],
            selectData:[],

            onSelect:null,
        }
    },
    getInitialState(){
        var realData= this.setValueAndText(this.props.data);

        var realSelectData= this.setValueAndText(this.props.selectData);

        return {
            name:this.props.name,
            data:realData,
            selectData:realSelectData,
            leftOnIndex:null,//左边被点中的数据
            rightOnIndex:null,//右边被点中的数据
            onSelect: this.props.onSelect,
        }
    },
    componentWillReceiveProps:function(nextProps) {
        /*
         this.isChange :代表自身发生了改变,防止父组件没有绑定value,text,而导致无法选择
         */
        this.isChange=false;//重置
        var value=this.isChange?this.state.value: nextProps.value;
        var text = this.isChange?this.state.text: nextProps.text;
        var newData = [];
        var selectData = [];
        if(nextProps.data!=null&&nextProps.data instanceof  Array &&(!nextProps.url||nextProps.url=="")) {//没有url,传的是死数据
            //因为这里统一将数据进行了改造,所以这里要重新处理一下
            newData=  this.setValueAndText(nextProps.data);
            selectData= this.setValueAndText(nextProps.selectData);
        }
        else {//url形式
            newData = this.state.data;//先得到以前的数据
            selectData = this.state.selectData;//先得到以前的数据
            if (this.showUpdate(nextProps.params)) {//如果不相同则更新
                this.loadData(this.props.url, nextProps.params);//异步更新
            }
            else {

            }
        }

        this.setState({
            value:value,
            text:text,
            data: newData,
            selectData: selectData,
            url:nextProps.url,
            params:unit.clone( nextProps.params),
        })

    },
    componentDidUpdate:function() {
        if(this.isChange==true)
        {//说明已经改变了,回传给父组件
            if( this.props.onSelect!=null)
            {
                this.props.onSelect(this.state.data,this.state.selectData);
            }
        }
    },
    componentDidMount:function () {
        this.loadData(this.state.url,this.state.params);
    },
    loadData:function(url,params) {
        if(url!=null&&url!="")
        {
            if(params==null)
            {
                var fetchmodel=new FetchModel(url,this.loadSuccess,null,this.loadError);
                unit.fetch.get(fetchmodel);
            }
            else

            {
                var fetchmodel=new FetchModel(url,this.loadSuccess,params,this.loadError);
                unit.fetch.post(fetchmodel);
            }
            console.log("transfer",fetchmodel);
        }
    },
    loadSuccess:function(data) {//数据加载成功
        var realData = data;
        if (this.props.dataSource == null) {
        }
        else {
            realData = unit.getSource(data, this.props.dataSource);
        }
        if (realData instanceof Array) {
            for (let i = 0; i < realData.length; i++) {
                realData[i].text = realData[i][this.props.textField];
                realData[i].value = realData[i][this.props.valueField];

            }
        }
        this.setState({
            data: realData,
        })
    },
    loadError:function(errorCode,message) {//查询失败
        console.log("treepicker-error",errorCode,message);
        Message. error(message);
    },
    setValueAndText:function (realData) {//设置text，value的值
        if(realData instanceof  Array) {
            for (let i = 0; i < realData.length; i++) {
                realData[i].text = realData[i][this.props.textField];
                realData[i].value = realData[i][this.props.valueField];

            }

        }

        return realData;
    },
    onSelect:function (value,text,property) {
        this.isChange=true;//代表自身发生了改变,防止父组件没有绑定value,text的状态值,而导致无法选择的结果
        this.property=property;//临时保存起来
        if(value==undefined)
        {
            console.error("绑定的valueField没有")
        }
        if(text==undefined)
        {
            console.error("绑定的textField没有");
        }
        this.setState({
            value:value,
            text:text
        })
    },
    itemClickHandler:function (type,index) {
        if (type == "left") {
            if (this.ctrl) {//多选
                var leftOnIndex = [];
                if (this.state.leftOnIndex instanceof Array) {
                    leftOnIndex = this.state.leftOnIndex;
                }
                else if (this.state.leftOnIndex) {
                    leftOnIndex.push(this.state.leftOnIndex);
                }
                if (leftOnIndex.indexOf(index) > -1) {
                    leftOnIndex.splice(leftOnIndex.indexOf(index),1);
                }
                else {
                    leftOnIndex.push(index);
                }
                if(leftOnIndex.length==0)
                {//没有选择
                    leftOnIndex=null;
                }
                else if(leftOnIndex.length==1)
                {//只选择了一个
                    leftOnIndex=leftOnIndex[0];
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
                var rightOnIndex = [];
                if (this.state.rightOnIndex instanceof Array) {
                    rightOnIndex = this.state.rightOnIndex;
                }
                else if (this.state.rightOnIndex) {
                    rightOnIndex.push(this.state.rightOnIndex);
                }
                if (rightOnIndex.indexOf(index) > -1) {
                    rightOnIndex.splice(rightOnIndex.indexOf(index),1);
                }
                else {
                    rightOnIndex.push(index);
                }
                if(rightOnIndex.length==0)
                {//没有选择
                    rightOnIndex=null;
                }
                else if(rightOnIndex.length==1)
                {//只选择了一个
                    rightOnIndex=rightOnIndex[0];
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
    },
    itemDblClickHandler:function (direction,indexArray) {
        if(indexArray==null)
        {
            return;
        }
        else
        {
            if(indexArray instanceof  Array)
            {//按住了ctrl键

                if (direction == "right") {//向右
                    var data = [];
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
                    var selectData=[];
                    this.state.selectData.map((item,index)=>{
                        if(indexArray.indexOf(index)>-1)
                        {
                            this.state.data.push(item);
                        }
                        else
                        {
                            selectData.push(item);
                        }
                    });
                    this.state.selectData=selectData;
                }
            }
            else
            {
                if (direction == "right") {//向右
                    this.state.selectData.push(this.state.data.splice(indexArray,1)[0]);


                }
                else {
                    this.state.data.push(this.state.selectData.splice(indexArray,1)[0]);

                }

            }

            this.isChange=true;//是否需要回传父组件，因为index不需要回传给父组件，所以组件本身先更新再回传
            this.setState({
                data: this.state.data,
                selectData:this.state.selectData,
                leftOnIndex:null,
                rightOnIndex:null,
            })
        }

    },
    itemUpHandler:function () {//向上
        if(this.state.leftOnIndex&&!(this.state.leftOnIndex instanceof  Array)) {//左边

            this.state.data.splice(this.state.leftOnIndex-1,2,this.state.data[this.state.leftOnIndex],this.state.data[this.state.leftOnIndex-1]);

            this.isChange=true;//是否需要回传父组件，因为index不需要回传给父组件，所以组件本身先更新再回传
            this.setState({
                data:this.state.data,
                leftOnIndex:this.state.leftOnIndex-1,
                rightOnIndex:null,
            })
        }
        else   if(this.state.rightOnIndex&&!(this.state.rightOnIndex instanceof  Array)){//右边
            this.state.selectData.splice(this.state.rightOnIndex-1,2,this.state.selectData[this.state.rightOnIndex],this.state.selectData[this.state.rightOnIndex-1]);
            this.isChange=true;//是否需要回传父组件，因为index不需要回传给父组件，所以组件本身先更新再回传
            this.setState({
                selectData:this.state.selectData,
                leftOnIndex:null,
                rightOnIndex:this.state.rightOnIndex-1
            })
        }
    },
    itemDownHandler:function () {//向下
        if(this.state.leftOnIndex!=null&&!(this.state.leftOnIndex instanceof  Array)&&this.state.leftOnIndex<this.state.data.length-1) {//左边

            this.state.data.splice(this.state.leftOnIndex,2,this.state.data[this.state.leftOnIndex+1],this.state.data[this.state.leftOnIndex]);
            this.setState({
                data:this.state.data,
                leftOnIndex:this.state.leftOnIndex+1,
                rightOnIndex:null,
            })
        }
        else  if(this.state.rightOnIndex!=null&&!(this.state.rightOnIndex instanceof  Array)&&this.state.rightOnIndex<this.state.selectData.length-1){//右边
            this.state.selectData.splice(this.state.rightOnIndex,2,this.state.selectData[this.state.rightOnIndex+1],this.state.selectData[this.state.rightOnIndex]);
            this.setState({
                selectData:this.state.selectData,
                leftOnIndex:null,
                rightOnIndex:this.state.rightOnIndex+1,
            })
        }
    },
    onKeyDown:function (event) {

        if (event.keyCode == 17 || event.keyCode == 91) {
            this.ctrl = true;
            this.refs.up.setDisabled(true);
            this.refs.down.setDisabled(true);
        }
        else
        {

        }

    },
    onKeyUp:function () {
        this.ctrl = false;
        if(this.state.leftOnIndex instanceof Array||this.state.rightOnIndex instanceof Array)
        {

        }
        else
        {
            this.refs.up.setDisabled(false);
            this.refs.down.setDisabled(false);
        }

    },
    onMouseOver:function (event) {
        this.refs.transfer.focus();
    },
    render:function () {

        var leftControl=[];
        var rightControl=[];
        this.state.data.map((item,index)=>{
            leftControl.push( <li className={(this.state.leftOnIndex==index||(this.state.leftOnIndex instanceof  Array&&this.state.leftOnIndex.indexOf(index)>-1))?"on":""} key={index} onDoubleClick={this.itemDblClickHandler.bind(this,"right",index)} onClick={this.itemClickHandler.bind(this,"left",index)}>{item.text}</li>);
        })
        this.state.selectData.map((item,index)=>{
            rightControl.push(<li className={(this.state.rightOnIndex==index||(this.state.rightOnIndex instanceof  Array&&this.state.rightOnIndex.indexOf(index)>-1))?"on":""} key={index} onDoubleClick={this.itemDblClickHandler.bind(this,"left",index)}  onClick={this.itemClickHandler.bind(this,"right",index)}>{item.text}</li>);
        })
        return<div className="wasabi-transfer" ref="transfer" tabIndex="0" onKeyUp={this.onKeyUp} onKeyDown={this.onKeyDown} onMouseOver={this.onMouseOver}>
            <ul className="wasabi-transfer-left">
                {leftControl}
            </ul>
            <div className="wasabi-transfer-middle">
                <LinkButton name="up" title="向上" iconCls={"icon-up"} onClick={this.itemUpHandler} ref="up" disabled={(this.state.leftOnIndex instanceof Array||this.state.rightOnIndex instanceof Array)?true:false}/>
                <LinkButton name="down" title="向下" iconCls={"icon-down"} onClick={this.itemDownHandler} ref="down" disabled={(this.state.leftOnIndex instanceof Array||this.state.rightOnIndex instanceof Array)?true:false}/>
                <LinkButton name="right" title="向右" iconCls={"icon-right"} onClick={this.itemDblClickHandler.bind(this,"right",this.state.leftOnIndex)}/>
                <LinkButton name="left" title="向左" iconCls={"icon-left"} onClick={this.itemDblClickHandler.bind(this,"left",this.state.rightOnIndex)}/>

            </div>
            <ul className="wasabi-transfer-right">
                {rightControl}
            </ul>
        </div>
    }
})
module.exports=Transfer;