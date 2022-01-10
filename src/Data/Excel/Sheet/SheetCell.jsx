/**
 * Sheet 的表体的单元格
 * create by wangzhiyong
 * date:2021-06-26
 */
import React from "react";
import { TableCell, } from "../../Table";
class SheetCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }

    }


    render() {
        return <TableCell
            id={this.props.id}
            className={this.props.className}
            style={this.props.style}
            rowSpan={this.props.rowSpan}
            colSpan={this.props.colSpan}
            rowIndex={this.props.rowIndex}
            columnIndex={this.props.columnIndex}
            className={this.props.className || ""}
            onClick={this.props.onClick}
            onDoubleClick={this.props.onDoubleClick}
            onMouseDown={this.props.onMouseDown}
            onMouseUp={this.props.onMouseUp}
        >
            {this.props.children}
        </TableCell>

    }

}
export default SheetCell;