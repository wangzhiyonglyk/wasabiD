/**
 * 基础输入框
 * create by wangzhiyong
 * date:2021-04-16
 */
import React from "react";

const BaseInput = React.forwardRef((props, ref) => {
    return <input
        type={"text"}//类型固定好
        {...props}
        ref={ref}
        className={"wasabi-input " + (props.className || "")}
        value={props.value || ""}
        autoComplete="off" />

})
export default React.memo( BaseInput);


