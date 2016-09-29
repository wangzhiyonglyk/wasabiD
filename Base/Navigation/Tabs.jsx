//create by wangzy
//date:2016-02-18
//标签页组
require("../../sass/Base/Layout/Tabs.scss");
var React =require("react");
var Tabs=React.createClass(
    {

        propTypes:{
            tabs:React.PropTypes.array.isRequired,
            theme: React.PropTypes.oneOf([//主题
                "primary",
                "default",
                "green"
            ])
        },
        getDefaultProps: function () {
            return {
                tabs: [],
                theme:"default",
            }
        }
        , getInitialState: function () {
        //这里似乎无法复制，因为content属性是jsx对象，但似乎不影响使用
        return {
            tabs: this.props.tabs
        };
    },
        componentWillReceiveProps:function (nextProps)
        {
            this.setState({
                tabs:nextProps.tabs
            })
        },
        tabClickHandler:function(index) {
            //页签单击事件
            var newTabs = this.state.tabs;
            for (var i = 0; i < newTabs.length; i++) {
                if (i == index) {
                    newTabs[index].active = true;
                }
                else {
                    newTabs[i].active = false;
                }
            }
            this.setState({tabs: newTabs});
        },
        render: function () {
            return (

                <div className="wasabi-tabs" style={this.props.style}>
                    <div  >
                        {
                            this.state.tabs.map((child,i)=>{
                                return    <a key={i} href="javascript:void(0);" onClick={this.tabClickHandler.bind(this,i)} className={"wasabi-tab "+this.props.theme+" "+(child.active==true?"active ":"")} >{child.title}</a>
                            })
                        }
                    </div>
                    <div  className={"section "+this.props.theme} >
                        {this.state.tabs.map((child, i)=> {
                            return (<div key={i}  className={(child.active==true?"active":"")}>{child.content}</div>);
                        })
                        }
                    </div>
                </div>)

        }
    }
);
module.exports=Tabs;
