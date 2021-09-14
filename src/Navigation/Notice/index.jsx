/**
通知组件
create:wangzhiyong
date:2021-07-28
*/
import React from "react";
import "./notice.css"
class Notice extends React.PureComponent{
    constructor(props){
        super(props);
    }
    render(){
        return <div className="wasabi-notice">
            {this.props.data&&this.props.data.map((item,index)=>{
                return <div key={index} className="wasabi-notice-item" onClick={this.props.onClick&&this.props.onClick.bind(this,item)}>
                    <div className="wasabi-notice-left">
                      {item.iconCls}
                    </div>
                    <div className="wasabi-notice-right">
                        <div className="wasabi-notice-right-title">{item.title}</div>
                        <div className="wasabi-notice-right-subtitle">{item.subtitle}</div>
                        <div className="wasabi-notice-right-date">{item.date}</div>
                    </div>
                </div>
            })}
        </div>
    }
}

export default Notice;