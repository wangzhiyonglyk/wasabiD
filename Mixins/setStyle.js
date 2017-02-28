//create by wangy
//date:2016-08-02
//将设置自定义样式独立出来
let React=require("react");
let SetStyle= {
    setStyle: function (type) {
        var style = this.props.style;
        if (style) {
        }
        else {
            style = {};
        }

        if (this.props.width != null) {
            style.width = this.props.width;//设置了宽度属性为最先级别
            if (type && type == "input") {//因为表单组件设置了一个最小宽度，所以一定除去这个属性
                style.minWidth = this.props.width;//一定要设置这个否则跟原有的样式产生冲突
            }

        }
        else {
            if (style.width) {//用户设置宽度,
                if (type && type == "input") {//因为表单组件设置了一个最小宽度，所以一定除去这个属性
                    style.minWidth = style.width;//一定要设置这个否则跟原有的样式产生冲突

                }
            }
        }

        if(this.props.height)
        {
            style.height=this.props.height;
        }

        if (type && type == "input") {

            style.display = this.state.hide == true ? "none" : "block";
        }
        return style;
    }
}
module.exports=SetStyle;
