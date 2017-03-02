//create by wangzy
//date:2016-04-05后开始独立改造
//标签页
var React =require("react");
var addRipple=require("../Mixins/addRipple.js");
var MenuTab=React.createClass({
        mixins:[addRipple],
        propTypes:
            {
                index:React.PropTypes.number.isRequired,//在父组件中的序号，用于关闭
                title:React.PropTypes.string.isRequired,//标题
                iconCls:React.PropTypes.string,//图标
                url:React.PropTypes.string,//子页面地址
                active:React.PropTypes.bool,//是否为激活状态
                clickHandler:React.PropTypes.func.isRequired,//激活后的回调事件,
                closeHandler:React.PropTypes.func.isRequired,//页面关闭事件
                hide:React.PropTypes.bool,//是否隐藏,由于过多导致的这个属性

            },
        getDefaultProps:function()
        {
            return {
                active:false,
                iconCls:null,
                hide:false,
            }
        },
        getInitialState() {
            return {
                active:this.props.active,
                hide:this.props.hide,
            }
        },
        componentWillReceiveProps(nextProps) {
            var props={...nextProps};
            this.setState(props);
        },
        clickHandler:function(event) {
            this.rippleHandler(event);
            if(event.target.nodeName=="A"||event.target.className=="text"||event.target.className=="icon")
            {
                this.props.clickHandler(this.props.index);
            }
        },
        closeHandler:function(event)
        {
            if(this.props.closeHandler) {
                this.props.closeHandler(this.props.index);
            }

        },
        render: function () {
            return (
                <li className ={this.state.active?"active":""} style={{display:this.state.hide?"none":"inline-block"}}  title="双击可以关闭">
                    <a onDoubleClick={this.closeHandler}  onClick={this.clickHandler} >
                        <div className={"icon "+this.props.iconCls} style={{width:(this.props.iconCls==null?5:null)}}></div>
                        <div className={this.props.title=="首页"?"":"closeicon icon-close"} onClick={ this.closeHandler}></div>

                        <div className="text" title={this.props.title} >{this.props.title}</div>
                        <div className="split"></div>
                    </a></li>
            )
        }
    }
);
module .exports=MenuTab;