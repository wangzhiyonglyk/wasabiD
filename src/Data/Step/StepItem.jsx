/*
 create by wangzhiyong
 date:2020-11-29
 desc 步骤条单元组件
 */
import React from "react";
import PropTypes from "prop-types";
import "./index.css"
class StepItem extends React.Component {

    constructor(props) {
        super(props)
    }
    render() {
        return <div className={"wasabi-step-item " +( this.props.active? this.props.theme:" ")} >
            <div className="wasabi-step-item-header">
                <div className={"wasabi-step-line "} ></div>
                <div className={"wasabi-step-icon "}>
                    <div className="wasabi-step-icon-inner">{this.props.stepIndex}</div>
                </div>

            </div>
            <div className="wasabi-step-content">
                <div className="wasabi-step-title ">{this.props.title}</div>
                <div className="wasabi-step-desc">{this.props.children}</div>
            </div>
        </div>

    }
}
export default StepItem;