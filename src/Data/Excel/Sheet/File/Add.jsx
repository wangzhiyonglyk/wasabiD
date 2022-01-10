import React from "react";
let Add = function (props) {
    return <React.Fragment>
        <div key="2" className={"menu-item " + (props.activeIndex === 1 ? "active" : "")}>
            <label style={{ width: "100%", fontSize: 30, color: "var(--color)" }}>新建</label>
            <div className="newfile">
                <img style={{ width: 210 }} src={require("./excel.svg")}></img>
                <label htmlFor="" style={{ width: "100%", fontSize: "var(--font-size)", color: "var(--color)" }}>空白工作薄</label>

            </div>
        </div>
    </React.Fragment>
}

export default React.memo(Add)