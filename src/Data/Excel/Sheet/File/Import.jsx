import React from "react";
import Input from "../../../../Form/Input";
import LinkButton from "../../../../Buttons/LinkButton"
let Import = function (props) {
    return <div key="2" className={"menu-item " + (props.activeIndex === 2 ? "active" : "")}>
        <label style={{ width: "100%", fontSize: 30, color: "var(--color)" }}>导入</label>
        <div className="wasabi-excel-file-import">
            <div key="1" className="wasabi-excel-file-import-left">

                <div key="1" onClick={props.onImportClick.bind(this, 0)} className={"menu-item " + (props.importIndex === 0 ? "active" : "")} title="Excel文件">Excel文件</div>
                <div key="2" onClick={props.onImportClick.bind(this, 1)} className={"menu-item " + (props.importIndex === 1 ? "active" : "")} title="CSV文件">CSV文件</div>

            </div>
            <div key="2" className="wasabi-excel-file-import-right">
                <div className={"menu-item-panel " + (props.importIndex === 0 ? "active" : "")} >
                    <label style={{ fontSize: 22, marginBottom: 20, width: "100%", color: "var(--success-color)" }}>Excel文件</label>
                    <div>
                        <div>打开选项</div>
                        <Input type="checkbox" style={{ width: 100 }} data={props.excelChoses}></Input>
                        <div className="import-icon">
                            <LinkButton iconCls="icon-excel" theme="info" style={{ fontSize: 30 }}></LinkButton>
                            <div style={{ textAlign: "center", marginTop: 10 }}>导入excel文件</div>
                        </div>
                    </div>

                </div>
                <div className={"menu-item-panel csv " + (props.importIndex === 1 ? "active" : "")} >

                <label style={{ fontSize: 22, marginBottom: 20, width: "100%", color: "var(--success-color)" }}>CSV文件</label>
                    <div>
                        <div  style={{marginBottom:10}}>打开选项</div>
                        <Input type="text" label="行分隔符" value="\r\n"></Input>
                        <Input type="text" label="列分隔符" value=","></Input>
                        <div className="import-icon">
                            <LinkButton iconCls="icon-csv" theme="info" style={{ fontSize: 30 }}></LinkButton>
                            <div style={{ textAlign: "center", marginTop: 10 }}>导入CSV文件</div>
                        </div>
                    </div>
                </div>

            </div >
        </div>
    </div>
}

export default React.memo(Import);