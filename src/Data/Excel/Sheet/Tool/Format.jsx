/**
 * create by wangzhiyong
 * date:2021-06-27
 * desc:文字校对工具栏
 */
import React from "react";
import LinkButton from "../../../../Buttons/LinkButton";
let Format = function (props) {
    return <div className="wasabi-execel-tool-group">
        <div style={{ display: "flex" }}>
            <div  key="1" className="wasabi-excel-tool-button" title="文本"> <LinkButton onClick={props.onClick.bind(this,"format_text")} theme="info" iconCls="icon-text" title="文本"></LinkButton></div>
            <div  key="2" className="wasabi-excel-tool-button" title="数字">  <LinkButton onClick={props.onClick.bind(this,"format_number")}  theme="info" iconCls="icon-number" title="数字"></LinkButton></div>
            <div  key="3" className="wasabi-excel-tool-button" title="选择">  <LinkButton onClick={props.onClick.bind(this,"format_select")}  theme="info" iconCls="icon-select" title="选择"></LinkButton></div>
            <div  key="4" className="wasabi-excel-tool-button" title="日期">  <LinkButton onClick={props.onClick.bind(this,"format_date")}  theme="info" iconCls="icon-date" title="日期"></LinkButton></div>
            <div  key="5" className="wasabi-excel-tool-button" title="时间">  <LinkButton onClick={props.onClick.bind(this,"format_time")} theme="info" iconCls="icon-time" title="时间"></LinkButton></div>
            <div  key="6" className="wasabi-excel-tool-button" title="人民币">  <LinkButton onClick={props.onClick.bind(this,"format_cny")} theme="info" iconCls="icon-cny" title="人民币"></LinkButton></div>
            <div  key="7" className="wasabi-excel-tool-button" title="美元">  <LinkButton onClick={props.onClick.bind(this,"format_dollar")} theme="info" iconCls="icon-dollar" title="美元"></LinkButton></div>
            <div  key="8" className="wasabi-excel-tool-button" title="百分比">  <LinkButton onClick={props.onClick.bind(this,"format_percent")}  theme="info" iconCls="icon-baifenbi" title="百分比"></LinkButton></div>
            <div  key="9" className="wasabi-excel-tool-button" title="身份证">  <LinkButton onClick={props.onClick.bind(this,"format_idcard")}  theme="info" iconCls="icon-idcard" title="身份证"></LinkButton></div>
        </div>
        <div style={{ textAlign: "center" }}>格式</div>
    </div>
}
export default Format;