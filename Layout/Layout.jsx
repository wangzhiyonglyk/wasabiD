/*
create by wangzhiyong
date:2017-02-09
desc:圣杯布局
 */

var React = require("react");
require("../Sass/Layout/Layout.css");
class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.calWidthHeight = this.calWidthHeight.bind(this);
    }
    static propTypes = {
        width: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        height: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    }
    static defaultProps = {
        width: "100%",
        height: null
    }
    calWidthHeight() {
        //计算center的高度与宽度
        let centerHeight = 0;
        let centerWidth = 0;
        let top = 0;
        let left=0;
        React.Children.map(this.props.children, (child, index) => {
            switch (child.props.title) {
                case "header":
                    centerHeight += child.props.height ? child.props.height : 100;//默认100
                    top = child.props.height ? child.props.height : 100;
                    break;
                case "footer":
                    centerHeight += child.props.height ? child.props.height : 100;
                    break;
                case "left":
                    centerWidth += child.props.width ? child.props.width : 100;
                    left =child.props.width ? child.props.width : 100;
                    break;
                case "right":
                    centerWidth += child.props.width ? child.props.width : 100;
                    break;

            }
        })
        return {
            width: centerWidth ? centerWidth : null,
            height: centerHeight ? centerHeight : null,
            top: top,
            left:left
           
        }
    }
    render() {
        let widthHeight = this.calWidthHeight();//计算宽高
        return <div className={"wasabi-layout clearfix"}
            style={{ width: this.props.width, height: this.props.height }}  >
            {
                React.Children.map(this.props.children, (child, index) => {
                    switch (child.props.title) {
                        case "center":
                            return React.cloneElement(child, { key: index, ref: index, ...widthHeight });
                        case "left":
                            return React.cloneElement(child, { key: index, ref: index, top: widthHeight.top, height: widthHeight.height });
                        case "right":
                            return React.cloneElement(child, { key: index, ref: index, top: widthHeight.top, height: widthHeight.height });
                        default:
                            return React.cloneElement(child, { key: index, ref: index });

                    }
                })
            }</div>
    }
}

module.exports = Layout;