/**
 * 手机模拟器
 */

import React from "react";
import PropTypes from 'prop-types';
import func from "../../libs/func"
import "./index.css"
class Simulator extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            containerid: func.uuid(),
            frameid: func.uuid(),
        }

    }
    render() {
      return   <div className={"wasabi-preview-phone " + this.props.className} style={this.props.style} >
           
                <div className="wasabi-preview-top">
                    <i></i>
                    <span></span>
                </div>
                <div className="wasabi-preview-home"></div>
                <div className="wasabi-preview-view">
                    {
                        this.props.url ? <iframe id="wasabi-preview" src={this.props.url}  scrolling="yes"></iframe> :
                            this.props.children
                    }

                </div>
            
        </div>
    }
}
Simulator.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    url: PropTypes.string,//url地址
}
export default Simulator;