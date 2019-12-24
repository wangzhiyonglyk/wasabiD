//create by wangzy
//date:2016-03-22
//desc:模态窗口
require("../Sass/Layout/Modal.css");
require("../Sass/Buttons/button.css");
let React =require("react");
let Button=require("../Buttons/Button.jsx");
let Resize=require("./Resize.jsx");
class Modal extends  React.Component {
    constructor(props) {
        super(props);
        let width=(this.props.style&&this.props.style.width)?this.props.style.width:400;
        let height=(this.props.style&&this.props.style.height)?this.props.style.height:400;
        
        this.state = {
            width:width,
            height:height,
            visible: false,
            left: (document.body.clientWidth - width) / 2,
            top: 50,
            oldLeft: (document.body.clientWidth - width) / 2,
            oldTop: 50,
            moveX: null,
            moveY: null,
        }
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
        this.mouseDownHandler = this.mouseDownHandler.bind(this);
        this.mouseOutHandler = this.mouseOutHandler.bind(this);
        this.mouseUpHandler = this.mouseUpHandler.bind(this);
        this.OKHandler = this.OKHandler.bind(this);
        this.cancelHandler = this.cancelHandler.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let width=(nextProps.style&&nextProps.style.width)?nextProps.style.width:this.state.width;
        let height=(nextProps.style&&nextProps.style.height)?nextProps.style.height:this.state.height;
        
        this.setState({
               ...nextProps,
               width:width,
               height:height,
            }
        );

    }
    close() {//关闭事件
        this.setState({visible: false});
        if (this.props.closedHandler != null) {
            this.props.closedHandler();
        }
    }

    open() {//打开事件
        this.setState({visible: true});
    }

    mouseMoveHandler(event) {
        if (this.state.moveX != null && event.target.className == "wasabi-modal-header") {
            this.setState({
                left: this.state.oldLeft + event.clientX - this.state.moveX,
                top: this.state.oldTop + event.clientY - this.state.moveY,
            })
        }


    }

    mouseDownHandler(event) {
        this.setState({
            moveX: event.clientX,
            moveY: event.clientY,
        })
    }

    mouseOutHandler(event) {
        this.setState({
            moveX: null,
            moveY: null,
            oldLeft: this.state.left,
            oldTop: this.state.top
        })
    }

    mouseUpHandler(event) {
        this.setState({
            moveX: null,
            moveY: null,
            oldLeft: this.state.left,
            oldTop: this.state.top
        })
    }

    OKHandler() {
        if (this.props.OKHandler != null) {
            this.props.OKHandler();
        }
    
    }

    cancelHandler() {
        if (this.props.cancelHandler != null) {
            this.props.cancelHandler();
        }
        this.close();//关闭
    }

    render() {

        let activename = "wasabi-modal-container ";
        if (this.state.visible == true) {
            activename = "wasabi-modal-container active";
        }
        let width = this.state.width;
        let height = this.state.height;
        let left = this.state.left;
        let top = this.state.top;
        let control;
        let footer = null;
        let buttons = [];
            if (this.props.OKHandler) {
                buttons.push(
                    <Button title="确定" key="ok" theme="primary" onClick={this.OKHandler}
                            style={{width: 60, height: 30}}></Button>
                )         
            if (this.props.OKHandler) {
                buttons.push(
                    <Button title="取消" key="cancel" theme="cancel" onClick={this.cancelHandler}
                            style={{width: 60, height: 30, backgroundColor: "gray"}}></Button>
                )
            }
            footer = <div className="wasabi-modal-footer">
                {
                    buttons
                }
            </div>;
        }
        return <div className={activename}>
            <div className={" wasabi-overlay " + (this.props.modal == true ? "active" : "")}></div>
            <Resize width={width} height={height} left={left} top={top}
                    className="wasabi-modal fadein" resize={this.props.resize}>
                <a className="wasabi-modal-close" onClick={this.close}></a>
                <div className="wasabi-modal-header" ref="header" onMouseMove={this.mouseMoveHandler}
                     onMouseDown={this.mouseDownHandler}
                     onMouseUp={this.mouseUpHandler}
                     onMouseOut={this.mouseOutHandler}
                >
                    <div style={{display: "inline"}}>{this.props.title}</div>
                </div>

                <div className="wasabi-modal-content" style={{height: this.state.height - 40}}>
                    {
                        this.props.children
                    }
                </div>
                {
                    footer
                }
            </Resize>
        </div>


    }
}

Modal.propTypes={
    
    resize: React.PropTypes.bool,
    closedHandler: React.PropTypes.func,
    OKHandler: React.PropTypes.func,
    cancelHandler: React.PropTypes.func,
}

Modal.defaultProps={
    ...Modal.defaultProps,
    width: 400,//宽度
    height: 400,//高度
    resize: false,//是否可以改变大小
    modal: true,//默认有遮罩层
    OKHandler: null,//确定按钮的事件,
}


module .exports= Modal;