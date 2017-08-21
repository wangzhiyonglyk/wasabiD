//create by wangzy
//date:2016-02-18
//标签页组
require("../sass/Layout/Tabs.scss");
var React =require("react");
var addRipple=require("../Mixins/addRipple.js");
var Tabs=React.createClass({
      mixins:[addRipple],
        propTypes:{
            theme: React.PropTypes.oneOf([//主题
                "primary",
                "default",
               
            ]),
            activeIndex:React.PropTypes.number,
        },
        getDefaultProps: function () {
            return {
                theme:"default",
                activeIndex:0,

            }
        }
        , getInitialState: function () {
            
         return {   activeIndex:this.props.activeIndex}
    },
        componentWillReceiveProps:function (nextProps)
        {
           
            this.setState({
                activeIndex:nextProps.activeIndex!=null&&nextProps.activeIndex!=undefined?nextProps.activeIndex:0
            })
        },
        tabClickHandler:function(index,event) {

            this.rippleHandler(event);
            //页签单击事件
           this.setState({
               activeIndex:index
           })
        },
        render: function () {
            return (
                <div className="wasabi-tabs" >
                    <div  >
                        {
                            
                            React.Children.map(this.props.children, (child, index) => {
                              
                                return    <a key={index} href="javascript:void(0);"  onClick={this.tabClickHandler.bind(this,index)} className={"wasabi-tab "+this.props.theme+" "+(this.state.activeIndex==index?"active ":"")} >{child.props.title}</a>
                            })
                        }
                    </div>
                    { 
                            React.Children.map(this.props.children, (child, index) => {
                               
                            return  <div key={index} style={this.props.style} className={"section  "+this.props.theme+ " "+(index==this.state.activeIndex?"active":"")}  >
                      {child}
                       </div>
                        })
                        }
                   
                </div>)

        }
    }
);
module.exports=Tabs;
