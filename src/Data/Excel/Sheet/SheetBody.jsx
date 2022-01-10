/**
 * Sheet 的表体
 * create by wangzhiyong
 * date:2021-06-26
 */
import React from "react";
import { TableBody, TableRow } from "../../Table";
import SheetCell from "./SheetCell"
class SheetBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }

    }


    render() {
        //渲染表体
        let trArr = [];
        this.props.cells && this.props.cells.map((rowData, rowIndex) => {
            let tds = [];
            rowData && rowData.length > 0 && rowData.map((cell, columnIndex) => {
                if(cell.hide!==true)
                {
                    let className = cell.wrap === true ? " excel-td " : "excel-td ellipsis ";
                    let style = {
                        textAlign: cell.align || null,
                        fontWeight: cell.bold || null,
                        fontStyle: cell.italic || null,
                        textDecoration: cell.underline || null,
                        fontFamily: cell.fontFamily || null,
                        fontSize: cell.fontSize || null,
                        color: cell.color || null,
                        backgroundColor:cell.backgroundColor||null,
                    };
                    tds.push(
                        <SheetCell
                            onClick={this.props.onClick.bind(this, rowIndex, columnIndex, cell.label)}
                            onDoubleClick={this.props.onDoubleClick.bind(this, rowIndex, columnIndex, cell.label)}
                            onMouseDown={this.props.onMouseDown.bind(this, rowIndex, columnIndex, cell.label)}
                            onMouseUp={this.props.onMouseUp.bind(this, rowIndex, columnIndex,cell.rowSpan,cell.colSpan)}
                            id={rowIndex+"-"+columnIndex}
                            rowIndex={rowIndex}
                            columnIndex={columnIndex}
                            rowSpan={cell.rowSpan}
                            colSpan={cell.colSpan}
                            key={'cell-' + rowIndex.toString() + '-' + columnIndex.toString()}
                            className={className}
                            style={style}>
                            {cell.label}
                        </SheetCell>
                    );
                }else{
                
                }
               
              
            });
            trArr.push(
                <TableRow key={'row' + rowIndex.toString()}  >
                    <SheetCell className="wasabi-order-column">{rowIndex + 1}</SheetCell>
                    {tds}
                </TableRow>
            );

        });
        return <TableBody>{trArr}</TableBody>;
    }

}
export default SheetBody;