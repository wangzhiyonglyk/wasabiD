/**
 * create by wangzhiyong
 * desc:文件操作
 * date:2021-07-03
 */
import React from 'react';
import Add from './Add';
import Menu from "./Menu"
import Import from './Import';
import Export from './Export';
class File extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 1,
            importIndex: 0,
            exportIndex:0,
            excelChoses: [
                { text: "增量导入", value: "add" },
                { text: "导入公式/函数", value: "formula" },
                { text: "不导入标题", value: "title" },
            ]
        }
        this.onClick = this.onClick.bind(this);
        this.onImportClick = this.onImportClick.bind(this);
        this.onExportClick=this.onExportClick.bind(this);
    }
    onClick(index) {
        if(index===0){
            this.props.closeFile&&this.props.closeFile();
        }
        else{
            this.setState({
                activeIndex: index
            })
        }
     
    }
    onImportClick(index) {
        this.setState({
            importIndex: index
        })
    }
    onExportClick(index){
        this.setState({
            exportIndex:index
        })
    }
    render() {
        return <div className="wasabi-excel-file" style={{ display: this.props.visible ? "block" : "none" }}>
            <div className="wasabi-excel-file-left">
                <Menu activeIndex={this.state.activeIndex} onClick={this.onClick}></Menu>
            </div>
            <div className="wasabi-excel-file-right">
                <Add key="1" activeIndex={this.state.activeIndex}></Add>
                <Import key="2" 
                activeIndex={this.state.activeIndex} 
                excelChoses={this.state.excelChoses} 
                importIndex={this.state.importIndex}
                onImportClick={this.onImportClick}
                 ></Import>
                <Export key="3"
                 activeIndex={this.state.activeIndex} 
                 excelChoses={this.state.excelChoses} 
                 exportIndex={this.state.exportIndex}
                 onExportClick={this.onExportClick}
                ></Export>
            </div>
        </div>
    }
}
export default File;