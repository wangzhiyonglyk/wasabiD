//create by wangzhiyong
//date 2016-07-27
//desc 物流跟踪信息

import React from "react";
import PropTypes from "prop-types";
import "../sass/Navigation/Track.css"
class Track extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            model: this.props.model,
            expressName: this.props.expressName || "",
            expressId: this.props.expressId,
        }
    }
    render() {
        if (this.props.model instanceof Array) {
            return (
                <div className="wasabi-track">
                    <div className="express" style={{ display: this.state.expressName || this.state.expressId ? "block" : "none" }}>  <div className="expressName"
                    >{"快递公司:   " + this.state.expressName}</div><div className="expressId">{"快递单号:  " + this.state.expressId}</div></div>
                    <ul >

                        {
                            this.props.model.map((child, index) => {
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
}

Track.propTypes = {
    model: PropTypes.array,//物流信息
    expressName: PropTypes.string,//快递公司名称
    exrepssId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),//快递单号
}

export default Track;