/**
 * create by wangzhiyong
 * date:2017-08-20
 * desc:标签页的内容
 *
 */
import React from "react";
import PropTypes from "prop-types";
class TabPanel extends React.Component {
  constructor(props) {
   
    super(props);
    this.ref=React.createRef();
    this.refresh=this.refresh.bind(this);
  } 
  static propTypes={
      title: PropTypes.any.isRequired,//标题是必须，可以是组件
      closeAble:PropTypes.bool,//是否可以关闭
      iconCls:PropTypes.string
  } 
  static defaultProps={
    closeAble:true,
    iconCls:"icon-txt"
  }
  /**
   * 刷新
   */
  refresh(){
    try{
      if(this.ref.current.children&&this.ref.current.children.length>0&&this.ref.current.children[0].nodeName==="IFRAME")
      {
       this.ref.current.children[0].contentWindow.location.href=this.ref.current.children[0].contentWindow.location.href;
      }
      else{
       this.forceUpdate(); 
      }
      this.props.refresh&&this.props.refresh(this.props.index);
    }
    catch(e){

    }
 
    
  }
  render() {
    return <div ref={this.ref} style={this.props.style} className={"section  "  + (this.props.active ? "active" : "")}  >
    { this.props.children}
</div>
  }


}

export default TabPanel;
