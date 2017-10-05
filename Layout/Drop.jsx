/**
 * Created by zhiyongwang on 2016-03-26.
 * 能停靠的层与LinkButton配合使用
 */
var React=require("react");
var LinkButton=require("../Buttons/LinkButton.jsx");
require("../sass/Layout/Drop.scss");
class Drop extends  React.Component {
    constructor(props) {
        super(props);
        this.dragOverHandler = this.dragOverHandler.bind(this);
        this.dragEnterHandler = this.dragEnterHandler.bind(this);
        this.dragLeaveHandler = this.dragLeaveHandler.bind(this);
        this.dropHandler = this.dropHandler.bind(this);
        this.state = {
            dropClass: "drop"
        }
    }
    dragOverHandler(event) {//在ondragover中一定要执行preventDefault()，否则ondrop事件不会被触发
        event.preventDefault();
        return true;
    }

    dragEnterHandler() {
        this.setState({
            dropClass: "drop dragEnter"//停靠的背景色
        })
    }

    dragLeaveHandler() {
        this.setState({
            dropClass: "drop"//
        })
    }

    dropHandler() {
        this.setState({
            dropClass: "drop"
        })
        var eleProps = (window.localStorage.getItem("wasabidrageleProps"));
        if (eleProps) {
            eleProps = JSON.parse(eleProps);
        }
        this.props.onDrop(eleProps);
        window.localStorage.removeItem("wasabidrageleProps")
    }

    render() {
        var props =
            {
                style: this.props.style,
            }
        return (
            <div className={this.props.className + " " + this.state.dropClass} {...props} onDrop={this.dropHandler}
                 onDragEnter={this.dragEnterHandler} onDragOver={this.dragOverHandler}
                 onDragLeave={this.dragLeaveHandler}>
                {
                    this.props.children
                }
            </div>
        )
    }
}
Drop.propTypes={
    onDrop: React.PropTypes.func.isRequired,//元素停靠事件
}
module .exports= Drop;