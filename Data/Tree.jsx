/*
create by wangzhiyong 创建树组件

 */

let React=require("react");
require("../Sass/Data/Tree.scss");
let TreeNode=require("./TreeNode.jsx");
let unit=require("../libs/unit.js");
var showUpdate=require("../Mixins/showUpdate.js");
let Tree=React.createClass({
    mixins:[showUpdate],
    propTypes: {
            name:React.PropTypes.string,//树名称
             value:React.PropTypes.oneOfType([React.PropTypes.number,React.PropTypes.string]),//值
            text:React.PropTypes.oneOfType([React.PropTypes.number,React.PropTypes.string]),//标题
            valueField: React.PropTypes.string,//数据字段值名称
            textField:React.PropTypes.string,//数据字段文本名称
            url:React.PropTypes.string,//后台查询地址
            params:React.PropTypes.object,//向后台传输的额外参数
            dataSource:React.PropTypes.string,//ajax的返回的数据源中哪个属性作为数据源,为null时直接后台返回的数据作为数据源
            data:React.PropTypes.array,//节点数据
            onSelect:React.PropTypes.func,//选中后的事件

        },
    getDefaultProps:function() {
        return {
            name:null,
            text:null,
            value:null,
            valueField:"value",
            textField:"text",
            url:null,
            params:null,
            dataSource:"data",
            data:[],
            onSelect:null,
        }
    },
    getInitialState(){
        var newData=  this.setValueAndText(this.props.data);//对数据进行处理
        return {
            name:this.props.name,
            text: this.props.text,
            value: this.props.value,
            data:newData,
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
        if(nextProps.data!=null&&nextProps.data instanceof  Array &&(!nextProps.url||nextProps.url=="")) {//没有url,传的是死数据
            newData=[];
            //因为这里统一将数据进行了改造,所以这里要重新处理一下
            newData=  this.setValueAndText(nextProps.data);

        }
        else {//url形式
            newData = this.state.data;//先得到以前的数据
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
            url:nextProps.url,
            params:unit.clone( nextProps.params),
        })

    },
    componentDidUpdate:function() {
        if(this.isChange==true)
        {//说明已经改变了,回传给父组件
            if( this.props.onSelect!=null)
            {
                this.props.onSelect(this.state.value,this.state.text,this.props.name,this.property);
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
            console.log("treepicker",fetchmodel);
        }
    },
    loadSuccess:function(data) {//数据加载成功
        var realData=data;
        if(this.props.dataSource==null) {
        }
        else {
            realData=unit.getSource(data,this.props.dataSource);
        }

        realData=this.setValueAndText(realData);
        this.setState({
            data:realData,
        })
    },
    setValueAndText:function (realData) {//遍历设置text，value的值
        if(realData instanceof  Array) {
            for (let i = 0; i < realData.length; i++) {
                realData[i].text = realData[i][this.props.textField];
                realData[i].value = realData[i][this.props.valueField];
                if (realData[i].data) {
                    realData[i].data = this.setValueAndText(realData[i].data);
                }
            }

        }

        return realData;
    },
    loadError:function(errorCode,message) {//查询失败
        console.log("treepicker-error",errorCode,message);
        Message. error(message);
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
    render:function () {
        var nodeControl=[];
        if(this.state.data instanceof  Array)
        {
            this.state.data.map((item,index)=>{
                let isParent=false;//是否为父节点
                if(item.isParent==true||(item.data instanceof Array && item.data.length > 0)) {//如果明确规定了，或者子节点不为空，则设置为父节点
                    isParent = true;
                }
                else {

                }
                nodeControl.push(<TreeNode key={index} rootValue={this.state.value} rootText={this.state.text} {...item} isParent={isParent} onSelect={this.onSelect} />);
            });
        }
        return <ul className="wasabi-tree">
            {nodeControl}
        </ul>
    }
})
module.exports=Tree;