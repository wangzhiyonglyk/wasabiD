
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
  validate () {
    let isva = true;
    for (let v in this.refs) {
        //如果没有验证方法说明不是表单控件，保留原来的值
        isva = this.refs[v].validate ? this.refs[v].validate() : isva;
    }
    return isva;
}
getData () {
    var data = {}
    for (let v in this.refs) {      
        if (this.refs[v].props.name&&this.refs[v].getValue) {//说明是表单控件
            if (this.refs[v].props.name.indexOf(",") > -1) {//含有多个字段
                var nameSplit = this.refs[v].props.name.split(",");
                if (this.refs[v].getValue()) {
                    var valueSplit = this.refs[v].getValue().split(",");
                    for (let index = 0; index < nameSplit.length; index++) {
                        if (index < valueSplit.length) {
                            data[nameSplit[index]] = valueSplit[index];
                        }
                    }

                }
                else {
                    for (let index = 0; index < nameSplit.length; index++) {
                        data[nameSplit[index]] = null;
                    }
                }
            }
            else {
                data[this.refs[v].props.name] = this.refs[v].getValue();
            }
        }
        else if(this.refs[v].getData){//布局组件或者表单组件
            data=Object.assign(data,this.refs[v].getData())
        } 


    }
    return data;
}

setData (data) {//设置值,data是对象

    if (!data) {
        return;
    }
    for (let v in this.refs) {
        if (this.refs[v].props.name&&data[this.refs[v].props.name]) {
            this.refs[v].setValue&&this.refs[v].setValue(data[this.refs[v].props.name]);
        }
        else if(this.refs[v].setData)
            {//表单或者布局组件
                this.refs[v].setData(data);
            }
    }
}
clearData () {
    for (let v in this.refs) {
      this.refs[v].setValue && this.refs[v].setValue("");
        this.refs[v].clearData && this.refs[v].clearData();
    }
}
  render() {
    return <div className="container">{
         React.Children.map(this.props.children, (child, index) => {
            if(typeof child.type !=="function" )
            {//非react组件
              return child;
            }
            else{
              return React.cloneElement(child, { key: index, ref: index })
            }
           
        })
      }</div>;
  }

}

module.exports=Container;
