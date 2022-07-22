/**
 * create by wangzhiyong 树型表格视图
 * date:2022-01-06 因为虚拟列表的原因，要容器与视图拆分
 * 2022-01-06 修复树表格的单击事件的bug
 */


import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import DataGrid from "../DataGrid";
import TreeView from "../Tree/TreeView";
import "./index.css"
import config from './config';
import func from '../../libs/func';


function TreeGrid(props, ref) {
    const grid = useRef(null);
    const [width, setWidth] = useState(config.leftWidth);
    const [treegridid] = useState(func.uuid());
    const [divideid] = useState(func.uuid());

    let treeTopHeight = 0;//计算得到表头的高度 todo
    if (props.headers instanceof Array && props.headers.length > 0) {
        if (props.headers[0] instanceof Array) {
            treeTopHeight = props.headers.length * config.topHeight;
        }
        else {
            treeTopHeight = config.topHeight;;
        }
    }
    /**
        * 表格的单击事件
        * @param {*} rowData 
        * @param {*} rowIndex 
        */
    const dataGridClick = useCallback(
        (rowData, rowIndex) => {
            props.onClick && props.onClick((rowData[props.idField] ?? rowIndex));
        },
        []
    )
    /**
     * 分隔线事件
     */
    const onDivideMouseMove = useCallback((event) => {
        let divide = document.getElementById(divideid);
        let treegrid = document.getElementById(treegridid);
        treegrid.style.userSelect = "none";
        let left = treegrid.getBoundingClientRect().left;
        divide.style.left = (event.clientX - left) + "px";//这个位置才是相对容器的位置
    }, [])
    const onDivideMouseUp = useCallback((event) => {
        let divide = document.getElementById(divideid);
        divide.style.display = "none";
        let treegrid = document.getElementById(treegridid);
        treegrid.style.userSelect = null;
        setWidth(parseInt(divide.style.left));
        document.removeEventListener("mousemove", onDivideMouseMove);
        document.removeEventListener("mouseup", onDivideMouseUp);
    }, [])

    /**
  * 左侧树的鼠标监听事件
  * @param {*} event 
  */
    const onMouseMove = useCallback((event) => {
        try {
            let offsetX = event && event.nativeEvent && event.nativeEvent.offsetX;
            let width = event.target.getBoundingClientRect().width;
   
            if (width - offsetX <= 4) {
                console.log("width",width,event.target)
                event.target.style.cursor = "ew-resize";
            }
            else {
                event.target.style.cursor = "pointer";

            }
        }
        catch (e) {

        }

    }, [])
 
    const onMouseDown = useCallback((event) => {
        if (event.target.style.cursor === "ew-resize") {
            document.getElementById(divideid).style.left = event.target.getBoundingClientRect().width + "px";
            document.getElementById(divideid).style.display = "block";
            document.addEventListener("mousemove", onDivideMouseMove);
            document.addEventListener("mouseup", onDivideMouseUp);

        }
    })

    useImperativeHandle(ref, () => ({
        /**
             * 设置焦点行
             * @param {*} id 
             */
        setFocus(id) {
            grid?.current.setFocus(id);
        }
    }))
    return <div className={"wasabi-treegrid "} id={treegridid}>
        <div className="wasabi-treegrid-left" style={{ width: width }} >
            <div className="wasabi-treegrid-configuration" onMouseMove={onMouseMove} onMouseDown={onMouseDown}
                style={{ height: treeTopHeight, lineHeight: treeTopHeight + "px" }}>
                {props.treeHeader}
            </div>
            <div className="wasabi-treegrid-rowsData"  >
                <TreeView {...props}
                    //  取消虚线
                    dottedAble={false}
                ></TreeView>
            </div>
        </div>
        <div className="wasabi-treegrid-right"  style={{width:`calc(100% - ${width}px)`}}>
            <DataGrid ref={grid} pagination={false} rowNumber={false}
                priKey={props.idField || "id"}
                headers={props.headers} data={props.visibleData}
                onClick={dataGridClick}
            ></DataGrid>
        </div>
        <div className="wasabi-treegrid-divide" id={divideid}></div>
    </div>
}

export default React.memo(React.forwardRef(TreeGrid), (pre, next) => { return !func.diff(pre, next, false) });