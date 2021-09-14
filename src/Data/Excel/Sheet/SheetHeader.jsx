/**
 * Sheet 的头部
 * create by wangzhiyong
 * date:2021-06-26
 */
import React from "react";
import { TableHead, TableCell, TableRow } from "../../Table";
class SheetHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        let headers = this.props.headers;
        return <TableHead><TableRow>
            <TableCell position="header" key="order" ></TableCell>
            {
            headers && headers.map((header, headerColumnIndex) => {
                return <TableCell key={'header-' + headerColumnIndex.toString()} position="header" align={header.align}>{header.label} </TableCell>
            })}</TableRow></TableHead>
    }

}
export default SheetHeader;