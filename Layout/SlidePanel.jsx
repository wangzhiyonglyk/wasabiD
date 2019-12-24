/*
滑动面板
create by wangzy
date:2016-04-05
desc:滑动面板
*/
let React=require("react");
require("../Sass/Layout/SlidePanel.css");
var Toolbar=require("../Buttons/Toolbar.jsx");
var Button=require("../Buttons/Button.jsx");
class SlidePanel extends  React.Component{
    constructor(props) {
        super(props);
        let width=(this.props.style&&this.props.style.width)?this.props.style.width:window.screen.availWidth;
       
        this.state={
            width:width,
            title:this.props.title,
            buttons:this.props.buttons,
            buttonClick:this.props.buttonClick,
            panelwidth:0,//总宽度
            containerwidth:0,//容器宽度
            leftwidth:0,//左侧滑块宽度
            rightwidth:0,//右侧内容宽度
            overlayOpacity:0,//遮盖层透明度
        }
        this.slideHandler=this.slideHandler.bind(this);
        this.buttonClick=this.buttonClick.bind(this);

    }
    static propTypes= {
        title: React.PropTypes.string,//标题
        buttons: React.PropTypes.array,//自定义按钮
        buttonClick: React.PropTypes.func,//按钮的单击事件,
    }
    static defaultProps={
        title:"",
        buttons:[],
        buttonClick:null,
        url:null
    }
    componentWillReceiveProps(nextProps)
    {
        let width=(nextProps.style&&nextProps.style.width)?nextProps.style.width:this.state.width;
        
        this.setState({...nextProps,
            width:width
        });
    }

     open() {//打开事件，用于外部调用
       this.slideHandler();
   }
    close() {//关闭事件,用于外部调用
        this.slideHandler();
    }
    slideHandler() {
        if(this.state.panelwidth!=0)
        {//关闭时，外面宽度等过渡效果完成后再设置
            this.setState({
                containerwidth: this.state.containerwidth == 0 ? this.state.width - 34 : 0,
                overlayOpacity:this.state.overlayOpacity==0?0.5:0
            });
            setTimeout(()=>{
                this.setState({
                    panelwidth:0
                })
            },700);//过渡效果结束后立即关闭
        }
       else
        {//打开时，立即将外面宽度设置
            this.setState({
                containerwidth: this.state.containerwidth == 0 ? this.state.width - 34 : 0,
                overlayOpacity:this.state.overlayOpacity==0?0.5:0,
                panelwidth:this.state.width
            });
        }

    }
    buttonClick(name,title) {
        if (this.state.buttonClick != null) {
            this.state.buttonClick(name, title);
        }
    }
    render() {
        let style=this.props.style?this.props.style:{};
        style.width=this.state.panelwidth;
            return <div className={"wasabi-slidepanel "}  style={style}>
                <div className="slide-overlay" style={{width:this.state.panelwidth,opacity:this.state.overlayOpacity}}></div>
                <div className="slide-container" style={{width:this.state.containerwidth}}>

                        <div className="slide-header">
                            <div className="title">{this.state.title}</div>


                        </div>
                        <div className="slide-body">
                            {
                                this.props.children
                            }

                        </div>
                    <div className="slide-footer">

                            <div className="slide-toolbar"><Toolbar buttons={this.state.buttons} buttonClick={this.buttonClick}></Toolbar></div>
                        <div className="slide-close">
                            <Button name="close" title="关闭" onClick={this.slideHandler}></Button>
                        </div>


                    </div>
                </div>
            </div>
        }
    };
module.exports=SlidePanel;