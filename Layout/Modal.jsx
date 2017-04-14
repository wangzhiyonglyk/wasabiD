//create by wangzy
//date:2016-03-22
//desc:模态窗口
require("../Sass/Layout/Modal.scss");
require("../Sass/Buttons/button.scss");
var React =require("react");
var Button=require("../Buttons/Button.jsx");
var Resize=require("./Resize.jsx");
class Modal extends  React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            width: this.props.width,
            height: this.props.height,
            left: (document.body.clientWidth - this.props.width) / 2,
            top: 50,
            oldLeft: (document.body.clientWidth - this.props.width) / 2,
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
        this.setState({
                width: nextProps.width,
                height: nextProps.height
            }
        );

    }

    componentDidMount() {
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
        this.close();//关闭
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
        var width = this.state.width;
        var height = this.state.height;
        let left = this.state.left;
        let top = this.state.top;
        let control;
        let footer = null;
        let buttons = [];
        if (this.props.showOK == true || this.props.showCancel == true) {
            if (this.props.showOK) {
                buttons.push(
                    <Button title="确定" key="ok" theme="green" onClick={this.OKHandler}
                            style={{width: 60, height: 30}}></Button>
                )
            }
            if (this.props.showCancel) {
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
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    resize: React.PropTypes.bool,
    closedHandler: React.PropTypes.func,
    showOK: React.PropTypes.bool,
    showCancel: React.PropTypes.bool,
    OKHandler: React.PropTypes.func,
    cancelHandler: React.PropTypes.func,
}

Modal.defaultProps={
    ...Modal.defaultProps,
    width: 730,//宽度
    height: 650,//高度
    resize: false,//是否可以改变大小
    modal: true,//默认没有遮罩层
    showOK: false,//是否显示确定按钮
    showCancel: false,//是否显示取消按钮
    OKHandler: null,//确定按钮的事件,
}


module .exports= Modal;