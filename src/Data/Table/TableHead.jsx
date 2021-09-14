import React from "react";
import PropTypes from 'prop-types';

class TableHead extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        }

    }
    render() {
        return <thead className={this.props.className} style={this.props.style} onClick={this.props.onClick||null}
        onDoubleClick={this.props.onDoubleClick} >{
                this.props.children
            }</thead>
    }
}
TableHead.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
    onDoubleClick: PropTypes.func,
}


export default TableHead;