/**
 * create by wangzhiyong
 * desc 普通轮播组件
 * date:2020-07-29
 *
 */

import React from 'react'
import PropTypes from 'prop-types'
import func from "../libs/func"
import('../Sass/Animate/chart.css')

class RotateChart extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      cantainerid: Math.random().toString(36).slice(-8) + 'canvas' ,
      canvasid: Math.random().toString(36).slice(-8) + 'canvas' ,
      textid: Math.random().toString(36).slice(-8) + 'text' ,
      text: '',
      stop: false,
    }
  }

  /**
   * 生成动画
   */
  animate(index=0) {
    this.clear()//清除定时器 
    if (this.props.data && this.props.data instanceof Array && this.props.data.length > 0) {

      this.activeIndex = index//激活下标
      this.draw(this.props.data, this.activeIndex)//先绘制

      if (this.props.disabled) {
        return;//不处理动画
      }
      let time = 1//旋转次数,因为每次转60度
      this.interval = setInterval(() => {
        if (this.stop) {
          return;
        }
        let canvas = document.getElementById(this.state.canvasid)
        let text = document.getElementById(this.state.textid)
        text.style.opacity = 0;
        text.style.transitionProperty = 'opacity'
        text.style.transitionDuration = (this.props.interval || 2000) + 'ms'
        if (time > 6) {
          time = 1//转完一圈了
        }
        let anger = time * 60//旋转角度
        canvas.style.transitionProperty = 'all'
        canvas.style.transitionDuration = (this.props.interval || 2000) + 'ms'
        canvas.style.transform = 'rotate(' + (anger) + 'deg)'



        if (anger == 360) {//转完了一圈了，立马回归
          setTimeout(function () {
            canvas.style.transitionProperty = null
            canvas.style.transitionDuration = '0ms'
            canvas.style.transform = 'rotate(0deg)'

          }, this.props.interval || 2000)
        }

        //此处处理文字，及重绘制环
        {
          this.timeout = setTimeout(() => {
            this.activeIndex++;
            this.props.oneFinishHandler && this.props.oneFinishHandler(this.activeIndex - 1);//转完一个
            if (this.activeIndex == this.props.data.length) {
              this.activeIndex = 0;
              this.props.finishHandler && this.props.finishHandler();//转完一圈
            }
            this.draw(this.props.data, this.activeIndex)//重新绘制
            text.style.fontSize = (this.props.fontSize || 24) + 'px'
            text.style.transitionProperty = 'opacity';
            text.style.opacity = 1;
            text.style.transitionDuration = (this.props.interval || 2000) + 'ms'
          }, (this.props.interval || 2000))

        }
        time++//追加一次，为了下一次
      }, this.props.interval * 2 || 4000)
    }
  }

  /**
   * 画出所有比例环
   * @param {*} arr 数据
   * @param {*} activeIndex 当前激活的环
   */
  draw(arr, activeIndex) {
    let c = document.getElementById(this.state.canvasid)
    if (c) {
      let ctx = c.getContext('2d')
      let start = 0//开始角度
      let model = []//数据模型
      if (arr instanceof Array && arr.length <= 8) {
        let sumAngle = 360 - (arr.length * 2)//总共多少度
        let sum = 0;//求和
        if(this.props.countType=="sum"){
          for (let i = 0; i < arr.length; i++) {
            sum += arr[i]
          }
          for (let i = 0; i < arr.length; i++) {
            model.push({
              sAngle: start,
              eAngle: start + ((arr[i] / sum) * sumAngle).toFixed(this.props.decimal ? 2 : 0) * 1,
            })
            start += ((arr[i] / sum) * sumAngle).toFixed(this.props.decimal ? 2 : 0) * 1 + 2//下一个开始
          }
        }else{//直接传的就是百分比
          for (let i = 0; i < arr.length; i++) {
            let angle=parseFloat(arr[i]);
              angle=angle>1?angle/100:angle;//百分比转成小数
              model.push({
              sAngle: start,
              eAngle: start + angle*sumAngle,
            })
            start += angle*sumAngle + 2//下一个开始
          }
        }
        requestAnimationFrame(() => {
          ctx.clearRect(0, 0, this.width, this.height)//先清除
          ctx.fillStyle = 'rgba(255, 255, 255, 0)'
          ctx.fillRect(0, 0, this.width, this.height)//先清除
          // ctx.globalAlpha=.5;
          for (let i = 0; i < model.length; i++) {
            if (i == activeIndex) {
              //画激活环
              if (typeof this.props.activeColor == 'string') {
                // console.log("activeColor",this.props.activeColor);
                this.drawCricle(ctx, model[i].sAngle, model[i].eAngle, this.props.activeColor, true)
              } else {
                this.drawCricle(ctx, model[i].sAngle, model[i].eAngle, this.props.activeColor[i], true)
              }


            } else {
              //画环
              if (typeof this.props.color == 'string') {
                this.drawCricle(ctx, model[i].sAngle, model[i].eAngle, this.props.color, false)
              } else {
                this.drawCricle(ctx, model[i].sAngle, model[i].eAngle, this.props.color[i], false)
              }


            }

          }
          //画文字
          let text = this.props.text instanceof Array && this.props.text.length > 0 ?
           this.props.text[activeIndex] : this.props.countType=="sum"? (arr[activeIndex] * 100 / sum).toFixed(this.props.decimal ? 2 : 0) + '%':(arr[activeIndex]+"").replace("%","")+"%"
          this.drawText(ctx, text)
        })
      }
    }


  }

  /**
   * 画百分比环
   * @param {*} ctx 画布
   * @param {*} sAngle 开始角度
   * @param {*} eAngle 结束角度
   * @param {*} color 颜色值
   * @param {*} active 是否为激活
   */
  drawCricle(ctx, sAngle, eAngle, color, active) {

    if (this.width) {
      ctx.beginPath()
      ctx.moveTo(this.width / 2, this.height / 2)
      let radius = this.width / 2
      if (radius > 0) {
        if (active) {
          ctx.arc(this.width / 2, this.height / 2, radius, Math.PI * (sAngle / 180), Math.PI * (eAngle / 180))
        } else {

          ctx.arc(this.width / 2, this.height / 2, (radius - 5), (Math.PI * (sAngle / 180)), Math.PI * (eAngle / 180))
        }
        ctx.closePath()
        ctx.fillStyle = color
        ctx.fill()
      }

    }

  }

  /**
   * 画内部文字效果
   * @param {*} ctx
   * @param {*} text
   */
  drawText(ctx, text) {

    let radius = this.width / 2
    //画空白环
    ctx.beginPath()
    ctx.arc(this.width / 2, this.height / 2, radius - this.props.ringRadius, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fillStyle = this.props.blankColor//
    ctx.fill()

    //画内部环
    ctx.beginPath()
    ctx.arc(this.width / 2, this.height / 2, this.props.innerRadius || radius / 2, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fillStyle = this.props.innerColor
    ctx.fill()

    //  //文字
    //  ctx.font = "bold 14px Microsoft YaHei";
    // ctx.fillStyle = '#ff0';
    // ctx.textAlign = 'center';
    // ctx.textBaseline = 'middle';
    // ctx.moveTo(x, y);
    // ctx.fillText(text, x, y);
    //改为html
    let textc = document.getElementById(this.state.textid)

    if(  textc)
    {
      textc.style.fontSize = (this.props.fontSize || 24) + 'px'
      textc.style.opacity = 1;
      document.getElementById(this.state.textid).innerHTML = text
    }
   
  

  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.data && (this.props.data && (nextProps.data.join(",") != this.props.data.join(",")) || !this.props.data)) {
      //数据有改变
      this.refresh();
    }
  }

  componentDidMount() {
    this.refresh();
  }

  componentDidUpdate() {

  }

  refresh() {
    this.setCanvasWidthAndHeight()//设置好canvas的高度与宽度
    setTimeout(() => {
      this.animate()
    }, 250)
  }
  /**
   * 清除定时器
   */
  clear() {
    let canvas = document.getElementById(this.state.canvasid);
    let text = document.getElementById(this.state.textid);
    if (canvas) {
      canvas.style.transitionProperty = null
      canvas.style.transitionDuration = '0ms'
      canvas.style.transform = 'rotate(0deg)'

      text.style.transitionProperty = null;
      text.style.transitionDuration = '0ms';
      text.style.opacity = 1;

    }
    this.interval && clearInterval(this.interval)
    this.timeout && clearTimeout(this.timeout)
  }

  /**
   * 设置canvas宽度与高度
   */
  setCanvasWidthAndHeight() {
    let cantainer = document.getElementById(this.state.cantainerid)
    //样式因隐藏或者父组件未渲染等原因无法获取宽与高
    let width = cantainer.clientWidth || parseInt(cantainer.style.width);
    let height = cantainer.clientHeight || parseInt(cantainer.style.height);

    let c = document.getElementById(this.state.canvasid)
    if (width && width > 5 && height > 5) {
      this.width = width
      this.height = height
      c.setAttribute('width', this.width)
      c.setAttribute('height', this.height)
    } else {
      //仍然未获取 到宽度与高度，todo 

    }


  }

  componentWillUnmount() {
    this.clear()
  }
  onMouseOver() {
    if (this.props.ableStop) {
      this.stop = true;
    }

  }
  onMouseOut() {
    if (this.props.ableStop) {
      this.stop = false;
    }
  }

  /**
   * 旋转到指定的下标
   * @param {*} index 
   */
  turnIndex(index){
    this.animate(index);
  }

  render() {
    let style = this.props.style ? func.clone(this.props.style) : {}
    style.width = (style.width) || 100
    style.height = (style.height) || 100//设置

    let fontStyle = {}
    fontStyle.color = this.props.fontColor
    fontStyle.fontSize = (this.props.fontSize || 24) + 'px'
    return <div onMouseOver={this.onMouseOver.bind(this)} onMouseOut={this.onMouseOut.bind(this)} className="rotateChart" id={this.state.cantainerid} style={style}>
      <canvas width={style.width} height={style.height} id={this.state.canvasid} className="chart"></canvas>
      <div id={this.state.textid} className="text" style={fontStyle}>{this.state.text}</div>

    </div>
  }
}

RotateChart.defaultProps = {
  style: { width: 100, height: 100 },//样式，或者百分比
  activeColor: '#ffa63f',//激活颜色
  color: '#c3c3c3',//非激活颜色
  blankColor: 'white',
  innerColor: 'transparent',//
  fontColor: '#ffa63f',
  fontSize: 24,
  ringRadius: 12,//
  innerRadius: 20,//内圆半径
  interval: 2000,
  ableStop: true,
  countType:"sum",
}
RotateChart.propTypes = {
  style: PropTypes.object,//样式，最重要的宽度与高度，用数字与百分比也可以，百分比父容器的高度与宽度必须有值
  activeColor: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),//激活颜色
  color: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),//非激活颜色
  blankColor: PropTypes.string,//空白颜色
  innerColor: PropTypes.string,//内圆颜色值
  fontColor: PropTypes.string,//内圆内文字颜色
  fontSize: PropTypes.number,//字体大小
  ringRadius: PropTypes.number,//环宽度
  innerRadius: PropTypes.number,//内圆半径
  interval: PropTypes.number,//动画间隔时间
  data: PropTypes.array,//所传数据，里面是数值型[1,2,3,4,5]
  text: PropTypes.array,//所传文字说明
  ableStop: PropTypes.bool,//是否可以停止
  finishHandler: PropTypes.func,//转完一圈响应事件
  oneFinishHandler: PropTypes.func,//转完一个响应事件
  disabled: PropTypes.bool,//是否不允许动画
  decimal: PropTypes.bool,//是否保留小数
  countType:PropTypes.oneOf(["sum","void"]),//是求和,还是直接显示
}
export default RotateChart;
