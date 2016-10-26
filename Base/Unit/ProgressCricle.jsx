/**
 * Created by 42591 on 2016/10/21.
 * 环形进度条组件
 */
let React = require("react");
let ReactDOM = require("react-dom");
var ProgressCricle = React.createClass({
    propTypes: {
        progress: React.PropTypes.number.isRequired,//进度
        color: React.PropTypes.string,//字体和圆环颜色
        radius: React.PropTypes.number//内圆半径
    },
    getDefaultProps: function(){
        return {
            progress: 0,
            color: '#72d0f4',
            radius: 50
        };
    },
    getInitialState: function(){
        return {
            progress: this.props.progress,
            color: this.props.color,
            radius: this.props.radius
        };
    },
    componentWillReceiveProps: function(nextProps){
        console.log(nextProps.progress)
        console.log('-', nextProps.radius)
        this.setState({
            progress: nextProps.progress,
            color: nextProps.color,
            radius: nextProps.radius
        });
    },
    render: function(){
        return (<canvas ref="progressCricle"></canvas>);
    },
    componentDidMount: function(){
        var canvas = this.refs.progressCricle,
            context = canvas.getContext('2d');
        this.init(canvas, context);
    },
    componentDidUpdate: function(){
        var canvas = this.refs.progressCricle,
            context = canvas.getContext('2d'),
            center = this.state.radius * 1.15;//画布中心
        this.draw(canvas, context, center);
    },
    init: function(canvas, context){
        //初始化一些公共数据
        canvas.width = this.state.radius * 2.3;
        canvas.height = canvas.width;
        context.lineWidth = this.state.radius*0.15;
        context.font = this.state.radius/2 + "px Arial bold";//字体大小固定为radius的二分之一
        context.fillStyle = this.state.color;//字体颜色
        context.textAlign = 'center';
        context.textBaseline = 'middle';
    },
    draw: function(canvas, context, center){
        //清空canvas，画一个灰色的圆
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = '#ddd';
        context.beginPath();
        context.arc(center, center, this.state.radius, 0, Math.PI * 2, true);
        context.stroke();
        //处理数字
        context.moveTo(center, center);
        context.fillText(this.state.progress+'%', center, center);
        //画表示进度的圆环
        context.strokeStyle = this.state.color;
        var copy = context.getImageData(0, 0, canvas.width, canvas.height);
        context.putImageData(copy, 0, 0);
        context.beginPath();
        context.arc(center, center, this.state.radius, -Math.PI*0.5, (this.state.progress*0.01*2 - 0.5)*Math.PI, false);
        context.stroke();
    }
});
module.exports = ProgressCricle;