/**
 * 拆分datagrid,控制列的宽度
 * 2021-05-28
 */
import React from "react";
import config from "../config";
import func from "../../../libs/func";
class GridColGroup extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        let tableWidth = 0;
        let colgroup = [];
        if (!(this.props.headers instanceof Array)) {
            return;
        }
        if (this.props.detailAble) {
            colgroup.push(<col key="wasabi-detail-column" name="wasabi-detail-column" width={config.detailWidth}></col>)
            tableWidth += config.detailWidth;
        }
        //处理序号列的宽度
        if (this.props.rowNumber) {
            colgroup.push(<col key="wasabi-order-column" name="wasabi-order-column" width={config.orderWidth}></col>)
            tableWidth += config.orderWidth;
        }
        //处理选择列的宽度
        if (this.props.selectAble) {
            colgroup.push(<col key="wasabi-select-column" name="wasabi-select-column" width={config.selectWidth}></col>)
            tableWidth += config.selectWidth;
        }
        this.props.headers.map((trheader, headerRowIndex) => {
            if (trheader instanceof Array) {
                trheader.map((header, headerColumnIndex) => {
                    if ((header.colSpan && header.colSpan > 1)) {
                        //跨几列的不用渲染
                        return;
                    }
                    else {
                        let width = header.width ? header.width : this.props?.headerWidth&&this.props?.headerWidth[header.name||trheader.label] || config.minWidth;
                        tableWidth += width;
                        colgroup.push(<col
                            key={headerRowIndex + "-" + headerColumnIndex}
                            name={header.name||header.label}//name可能没有设置
                            width={width}></col>)
                    }
                });
            } else {
                let width = trheader.width ? trheader.width : this.props?.headerWidth&&this.props?.headerWidth[trheader.name||trheader.label] || config.minWidth;
                tableWidth += width;
                colgroup.push(<col
                    key={headerRowIndex}
                    name={trheader.name || trheader.label}
                    width={width}></col>)
            }
        })
       
        if (document.getElementById(this.props.realTableId)) {
            document.getElementById(this.props.realTableId).style.width = tableWidth + "px";
        }
        if (document.getElementById(this.props.fixTableId)) {
            document.getElementById(this.props.fixTableId).style.width = tableWidth + "px"; 
          
        }
        return <colgroup >
            {
                colgroup
            }
        </colgroup>;
    }
}
export default GridColGroup;