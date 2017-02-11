/*
create by wangzhiyong
date:2017-02-09
desc:圣杯布局
 */

var React =require("react");
require("../Sass/Layout/Layout.scss");
class Layout extends  React.Component{
constructor(props)
{
    super(props);

}
    render() {

        let style = this.props.style ? this.props.style : {};
         style.width=this.props.width;
         style.height=this.props.height;
         console.log(style);
        return <div className="wasabi-layout" style={style}>{  this.props.children}</div>
    }
}
Layout.propTypes={
    width: React.PropTypes.oneOfType([
        React.PropTypes.number,
        React.PropTypes.string,

    ]),//宽度
    height: React.PropTypes.oneOfType([
        React.PropTypes.number,
        React.PropTypes.string,
    ]),//高度
    style:React.PropTypes.object,
    className:React.PropTypes.string,

}

Layout.defaultProps={
    ...Layout.defaultProps,
    width:"100%",
    height:"100%",
    style:null,
    className:""
}

module .exports= Layout;