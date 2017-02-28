/*
 create by wangy
 date:2016-04-05后开始独立改造
 desc:树组件
 */
let React=require("react");
require("../Sass/Data/MenuTree.scss");
var MenuTree = React.createClass({
    propTypes: {
        collapsed: React.PropTypes.bool,//是否允许折叠
        defaultCollapsed:React. PropTypes.bool,//默认是否折叠
        nodeLabel:React. PropTypes.node.isRequired,//当前节点组件
        arrowClass:React. PropTypes.string,//当前箭头样式
        nodeClass:React. PropTypes.string,//当前节点样式
    },
    getInitialState() {
        return {collapsed: this.props.defaultCollapsed};
    },

    handleClick(...args) {
        this.setState({collapsed: !this.state.collapsed});
        if (this.props.onClick) {
            this.props.onClick(...args);
        }
    },

    render() {
        const {
            collapsed = this.state.collapsed,
            arrowClass = '',
            itemClassName = '',
            nodeLabel,
            nodeClass="",
            children

            } = this.props;

        let arrowClassName = 'tree-view_arrow';
        let containerClassName = 'tree-view_children';
        if (collapsed) {
            arrowClassName += ' tree-view_arrow-collapsed';
            containerClassName += ' tree-view_children-collapsed';
        }

        const arrow =
            <div

                className={arrowClassName+" "+arrowClass }
                onClick={this.handleClick} />;

        return (
            <div className="tree-view">
                <div   className={'tree-view_item ' + nodeClass}>
                    {arrow}
                    {nodeLabel}
                </div>
                <div className={containerClassName}>
                    {children}
                </div>
            </div>
        );
    },
});

module.exports=MenuTree;
