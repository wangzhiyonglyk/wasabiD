import React from "react";
import LinkButton from "../../../../Buttons/LinkButton"
let Menu = function (props) {
    return <React.Fragment>
        <div key="1" style={{ height: 60, lineHeight: "60px", paddingLeft: 10 }} onClick={props.onClick.bind(this,0)}> <LinkButton style={{ color: "white", fontSize: 30 }} iconCls="icon-back"></LinkButton></div>
        <div key="2" onClick={props.onClick.bind(this, 1)} className={"menu-item " + (props.activeIndex === 1 ? "active" : "")}>新建</div>
        <div key="3" onClick={props.onClick.bind(this, 2)} className={"menu-item " + (props.activeIndex === 2 ? "active" : "")}>导入</div>
        <div key="4" onClick={props.onClick.bind(this, 3)} className={"menu-item " + (props.activeIndex === 3 ? "active" : "")}>导出</div>
    </React.Fragment>
}
export default React.memo(Menu)