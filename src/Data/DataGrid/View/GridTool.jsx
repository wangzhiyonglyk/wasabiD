import React from "react";
import LinkButton from "../../../Buttons/LinkButton"
import Msg from "../../../Info/Msg";
function Help(){
   return <div>
        1.可以拖动excel文件导入<br></br>
        2.可以复制某个excel文件中的内容，粘贴导入<br></br>
    </div>
}
class GridTool extends React.Component {
    constructor(props) {
        super(props);
        this.file = React.createRef();
        this.state = {

        }
    }
    upload() {
        this.file.current.click();

    }
    /**
     * 
     * @param {*} event 
     */
    onChange(event) {
        this.props.upload && this.props.upload(event);

    }
    help(){
    
      Msg.confirm(<Help></Help>)
    }
    render() {
        const props = this.props;
        return <div className="wasabi-grid-tool">
            <input key="input" type="file" style={{ display: "none" }} ref={this.file} onChange={this.onChange.bind(this)}></input>
            {props.addAble? <LinkButton key="add" iconCls="icon-add" title="添加" onClick={props.onAdd}>添加</LinkButton>:null}
            {props.importAble?<LinkButton key="upload" iconCls="icon-arrow-circle-down" title="粘贴，拖动均可" onClick={this.upload.bind(this)}>导入</LinkButton>:null}
            {props.editAble? <LinkButton key="save" iconCls="icon-save" title="保存" onClick={props.onSave}>保存</LinkButton>:null}
           {props.importAble? <LinkButton key="help" style={{float:"right",marginRight:10}} theme="danger"  iconCls="icon-help" title="帮助"  onClick={this.help.bind(this)} >帮助</LinkButton>:null}
        </div>
    }


}
export default GridTool
