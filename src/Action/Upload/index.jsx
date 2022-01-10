/*/
 create by wangzhiyong
 date:2016-05-17
 edit:2020-03-13
 edit 2020-11-20 拆分成两个，保留原始，做兼容处理
 desc:文件上传组件
 */
import React, { Component } from 'react';
import PlainUpload from "./PlainUpload"
import BreakUpload from "./BreakUpload"
class Upload extends React.PureComponent {
  constructor(props) {
    super(props);
    this.pupload = React.createRef();
    this.bupload = React.createRef();
  }
  open() {
    if (this.props.plain) {
      this.pupload.current.open();
    }
    else {
      this.bupload.current.open();
    }

  }
  close() {
    if (this.props.plain) {
      this.pupload.current.close();
    }
    else {
      this.bupload.current.close();
    }
  }
  render() {
    if (this.props.plain) {
      return <PlainUpload ref={this.pupload} {...this.props}></PlainUpload>
    }
    else {
      return <BreakUpload ref={this.bupload} {...this.props}></BreakUpload>
    }
  }



}
Upload.defaultProps={
  plain:true
}
export default Upload;