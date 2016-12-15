/**
 * Created by wangzhiyong on
 * date:2016-04-05后开始独立改造
 * desc:按钮工具栏
 */
var React=require("react");
require("../Sass/Buttons/Toolbar.scss");
var LinkButton=require("./LinkButton.jsx");
var Button=require("./Button.jsx");
var Toolbar=React.createClass({
    propTypes: {
        buttons:React.PropTypes.array.isRequired,
        type:React.PropTypes.oneOf([//主题
            "button",
            "link",
            ]),
        buttonClick:React.PropTypes.func.isRequired
    },
    getDefaultProps:function() {
        return{
            buttons:[],
            type:"button",
            className:"",
        }
    },
    buttonClick:function(name,title) {
      this.props.buttonClick(name,title);//执行父组件的事件
    },
    render: function () {
        let props={
            className:this.props.className+" "+"wasabi-toolbar",
            style:this.props.style
        };
        var buttonlist = [];
        if (this.props.buttons != null) {
            this.props.buttons.map((child)=> {
                if(this.props.type=="button")
                {
                    buttonlist.push(
                        <Button key={child.name} {...child} onClick={this.buttonClick.bind(this,child.name,child.title)}>
                        </Button>);
                }
                else
                {
                    buttonlist.push(
                        <LinkButton key={child.name} {...child} onClick={this.buttonClick.bind(this,child.name,child.title)}>
                        </LinkButton>);
                }

            });
        }
        return (
            <div  {...props}>
                {buttonlist}
            </div>

        )
    }
});

module.exports=Toolbar;