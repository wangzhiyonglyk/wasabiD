
/*
create by wangzhiyong
date:2020-03-18
desc 富文本框
*/

import React from "react";
import PropTypes from 'prop-types';
import E from "wangeditor";
import Upload from "./Upload/BreakUpload";
//引入富文本框

class Editor extends React.Component {
    constructor(props) {
        super(props);

        this.editorElem=React.createRef();
        this.upload=Reeact.createRef();
        this.state = {
            content: this.props.content
        }
        this.openFile=this.openFile.bind(this)

    }
    componentDidMount() {
        //创建富文本框
        const elem = this.editorElem.current;
        this.editor = new E(elem);
        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        this.editor.customConfig.onchange = html => {

            this.setState({
                content: html
            })
            if (this.props.onChange) {
                this.props.onChange(html);
            }
        }
        this.editor.create();//创建富文本框
        this.editor.txt.html(this.state.content);
        let obj = document.getElementsByClassName("w-e-toolbar");
        let contentobj = document.getElementsByClassName("w-e-text-container");
        contentobj[0].style.zIndex = 1;
        window.openFile = this.openFile;
        let innerHTML = obj[0].innerHTML + `<div class="w-e-menu" style="z-index:10001" onclick="openFile()"> <i class="icon-file"></i></div>`
        innerHTML = innerHTML.replace(/10001/g, "1");
        obj[0].innerHTML = innerHTML;
    }
    openFile() {
        this.upload.current.open();
    }
    getData() {
        return this.state.content;
    }
    setData(content) {
        this.editor.txt.html(content);
    }
    /**
     * 上传的组件的属性就不在这里定义的了
     */
    static defaultProps = {
        content: "",
    };

    static propTypes = {
        style: PropTypes.object,
        className: PropTypes.string,
    };

    render() {
        {/* 将生成编辑器 */ }

        return <div> <div ref={this.editorElem} className={this.props.className??""} style={this.props.style}>
        </div>
        <Upload ref={this.upload} {...this.props}></Upload>
        </div>


    }
}

export default Editor;
