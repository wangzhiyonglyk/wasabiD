//create by wangzy
//date 2016-07-27
//desc 物流跟踪信息

let React=require("react");
require("../../sass/Base/NAvigation/Track.scss");
let Track=React.createClass({
    propTypes:
    {
        model:React.PropTypes.array,//跟踪信息
        expressName:React.PropTypes.string,//快递公司名称
        exrepssId:React.PropTypes.string,//快递单号


    },
    getDefaultProps:function()
    {
        return {
            model:null,
            expressName:null,
            expressId:null,
        }
    },
    getInitialState:function()
    {
        return {
            model:this.props.model,
            expressName:this.props.expressName,
            expressId:this.props.expressId,
        }
    },
    componentWillReceiveProps:function(nextProps)
    {
        this.setState({
            model:nextProps.model,
            expressName:nextProps.expressName,
            expressId:nextProps.expressId,
        })
    },
    render:function()
    {
        if(this.state.model instanceof  Array)
        {
            return(
                <div className="wasabi-track">
              <div className="express">  <div className="expressName">{"快递公司:   "+this.state.expressName}</div><div className="expressId">{"快递单号:  "+this.state.expressId}</div></div>
                <ul >

                    {
                        this.state.model.map((child,index) =>{
                            return <li key={index}><div className="track-time">{child.time}</div><div className="track-info">{child.info}</div></li>
                        })
                    }
                </ul>
                    </div>
            )
        }
        else {
            return null;
        }
    }
});
module .exports=Track;