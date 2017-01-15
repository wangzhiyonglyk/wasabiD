//create by wangzy
//date:2016-04-05后开始独立改造
//标签页
var React =require("react");
class TabSection extends  React.Component {
    constructor(props) {
        super(props);
        var height = document.documentElement.clientHeight - 40;
        this.state = {
            bodyHeight: height,
            active:this.props.active,
        }
    }

    static  propTypes =
        {
            url: React.PropTypes.string,
            active: React.PropTypes.bool
        }

    static  defaultProps = {
        active: false
    }

    render() {
        if (this.props.url.indexOf("pendingOrder") > -1) {
            console.log("pendingOrder");
        }
        return (<section ref="tabsection" style={{height: this.state.bodyHeight}}
                         className={this.state.active == true ? "checkedsection" : "tabsection"}>
            <iframe src={this.props.url} style={{height: this.state.bodyHeight}}></iframe>
        </section>);
    }
}

export  default TabSection;