/**
 * Created by wangzhiyong on 2016/10/25.
 * 将原有的单击与双击事件
 * 将新增的 ,粘贴,拖动,鼠标右键,滚动,固定表头,固定列等功能
 * 作为DataGrid扩展功能
 */
let React=require("react");
var unit=require("../libs/unit.js");
var FetchModel=require("../model/FetchModel.js");
var Message=require("../Base/unit/Message.jsx");
let DataGridExtend= {
    onClick: function (rowData, rowIndex) {
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
            this.props.onClick(rowIndex, rowData);//注意参数换了位置,因为早期版本就是这样子
        }

    },
    onDoubleClick: function (rowData, rowIndex) {
        if (this.props.onDoubleClick != null) {
            this.props.onDoubleClick(rowIndex, rowData);

        }
    },
    onPaste: function (event) {
        //调用公共用的粘贴处理函数
        this.pasteHandler(event, this.pasteSuccess);
    },
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
    setWidthAndHeight: function () {//重新计算列表的高度,固定的表头每一列的宽度
        if (this.refs.grid.parentElement.className == "wasabi-detail") {//如果列表是在详情列表中不处理

        }
        else { //主列表


            //固定表头的列
            var headerTableHeader = this.refs.headertable.children[0].children[0].children;
            //列表的原始表头的列
            var bodyTableHeader = this.refs.bodytable.children[0].children[0].children;

            for (let index = 0; index < bodyTableHeader.length; index++) {//遍历，如果原始表头的列的宽度与固定表头对应列不一样,就设置
                if (bodyTableHeader[index].getBoundingClientRect().width != headerTableHeader[index].getBoundingClientRect().width) {
                    headerTableHeader[index].children[0].style.width = bodyTableHeader[index].getBoundingClientRect().width + "px";
                }
            }
            //监听列表的横向滚动的事件,以便固定表头可以一同滚动
            this.refs.tablebody.onscroll = this.tablebodyScrollHandler;//
            if (!this.state.height) {
                this.setState({
                    height: this.clientHeight - this.refs.grid.getBoundingClientRect().top - 5//底部留点空白
                })

            }
        }
    },
    tablebodyScrollHandler: function (event) {//监听列表的横向滚动的事件,以便固定表头可以一同滚动
        this.refs.tablefixHeader.style.left = "-" + event.target.scrollLeft + "px";

    },
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

    headerMouseMoveHandler: function (event) {//表头列,鼠标经过事件,用以判断
        let position = event.target.getBoundingClientRect();
        let last=this.refs.headertable.getBoundingClientRect().right-position.right;
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
        if (event.target.style.cursor == "ew-resize") {//如果有箭头,说明可以调整宽度

            // 先保存好,要调整宽度的是哪一列及原始宽度,并且保存当前鼠标left位置
            this.moveHeaderName = event.target.getAttribute("name");
            this.divideinitLeft = event.clientX;//初始化位置
            this.moveHeaderWidth = event.target.getBoundingClientRect().width;
            //显示分隔线
            this.refs.tabledivide.style.left = event.clientX + "px";
            //计算分隔线的高度
            if (this.props.pagePosition == "top" || this.props.pagePosition == "both") {//如果列表上面显示分页控件

                this.refs.tabledivide.style.height = (this.refs.grid.clientHeight - 70) + "px";
            }
            else {

                this.refs.tabledivide.style.height = (this.refs.grid.clientHeight - 35) + "px";
            }
            //显示分隔线
            this.refs.tabledivide.style.display = "block";
            this.refs.grid.style.webkitUserSelect = "none";//不可以选择
        }
        else {//不可以调整宽度
            //设置为空
            this.moveHeaderName = null;
            this.moveHeaderWidth = null;
            this.divideinitLeft = null;//
            this.refs.grid.style.webkitUserSelect = "text";//可以选择
        }


    },
    divideMouseUpHandler: function (event) {//分隔线,鼠标松开事件
        let diffWidth = event.clientX - this.divideinitLeft;
        if (diffWidth <= this.moveHeaderWidth - 2 * this.moveHeaderWidth) {//缩小的宽度小于原来的宽度时不处理

            //分割线隐藏
            event.target.style.left = "0px";
            event.target.style.display = "none";

            this.refs.grid.style.webkitUserSelect = "text";//可以选择
        }
        else {
            let headers = this.state.headers;//列表数据
            var headerTableHeader = this.refs.headertable.children[0].children[0].children;//当前列表样式

            for (let index = 0; index < headers.length; index++) {
                if (headers[index].name == this.moveHeaderName) {//需要调整的列的宽度
                    headers[index].width = this.moveHeaderWidth + diffWidth;
                    //值设置为空
                    this.moveHeaderName = null;
                    this.moveHeaderWidth = null;
                    this.divideinitLeft = null;
                    //分割线隐藏
                    event.target.style.left = "0px";
                    event.target.style.display = "none";
                    //重新设置表格宽度,否则在100%下调整宽度效果不明显
                    var newwidth = this.refs.headertable.getBoundingClientRect().width + diffWidth;
                    this.refs.headertable.style.width = newwidth + "px";
                    this.refs.bodytable.style.width = newwidth + "px";

                }
                else {//非要调整的列
                    if (headers[index].width) {//已经自定义过宽度了

                    }
                    else {//没自定义过宽度的,则根据当前效果得到实际宽度,以避免页面出现晃动,这里不能用map
                        for (var filterIndex = 0; filterIndex < headerTableHeader.length; filterIndex++) {
                            if (headerTableHeader[filterIndex].getAttribute("name") == headers[index].name) {
                                headers[index].width = headerTableHeader[filterIndex].getBoundingClientRect().width;//获取当前列的宽度
                            }
                        }

                    }

                }
            }

            this.setState({
                headers: headers
            })
        }
    },
}
module .exports=DataGridExtend;