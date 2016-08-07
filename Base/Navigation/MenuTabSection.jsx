//create by wangzy
//date:2016-04-05后开始独立改造
//标签页
var React =require("react");
var TabSection=React.createClass(
    {
        propTypes:
        {
            url:React.PropTypes.string,
            active:React.PropTypes.bool
        },

        getDefaultProps:function()
        {
            return {
                active:false
            }
        },
        getInitialState:function()
        {
            let height=(window.screen.height)-165;
            if(document.body.clientHeight>0){
                height=document.body.clientHeight-40;
            }
         return{
                bodyHeight:height
            }
        },
        componentDidMount:function()
        {

        },

        render: function () {
            return (  <section ref="tabsection" style={{height:this.state.bodyHeight}} className={this.props.active==true?"checkedsection":"tabsection"}>
                <iframe src={this.props.url} style={{height:this.state.bodyHeight}} ></iframe>
            </section>);
        }
    }
);
module .exports=TabSection;