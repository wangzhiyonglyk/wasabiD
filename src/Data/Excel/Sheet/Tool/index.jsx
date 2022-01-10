/**
 * Excel Tool 工具栏
 * create by wangzhiyong
 * date:2021-06-26
 */
import React from "react";
import BaseInput from "../../../../Form/BaseInput";
import Do from "./Do"
import Font from "./Font";
import Align from "./Align";
import Format from "./Format";
function BeginToll(props) {
   return  <div className="wasabi-execel-tool-section">
        <Do key="1"  cellProps={props.cellProps} onClick={props.onClick}></Do>
        <Font key="2"  cellProps={props.cellProps} onClick={props.onClick}></Font>
        <Align key="3"  cellProps={props.cellProps} onClick={props.onClick}></Align>
        <Format key="4"  cellProps={props.cellProps}  onClick={props.onClick}></Format>
    </div>
}
class Tool extends React.Component {
    constructor(props) {
        super(props);
        this.input=React.createRef();
        this.state = {
        }
        this.onChange=this.onChange.bind(this)
    }
    focus(){
        this.input.current.focus();
    }
    getValue(){
        
    }
    setValue(){

    }
    onChange(event){
        this.props.onChange&&this.props.onChange(event);
    }
    render() {
        return <div className="wasabi-excel-tool">
            <div className="wasabi-execel-tool-tabs">
                <div className="wasabi-execel-tool-tab">
                    <div key="0" onClick={this.props.onClick.bind(this,"openFile")} className={"wasabi-execel-tool-tab-button "}><i className="icon-excel"></i></div>
                    <div key="1" onClick={this.props.changeToolActive.bind(this, 0)} className={"wasabi-execel-tool-tab-button " + (this.props.activeIndex === 0 ? "active" : "")}>开始</div>
                    <div key="2" onClick={this.props.changeToolActive.bind(this, 1)} className={"wasabi-execel-tool-tab-button " + (this.props.activeIndex === 1 ? "active" : "")}>插入</div>
                    <div key="3" onClick={this.props.changeToolActive.bind(this, 2)} className={"wasabi-execel-tool-tab-button " + (this.props.activeIndex === 2 ? "active" : "")}>公式</div>
                    <div key="4" onClick={this.props.changeToolActive.bind(this, 3)} className={"wasabi-execel-tool-tab-button " + (this.props.activeIndex === 3 ? "active" : "")}>数据</div>
                </div>
                {this.props.activeIndex===0?<BeginToll cellProps={this.props.cellProps} onClick={this.props.onClick}></BeginToll>:null}

            </div>
            <div className="wasabi-execel-edit">
                <label style={{fontSize:16,width:50}}>编辑:</label>
                <BaseInput ref={this.input} onChange={this.onChange}  value={this.props.value} type="text" name="edit" ></BaseInput>
            </div>
        </div>
    }
}
export default Tool;