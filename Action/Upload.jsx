/*/
 create by wangzy
 date:2016-05-17
 desc:文件上传组件
 */
let  React=require("react");
let Modal=require("../Layout/Modal.jsx");
let Button=require("../Buttons/Button.jsx");
let Message=require("../Unit/Message.jsx");
let fileType=require("../libs/fileType.js");
require("../Sass/Action/Import.scss");
let  Import=React.createClass({
    propTypes: {
        uploadurl: React.PropTypes.string.isRequired,//上传地址
        accept: React.PropTypes.oneOf([//上传文件类型
            "word",
            "excel",
            "ppt",
            "office",
            "txt",
            "pdf",
            "html",
            "image",
            "media",
            "zip",
            null,
        ]),
        multiple: React.PropTypes.bool,//是否允许多选
        uploadSuccess: React.PropTypes.func//上传成功事件
    },
    getDefaultProps: function () {
        return {

            multiple: false,
            accept: null,
            uploadurl: null,
            downloadurl: "javascript:void(0)",

        }
    },
    getInitialState: function () {
        return {

            visible:false,
            filenames: "",//选择的文件名集合
            uploadurl: this.props.uploadurl,
            multiple: this.props.multiple,
            accept: this.props.accept,
            downloadurl: this.props.downloadurl,
            uploadTitle:"导入",
            uploadDisabled:false,

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
        if(this.state.uploadDisabled)
        {
            return ;
        }
        var files = this.refs.import.files;

        let filenames = "";
        this.typevalidate = true;
        if (files.length > 0) {
            for (let index = 0; index < files.length; files++) {
                if (this.state.accept != null && !fileType[this.state.accept](files[index].type)) {
                    this.typevalidate = false;
                    break;
                }
                if (filenames == "") {
                    filenames += files[index].name;
                }
                else {
                    filenames += "," + files[index].name;
                }

            }


        }
        else
        {
            this.typevalidate=false;
        }
        this.setState({
            filenames: filenames,
            visible:true,
        })

    },
    importHandler: function () {//执行导入事件
        if (this.typevalidate) {//格式正确
            // 实例化一个表单数据对象
            var formData = new FormData();
            // 遍历文件列表，插入到表单数据中
            var files = this.refs.import.files;
            if ( files.length > 0) {
                if (this.state.uploadurl) {
                    for (let index = 0, file; file = files[index]; index++) {
                        // 文件名称，文件对象
                        formData.append(file.name, file);
                    }
                    // 实例化一个AJAX对象
                    var xhr = new XMLHttpRequest();
                    xhr.upload.addEventListener("progress", this.uploadProgress, false);
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

        }
        else {
            Message.alert("选择的文件格式有误");
        }

    },
    uploadProgress:function (event) {
        if (event.lengthComputable) {
            var percentComplete = Math.round(event.loaded * 100 / event.total);
            if(percentComplete<100) {
                this.setState({
                    uploadTitle: "上传" + percentComplete + "%",
                })
            }
            else
            {
                this.setState({
                    uploadTitle: "处理中...",
                })
            }

        }
        else {
            this.uploadFailed();
        }
    },
    uploadComplete:function (event) {
        var xhr= (event.target);
        if ( xhr.readyState == 4 && xhr.status == 200 ) {
            var result=JSON.parse(xhr.responseText);
            if(result&&result.success!=null&&result.success!=undefined)
            {
                if(result.success==true)
                {
                    if(result.data.failNum>0) {
                        Message.error("有" + result.data.failNum + "条数据处理失败");
                    }
                    else
                    {
                        Message.success("处理成功");
                        if(this.props.uploadSuccess!=null)
                        {
                            this.props.uploadSuccess();
                        }
                    }

                }
                else
                {
                    Message.error(result.message);
                }
            }
            else
            {
                Message.error("服务器返回值非标准JSON格式,无法处理,请联系管理员");

            }

        }
        else {
            if( xhr.statusText.indexOf("404"))
            {
                Message.error("服务器没有响应,请检查您的上传路径");
            }
            else
            {
                Message.error("服务器处理错误");
            }


        }

        this.setState({
            uploadTitle: "导入",
            uploadDisabled: false,
        });

        this.state.visible = false;
    },
    uploadFailed:function(event) {
        Message.alert("上传文件失败");
    },
    uploadCanceled:function (evt) {
        //保留这个方法
    },
    render:function() {
        let accepts=null;//接受的文件类型
        if(this.state.accept!=null)
        {
            let acceptMap=fileType.type(this.state.accept);
            if(acceptMap!=null)
            {

                for (let value of acceptMap.values()) {
                    if(accepts==null)
                    {
                        accepts=value;

                    }
                    else {
                        accepts+=","+value;
                    }
                }
            }
        }

        let props={
            accept:accepts,
            multiple:this.state.multiple,
        }


        return(   <Modal  ref="modal" visible={this.state.visible} width={460} height={340} title="请选择导入文件">


            <div className="import-section">
                <input type="text" name={this.state.name} className="import-text" value={this.state.filenames} readOnly={true} ></input>
                <input type="file" ref="import" className="import-file" onChange={this.onChange} {...props} style={{display:this.state.uploadDisabled?"none":"inline"}}></input><Button type="button" disabled={this.state.uploadDisabled} className="import-chose" theme="cancel" title="选择文件"></Button>
            </div>

            <div className="import-submit">
                <Button title={this.state.uploadTitle}  disabled={this.state.uploadDisabled} onClick={this.importHandler} theme="green"></Button>
                <Button title="取消"  onClick={this.close} theme="cancel"></Button>
            </div>
            <a className="import-downloadmodel" href={this.props.downloadurl}>下载模版</a>
        </Modal>);

    }
});
module .exports=Import;