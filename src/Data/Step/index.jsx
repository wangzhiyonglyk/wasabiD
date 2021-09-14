/*
 create by wangzhiyong
 date:2020-11-29
 desc 步骤条组件
 */
import React from "react";
import PropTypes from "prop-types";
import("./index.css")
class Step extends React.Component {

    constructor(props) {
        super(props)
        this.state={
            activeIndex:this.props.activeIndex,
            oldPropsActiveIndex:this.props.activeIndex,
        }
    }
    static getDerivedStateFromProps(props, state) {
        if (props.activeIndex != state.oldPropsActiveIndex) {
            return {
                activeIndex: props.activeIndex,
                oldPropsActiveIndex: props.activeIndex
            }
        }
        return null;
    }
    setActiveIndex(index){
        this.setState({
            activeIndex:index
        })
    }
    render() {
      
        return  <div className={"wasabi-step "+this.props.className} style={this.props.style}>
             {
                      React.  Children.map(this.props.children, (child, index) => {

                           
                            if (typeof child.type !== "function") {//非react组件
                                return child;
                            } else {
                                return React. cloneElement(child, {key: index, theme:this.props.theme,active:this.state.activeIndex!=null&&this.state.activeIndex!=undefined&&this.state.activeIndex>=(index)?true:false,stepIndex:(index+1) })
                            }

                        })
                    }
        </div>

    }
}

Step.propTypes = {
    activeIndex: PropTypes.number,
    style: PropTypes.object,
    className: PropTypes.string,
    theme: PropTypes.oneOf([
        //主题
        'primary',
        'default',
        'success',
        'info',
        'warning',
        'danger',
        'cancel'
    ]),

};
Step.defaultProps = {
    theme: "default"
};
export default Step;