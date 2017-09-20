//create by wangzy
//date:2016-03-22
//desc:模态窗口
var React=require("react");
require("../Sass/Layout/resize.scss");
var Resize=React.createClass({
    propTypes: {
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        left:React.PropTypes.number,
        top:React.PropTypes.number,
        onlyWidth:React.PropTypes.bool,//是否只允许改变宽度
        className:React.PropTypes.string,
        resize:React.PropTypes.bool,//属性内部使用
    },
    getDefaultProps:function() {
        return{
         width:700,
            height:500,
            left:0,
            top:0,
            onlyWidth:false,
            className:"",
            resize:true,//默认是可以改变大小的
        }

    },
    getInitialState:function() {
        return{
            oldClientX:null,
            oldCllientY:null,
            width:this.props.width,
            oldwidth:this.props.width,
            height:this.props.height,
            oldheight:this.props.height,
            min:8
        }
    },
    componentWillReceiveProps:function(nextProps) {

    },
    componentDidMount:function() {//设置鼠标事件
        if(this.props.resize){
            //允许改变大小

            document.onmousemove=this.mouseMoveHandler;
            document.onmouseup=this.mouseUpHandler;
            document.onmousedown=this.mouseDownHandler;
        }

    },
    mouseDownHandler:function(event) {
        //鼠标按下事件,保存鼠标位置
       var dir=this.getDirection(event);
        if(dir!="")
        {
            this.setState({
                oldClientX:event.clientX,
                oldClientY:event.clientY,
            })
        }
        else
        {
            this.setState({
                oldClientX:null,
                oldClientY:null,
            })
        }
      //取消默认事件
        //window.event.returnValue = false;
  //window.event.cancelBubble = true;
    },
    mouseUpHandler:function() {
        //鼠标松开事件
        this.setState({
            oldClientX:null,
            oldwidth:this.state.width,
            oldheight:this.state.height,
            oldClientY:null,

        })
    },
    mouseMoveHandler:function(event) {//鼠标移动事件
        let dir=this.getDirection(event);
        if(this.state.oldClientX!=null&&dir!="") {
            //判断是否可以拖动

            try {
                var newwidth = this.state.width;
                var newheight = this.state.height;
                if (dir.indexOf("e") > -1) {//向东
                    newwidth = Math.max(this.state.min, this.state.oldwidth + event.clientX - this.state.oldClientX);
                }
                if (dir.indexOf("s") > -1) {//向南
                    if(this.props.onlyWidth==false) {//允许改变高度
                        newheight = Math.max(this.state.min, this.state.oldheight + event.clientY - this.state.oldClientY);
                    }
                }


                this.setState({
                    width: newwidth,
                    height: newheight
                })

            }
            catch (e) {

            }
        }
        else {
        }
        //取消默认事件
        //window.event.returnValue = false;
        //window.event.cancelBubble = true;
    },
    getDirection:function(event) {
        //此处计算方向与光标图形分开，
        //当缩小时，要将方向向里多计算一点，否则缩小不流畅
        var xPos, yPos, offset, dir;
        dir = "";
        xPos = event.offsetX;
        yPos = event.offsetY;
        offset = this.state.min;
        if (this.props.onlyWidth == false) {//允许改变高度
            if (yPos > this.refs.resizediv.offsetHeight - 4 * offset) dir += "s";
        }
        if (xPos > this.refs.resizediv.offsetWidth - 4 * offset) dir += "e";
        let cursor = "";
        if (this.props.onlyWidth == false) {//允许改变高度
            if (yPos > this.refs.resizediv.offsetHeight - offset) {
                cursor += "s";
            }
        }
        if (xPos > this.refs.resizediv.offsetWidth - offset) {
            cursor += "e";
        }
        if (cursor == "") {
            cursor = "default";
        }
        else {
            cursor = cursor + "-resize";
        }
        this.refs.resizediv.style.cursor = cursor;//设置鼠标样式
        return dir;
    },
    render:function() {

        return (
            <div className={"resize  "+this.props.className} ref="resizediv"
                 style={{height:this.props.onlyWidth==true?"auto":this.state.height,left:this.props.left,top:this.props.top,width:this.state.width,zIndex:8888
                    ,borderBottom:this.props.onlyWidth==true?"none":null
                 }}
            >

                {this.props.children}
            </div>)
    }
});
module .exports=Resize;