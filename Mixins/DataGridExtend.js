/**
 * Created by wangzhiyong on 2016/10/25.
 * 将原有的单击与双击事件
 * 将新增,修改,粘贴,鼠标右键,滚动,固定表头,固定列,等功能
 * 作为DataGrid扩展功能
 */
let React=require("react");
var unit=require("../libs/unit.js");
var FetchModel=require("../Model/FetchModel.js");
var Message=require("../Unit/Message.jsx");
let DataGridExtend= {
    //表体常用操作
    onClick: function (rowIndex,rowData) {

        if (this.props.selectChecked == true) {
            let key = this.getKey(rowIndex);//获取关键字
            if (this.state.checkedData.has(key)) {
                this.onChecked(rowIndex, "");
            }
            else {
                this.onChecked(rowIndex, key);
            }
        }
        if (this.props.onClick != null) {
            this.props.onClick(rowIndex,rowData);//注意参数换了位置,因为早期版本就是这样子
        }

    },
    onDoubleClick: function (rowIndex,rowData ) {
        if (this.props.onDoubleClick != null) {//如果自定义了,
            this.props.onDoubleClick(rowIndex,rowData );

        }
        else if(this.state.editAble) {//没有自定义,允许编辑表格
            if (this.state.editIndex != null && this.state.editIndex != rowIndex) {//说明上一行编辑完成
                this.remoteUpdateRow(rowIndex);
            }
            else {//没有上一行
                this.setState({
                    editIndex: rowIndex
                })
            }
        }
    },
    remoteUpdateRow:function (newEditIndex) {//远程提交某一行数据
        if (this.state.updateUrl) {//定义url,保存上一行
            var fetchmodel = new FetchModel(this.state.updateUrl, this.remoteUpdateRowuccess.bind(this,newEditIndex), {model: this.state.data[this.state.editIndex]}, this.ajaxError);
            console.log("datagrid-updateRow:", fetchmodel);
            unit.fetch.post(fetchmodel);
        }
        else {//没有定义url
            if(this.state.addData.has(this.getKey(this.state.editIndex)))
            {//说明是属于新增的
                this.state.addData.set(this.getKey(this.state.editIndex),this.state.data[this.state.editIndex]);
            }
            else {//属于修改的
                this.state.updatedData.set(this.getKey(this.state.editIndex),this.state.data[this.state.editIndex]);
            }
            this.setState({
                editIndex: newEditIndex,
                data:this.state.data,
                addData:this.state.addData,
                updatedData:this.state.updatedData
            })
        }
    },
    remoteUpdateRowuccess:function (newEditIndex,result) {//远程提交某一行数据
        if(this.state.addData.has(this.getKey(this.state.editIndex)))
        {//说明是属于新增的
            this.state.addData.delete(this.getKey(this.state.editIndex));
        }
        else {//属于修改的
            this.state.updatedData.delete(this.getKey(this.state.editIndex));
        }
        if (result.success) {
            this.setState({
                editIndex: newEditIndex,
            })
        }
    },
    pageUpdateHandler:function (pageSize,pageIndex) {//改变分页大小，或者跳转
        this.updateHandler(this.state.url,pageSize*1, pageIndex*1, this.state.sortName, this.state.sortOrder, null, null);
    },

    //粘贴事件
    pasteSuccess: function (data) {
        if (this.props.pasteUrl != null && this.props.pasteUrl != "") {//用户定义了粘贴url
            let actualParams = null;//实际参数
            if (this.props.pasteParamsHandler != null) {//如果粘贴参数处理函数不为空
                actualParams = this.props.pasteParamsHandler(data);
            }
            //保留以前的状态值,保存以前的查询条件
            var fetchmodel = new FetchModel(this.props.pasteUrl, this.loadSuccess.bind(this, this.state.url, this.props.pageSize, 1, this.props.sortName, this.props.sortOrder, this.state.params), actualParams, this.loadError);
            fetchmodel.lang = this.props.lang;
            console.log("datagrid-paste-fetch", fetchmodel);
            unit.fetch.post(fetchmodel);
        }
    },

    //详情页面
    detailViewHandler: function (detail) {
        var colSpan = this.state.headers.length;

        var key = this.getKey(this.state.focusIndex);
        if (this.props.selectAble == true) {
            colSpan++;
        }
        this.setState({
            detailIndex: key,
            detailView: <tr key={key+"detail"}>
                <td colSpan={colSpan}>
                    <div className="wasabi-detail">{detail}</div>
                </td>
            </tr>,
        })
    },

    //调整高宽
    setWidthAndHeight: function () {//重新计算列表的高度,及固定的表头每一列的宽度
        if (this.refs.grid.parentElement.className == "wasabi-detail") {//如果列表是在详情列表中不处理
        }
        else { //主列表
            if (this.refs.realTable.getBoundingClientRect().width == 0) {//TODO 暂时不清楚为什么会0的情况

            }
            else {
                /*
                 数据生成后,先调整两个表格的宽度，因为有可能出现滚动条
                 再得到表头的各列的宽度,修改固定表头列宽度,使得固定表头与表格对齐
                 */
                this.resizeTableWidthHandler();//调速表格的宽度

            }

            /*
             如果没有设定列表的高度,则要自适应页面的高度,增强布局效果
             */
            if (!this.state.height) {//如果没有设定高度
                let blankHeight = this.clientHeight - this.refs.grid.getBoundingClientRect().top - 5;//当前页面的空白高度
                this.setState({
                    height: blankHeight
                })

            }
        }
    },

    //表体的监听处理事件
    onPaste: function (event) {
        //调用公共用的粘贴处理函数
        this.pasteHandler(event, this.pasteSuccess);
    },

    gridMouseDownHandler:function(event){//鼠标按下事件

        if(event.button!=2)
        {//不是鼠标右键
            if(event.target.className=="header-menu-item")
            {//点击中的就是菜单项不处理

            }
            else
            {
                this.hideMenuHandler();//隐藏菜单
            }

        }
        else
        {//又是鼠标右键
            if(event.target.className=="header-menu-item")
            {//点击中的就是菜单项不处理

            }
            else
            {//隐藏
                this.hideMenuHandler();//隐藏菜单
            }
        }

    },
    hideMenuHandler:function (event) {//外层组件的单击事件，隐藏菜单，远程更新某一行
        this.refs.headermenu.style.display="none";//表头菜单隐藏
        this.menuHeaderName=null;//清空
        this.unbindClickAway();//卸载全局单击事件
    },

    gridContextMenuHandler:function(event) {
        // event.preventDefault();//阻止默认事件
    },

    //固定表头容器的处理事件
    fixedTableMouseMoveHandler: function (event) {//表头行.拖动事件
        if (this.refs.tabledivide.style.display == "block") {//说明已经处理拖动状态
            this.refs.tabledivide.style.left = event.clientX + "px";
            event.target.style.cursor = "ew-resize";//设置鼠标样式,这样拖动不会有停滞的效果

        }
        else {

        }

    },
    fixedTableMouseUpHandler:function(event) {//保证鼠标松开后会隐藏
        this.refs.tabledivide.style.left = "0px";
        this.refs.tabledivide.style.display = "none";
    },


    //表头的处理事件
    headerMouseMoveHandler: function (event) {//表头列,鼠标经过事件,用以判断
        let position = event.target.getBoundingClientRect();
        let last=this.refs.fixedTable.getBoundingClientRect().right-position.right;
        if(last>0&&last<=3)
        {//说明是最后一列,不处理
            return;
        }
        let diff = ((position.left + position.width) - event.clientX);

        if (diff >= 0 && diff <= 3) {
            event.target.style.cursor = "ew-resize";
        }
        else {
            event.target.style.cursor = "default";

        }

    },
    headerMouseDownHandler: function (event) {//表头列,鼠标按下事件

        if (event.button==0&&event.target.style.cursor == "ew-resize") {//鼠标左键,如果有箭头,说明可以调整宽度

            this.refs.headermenu.style.display="none";//隐藏菜单

            // 先保存好,要调整宽度的是哪一列及原始宽度,并且保存当前鼠标left位置
            this.moveHeaderName = event.target.getAttribute("name");
            this.divideinitLeft = event.clientX;//初始化位置
            this.moveHeaderWidth = event.target.getBoundingClientRect().width;
            //显示分割线
            this.refs.tabledivide.style.left = event.clientX + "px";
            //计算分割线的高度
            if (this.props.pagePosition == "top" || this.props.pagePosition == "both") {//如果列表上面显示分页控件

                this.refs.tabledivide.style.height = (this.refs.grid.clientHeight - 70) + "px";
            }
            else {

                this.refs.tabledivide.style.height = (this.refs.grid.clientHeight - 35) + "px";
            }
            //显示分割线
            this.refs.tabledivide.style.display = "block";
            this.refs.grid.style.webkitUserSelect = "none";//不可以选择
        }
        else {//不可以调整宽度

            this.refs.headermenu.style.display="none";//隐藏菜单
            // 设置为空
            this.moveHeaderName = null;
            this.moveHeaderWidth = null;
            this.divideinitLeft = null;//
            this.refs.grid.style.webkitUserSelect = "text";//可以选择
        }


    },
    headerContextMenuHandler:function(event) {//显示菜单
        if(this.refs.headermenu.style.display=="block") {//已经出现了,不处理

        }
        else {//
            this.menuHeaderName = event.target.getAttribute("name");//保存当前列名
            this.refs.headermenu.style.left = (event.clientX - this.refs.grid.getBoundingClientRect().left) + "px";
            this.refs.headermenu.style.top = (event.clientY - this.refs.grid.getBoundingClientRect().top) + "px";
            this.refs.headermenu.style.display = "block";
            event.preventDefault();//阻止默认事件

        }
        this.bindClickAway();//绑定全局单击事件

    },


    //表体横行滚动的处理事件
    tableBodyScrollHandler: function (event) {//监听列表的横向滚动的事件,以便固定表头可以一同滚动
        this.refs.fixedTableContainer.style.left = "-" + event.target.scrollLeft + "px";

    },

    //分割线的处理事件
    divideMouseUpHandler: function (event) {//分割线,鼠标松开事件
        event.target.style.display = "none";
        this.refs.grid.style.webkitUserSelect = "text";//可以选择
        let diffWidth = event.clientX - this.divideinitLeft;
        if (diffWidth <= this.moveHeaderWidth - 2 * this.moveHeaderWidth) {//缩小的宽度小于原来的宽度时不处理

        }
        else {
            this.resizeCellWidthHandler(diffWidth);//调整宽度
        }
    },


    //右键菜单处理事件
    menuHideHandler:function(event) {//没有使用单击事件,用户有可能继续使用鼠标右键,隐藏某一列的事件

        let headers = this.state.headers;//列表数据
        let headerMenu=this.state.headerMenu;
        for (let index = 0; index < headers.length; index++) {
            //使用label,因为多个列可能绑定一个字段
            if (headers[index].label == this.menuHeaderName) {//需要隐藏的列
                headerMenu.push(this.menuHeaderName);//放入隐藏列中
                headers[index].hide=true;
                this.hideMenuHandler();//隐藏菜单
            }

        }
        this.setState({
            headers:headers,
            headerMenu:headerMenu
        })

    },
    menuHeaderShowHandler:function(itemIndex,label) {//没有使用单击事件,用户有可能继续使用鼠标右键,显示某列

        let headers = this.state.headers;//列表数据
        let headerMenu=this.state.headerMenu;


        for (let index = 0; index < headers.length; index++) {
            //使用label,因为多个列可能绑定一个字段
            if (headers[index].label == label) {//需要显示的列
                headerMenu.splice(itemIndex,1);//从隐藏列中删除
                headers[index].hide=false;//显示此列
                this.hideMenuHandler();//隐藏菜单

            }

        }
        this.setState({
            headers:headers,
            headerMenu:headerMenu
        })
    },

    //操作面板面板的处理事件
    panelShow:function () {//面板显示/隐藏
        this.setState({
            panelShow:!this.state.panelShow
        })
    },


    //单元格宽度调整
    resizeCellWidthHandler:function (diffWidth) {//调整单元格的宽度

        if(diffWidth) {//拖动宽度
            var fixedTableHeaderth = this.refs.fixedTable.children[0].children[0].children;
            //列表的原始表头的列
            var realTableHeaderth = this.refs.realTable.children[0].children[0].children;
            var realTableBodyTr= this.refs.realTable.children[1].children;
            for (var index = 0; index < realTableHeaderth.length; index++) {
                if (realTableHeaderth[index].getAttribute("name") == this.moveHeaderName) {
                    var width=this.moveHeaderWidth + diffWidth;
                    fixedTableHeaderth[index].style.width = (width ) + "px";
                    realTableHeaderth[index].style.width = (width) + "px";
                    //设置cell
                    fixedTableHeaderth[index].children[0].style.width = ( width - 1) + "px";
                    realTableHeaderth[index].children[0].style.width = (width - 1) + "px";

                    for(var rowIndex=0;rowIndex<realTableBodyTr.length;rowIndex++)
                    {//调整表体对应列的宽度
                        try
                        {//存在子表的问题
                            realTableBodyTr[rowIndex].children[index].children[0].style.width = ( width - 1) + "px";
                        }
                        catch (e){

                        }
                    }
                     if(diffWidth<0) {
                         this.refs.realTable.style.width = (this.refs.realTable.getBoundingClientRect().width + diffWidth).toString() + "px";
                         this.refs.fixedTable.style.width = (this.refs.realTable.getBoundingClientRect().width + diffWidth).toString() + "px";
                         this.setAlign();//调整对齐问题
                     }
                    break;
                }
            }
        }

    },

    //表格宽度调整
    resizeTableWidthHandler:function () {
        var width = null;//判断是否需要调整表格的宽度
        if ((this.refs.realTableContainer.getBoundingClientRect().width == this.refs.realTable.getBoundingClientRect().width)
            && this.refs.realTableContainer.getBoundingClientRect().height <this.refs.realTable.getBoundingClientRect().height
        ) {
            //如果列表与列表容器的宽度相同但高度高度超过了,说明刚好有内侧滚动条了，调整宽度
            width = this.refs.realTable.getBoundingClientRect().width - 10;
        }

        else if (!this.refs.fixedTable.style.width ||
            this.refs.fixedTable.style.width == "100%"
            || this.refs.realTable.getBoundingClientRect().width != this.refs.fixedTable.getBoundingClientRect().width) {
            //没有设定宽度,或者宽度不相等
            width = this.refs.realTable.getBoundingClientRect().width;
        }
        else if(this.refs.grid.getBoundingClientRect().width-20 ==this.refs.realTable.getBoundingClientRect().width ) {//页面的滚动条没有了
            width = this.refs.realTable.getBoundingClientRect().width+10;
        }



        if (width) {//如果需要调整宽度
            this.refs.fixedTable.style.width = (width) + "px";
            this.refs.realTable.style.width = (width) + "px";

        }


        this.setAlign();//调整对齐问题

    },
    setAlign:function (type) {
        //处理对齐问题
        var fixedTableHeaderth = this.refs.fixedTable.children[0].children[0].children;
        //列表的原始表头的列
        var realTableHeaderth = this.refs.realTable.children[0].children[0].children;

        for (let index = 0; index < realTableHeaderth.length; index++) {//遍历，如果原始表头的列的宽度与固定表头对应列不一样,就设置
            //设置th的宽度
            if (realTableHeaderth[index].getBoundingClientRect().width != fixedTableHeaderth[index].getBoundingClientRect().width) {
                let thwidth = realTableHeaderth[index].getBoundingClientRect().width;

                fixedTableHeaderth[index].style.width = thwidth + "px";
                realTableHeaderth[index].style.width = thwidth + "px";
                //设置cell
                fixedTableHeaderth[index].children[0].style.width = ( thwidth - 1) + "px";
                realTableHeaderth[index].children[0].style.width = (thwidth - 1) + "px";
            }
        }
    },

     //自定义列事件
    getHeaderDataHandler:function (headerUrl) {//获取自定义列
        if(!headerUrl){
            headerUrl=this.state.headerUrl;
        }
        if(headerUrl)
        {
            var fetchmodel=new FetchModel(headerUrl,this.getHeaderDataHandlerSuccess,{url:this.state.url},this.ajaxError);
            console.log("datagrid-header-get:",fetchmodel);
            unit.fetch.post(fetchmodel);
        }
        this.setState({
            loading:true,//正在加载
        })

    },
    getHeaderDataHandlerSuccess:function (result) {
        if(result.rows)
        {
            result.data=result.rows;
        }
      var filterResult=  this.headerFilterHandler(result.data);
        //更新
        this.setState({
            headers: filterResult.headers,
            remoteHeaders: filterResult.remoteHeaders,
            loading: false,//正在加载
        })

    },
    headerFilterHandler:function (remoteHeaders) {
        if(remoteHeaders&&remoteHeaders instanceof  Array) {
            let newHeaders=[];
            remoteHeaders.map((header,index)=>{
                try {
                    if(header.name&&header.label&&(header.hide!=null&&header.hide!=undefined)) {
                        let filterResult = this.state.headers.filter((filterHeader, filterIndex) => {
                            return header.name == filterHeader.name;
                        });
                        if (filterResult.length > 0) {//说明该列的显示方式已经定义过了，则使用旧的

                            newHeaders.push(filterResult[0]);//
                        }
                        else {//说明没有，则添加
                            newHeaders.push(header);//

                        }
                    }
                    else
                    {
                        throw new Error("返回的headerData 数据格式不对:{name:'',label:'',hide:true}");
                    }
                }
                catch(e) {
                    throw new Error(e.message);
                }

            })
            return {
                remoteHeaders:remoteHeaders,
                 headers:newHeaders
            }
        }
        else
        {
            return {
                remoteHeaders:remoteHeaders,
                headers:this.state.headers
            }
        }
    },

    //表格内部修改的监听事件
    rowEditHandler:function (columnIndex,value, text, name, data) {  //表格内部修改的监听事件
          if (this.state.headers[columnIndex].editor && typeof this.state.headers[columnIndex].editor.edited === "function") {
              //得到新的一行数据
              this.state.data[this.state.editIndex] = this.state.headers[columnIndex].editor.edited(value, text, this.state.data[this.state.editIndex]);//先将值保存起来，不更新状态

          }
          else if(this.state.headers[columnIndex].editor ) {
              //没有则默认以value作为值
              this.state.data[this.state.editIndex][name] = value;//先将值保存起来，不更新状态值
          }

        if(this.state.addData.has(this.state.editIndex))
        {//说明是属于新增的
            this.state.addData.set(this.getKey(this.state.editIndex),this.state.data[this.state.editIndex]);
        }
        else {//属于修改的
            this.state.updatedData.set(this.getKey(this.state.editIndex),this.state.data[this.state.editIndex]);
        }
    },

    //错误处理事件
    ajaxError:function (errorCode,message) {//错误处理事件
        Message.error(message);
    },

    //新增，修改，删除
    addRow:function(rowData,editAble) {//添加一行,如果editable为true，说明添加以后处理编辑状态
        let newData=this.state.data;
        newData.push(rowData);
        this.state.addData.set(this.getKey(newData.length-1),rowData);//添加到脏数据里
        this.setState({
            data:newData,
            addData:this.state.addData,
            editIndex:editAble?newData.length-1:null,
        });
    },
    deleteRow:function (rowIndex) {//删除指定行数据

        this.state.deleteData.push(this.state.data.splice(rowIndex,1));
        let newData=this.state.data.splice(rowIndex,1);

        this.setState({
            data:newData,
            deleteData:this.state.deleteData
        });
    },
    editRow:function (rowIndex) {//让某一个处理编辑状态

        this.setState({
            editIndex:rowIndex
        })

    },
    updateRow:function(rowIndex,rowData) {// //只读函数,更新某一行数据
        this.state.updatedData.set(this.getKey(rowIndex),rowData);//更新某一行

        if(rowIndex>=0&&rowIndex<this.state.data.length) {
            var newData = this.state.data;
            newData[rowIndex] = rowData;
            this.setState(
                {
                    data: newData,
                    updatedData: this.state.updatedData
                });
        }
    },

    //获取各类脏数据，及清空脏数据
    getAddData:function () {//获取新增数据
        var addData=[];
        for (let value of this.state.addData.values()) {
            addData.push(value);
        }
        return addData;
    },
    getUpdateData:function () {//获取被修改过的数据
        var updatedData=[];
        for (let value of this.state.updatedData.values()) {
            updatedData.push(value);
        }
        return updatedData;
    },
    getDeleteData:function () {//获取被删除的数据
      return this.state.deleteData;
    },
    clearDirtyData:function () {//清除脏数据

        //清除脏数据
        this.setState({
            addData:new Map(),
            updatedData:new Map(),
            deleteData:[],
        })
    },

}
module .exports=DataGridExtend;

