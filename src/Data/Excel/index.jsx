/**
 * Excel组件
 * create by wangzhiyong
 * date:2021-06-26
 */
import React from "react";
import Workbook from "./Wookbook";
import SheetTabs from "./SheetTabs";
import sheetFunc from "./sheetFunc";
import "./excel.css"
class Excel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            workbook: {
                sheets: [],
                title: "",
            }
        }
    }
    componentDidMount() {
        if (!this.props.workbook){
            let sheet1 = sheetFunc.init();//初始化一个工作表
            // let sheet2 = sheetFunc.init("sheet2");//初始化一个工作表
            this.setState({
                workbook: {
                    sheets: [sheet1],
                    title: "工作表1",
                    activeIndex:0,
                }
            })
        }
      
    }
    render() {
        let sheetTabs = [];
        const { sheets } = this.state.workbook;
        if (sheets && sheets.length > 0) {
            for (let i = 0; i < sheets.length; i++) {
                sheetTabs.push({
                    title: sheets[i].title
                })
            }
        }
        return <div className={"wasabi-excel " + (this.props.className || "")} style={this.props.style}>
            <Workbook sheets={this.state.workbook.sheets||[]} activeIndex={this.state.workbook.activeIndex}></Workbook>
            <SheetTabs sheetTabs={sheetTabs} activeIndex={this.state.workbook.activeIndex}></SheetTabs>
        </div>
    }
}
export default Excel;