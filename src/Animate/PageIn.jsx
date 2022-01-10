import React from 'react';
import PropTypes from 'prop-types'
class PageIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        animate: -1,//0为关闭，1为打开，-1为隐藏
    };
  }
 /**
     * 先设置为空
     */
    componentWillReceiveProps(){
        //先隐藏
        // this.setState({
        //     animate:-1
        // }) 
       
    }
    componentWillUnmount(){
        clearTimeout( this.timeout);
    }
    componentDidMount(){
        if(this.props.autoOpen){
            this.open();
        }
    }
 
    /**
     * 打开 
     */
    open(){
        this.timeout= setTimeout(() => {
            this.setState({
                animate:1
            }) 
           
        }, 20);
    }
    /**关闭 */
    close(){
        this.timeout= setTimeout(() => {
            this.setState({
                animate:0
            }) 
           
        }, 20);
    }
    
    /**
     * 双击关闭
     */
    onDoubleClick(){
         this.props.ableClose&&this.close();
         this.props.close&&this.props.close()
    }
  render() {
  return <div  onDoubleClick={this.onDoubleClick.bind(this)} className={"wasabi-section  " +(this.props.className||"")+" "+(this.state.animate==1?  "wasabi-section-anim "+this.props.inAnimate+"In":this.state.animate==0? "wasabi-section-anim "+this.props.inAnimate+"Out":"")} style={this.props.style}>{this.props.children}</div>
  }


}

PageIn.defaultProps = {
   inAnimate:"scale",
  }
  PageIn.propTypes = {
      className:PropTypes.string,//样式
    style: PropTypes.object,//样式，
    autoOpen:PropTypes.bool,//是否自动打开
    inAnimate:PropTypes.oneOf(["scale",//从中心放大
                             "slideLeft",//从左侧滑出
                             " slideRight",//从右侧滑出
                             "slideUp",//从顶部滑出
                             "slideDown",//从底部滑出
                            
                ]),//数据 
                autoOpen:PropTypes.bool,//是否自动打开
                ableClose:PropTypes.bool,//是否允许关闭

  }


export default PageIn;
