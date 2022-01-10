/**
 * create by wangzhiyong
 * date:2021-07-28
 * desc:分隔线
 */
 import React from "react";

import "./separator.css"
 class Separator extends React.PureComponent{
     constructor(props){
         super(props);
     }
     render(){
       return  <div className={"wasabi-separator " +(this.props.className||"") +" " +(this.props.theme||"")} style={this.props.style}>
            <span className={"wasabi-separator-text"}>{this.props.children}</span>
         </div>
     }
 }

 export default Separator;