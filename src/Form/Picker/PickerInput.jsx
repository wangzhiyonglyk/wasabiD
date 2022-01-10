/**
 * create by wangzhiyong
 * date:2021-04-20
 * desc:为了日期组件定制的输入框，独立出来
 */
import React from "react";
import BaseInput from "../BaseInput";
const PickerInput =React.forwardRef((props,ref)=>{
        const{value,name,title,placeholder,readOnly,required,show,onClear,onClick}=props;
        const inputProps ={name,title,placeholder,readOnly,required};
        return <React.Fragment>
            <i className={"combobox-clear icon-clear"} onClick={onClear} style={{ display: readOnly ? "none" : !value ? "none" : "inline" }}></i>
            <i className={"comboxbox-icon icon-caret-down " + (show ? "rotate" : "")} onClick={onClick}></i>
            <BaseInput ref={ref} {...inputProps} value={value||""} onClick={onClick} onChange={()=>{}} />
        </React.Fragment>

    
});
export default PickerInput;