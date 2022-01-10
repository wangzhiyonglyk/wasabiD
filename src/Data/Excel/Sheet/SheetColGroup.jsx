/**
 * 拆分datagrid,控制列的宽度
 * 2021-05-28
 */
import React from "react";

let SheetColGroup = function (props) {
   const headers = props.headers;
   return <colgroup>
   <col key="order" name="order" width={60}></col>
   {
      headers && headers.map((header, headerColumnIndex) => {
         return (<col
            key={headerColumnIndex}
            name={header.name}
            width={header.width || props.width || null}></col>)

      })}</colgroup>;
}
export default React.memo(SheetColGroup);