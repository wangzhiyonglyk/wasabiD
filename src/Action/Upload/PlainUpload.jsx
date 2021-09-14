

/*/
 create by wangzhiyong
 date:2020-11-20 改造上传组件
 desc:文件上传组件
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Msg from '../../Info/Msg.jsx';
import LinkButton from "../../Buttons/LinkButton"
import fileType from "../../libs/fileType";
import api from "wasabi-api";
import func from "../../libs/func";

import('./index.css');
class Upload extends Component {
    constructor(props) {
        super(props);
        this.fileinput = React.createRef();
        this.state = {
            uploadid: func.uuid(),
            defaultImgid: func.uuid(),//默认图片的id
            uploadImgid: func.uuid(),//单图片上传预览的id
            files: [], //选择的文件名集合
            uploadTitle: '正在上传',
            uploadSuccessStatus: -1,//上传状态
        }

        this.onChange = this.onChange.bind(this);
        this.importHandler = this.importHandler.bind(this);
        this.uploadSuccess = this.uploadSuccess.bind(this);
        this.uploadFailed = this.uploadFailed.bind(this);
        this.uploadProgress = this.uploadProgress.bind(this);
        this.clear = this.clear.bind(this);
        this.imgLoad = this.imgLoad.bind(this);
        this.setFile = this.setFile.bind(this);
    }
    /**
     * 选择文件
     * @param {} event 
     */
    onChange(event) {
        //选择文件
        this.setFile(event.target.files);
        this.props.onChange && this.props.onChange(event.target.files);

    }
    onDrop(event) {
        if (this.props.disabled || this.state.uploadSuccessStatus != -1) {
            return;
        }
      
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            this.setFile(event.dataTransfer.files)
        }

    }
    /**
     * 设置上传时文件参数
     * @param {array} targetFiles 文件
     * @returns 
     */
    setFile(targetFiles = []) {
        if (!this.props.uploadurl) {
            Msg.info('您没有设置上传的服务器地址');
            return;
        }
        if (targetFiles.length > 0 && this.validateType(targetFiles)) {
            let files = [];
            for (let i = 0; i < targetFiles.length; i++) {
                files.push(targetFiles[i]);
            }
            this.setState({
                files: files,
                uploadSuccessStatus: 0,
                uploadTitle: "..."

            }, () => {
                this.props.autoUpload && this.importHandler();//
            });

        }
        else {
            if (targetFiles.length > 0) {
                Msg.error("上传的文件类型不正确");
                this.clear();//清除
            }
            return;
        }


    }
    /**
     * 
     * @param {*} event 
     */
    onDragOver(event) {//在ondragover中一定要执行preventDefault()，否则ondrop事件不会被触发
        event.preventDefault();
    }
    //验证文件上传类型是否正确
    validateType(files) {
        let accept = this.props.accept || (this.props.type)
        if (accept) {

            return fileType.filter(accept, files);
        }
        else {
            return true;
        }


    }
    //上传处理
    importHandler() {
        if (this.props.disabled) {
            return;
        }
        //执行导入事件
        // 实例化一个表单数据对象
        let formData = new FormData();
        // 遍历文件列表，插入到表单数据中

        if (this.state.files && this.state.files.length > 0) {
            if (this.props.uploadurl) {
                if (!this.validateType(this.state.files)) {
                    Msg.error("上传的文件类型不正确");
                    this.clear();//清除
                    return;
                }
                if (this.state.files.length == 1) {
                    //单文件上传时，如果指定了name，则以name为基准
                    if (!this.props.name) {
                        Msg.error("单文件上传必须指定name属性");
                        this.clear();//清除
                        return;
                    }
                    if (this.props.size && this.props.size * 1024 * 1024 < this.state.files[0].size) {
                        Msg.error("文件不得超过" + this.props.size + "M");
                        this.clear();//清除
                        return;
                    }
                    formData.append(this.props.name || this.state.files[0].name, this.state.files[0]);
                } else {
                    let size = 0;//文件总大小
                    for (let index = 0; index < this.state.files.length; index++) {
                        // 文件名称，文件对象
                        size += this.state.files[index].size;
                        formData.append(this.state.files[index].name, this.state.files[index]);
                    }
                    if (this.props.size && this.props.size * 1024 * 1024 < size) {
                        Msg.error("文件不得超过" + this.props.size + "M");
                        this.clear();//清除
                        return;
                    }
                }
                //是否有其他参数
                if (this.props.params) {
                    for (var s in this.props.params) {
                        formData.append(s, this.props.params[s]);//其他参数
                    }
                }
                let wasabi_api = window.api || api;

                wasabi_api.ajax({
                    url: this.props.uploadurl,
                    type: "post",
                    contentType: false,
                    headers: this.props.httpHeaders || {},
                    dataType: "json",
                    data: formData,
                    success: (result) => {
                        this.uploadSuccess(result);
                    },
                    progress: (percent) => {
                        this.uploadProgress(percent);
                    },
                    error: (message) => {
                        this.uploadFailed(message);
                    }


                })


            } else {
                Msg.info('您没有设置上传的服务器地址');
                this.clear();//清除
            }
        } else {
            Msg.info('请选择文件');
        }
    }
    //上传进度
    uploadProgress(percentComplete) {
        if (percentComplete < 100) {
            this.setState({
                uploadSuccessStatus: 0,
                uploadTitle: percentComplete + '%'
            });
        } else {
            this.setState({
                uploadSuccessStatus: 0,
                uploadTitle: '...'
            });
        }
    }
    //上传完成
    uploadSuccess(result) {
        this.setState({
            uploadTitle: "100%",
            uploadSuccessStatus: 1,
        })
        Msg.success("上传成功")
        this.props.uploadSuccess && this.props.uploadSuccess(result, this.state.files);


    }
    //上传文件失败
    uploadFailed(message) {
        this.setState({
            uploadTitle: "error",
            uploadSuccessStatus: -1
        })
        this.clear();
        Msg.error(message);
    }
    /**
    * 清空文件
    */
    clear() {
        let obj = document.getElementById(this.state.uploadid);
        obj.value = "";
    }
    /**
     * 选择文件
     */
    onClick() {
        if (this.props.disabled || this.state.uploadSuccessStatus != -1) {
            return;
        }
        else {
            this.fileinput.current.click();
        }

    }

    /**
    * 给父组件调用,上传
    */
    open() {
        this.importHandler();
    }
    /**
     * 拿到图片的真实高与宽，防止显示失真
     */
    imgLoad(id, event) {
        try {
            let path = event.path ? event.path : event.nativeEvent.path;//做兼容性处理
            if (path instanceof Array && path.length > 0) {
                let parentHeight = document.getElementById(id).parentNode.getBoundingClientRect().height;
                let height = path[0].naturalHeight && path[0].naturalHeight < parentHeight ? path[0].naturalHeight : parentHeight;
                document.getElementById(id).style.height = height + "px";

            }

        } catch (e) {

        }
    }
    render() {
        let iconCls = "time";
        let theme = "warning";
        switch (this.state.uploadSuccessStatus) {
            case -1:
                iconCls = "error";
                theme = "danger";
                break;
            case 1:
                iconCls = "ok";
                theme = "success";
                break;
            default:
                break;
        }
        let props = {
            accept: this.props.accept,
            multiple: this.props.multiple
        };
        return (
            <div className={"wasabi-upload-container " + (this.props.className || "")} style={this.props.style}>
                <div key="1" className={"wasabi-upload " + (this.props.disabled ? "disabled" : "")}
                 onDrop={this.onDrop.bind(this)} onDragOver={this.onDragOver.bind(this)}>
                    <div key="upload" style={{ display: (this.props.type=="image"&&this.state.files.length==0&&this.props.value ? "none" : "block" )}}>
                        <i className="icon-upload wasabi-upload-icon" onClick={this.onClick.bind(this)}></i>
                        <div className="wasabi-upload-text">将{this.props.type == "file" ? "文件" : "图片"}拖到此处，或<LinkButton onClick={this.onClick.bind(this)}>点击上传</LinkButton></div>
                        <input id={this.state.uploadid} type="file" name="file" ref={this.fileinput}  {...props} onChange={this.onChange.bind(this)} className="wasabi-upload-input" />

                    </div>
                    {/* 默认显示 */}
                    <div key="preview" onClick={this.onClick.bind(this)} className="wasabi-uplaod-files preview" style={{
                        display: ((this.state.files && this.state.files.length == 0)&&this.props.type=="image" && this.props.value ? "block" : "none")
                    }}>
                        <img src={this.props.value||""} id={this.state.defaultImgid} onLoad={this.imgLoad} alt="点击上传" style={{ width: "100%" }}></img>

                    </div>
                    {/* 单图片上传预览 */}
                    <div key="preview2" onClick={this.onClick.bind(this)} className="wasabi-uplaod-files" style={{
                        display: ((this.props.type == "image" && this.state.files && this.state.files.length == 1) ? "block" : "none")
                    }}>
                        {(this.props.type == "image" && this.state.files && this.state.files.length == 1) ? <img id={this.state.uploadImgid} onLoad={this.imgLoad} style={{ width: "100%", height: "100%" }}
                            src={window.URL.createObjectURL(this.state.files[0]) || ""}></img> : null}
                    </div>
                </div>
                <div key="2" onClick={this.onClick.bind(this)} className="wasabi-uplaod-files" style={{paddingLeft:10, display: this.state.files.length > 0 ? "block" : "none" }}>
                    {/* 文件上传预览 */}
                    {

                        this.props.type == "file" && this.state.files && this.state.files.length > 0 && this.state.files.map((item, index) => {
                            return <div key={"div" + index} style={{ position: "relative", height: 40, lineHeight: "40px" }}>
                                <LinkButton iconCls="icon-file" theme="default" style={{ marginRight: 10 }} key={index}><span style={{ marginLeft: 10 }}>{item.name}</span></LinkButton>
                                <LinkButton iconCls={"icon-" + iconCls} theme={theme}  >{this.state.uploadTitle}</LinkButton>
                            </div>
                        })
                    }
                    {/* 多图片上传预览 */}
                    {
                        this.props.type == "image" && this.state.files && this.state.files.length > 1 && this.state.files.map((item, index) => {
                            return <div key={"div" + index} style={{ position: "relative", height: 82, lineHeight: "80px", borderBottom: "1px solid var(--border-color)", marginBottom: 5 }}>
                                <img style={{ height: 80, marginRight: 10 }} src={window.URL.createObjectURL(item)}></img>
                                <LinkButton iconCls={"icon-" + iconCls} style={{ marginLeft: 10 }} theme={theme}>{this.state.uploadTitle}</LinkButton>
                            </div>
                        })
                    }


                </div>

            </div>
        );
    }
}

Upload.propTypes = {
    autoUpload: PropTypes.bool, //是否自动上传
    className: PropTypes.string,//
    style: PropTypes.object,//
    type: PropTypes.oneOf(["file", "image"]),//上传的是文件还是纯图片
    httpHeaders: PropTypes.object,//请求的头部信息
    params: PropTypes.object,//其他参数
    uploadurl: PropTypes.string.isRequired, //上传地址
    accept: PropTypes.string, //上传文件类型
    multiple: PropTypes.bool, //是否允许多选
    size: PropTypes.number,//上传大小限制
    name: PropTypes.string, //名称
    uploadSuccess: PropTypes.func, //上传成功事件
    disabled: PropTypes.bool,//是否禁止
    value: PropTypes.string, //默认图片值
};
Upload.defaultProps = {
    autoUpload: true,//允许
    type: "file",
  
};
export default Upload;
