/**
 * create by wangzhiyong
 * desc 普通轮播组件
 * date:2020-07-15
 * todo 还有bug
 * 2021-05-12 有bug
 *
 */

import React from 'react';
import PropTypes from "prop-types";
import "../Sass/Animate/slider.css"
class Slider extends React.Component {
  constructor(props) {
    super(props);
    this.wasabislider=React.createRef();
    this.banner=React.createRef();
    this.state = {
      // interval: this.props.interval,//间隔时间
      // duration:this.props.duration,//轮播停留时间
      // direction:this.props.direction//方向

    };
  }


  componentDidMount() {


    if (this.props.auto&&!this.props.async) {
      this.setSliderAnimate();//设置滑动效果
    }
  }
  //如果子节点数量改变 要重新计算
  componentDidUpdate() {
    if (this.props.auto&&this.props.async) {
      this.setSliderAnimate();//设置滑动效果
    }
  }
  /**
   * 设置滑动
   */
  setSliderAnimate() {
    //清除定时器
    clearTimeout(this.timeout);//清除
    clearTimeout(this.interval);
    if (this.props.children) {

      if (this.props.direction == "top" || this.props.direction == "bottom") {
        this.setBannerHeight();//上下滑动
      }
      else {
        this.setBannerWidth();//左右滑动
      }

    }


  }
  //初始化节点样式
  setBannerWidth() {
    if (this.props.children) {
      if (this.props.style.width) {
        //得到当前宽度，保存起来
        let width = this.wasabislider.current.clientWidth;//获取节点宽度

        this.offset = this.props.offset ? this.props.offset : width;//偏移量
        // console.log("silder width", width);
        // console.log("wasabislider", this.wasabislider.current);
        // console.log("children", this.props.children);
        // console.log("innerHTML", this.banner.current.innerHTML);
        if (this.offset <= width) {//偏移量小于宽度
          this.offsetIndex = (width / this.offset);//求偏移个数
          for (let i = 0; i < this.banner.current.children.length; i++) {
            this.banner.current.children[i].style.width = this.offset + "px";
            this.banner.current.children[i].style.height = "100%";
          }

          this.banner.current.style.width = ((React.Children.count(this.props.children) + this.offsetIndex) * this.offset) + "px";//增N个单位，为了平滑过渡


          if (this.props.direction == "left" && !this.banner.current.style.left) {//如果没有设置值，说明是初始化

            this.banner.current.style.left = "0px";//设置为0，否则无法滚动
            this.banner.current.style.transitionDuration = this.props.interval

          }
          if (this.props.direction == "right" && !this.banner.current.style.right) {//如果没有设置值，说明是初始化
            this.banner.current.style.right = "0px";//设置为0，否则无法滚动
            this.banner.current.style.transitionDuration = this.props.interval
          }
          this.renderAttachChildren();//附加节点

          //设置定时器
          this.interval = setInterval(() => {
            this.widthAnimate();
          }, this.props.duration + this.props.interval);


        }


      }
      else {
        console.error("slider组件【left,right]未设置style的宽度");
      }
    }



  }
  //初始化节点样式
  setBannerHeight() {
    if (this.props.children) {
      //得到当前高度，保存起来
      if (this.props.style.width) {
        let height = this.wasabislider.current.getBoundingClientRect().height;//获取节点宽度
        this.offset = this.props.offset ? this.props.offset : height;//偏移量
        if (this.offset <= height) {//偏移量小高度
          this.offsetIndex = height % this.offset + 1;//求徐，偏移个数
          for (let i = 0; i < this.banner.current.children.length; i++) {
            this.banner.current.children[i].style.height = this.offset + "px"
            this.banner.current.children[i].style.width = "100%";
          }

          this.banner.current.style.height = ((React.Children.count(this.props.children) + this.offsetIndex) * this.offset) + "px";//增N个单位，为了平滑过渡

          if (!this.banner.current.style.top) {//如果没有设置值，说明是初始化
            this.banner.current.style.top = "0px";//设置为0，否则无法滚动
            this.banner.current.style.transitionDuration = this.props.interval + "ms";
          }
          this.renderAttachChildren();//附加节点

          //设置定时器
          this.interval = setInterval(() => {
            this.heightAnimate();
          }, this.props.duration + this.props.interval);

        }
      }
      else {
        console.error("slider组件【top,bottom]未设置style的高度");
      }

    }



  }
  /**
   * 左右移动
   *
   */
  widthAnimate() {
    if (this.stop) {
      return;
    }
    let newWidthOffset = 0;//最新的偏移宽度
    let nextIndex = 1;//下一张下标
    let preIndex = 0;////上一张


    if (this.props.direction == "left") {
      newWidthOffset = parseInt(this.banner.current.style.left ? this.banner.current.style.left : 0) + this.offset * -1;//下一张
      nextIndex = ((newWidthOffset * -1) / this.offset);//下一张下标（将要展示的一张)

      preIndex = nextIndex - 1 >= 0 ? nextIndex - 1 : React.Children.count(this.props.children) - 1;//上一张

    }
    else {
      newWidthOffset = parseInt(this.banner.current.style.right ? this.banner.current.style.right : 0) + this.offset * -1;//下一张
      nextIndex = React.Children.count(this.props.children) + this.offsetIndex - 1 - ((newWidthOffset * -1) / this.offset);//下一张下标（将要展示的一张)
      preIndex = nextIndex + 1 >= React.Children.count(this.props.children) + this.offsetIndex ? React.Children.count(this.props.children) + this.offsetIndex - 1 : nextIndex + 1;//上一张

    }
    // console.log("newWidthOffset",React.Children.count(this.props.children)+this.offsetIndex,preIndex,nextIndex)
    //处理子元素的动画
    for (let i = 0; i < this.banner.current.children.length; i++) {
      if (preIndex !==i) {//非上一张恢复透明
        this.banner.current.children[i].style.opacity = 1;
        this.banner.current.children[i].style.transitionProperty = null;
        this.banner.current.children[i].style.transitionDuration = "0ms";
      }
      else {//上一张（即将要消失的一张）设置透明
        this.banner.current.children[i].style.opacity = 0.4;
        this.banner.current.children[i].style.transitionProperty = "opacity";
        this.banner.current.children[i].style.transitionDuration = this.props.interval + "ms";
      }

    }

    if (newWidthOffset == React.Children.count(this.props.children) * this.offset * -1) {
      //下一张又是(第一张（左）/最后一张（右）)，等待开始的一张的动画执行完成，恢复到banner最初的状态
      this.timeout = setTimeout(() => {
        this.banner.current.style.transitionDuration = "0ms";
        this.props.direction == "left" ? this.banner.current.style.left = "0px" : this.banner.current.style.right = "0px"
      }, this.props.interval);

    }
    this.banner.current.style.transitionDuration = this.props.interval + "ms";
    this.props.direction == "left" ? this.banner.current.style.left = newWidthOffset + "px" : this.banner.current.style.right = newWidthOffset + "px";
  }

  /**
   * 手动滚动
   */
  refresh(){
    if(!this.props.auto){
    this.setSliderAnimate();//设置滑动效果
  }
}

  /**
 * 上下移动,下暂时不做
 * @param {number} direction()
 */
  heightAnimate() {
    if (this.stop) {
      return;
    }
    let newTop = parseInt(this.banner.current.style.top ? this.banner.current.style.top : 0) + this.offset * (this.props.direction == "top" ? -1 : 1);//下一张
    let nextIndex = ((newTop * -1) / this.offset);//下一张下标（将要展示的一张)
    nextIndex = nextIndex % React.Children.count(this.props.children);//求余
    let preIndex = nextIndex - 1 >= 0 ? nextIndex - 1 : React.Children.count(this.props.children) - 1;//上一张

    //处理子元素的动画
    for (let i = 0; i < this.banner.current.children.length; i++) {
      if (preIndex !==i) {//非上一张恢复透明
        this.banner.current.children[i].style.opacity = 1;
        this.banner.current.children[i].style.transitionProperty = null;
        this.banner.current.children[i].style.transitionDuration = "0ms";
      }
      else {//上一张（即将要消失的一张）设置透明
        this.banner.current.children[i].style.opacity = 0.4;
        this.banner.current.children[i].style.transitionProperty = "opacity";
        this.banner.current.children[i].style.transitionDuration = this.props.interval + "ms";
      }

    }

    if (newTop == React.Children.count(this.props.children) * this.offset * (this.props.direction == "top" ? -1 : 1)) {
      //下一张又是第一张，等待第一张的动画执行完成，恢复到banner最初的状态
      this.timeout = setTimeout(() => {
        this.banner.current.style.transitionDuration = "0ms";
        this.banner.current.style.top = "0px";
      }, this.props.interval);

    }
    this.banner.current.style.transitionDuration = this.props.interval + "ms";
    this.banner.current.style.top = newTop + "px";
  }


  /**
   * 添加多余的节点
   */
  renderAttachChildren() {
    //更新一下，为了添加多余节点

    if (this.props.children && this.banner.current.children.length < React.Children.count(this.props.children) + this.offsetIndex) {
      //

      let innerHTML = this.banner.current.innerHTML;

      if (this.props.direction == "left" || this.props.direction == "top") {
        for (let i = 0; i < this.offsetIndex; i++) {

          innerHTML += this.banner.current.children[i].outerHTML;
        }
      }
      else {

        for (let i = this.banner.current.children.length - 1; i >= this.banner.current.children.length - this.offsetIndex; i--) {

          innerHTML = this.banner.current.children[i].outerHTML + innerHTML;
        }
      }



      this.banner.current.innerHTML = innerHTML;
    }



  }
  /**
   * 鼠标停留事件
   */
  onMouseOver() {
    this.stop = true;
  }
  /**
   * 鼠标离开事件
   */
  onMouseOut() {
    this.stop = false;
  }

  componentWillUnmount() {
    //清除定时器
    clearTimeout(this.timeout);//清除
    clearTimeout(this.interval);

  }
  render() {
    console.log(this.props.children)
    return <div ref={this.wasabislider}  className={"wasabi-slider" + " " + this.props.className} style={this.props.style} onMouseOver={this.onMouseOver.bind(this)} onMouseOut={this.onMouseOut.bind(this)}>
      <div className="banner" ref= {this.banner}>
        {
          this.props.children
        }

      </div>



    </div>
  }
}
Slider.defaultProps = {
  interval: 2000,
  duration: 2000,
  direction: "left",
  offset: 0,
  async: true,
  auto:true,
}
Slider.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,//
  offset: PropTypes.number,//是否自定义宽度
  interval: PropTypes.number,//轮播间隔时间
  duration: PropTypes.number,//轮播停留时间
  direction: PropTypes.oneOf(["left", "right", "top"]),//todo bottom后期再支持
  async: PropTypes.bool,//是否在更新后滚动
  auto:PropTypes.bool,//是否自动滚动
}

export default Slider;
