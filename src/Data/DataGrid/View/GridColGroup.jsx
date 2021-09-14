/**
 * 拆分datagrid,控制列的宽度
 * 2021-05-28
 */
import React from "react";

class GridColGroup extends React.PureComponent{
    constructor(props){
        super(props);
        this.state={

        }
        this.renderSingleColGroup=this.renderSingleColGroup.bind(this);
        this.renderComplexColGroup=this.renderComplexColGroup.bind(this);
    }
  
    renderSingleColGroup(colgroup) {
        let headers = this.props.headers;
        headers.map((header, headerColumnIndex) => {
                let width = header.width ? header.width : this.props.perColumnWidth || null;
                colgroup.push(<col
                    key={headerColumnIndex}
                    name={header.name||""}
                    width={width}></col>)
            
        });
        return colgroup;
    }
    renderComplexColGroup(colgroup) {
       this.props.headers.map((trheader, headerRowIndex) => {
            if (trheader instanceof Array) {
                trheader.map((header, headerColumnIndex) => {
                    if ((header.colSpan && header.colSpan > 1)) {
                        //跨几列的不用渲染
                        return;
                    }
                    else {
                        let width = header.width ? header.width : this.props.perColumnWidth || null;
                        colgroup.push(<col
                            key={headerRowIndex + "-" + headerColumnIndex}
                            name={header.label}//以label为准，是因为name可能没有设置
                            width={width}></col>)
                    }
                });
            }
        });
        return colgroup;
    }
    render(){
        let colgroup = [];
        if (!(this.props.headers instanceof Array)) {
            return;
        }
        if (this.props.detailAble) {
            colgroup.push(<col key="wasabi-check-column" name="wasabi-check-column" width={30}></col>)
        }
        //处理序号列的宽度
        if (this.props.rowNumber) {
            colgroup.push(<col key="wasabi-order-column" name="wasabi-order-column" width={60}></col>)
        }
        //处理选择列的宽度
        if (this.props.selectAble) {
            colgroup.push(<col key="wasabi-check-column" name="wasabi-check-column" width={36}></col>)
        }
        if (this.props.single) {
            colgroup = this.renderSingleColGroup(colgroup);
        }
        else {

            colgroup = this.renderComplexColGroup(colgroup);
        }
        return <colgroup id={this.props.colgroupid}>{colgroup}</colgroup>;
    }
}
export default GridColGroup;