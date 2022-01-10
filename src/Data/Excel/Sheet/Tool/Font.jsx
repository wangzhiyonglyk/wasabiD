/**
 * create by wangzhiyong
 * date:2021-06-27
 * desc:字体工具栏
 */
import React,{useCallback} from "react";
import LinkButton from "../../../../Buttons/LinkButton";
import Input from "../../../../Form/Input"
import Dropdown from "../../../../Buttons/Dropdown"
import Color from "../../../Color"
const fontFamily = [
    { value: "inherit", text: "默认" },
    { value: "SimSun", text: "宋体" },
    { value: "SimHei", text: "黑体" },
    { value: "Microsoft YaHei", text: "微软雅黑" },
    { value: "Microsoft JhengHei", text: "黑体" },
    { value: "NSimSun", text: "新宋体" },
    { value: "PMingLiU", text: "新细明体" },
    { value: "MingLiU", text: "细明体" },
    { value: "DFKai-SB", text: "标楷体" },
    { value: "FangSong", text: "仿宋" },
    { value: "KaiTi", text: "楷体" },
    { value: " FangSong_GB2312", text: "仿宋" },
];
const fontSize = function () {
    let arr = [];
    for (let i = 12; i <= 24; i++) {
        arr.push({ value: i, text: i });
    }
    return arr;


}

let Font = function (props) {
    const onClick=useCallback((type,prop,value)=>{
        props.onClick(type,prop,"rgba("+[value.r,value.g,value.b,value.a].join(",")+")")
        color1.current.close();
        color2.current.close();
    })
    const color1=React.createRef();
    const color2=React.createRef();
    return <div className="wasabi-execel-tool-group">
        <div key="1" style={{ display: "flex" }}> <div className="wasabi-excel-tool-button" title="字体"><Input type="select" value="inherit" data={fontFamily} onSelect={props.onClick.bind(this,"changeProps","fontFamily")} value={props.cellProps.fontFamily||"inherit"}></Input></div>
            <div key="2" className="wasabi-excel-tool-button" title="字号">  <Input type="select" value="14" data={fontSize()} onSelect={props.onClick.bind(this,"changeProps","fontSize")} value={props.cellProps.fontSize||"14"} ></Input></div>
            <div key="3" className={"wasabi-excel-tool-button "+(props.cellProps.bold==="bold"?"active":"")} title="加粗" onClick={props.onClick.bind(this,"changeProps","bold",props.cellProps.bold==="bold"?null:"bold")}> <LinkButton theme="info" iconCls="icon-bold" title="加粗" ></LinkButton></div>
            <div key="4" className={"wasabi-excel-tool-button "+(props.cellProps.italic==="italic"?"active":"")} title="斜体" onClick={props.onClick.bind(this,"changeProps","italic", props.cellProps.italic==="italic"?null:"italic")}>  <LinkButton theme="info" iconCls="icon-italic" title="斜体" ></LinkButton></div>
            <div key="5" className={"wasabi-excel-tool-button "+(props.cellProps.underline==="underline"?"active":"")} title="下划线" onClick={props.onClick.bind(this,"changeProps","underline", props.cellProps.underline==="underline"?null:"underline")}>  <LinkButton theme="info" iconCls="icon-underline" title="下划线" ></LinkButton></div>
            <div key="6" className="wasabi-excel-tool-button"  style={{color:props.cellProps.color}} > 
             <Dropdown ref={color1} theme="info" iconCls="icon-font-colors">
                <Color  onSelect={onClick.bind(this,"changeProps","color")}></Color>
                </Dropdown></div>
            <div key="7" className="wasabi-excel-tool-button" style={{color:props.cellProps.backgroundColor}}>  
            <Dropdown ref={color2} plain={true} theme="info" iconCls="icon-colorSelector">
            <Color onSelect={onClick.bind(this,"changeProps","backgroundColor")}></Color>
                </Dropdown></div>
        </div>
        <div style={{ textAlign: "center" }}>字体</div>
    </div>
}
export default Font;