/*
 create by wangzhiyong
 date:2020-11-29
 desc 进度条组件重新开发
 */
import React from "react";
import PropTypes from "prop-types";
import func from "../../libs/func"
class CircleProgress extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cantainerid:Math.random().toString(36).slice(-8) + 'cantainer',
            canvasid: Math.random().toString(36).slice(-8) + 'canvas',
            oldPropsValue: null,
            value: this.props.value||"",//初始化的0
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.value != state.oldPropsValue) {
            return {
                value: props.value||"",
                oldPropsValue: props.value
            }
        }
        return null;
    }
    componentDidMount() {
        this.setCanvasWidthAndHeight();
    }
    componentDidUpdate(){
        this.setCanvasWidthAndHeight();
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
            this.draw();
        } else {


        }
    }
    /**
     * 绘制
     */
    draw() {
        let c = document.getElementById(this.state.canvasid)
        if (c) {
            let ctx = c.getContext('2d');
            requestAnimationFrame(() => {
                ctx.clearRect(0, 0, this.width, this.height)//先清除
                ctx.fillStyle = 'rgba(255, 255, 255, 0)'
                ctx.fillRect(0, 0, this.width, this.height)//先清除

                let activeSAngle = -90; let activeEAngle =-90+ (this.state.value / 100) * 360;
                let color = "var(--primary-color)";//颜色
                switch (this.props.theme) {
                    case "primary":
                    case "default":
                        color = "var(--primary-color)";
                        break;
                    case "success":
                        color = "var( --success-color)";
                        break;
                    case "info":
                        color = "var(--info-color)";
                        break;
                    case "warning":
                        color = "var(--warning-color)";
                        break;
                    case "danger":
                        color = "var(--danger-color)";
                        break;

                }
                let radius = this.width / 2;//半径

                this.drawCricle(ctx, activeSAngle, activeEAngle, radius, color);//激活环
               this.drawCricle(ctx, activeEAngle, 360-90, radius, "var(--border-color)");//非激活
               this.drawCricle(ctx, 0, 360, radius - 6, "#ffffff");//空白环

            });


        }
    }

    /**
 * 画百分比环
 * @param {*} ctx 画布
 * @param {*} sAngle 开始角度
 * @param {*} eAngle 结束角度
 * @param {*} radius 半径
 * @param {*} color 颜色值
 */
    drawCricle(ctx, sAngle, eAngle, radius, color) {

        if (this.width) {
            ctx.beginPath()
            ctx.moveTo(this.width / 2, this.height / 2)
            if (radius > 0) {
                ctx.arc(this.width / 2, this.height / 2, radius, (Math.PI * (sAngle / 180)), Math.PI * (eAngle / 180))
                ctx.closePath()
                ctx.fillStyle = color;
                ctx.fill()
            }

        }

    }

    setValue(value) {
        this.setState({
            value: value
        },()=>{
            this.setCanvasWidthAndHeight();
          
        })
    }
    getValue() {
        return this.state.value
    }


    componentWillUnmount() {
        clearTimeout(this.time);
    }
    render() {
        let style = this.props.style ? func.clone(this.props.style) : {}
        style.width = (style.width) || 126
        style.height = (style.height) || 126//设置
    
        return <div id={this.state.cantainerid} className={"wasabi-progress wasabi-progress-circle " + this.props.className} style={style} >
            <canvas width={style.width} height={style.height} id={this.state.canvasid} className="circle"></canvas>
            <div className={"wasabi-progress-text " + this.props.theme} >{this.props.text?this.props.text:this.state.value+"%"}</div></div>
    }
}

CircleProgress.propTypes = {
    value: PropTypes.number,
    text:PropTypes.oneOfType([PropTypes.number,PropTypes.string,PropTypes.node]),
    style: PropTypes.object,
    className: PropTypes.string,
    theme: PropTypes.oneOf([
        //主题
        'primary',
        'default',
        'success',
        'info',
        'warning',
        'danger',
        'cancel'
    ]),

};
CircleProgress.defaultProps = {
    value: 0,
    theme: "default"
};
export default CircleProgress;