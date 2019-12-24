/*/
 create by wangzy
 date:2016-05-17
 desc:文件上传组件
 */
let React = require("react");
let Modal = require("../Layout/Modal.jsx");
let Button = require("../Buttons/Button.jsx");
let Message = require("../Unit/Message.jsx");
require("../Sass/Action/Import.css");
let Upload = React.createClass({
    propTypes: {
        uploadurl: React.PropTypes.string.isRequired,//上传地址
        accept: React.PropTypes.string,//上传文件类型
        multiple: React.PropTypes.bool,//是否允许多选
        name: React.PropTypes.string,//名称
        uploadSuccess: React.PropTypes.func//上传成功事件
    },
    getDefaultProps: function () {
        return {
            name: null,
            multiple: false,
            accept: null,
            uploadurl: null,
            downloadurl: "javascript:void(0)",

        }
    },
    getInitialState: function () {
        return {
            filenames: "",//选择的文件名集合
            uploadurl: this.props.uploadurl,
            multiple: this.props.multiple,
            accept: this.props.accept,
            downloadurl: this.props.downloadurl,
            uploadTitle: "导入",
            uploadDisabled: false,

        }
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({

            uploadurl: nextProps.uploadurl,
            multiple: nextProps.multiple,
            accept: nextProps.accept,
            downloadurl: nextProps.downloadurl,
        })
    },
    close: function () {//关闭
        this.refs.modal.close();
    },
    open: function () {//打开
        this.refs.modal.open();
    },
    onChange: function (event) {//选择文件
        if (this.state.uploadDisabled) {
            return;
        }
        var files = this.refs.import.files;
        let filenames = "";
        if (files.length > 0) {
            for (let index = 0; index < files.length; files++) {
                if (filenames == "") {
                    filenames += files[index].name;
                }
                else {
                    filenames += "," + files[index].name;
                }
            }
        }
        this.setState({
            filenames: filenames,
        })

    },
    importHandler: function () {//执行导入事件
        // 实例化一个表单数据对象
        var formData = new FormData();
        // 遍历文件列表，插入到表单数据中
        var files = this.refs.import.files;
        if (files.length > 0) {
            if (this.state.uploadurl) {
                if (files.length == 1 && this.props.name) {//单文件上传时，如果指定了name，则以name为基准
                    formData.append(this.props.name, files[0]);
                }
                else {
                    for (let index = 0, file; file = files[index]; index++) {
                        // 文件名称，文件对象
                        formData.append(file.name, file);
                    }
                }

                // 实例化一个AJAX对象
                var xhr = new XMLHttpRequest();
                if(this.props.progress)
                    {    
                        xhr.upload.addEventListener("progress", this.uploadProgress, false);
                        
                    }
            
                xhr.addEventListener("load", this.uploadComplete, false);
                xhr.addEventListener("error", this.uploadFailed, false);
                xhr.addEventListener("abort", this.uploadCanceled, false);
                xhr.open("POST", this.state.uploadurl, true);
                // 发送表单数据
                xhr.send(formData);
                this.setState({
                    uploadTitle: "上传0%",
                    uploadDisabled: true,
                })

            }
            else {
                Message.alert("您没有设置上传路径");
            }
        }
        else{
            Message.info("请选择文件");
        }




    },
    uploadProgress: function (event) {
        if (event.lengthComputable) {
            var percentComplete = Math.round(event.loaded * 100 / event.total);
            if (percentComplete < 100) {
                this.setState({
                    uploadTitle: "上传" + percentComplete + "%",
                })
            }
            else {
                this.setState({
                    uploadTitle: "处理中...",
                })
            }

        }
        else {
            this.uploadFailed();
        }
    },
    uploadComplete: function (event) {
        var xhr = (event.target);
        if (xhr.readyState == 4 && xhr.status == 200) {
            var result = JSON.parse(xhr.responseText);
            if (result && result.success != null && result.success != undefined) {
                if (result.success == true) {
                    Message.success("处理成功");
                    if (this.props.uploadSuccess != null) {
                        this.props.uploadSuccess();
                    }

                }
                else {
                    Message.error(result.message);
                }
            }
            else {
                Message.error("服务器返回值非标准JSON格式,无法处理,请联系管理员");

            }

        }
        else {
            if (xhr.statusText.indexOf("404")) {
                Message.error("服务器没有响应,请检查您的上传路径");
            }
            else {
                Message.error("服务器处理错误");
            }


        }

        this.setState({
            uploadTitle: "导入",
            uploadDisabled: false,
        });

       
    },
    uploadFailed: function (event) {
        Message.alert("上传文件失败");
    },
    uploadCanceled: function (evt) {
        //保留这个方法
    },
    render: function () {
        let props = {
            accept: this.state.accept,
            multiple: this.state.multiple,
        }
        return (<Modal ref="modal" width={460} height={340} title="请选择导入文件">
            <div className="import-section">
                <input type="text" name={this.state.name} className="import-text" value={this.state.filenames} readOnly={true} ></input>
                <input type="file" ref="import" className="import-file" onChange={this.onChange} {...props} style={{ display: this.state.uploadDisabled ? "none" : "inline" }}></input><Button type="button" disabled={this.state.uploadDisabled} className="import-chose" title="选择文件"></Button>
            </div>
            <div className="import-submit">
                <Button title={this.state.uploadTitle} disabled={this.state.uploadDisabled} onClick={this.importHandler} ></Button>
                <Button title="取消" onClick={this.close} theme="cancel"></Button>
            </div>

        </Modal>);

    }
});
module.exports = Upload;