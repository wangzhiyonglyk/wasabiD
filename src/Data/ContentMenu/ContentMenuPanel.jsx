/**
 * create by wangzhiyong
 * 右键菜单选项
 * 2021-07-01 重做
 */
import React from "react";
import func from "../../libs/func";
import dom from '../../libs/dom';
class ContentMenuPanel extends React.Component {
    constructor(props) {
        super(props);
        this.submenu = null;
        this.containerid = func.uuid();
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onClick=this.onClick.bind(this);
    }

    onMouseOver(index, event) {
        let children = this.props.children;
        if (this.submenu === null && children && children.length > 1) {
            for (let i = 0; i < children.length; i++) {
                if (children[i].type.name === "ContentMenu") {
                    this.submenu = dom.descendantByClass(document.getElementById(this.containerid), "wasabi-contentmenu"); break;
                }
            }
        }
        if (this.submenu) {
            this.submenu.style.left = "100%";
            this.submenu.style.display = "flex";
        }
    }
    onMouseOut(event) {

        if (this.submenu) {
            this.submenu.style.display = "none";
        }
    }
    onClick(name,event) {  
     this.props.onClick && this.props.onClick(name,event);      
    }
    render() {
        return <div id={this.containerid} className={"menu-item " + (this.props.className || "")} style={this.props.style || null}
            onClick={this.onClick.bind(this,this.props.name||"")} onMouseOver={this.onMouseOver.bind(this, this.props.index)} onMouseOut={this.onMouseOut}>
               {
                React.Children.map(this.props.children, (child, index) => {
                    if (child) {
                        if (typeof child.type !== "function") {//非react组件
                            return child;
                        } else {
                            return React.cloneElement(child,
                                {
                                    onClick: child.type.name==="ContentMenu"? this.onClick:null,      
                                });
                        }
                    }
                })
            }
        </div>
    }
}
export default ContentMenuPanel;