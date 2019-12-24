let React=require("react");
require("../Sass/Unit/newToolTip.css");
let ToolTip=React.createClass({
    propTypes:{
        theme:React.PropTypes.oneOf([
            "dark",
            "light",
        ]),//主题
        size:React.PropTypes.oneOf([
            "small",
            "medium",
            "large"
        ]),//大小
        direction:React.PropTypes.oneOf([
            "south",
            "west",
            "north",
            "east",
        ])//方向
    },
    getDefaultProps:function(){
        return{
           theme:"dark",
            size:"medium",
            direction:"north"
        };
    },
    getInitialState :function(){
        return{
            display:false,
            direction:this.props.direction
        };
    },
    showTipHandler:function(){
        this.setState({
            display:!this.state.display
        });
    },
    componentDidMount:function(){
        var toolTip = this.refs.tooltip;
        var target = this.refs.tipTarget;
        var tarClientRect = target.getBoundingClientRect();
        var tipWidth = toolTip.offsetWidth;
        var tarWidth = target.offsetWidth;
        var tarLeft = target.offsetLeft;
        var tipLeft = tarLeft+((tarWidth-tipWidth)/2);

        if(tarClientRect.left+tipLeft<0){
            if(this.state.direction!="west"){
                tipLeft = 0;
                toolTip.style.left = tipLeft+5+"px";
            }
        }else if(tarClientRect.left+Math.abs((tarWidth-tipWidth)/2)>=document.body.clientWidth){
            if(this.state.direction!="west") {
                tipLeft = tarLeft + (tarWidth - tipWidth);
                toolTip.style.left = tipLeft+5+"px";
            }
        }
        //判断方向位置
    },
    mouseOutHandler:function(event) {//鼠标移开时隐藏下拉
        //var parentE=event.relatedTarget;
        //while (parentE&&parentE.parentElement&&parentE.parentElement.nodeName!="BODY")
        //{
        //    if(parentE.className=="tooltip-div")
        //    {
        //        break;
        //    }
        //    parentE=parentE.parentElement;
        //}
        //if(parentE&&parentE.className!="tooltip-div")
        //{
        //  console.log(  parentE);
        //}
        //
        //if((event.relatedTarget==undefined||event.relatedTarget==null)|| ((parentE.className!="tooltip-div")))
        //{
        //    this.setState({
        //        display:"none",
        //    });
        //}

        //this.setState({
        //    display:false
        //});
    },
    render:function(){
      var className=this.props.theme+"-tooltip"+" "+this.props.theme+" "+this.props.size+" "+this.state.direction;

        var containerClassName = this.props.theme+"-tooltip "+ this.state.direction;
        var tipBodyClassName = "tip-body "+ this.props.theme+" "+ this.props.size;
        return (
            <div className="tooltip-div" onMouseLeave={this.mouseOutHandler} style={this.props.style}>
                <div ref="tipTarget" className="tooltip-button" onClick={this.showTipHandler}>{this.props.children}</div>
                <div ref="tooltip" className={containerClassName} style={{visibility:(this.state.display==true?"visible":"hidden")}}>
                    <div className={tipBodyClassName}>{this.props.content}</div>
                </div>
            </div>
        );
    }
});
module .exports=ToolTip;