import React from "react";
import Input from "../../../../Form/Input";
import LinkButton from "../../../../Buttons/LinkButton"
let Export = function (props) {
    return <div key="3" className={"menu-item " + (props.activeIndex === 3 ? "active" : "")}>
        <label style={{ width: "100%", fontSize: 30, color: "var(--color)" }}>导出</label>
        <div className="wasabi-excel-file-import">
            <div key="1" className="wasabi-excel-file-import-left">

                <div key="1" onClick={props.onExportClick.bind(this, 0)} className={"menu-item " + (props.exportIndex === 0 ? "active" : "")} title="Excel文件">Excel文件</div>
                <div key="2" onClick={props.onExportClick.bind(this, 1)} className={"menu-item " + (props.exportIndex === 1 ? "active" : "")} title="CSV文件">CSV文件</div>
                <div key="3" onClick={props.onExportClick.bind(this, 2)} className={"menu-item " + (props.exportIndex === 2 ? "active" : "")} title="PDF文件">PDF文件</div>
            </div>
            <div key="2" className="wasabi-excel-file-import-right">
                <div className={"menu-item-panel " + (props.exportIndex === 0 ? "active" : "")} >
                    <label style={{ fontSize: 22, marginBottom: 20, width: "100%", color: "var(--success-color)" }}>Excel文件</label>
                    <div>
                        <div>导出选项</div>
                        <Input type="checkbox" style={{ width: 100 }} data={props.excelChoses}></Input>
                        <div className="import-icon">
                            <LinkButton iconCls="icon-excel" theme="info" style={{ fontSize: 30 }}></LinkButton>
                            <div style={{ textAlign: "center", marginTop: 10 }}>导出excel文件</div>
                        </div>
                    </div>

                </div>
                <div className={"menu-item-panel csv " + (props.exportIndex === 1 ? "active" : "")} >

                    <label style={{ fontSize: 22, marginBottom: 20, width: "100%", color: "var(--success-color)" }}>CSV文件</label>
                    <div>
                        <div style={{ marginBottom: 10 }}>导出选项</div>
                        <Input type="text" label="行分隔符" value="\r\n"></Input>
                        <Input type="text" label="列分隔符" value=","></Input>
                        <div className="import-icon">
                            <LinkButton iconCls="icon-csv" theme="info" style={{ fontSize: 30 }}></LinkButton>
                            <div style={{ textAlign: "center", marginTop: 10 }}>导出CSV文件</div>
                        </div>
                    </div>
                </div>
                <div className={"menu-item-panel csv " + (props.exportIndex === 2 ? "active" : "")} >

                    <label style={{ fontSize: 22, marginBottom: 20, width: "100%", color: "var(--success-color)" }}>PDF文件</label>
                    <div>
                        <div style={{ marginBottom: 10 }}>导出选项</div>
                        <Input type="text" label="标题" ></Input>
                        <Input type="text" label="作者" ></Input>
                        <Input type="text" label="关键字" ></Input>
                        <div className="import-icon">
                            <LinkButton iconCls="icon-pdf" theme="info" style={{ fontSize: 30 }}></LinkButton>
                            <div style={{ textAlign: "center", marginTop: 10 }}>导出PDF文件</div>
                        </div>
                    </div>
                </div>
            </div >
        </div>
    </div>
}
export default React.memo(Export);