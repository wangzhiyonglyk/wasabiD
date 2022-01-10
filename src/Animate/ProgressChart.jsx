
/**
 * create by wangzhiyong
 * date:2020-08-07
 * desc 进度条报表
 */
import React from 'react';
import PropTypes from 'prop-types'
import '../Sass/Animate/progress.css'

class ProgressChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            animate: false
        };
    }
    /**
     * 先设置为空
     */
    componentWillReceiveProps() {
        // this.setState({
        //     animate: false
        // })
        // this.refreshed = false;
    }
    componentWillMount() {
        this.refresh();

    }
    componentDidUpdate() {
        this.refresh();

    }
    /**
     * 刷新 
     */
    refresh() {
        if (!this.refreshed) {
            this.timeout = setTimeout(() => {
                this.setState({
                    animate: true
                })
                this.refreshed = true;
            }, 200);
        }

    }
    componentWillUnmount() {
        clearTimeout(this.timeout);
    }
    getMax() {

        let max = 0;
        let arr = this.props.data && this.props.data.map(item => {
            if (this.props.computer == "sum") {
                max += item.value;//求和
            }
            return item.value
        })
        if (this.props.computer == "max") {
            max = Math.max(...arr) || 100;
        }
        else {

        }
        return max;
    }

    render() {
        let max = this.getMax();

        return <div className="wasabi-progress">
            {
                this.props.data && this.props.data.map((item, index) => {
                    return <div className="progress-bar" key={index}>
                        <div className="progress-bar-left" style={{ width: item.titleWidth }}>
                            {/*<span className="progress-dot" style={{ background: item.dotColor }}></span><span className="progress-title" style={{ color: item.titleColor, fontSize: item.fontSize || 14 }}>{item.title}</span>*/}
                            <span className="progress-title" style={{ color: item.titleColor, fontSize: item.fontSize || 14 }}>{item.title}</span>
                        </div>

                        <div className="progress-bar-center">
                            <div className="progress-bar-bi-all" >

                                <div className={"progress-bar-bi" + (this.state.animate ? " " : " noa")}
                                    style={{
                                        width: this.state.animate ? (parseInt((item.value / max) * 100)) + "%" : "0%",
                                        minWidth: "2%",
                                        background: item.barColor,
                                        height: item.barHeight || 8,
                                        borderRadius: item.radius || 4

                                    }}></div>
                            </div>

                        </div>
                        <div className="progress-desc" style={{ color: item.valueColor }}  >{item.desc ? item.desc : (item.percentage ? (parseInt((item.value / max) * 100)) + "%" : item.value)}</div>

                    </div>

                })
            }

        </div>
    }



}
ProgressChart.defaultProps = { 
    computer: "max",//
}
ProgressChart.propTypes = {
    className: PropTypes.string,//样式
    style: PropTypes.object,//样式，
    computer: PropTypes.oneOf(["max", "sum"]),//计算方式
    /**
     * 数据 
     * {
     *  title:"标题",//可以传组件，与字符串，数字
     * titleWidth:"auto",//标题宽度
     * titleColor:"标题颜色"
     * dotColor:"red",//圆点颜色，如果没有设置为透明即可，可以渐变
     * barColor:"red",//渐变颜色,可以设置渐变
     * barHeight:8,//高度
     * barRadius:4,//圆弧度
     * value：100,值,
     * valueColor:"white",//数字颜色值 
     * percentage:true,//是否显示百分比

     * desc:"描述信息",可以是组件，也可以字符串，数字

     * 
     * }
     */
    data: PropTypes.array//数据 

}

export default ProgressChart;
