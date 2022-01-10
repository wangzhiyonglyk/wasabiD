import React from "react";
import PropTypes from 'prop-types';

class TableCell extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        }
        this.renderCell = this.renderCell.bind(this);
        this.renderTd = this.renderTd.bind(this);
        this.renderTh = this.renderTh.bind(this);
    }
    renderCell() {
        return <div data-rowindex={this.props.rowIndex} data-columnindex={this.props.columnIndex}
         colSpan={this.props.colSpan || 1} rowSpan={this.props.rowSpan || 1} 
          style={this.props.style}
         className={"wasabi-table-cell  "}
            title={typeof this.props.children === "string" ? this.props.children : ""}>
            {
                this.props.children
            }
        </div>;
    }
    renderTh() {
     
        return <th   name={this.props.name} className={(this.props.className || "") + (this.props.position !== "body" ? ' nowrap ' : "")}
         align={this.props.align} 
         style={this.props.thStyle}
         colSpan={this.props.colSpan || 1} rowSpan={this.props.rowSpan || 1} 
            onClick={this.props.onClick} 
            onDoubleClick={this.props.onDoubleClick}
            onMouseDown={this.props.onMouseDown}
            onMouseUp={this.props.onMouseUp}
            onMouseMove={this.props.onMouseMove}
            onMouseOut={this.props.onMouseOut}
            >
            {this.renderCell()}
        </th>
    }
    renderTd() {
        
        return <td  name={this.props.name}  id={this.props.id} data-rowindex={this.props.rowIndex} 
        data-columnindex={this.props.columnIndex} 
        align={this.props.align} 
         colSpan={this.props.colSpan || 1} rowSpan={this.props.rowSpan || 1} 
         style={this.props.tdStyle}
         className={(this.props.className || "") + (this.props.position !== "body" ? ' nowrap ' : "")}  
            onClick={this.props.onClick} onDoubleClick={this.props.onDoubleClick}
            onMouseDown={this.props.onMouseDown}
            onMouseUp={this.props.onMouseUp}
            onMouseMove={this.props.onMouseMove}
            onMouseOut={this.props.onMouseOut}
        >
            {this.renderCell()}
        </td>
    }

    render() {
        switch (this.props.position || "body") {
            case "header":
                return this.renderTh();

            default:
                return this.renderTd();

        }

    }
}
TableCell.propTypes = {
    rowSpan: PropTypes.number,
    colSpan: PropTypes.number,
    position: PropTypes.oneOf(["header", "body", "footer"]),//位置  
}
TableCell.defaultProps = {
    rowSpan: 1,
    colSpan: 1,
    position: "body",
}

export default TableCell;