/**
 * create by wangzhiyong
 * date:2021-06-27
 * desc:文字校对工具栏
 */
import React from "react";
import LinkButton from "../../../../Buttons/LinkButton";
let Algin = function (props) {
    return <div className="wasabi-execel-tool-group">
        <div style={{ display: "flex" }}>
            <div key="1" className={"wasabi-excel-tool-button " + (props.cellProps.align==="left"?"active":"")} title="左对齐" onClick={props.onClick.bind(this,"changeProps","align",props.cellProps.align==="left"?null:"left")}><LinkButton  theme="info" iconCls="icon-align-left" title="左对齐"></LinkButton></div>
            <div key="2" className={"wasabi-excel-tool-button " + (props.cellProps.align==="center"?"active":"")} title="居中" onClick={props.onClick.bind(this,"changeProps","align",props.cellProps.align==="left"?null:"center")} ><LinkButton  theme="info" iconCls="icon-align-center" title="居中"></LinkButton></div>
            <div key="3" className={"wasabi-excel-tool-button " +( props.cellProps.align==="right"?"active":"")} title="右对齐"  onClick={props.onClick.bind(this,"changeProps","align",props.cellProps.align==="left"?null:"right")}><LinkButton  theme="info" iconCls="icon-align-right" title="右对齐"></LinkButton></div>
            <div key="4" className={"wasabi-excel-tool-button " + (props.cellProps.wrap==="wrap"?"active":"")} title="自动换行" onClick={props.onClick.bind(this,"changeProps","wrap",props.cellProps.wrap=="wrap"?false:true)}><LinkButton  theme="info" iconCls="icon-wrap" title="自动换行"></LinkButton></div>
            <div key="5" className={"wasabi-excel-tool-button " } title="合并单元格" onClick={props.onClick.bind(this,"merge")}> <LinkButton  theme="info" iconCls="icon-merge-cell" title="合并单元格"></LinkButton></div>
        </div>
        <div style={{ textAlign: "center" }}>校对</div>
    </div>
}
export default Algin;