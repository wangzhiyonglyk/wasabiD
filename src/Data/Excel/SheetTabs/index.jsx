/**
 * create by wangzhiyong
 * date:2021-06-27
 * desc:工作表的页签
 */
import React from "react";
import LinkButton from "../../../Buttons/LinkButton";

let SheetTabs = function (props) {

    return <div className="wasabi-excel-sheet-tabs">
         <LinkButton key="add" theme="info" iconCls="icon-expand" style={{fontSize:18,marginRight:10}} title="添加"></LinkButton>
        {
            props.sheetTabs && props.sheetTabs.map((item, index) => {
                return  <div key={index} 
                className={"wasabi-excel-tool-button "+(props.activeIndex===index?"active":"")}>
                    {item.title}&nbsp;&nbsp;
                    <LinkButton key="op" theme="info" iconCls="icon-drop-down"  title="编辑"></LinkButton>
                    </div>
            })
        }</div>
}
export default SheetTabs;