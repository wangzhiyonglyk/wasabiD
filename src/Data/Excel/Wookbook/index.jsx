/**
 * create by wangzhiyong
 * date:2021-06-27
 * 工作簿，包含一个或多个工作表
 */
import React from "react";
import Sheet from "../Sheet"
class Workbook extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        
        }
    }
    componentDidMount(){
       
    }
    render() {
        return <div className="wasabi-excel-workbook">
            {
                this.props.sheets&&this.props.sheets.length>0&&this.props.sheets.map((sheet,index)=>{
                  return  <Sheet active={index===this.props.activeIndex} key={index} sheet={sheet}></Sheet>
                })
            }
        </div>
    }
}

export default Workbook;