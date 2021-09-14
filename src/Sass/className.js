const defaultClassName={
    input:"wasabi-input"
}

/**
 * 
 * @param {*} name 组件名
 * @param {*} className 其他类
 * @returns 
 */
 function makeClassName(name, className="") {
    return (defaultClassName[name]||"")+" "+className;
}

export default makeClassName;

