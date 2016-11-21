/**
 * Created by apple on 2016/11/8.
 * 将复制粘贴功能独立出来
 */
let React=require("react");
let pasteExtend={
    pasteHandler:function(event,callBack) {
        if ( !(event.clipboardData && event.clipboardData.items) ) {//浏览器不支持这个功能
        }
        else
        {
            for (var i = 0, len = event.clipboardData.items.length; i < len; i++) {
                var item = event.clipboardData.items[i];
                if (item.kind === "string") {//文本型数据
                    item.getAsString( (pasteData) =>{//异步的
                        var data=[];//返回的数据
                    var rows=[];

                    if (pasteData.indexOf("<html") > -1||pasteData.indexOf("<table")>-1) {//如果从excel复制过来，会有完整html的内容

                    }
                    else if (pasteData.indexOf("\t")>-1||pasteData.indexOf("\r\n")>-1) {
                        //window 是多列或者多行数据,则处理,否则视为普通粘贴
                        var rows = pasteData.split("\r\n");//得到所有行数据
                    }
                    else if (pasteData.indexOf("{")<0&&pasteData.indexOf("\n")>-1) {
                        //mac
                        var rows = pasteData.split("\n");//得到所有行数据
                    }
                    for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                        var columns=    rows[rowIndex].split("\t");//当前所有列数据
                        var currentColumn=[];//当前行数据,为了除去空字符
                        for(var columnIndex=0;columnIndex<columns.length;columnIndex++) {
                            if(columns[columnIndex].trim()=="") {
                                continue;//空字符
                            }
                            else {
                                currentColumn.push(columns[columnIndex]);
                            }
                        }
                        data.push(currentColumn);
                    }
                    if(data.length>0) {
                        callBack(data);//回调
                    }

                })

                } else if (item.kind === "file") {//文件类型
                    var pasteFile = item.getAsFile();
                    // pasteFile就是获取到的文件，暂时不处理
                }
            }
        }


    },
}

module.exports=pasteExtend;