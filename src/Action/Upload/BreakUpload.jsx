/*/
 create by wangzhiyong
 date:2016-05-17
 edit:2020-03-13
 edit 2020-11-20 暂时保留原始版本
 desc:文件上传组件
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../Layout/Modal.jsx';
import LinkButton from '../../Buttons/LinkButton';
import Msg from '../../Info/Msg.jsx';
import fileType from "../../libs/fileType";
import func from "../../libs/func"
import api from "wasabi-api"
import '../../Sass/Action/Import.css'
class Upload extends Component {
    constructor(props) {
        super(props);
        this.modal = React.createRef();
        this.fileinput = React.createRef();
        this.state = {
            uploadid: func.uuid(),
            filenames: '', //选择的文件名集合
            uploadTitle: '上传',
            uploadDisabled: false
        }
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.importHandler = this.importHandler.bind(this);
        this.uploadCanceled = this.uploadCanceled.bind(this);
        this.uploadSuccess = this.uploadSuccess.bind(this);
        this.uploadFailed = this.uploadFailed.bind(this);
        this.uploadProgress = this.uploadProgress.bind(this);


    }
    /**
     * 选择文件
     */
    onClick() {
        if (this.props.disabled || this.state.uploadDisabled) {
            return;
        }
        else {
            this.fileinput.current.click();
        }

    }
    close() {
        //关闭
        this.modal.current.close();
    }
    open() {
        //打开
        this.modal.current.open();
    }
    onChange(event) {
        //选择文件
        if (this.props.disabled || this.state.uploadDisabled) {
            return;
        }
        this.files = event.target.files;//拿到文件
        this.props.onChange && this.props.onChange(this.files);
        let filenames = '';
        if (this.files.length > 0) {
            for (let index = 0; index < this.files.length; index++) {
                if (filenames == '') {
                    filenames += this.files[index].name;
                } else {
                    filenames += ',' + this.files[index].name;
                }
            }
        }
        this.setState({
            filenames: filenames
        });
    }
    //验证文件上传类型是否正确
    validateType(files) {

        if (this.props.accept) {
            return fileType.filter(this.props.accept, files);
        }
        else {
            return true;
        }


    }
    //上传处理
    importHandler() {
        if (this.props.disabled || this.state.uploadDisabled) {
            return ;
        }
        //执行导入事件
        // 实例化一个表单数据对象
        let formData = new FormData();
        // 遍历文件列表，插入到表单数据中

        if (this.files && this.files.length > 0) {
            if (this.props.uploadurl) {
                if (!this.validateType(this.files)) {
                    Msg.error("上传的文件类型不正确");
                    this.clear();
                    return;
                }
                if (this.files.length == 1) {
                    //单文件上传时，如果指定了name，则以name为基准
                    if (!this.props.name) {
                        Msg.error("单文件上传必须指定name属性");
                        this.clear();
                        return;
                    }
                    if (this.props.size && this.props.size * 1024 * 1024 < this.files[0].size) {
                        Msg.error("文件不得超过" + this.props.size + "M");
                        this.clear();
                        return;
                    }
                    formData.append(this.props.name || this.files[0].name, this.files[0]);
                } else {
                    let size = 0;//文件总大小
                    for (let index = 0; index < this.files.length; index++) {
                        // 文件名称，文件对象
                        size += this.files[index].size;
                        formData.append(this.files[index].name, this.files[index]);
                    }
                    if (this.props.size && this.props.size * 1024 * 1024 < size) {
                        Msg.error("文件不得超过" + this.props.size + "M");
                        this.clear();
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
                this.clear();
                Msg.alert('您没有设置上传路径');
            }
        } else {
            Msg.info('请选择文件');
        }
    }
    //上传进度
    uploadProgress(percentComplete) {
            if (percentComplete < 100) {
                this.setState({
                    uploadTitle: '上传' + percentComplete + '%'
                });
            } else {
                this.setState({
                    uploadTitle: '处理中...'
                });
            }
        
    }
    //上传完成
    uploadSuccess(result) {
        this.clear();
        Msg.success("上传成功")
        this.props.uploadSuccess && this.props.uploadSuccess(result, this.files);
    }

    //上传文件失败
    uploadFailed(event) {
        this.clear();
        Msg.error('上传文件失败');
    }
    uploadCanceled(evt) {
        //保留这个方法
    }
    clear() {
        let obj = document.getElementById(this.state.uploadid);
        obj.value = "";
        this.files = [];
        this.setState({
            filenames: "",
            uploadDisabled: false
        })

    }


    render() {
        let props = {
            accept: this.props.accept,
            multiple: this.props.multiple
        };

        return (
            <Modal ref={this.modal} style={{ width: 900, height: 500 }} title='请选择导入文件'
                OKHandler={this.state.uploadDisabled == false ? this.importHandler : null}
            >
                <div className='import-section'>
                    <input
                        type='text'
                        name={this.props.name}
                        className='import-text'
                        value={this.state.filenames}
                        readOnly={true}
                    ></input>
                    <input
                        id={this.state.uploadid}
                        type='file'
                        ref={this.fileinput}
                        className='import-file'
                        onChange={this.onChange.bind(this)}
                        {...props}
                        style={{ display: this.state.uploadDisabled ? 'none' : 'inline' }}
                    ></input>
                    <LinkButton
                        disabled={this.state.uploadDisabled}
                        className='icon-search'
                        title='选择文件'
                        onClick={this.onClick}
                    ></LinkButton>
                </div>

            </Modal>
        );
    }
}

Upload.propTypes = {
    httpHeaders: PropTypes.object,//请求的头部信息
    params: PropTypes.object,//其他参数
    uploadurl: PropTypes.string.isRequired, //上传地址
    accept: PropTypes.string, //上传文件类型
    multiple: PropTypes.bool, //是否允许多选
    size: PropTypes.number,//上传大小限制
    name: PropTypes.string, //名称
    uploadSuccess: PropTypes.func, //上传成功事件
    onChange: PropTypes.func //选择文件事件
};

export default Upload;
