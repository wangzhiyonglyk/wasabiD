
/**
 * cretate by wangzhiyong
 * date:2017-08-20
 * desc 对应bootstrap中风格布局中的容器
 */
import React from 'react';

class Container extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="container">{this.props.children}</div>;
  }

}

module.exports=Container;
