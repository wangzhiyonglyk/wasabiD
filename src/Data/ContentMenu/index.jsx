/**
 * create by wangzhiyong
 * 右键菜单
 * 2021-07-01 重做
 */
import React from "react";
import func from "../../libs/func";
import dom from '../../libs/dom';
import "./contentmenu.css"
class ContentMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            containerid: func.uuid(),
            visible: false,
            top: 0,
            left: 0
        }
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.onClick=this.onClick.bind(this)
    }
   
    /**
     * 打开
     * @param {*} event 
     */
    open(event) {
        if (event) {
            event.preventDefault();
            document.addEventListener("click", this.close);
            this.setState({
                visible: true,
                top: event.clientY || 0,
                left: event.clientX || 0
            })
        }
    }
    /**
     * 关闭
     */
    close(event) { 
        if (!dom.isDescendant(document.getElementById(this.state.containerid), event.target)) {
            document.removeEventListener("click", this.close);
            this.setState({
                visible: false,
                top: 0,
                left: 0
            })
        }
    }
    /**
     * 单击事件
     * @param {*} index 
     * @param {*} title 
     * @param {*} event 
     */
    onClick(title,event){
        if(title){
            this.setState({
                visible: false,
                top: 0,
                left: 0
            })
            this.props.onClick&& this.props.onClick(title,event)
        }
    }
   
    render() {
        let style = { ...this.props.style, display: this.state.visible ? "flex" : "none", top: this.state.top, left: this.state.left }
        return <div className={"wasabi-contentmenu " + (this.props.className || "")} style={style} id={this.state.containerid}>
            {
                React.Children.map(this.props.children, (child, index) => {
                    if (child) {
                        if (typeof child.type !== "function") {//非react组件
                            return child;
                        } else {
                           
                            return React.cloneElement(child,
                                {
                                    onClick: child.type.name==="ContentMenuPanel"? this.onClick:null,
                                
                                });
                        }
                    }
                })
            }

        </div>
    }
}
export default ContentMenu;