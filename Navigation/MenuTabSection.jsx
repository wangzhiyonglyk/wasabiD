//create by wangzy
//date:2016-04-05后开始独立改造
//标签页
var React =require("react");
var TabSection=React.createClass(
    {
        propTypes:
            {
                url:React.PropTypes.string,
                active:React.PropTypes.bool,
            },

        getDefaultProps:function()
        {
            return {
                active:false,
            }
        },
        getInitialState:function()
        {
            var  height=document.documentElement.clientHeight-80;
            return{
                bodyHeight:height
            }
        },
        // componentWillReceiveProps(nextProps) {
        //     this.setState(nextProps);
        // },
        componentDidMount:function()
        {

        },

        render: function () {
            if(this.props.url.indexOf("pendingOrder")>-1)
            {
                console.log("pendingOrder");
            }
            return (  <section ref="tabsection" style={{height:this.state.bodyHeight}} className={this.props.active==true?"checkedsection":"tabsection"}>
                <iframe src={this.props.url} style={{height:this.state.bodyHeight}} ></iframe>
            </section>);
        }
    }
);
module .exports=TabSection;