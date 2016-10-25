/**
 * Created by wangzhiyong on 2016/10/25.
 * 将原有的单击与双击事件
 * 将新增的 ,粘贴,拖动,鼠标右键等功能
 * 作为DataGrid扩展功能
 */
let React=require("react");
let DataGridExtend={
    onClick:function(rowData,rowIndex){
        if(this.props.selectChecked==true) {
            let key=this.getKey(rowIndex);//获取关键字
            if(this.state.checkedData.has(key)) {
                this.onChecked(rowIndex, "");
            }
            else {
                this.onChecked(rowIndex,key);
            }
        }
        if(this.props.onClick!=null)
        {
            this.props.onClick(rowIndex,rowData);//注意参数换了位置,因为早期版本就是这样子
        }

    },
    onDoubleClick:function(rowData,rowIndex) {
        if(this.props.onDoubleClick!=null)
        {
            this.props.onDoubleClick(rowIndex,rowData);
        }
    },

}
module .exports=DataGridExtend;