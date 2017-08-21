/**
 * create by wangzhiyong
 * date:2017-08-20
 * desc:标签页的内容
 *
 */
import React from 'react';

class TabPanel extends React.Component {
  constructor(props) {
    super(props);
    
  }
  static propTypes={
      title: React.PropTypes.any.isRequired//标题是必须，可以是组件
  } 
  render() {
    return <div>{this.props.children}</div>;
  }


}

module.exports= TabPanel;
