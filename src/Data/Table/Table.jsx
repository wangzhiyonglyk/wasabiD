import React from "react";
import PropTypes from 'prop-types';
import "./table.css"
class Table extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        }

    }
    render() {
        return <table id={this.props.id} className={" wasabi-table " + (this.props.className || "")} style={this.props.style}>{
            this.props.children
        }</table>
    }
}
Table.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
}


export default Table;