
import React from "react";
import LinkButton from "../../Buttons/LinkButton";
import Notice from "../../Navigation/Notice";
function SystemNoitce(props) {
    return <div className='system-icon' onClick={props.noticeExpand}>
        <LinkButton
            style={{
                marginLeft: 5,
                marginRight: 5,
                color:props.headerTheme!=="white"?"white":"var(--color)"
            }}
          
            dot={true}
            title="消息"
            className={"icon-bell"}

        ></LinkButton>
        
        <div className={
            props.isnoticeExpand ? "icon-menus notice show" : "icon-menus notice hide"
        } style={{ width: 360, border: "none", left: -100 }}>
            <Notice data={props.notices} onClick={props.noticeClick}></Notice>
        </div>
    </div>
}
export default SystemNoitce;