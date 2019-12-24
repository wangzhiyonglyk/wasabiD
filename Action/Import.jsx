/*/
 create by wangzy
 date:2016-05-17
 desc:excel数据导入组件
 */
let  React=require("react");
let Modal=require("../Layout/Modal.jsx");
let Button=require("../Buttons/Button.jsx");
let Message=require("../Unit/Message.jsx");
let fileType=require("../libs/fileType.js");
var unit=require("../libs/unit.js");
require("../Sass/Action/Import.css");
let  Import=React.createClass({
    propTypes: {
        name:React.PropTypes.string,//文件字段名称
        uploadurl: React.PropTypes.string.isRequired,//导入地址
        modelurl: React.PropTypes.string.isRequired,//模板下载地址
        failloadurl: React.PropTypes.string.isRequired,//导入失败下载地址
        importSuccess: React.PropTypes.func//上传成功事件
    },
    getDefaultProps: function () {
        return {
            name:"",
            uploadurl: null,
            failloadurl: "javascript:void(0)",

        }
    },
    getInitialState: function () {
        return {
            name:this.props.name,
            filename: "",//选择的文件名集合
            uploadDisabled:true,//是否允许导入
            choseDisabled:false,//是否允许选择文件
            giveupdisabled:true,//是否允许终止
            uploadurl: this.props.uploadurl,
            failloadurl: this.props.failloadurl,
            showfail:false,
            uploadInfo:[],

        }
    },
    componentWillReceiveProps: function (nextProps) {

        this.setState({
            name:nextProps.name,
            uploadurl: nextProps.uploadurl,
            failloadurl: nextProps.failloadurl,
        })
    },
    componentDidUpdate:function()
    {



    },
    close: function () {//关闭
        this.refs.modal.close();
    },
    open: function () {//打开
        this.setState({
            uploadInfo:[],//更新提示
            choseDisabled: false,//可以再选择
            uploadDisabled:true,//不可以再导入
            giveupdisabled:true,//不可以终止
            filename:"",//清空文件名
            showfail:false//不显示下载导入失败的文件
        })
        this.clearFile();//清空文件选择,方便下一次选择
        this.refs.modal.open();
    },
    onChange: function (event) {//选择文件

        this.isSuccess=false;//没有执行完成
        if(this.state.choseDisabled)
        {
            return ;
        }

        var files=(event.target.files);
        let filename = "";//文件名称
        var typevalidate = true;//文件类型正确
        if (files.length > 0) {
            if(files[0].type=="")
            {//苹果电脑存在的现象
                if((files[0].name.lastIndexOf(".xls")>-1&&files[0].name.lastIndexOf(".xls")+3==files[0].name.length-1)||(files[0].name.lastIndexOf(".xlsx")>-1&&files[0].name.lastIndexOf(".xlsx")+3==files[0].name.length-1))
                {
                    typevalidate = true;
                    filename = files[0].name;
                }
                else
                {
                    typevalidate = false;
                }
            }
            else {
                if (!fileType.isExcel(files[0].type)) {
                    typevalidate = false;
                }
                else {
                    filename = files[0].name;
                }

            }

        }
        else
        {
            typevalidate=false;
        }

        if(typevalidate)
        {
            this.file=files[0];//保存文件
            this.setState({
                filename: filename,
                uploadDisabled:false,//可以导入
                showfail:false,
            })
        }
        else
        {
            this.file=null;
            this.setState({
                filename: filename,
                uploadDisabled:true,//不可以导入
                showfail:false,
            })
        }


    },
    importBegin:function(name,title) {//开始的导入
        //清空一些数据值,这些数据不需要保存状态值中
        this.isgiveup=false;//默认标记不可以终止,这里没有采用状态值来标记,防止状态更新出现延迟导致统计数据不准确
        this.total=0;//设置总记录数初始值
        this.failNum=0;//失败数
        this.successNum=0;//成功数
        this.importHandler(null);//开始导入
        this.setState({
            choseDisabled: true,//不可以再选择
            uploadDisabled:true,//不可以再导入
            giveupdisabled:false,//可以终止
        })

    },
    giveup:function(){//终止
        this.isgiveup=true;
        let uploadInfo = this.state.uploadInfo;
        uploadInfo.unshift(<div className="info" key={"success"+(index+2).toString()} >{"用户终止,成功数:"+this.successNum.toString()+",失败数:"+this.failNum.toString()}</div>)
        this.setState({
            uploadInfo:uploadInfo,//更新提示
            choseDisabled: false,//可以再选择
            uploadDisabled:true,//不可以再导入
            giveupdisabled:true,//不可以终止
            filename:"",//清空文件名
            showfail:false//不显示下载导入失败的文件
        })
        this.clearFile();//清空文件选择,方便下一次选择

    },
    importHandler: function (index) {//执行导入事件
        if(this.isgiveup)
        {
            return ;
        }
        var formData = new FormData(); // 实例化一个表单数据对象
        if(index==null) {
            //导入文件
            if (this.file!=null) {

                if (this.state.uploadurl) {
                    formData.append(this.state.name, this.file);

                }
                else {
                    Message.alert("您没有设置上传路径");
                    return;
                }
            }
        }
        else {
            //执行数据导入
            var image=new Image();
            formData.append(this.state.name, image);
            formData.append("index",index);


        }
        // 实例化一个AJAX对象
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", this.uploadProgress.bind(this,index), false);//上传进度
        xhr.addEventListener("load", this.uploadComplete.bind(this,index), false);
        xhr.addEventListener("error", this.uploadFailed, false);
        xhr.addEventListener("abort", this.uploadCanceled, false);
        xhr.open("POST", this.state.uploadurl, true);
        // 发送表单数据
        xhr.send(formData);

    },
    uploadProgress:function (index,event) {
        if (event.lengthComputable) {
            if(index==null) {//导入文件
                var percentComplete = Math.round(event.loaded * 100 / event.total);
                if(percentComplete<100)
                {
                    this.setState({
                        uploadInfo: [<div key={"upload"+percentComplete.toString()} className="success">{"文件上传" + percentComplete + "%"}</div>],
                    })
                }
                else
                {
                    this.setState({
                        uploadInfo: [<div key={"upload"+percentComplete.toString()} className="success">{"文件上传" + percentComplete + "%,开始读取文件"}</div>],
                    })
                }
            }
        }
        else {
            this.uploadFailed();
        }
    },
    uploadComplete:function (index,event) {
        var xhr= (event.target);
        let uploadInfo = this.state.uploadInfo;
        if ( xhr.readyState == 4 && xhr.status == 200 ) {
            var result=JSON.parse(xhr.responseText);
            if(result&&result.success!=null&&result.success!=undefined) {
                if(result.success==true) {
                    if(index==null)
                    {//导入文件成功
                        this.total=result.data.total; //得到总记录数
                        uploadInfo.unshift(<div key="read" className="success">{"文件读取成功,总共"+this.total+"条数据,开始处理..."}</div>);
                        this.setState({
                            uploadInfo: uploadInfo,
                        });
                    }
                    else {
                        if (result.data.success) {
                            this.successNum+=1;
                            uploadInfo.unshift(<div className="success" key={"success"+(index+2).toString()}>{"序号为" + (index + 2).toString() + "行,导入成功"}</div>)
                        }
                        else {
                            this.failNum+=1;
                            uploadInfo.unshift(
                                <div className="fail" key={"fail"+(index+2).toString()}>{"序号为" + (index + 2).toString() + "行,导入失败," + result.data.message}</div>)
                        }
                        this.setState({
                            uploadInfo: uploadInfo
                        })
                    }
                    if(index==null)
                    {
                        this.importHandler(0);//开始导入第一条数据
                    }
                    else {

                        if(index>=this.total-1) {//代表已经执行完最后一条记录了
                            uploadInfo.unshift(<div className="info" key={"successall"} >{"所有数据执行完成,成功数:"+this.successNum.toString()+",失败数:"+this.failNum.toString()}</div>)
                            this.setState({
                                choseDisabled: false,//可以再选择
                                uploadDisabled:true,//不可以再导入
                                giveupdisabled:true,//不可以终止
                                filename:"",//清空文件名
                                showfail:this.failNum>0?true:false,//是否显示下载失败信息
                            })
                            this.clearFile();//清空文件选择,方便下一次选择

                            if(this.props.importSuccess)
                            {
                                this.props.importSuccess(result);
                            }

                        }
                        else
                        {
                            this.importHandler(index*1+1);//再次执行
                        }

                    }
                }
                else {
                    this.clearFile();//清空文件,方便下次选择
                    if(index==null) {
                        Message.error("文件读取失败,原因:"+result.message);
                        this.setState({
                            uploadDisabled:true,//不可以再导入
                            choseDisabled:false,//可以再选择
                        })

                    }
                    else
                    {
                        Message.error("服务器处理失败,导入中断,原因:"+result.message);
                        this.setState({
                            uploadDisabled:true,//不可以再导入
                            choseDisabled:false,//可以再选择
                        })
                    }

                }
            }
            else {
                this.clearFile();
                Message.error("服务器返回值非标准JSON格式,无法处理,请联系管理员");
                this.setState({

                    uploadDisabled:true,//不可以再导入
                    choseDisabled:false,//可以再选择
                })

            }

        }
        else {
            this.clearFile();
            if( xhr.statusText.indexOf("404"))
            {
                Message.error("服务器没有响应,请检查您的上传路径");
                this.setState({

                    uploadDisabled:true,//不可以再导入
                    choseDisabled:false,//可以再选择
                })
            }
            else
            {
                Message.error("服务器处理错误");
                this.setState({

                    uploadDisabled:true,//不可以再导入
                    choseDisabled:false,//可以再选择
                })
            }


        }

    },
    uploadFailed:function(event) {
        this.clearFile();
        this.setState({

            choseDisabled: false,//可以再选择
            uploadDisabled:true,//不可以再导入


        })
        Message.error("上传失败");
    },
    uploadCanceled:function uploadCanceled(evt) {
        //保留这个方法
    },
    clearFile:function() {
        try {
            this.refs.import.value="";//清空,以方便可以重新选择相同文件
        }
        catch (e) {

        }
    },
    render:function() {
        let accepts=null;//接受的文件类型
        let acceptMap=fileType.getTypeMap("excel");
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
        let props={
            accept:accepts,
            multiple:false,
        }


        return(   <Modal  ref="modal"  width={460} height={340} title="请选择导入文件">


            <div className="import-section">
                <input type="text" name={this.state.name} className="import-text" value={this.state.filename} readOnly={true} ></input>
                <input type="file" ref="import" className="import-file" onChange={this.onChange} {...props} style={{display:this.state.choseDisabled?"none":"inline"}}></input>
                <Button type="button" disabled={this.state.choseDisabled} className="import-chose"  title="选择文件"></Button>
            </div>

            <div className="import-submit">
                <a className="import-failload" target="blank" href={this.props.failloadurl} style={{display:this.state.showfail==true?"inline":"none"}}>下载失败信息</a>
                <Button title="导入" disabled={this.state.uploadDisabled}  onClick={this.importBegin} ></Button>
                <Button title="终止" disabled={this.state.giveupdisabled} onClick={this.giveup} theme="cancel"></Button>
                <Button title="关闭"  onClick={this.close} theme="cancel"></Button>
            </div>
            <a className="import-downloadmodel" href={this.props.modelurl}>下载模版</a>

            <div className="import-upload-info">{this.state.uploadInfo}</div>
        </Modal>);

    }
});
module .exports=Import;