import React from "react";
import Button from "../../Buttons/Button";
import func from "../../libs/func";
import regs from "../../libs/regs";
import "./color.css"
import colorFunc from "./colorFunc";
import colors from "./colors";
import PropTypes from 'prop-types';
class ColorPickerPanel extends React.Component {
    constructor(props) {
        super(props);
        let color = this.props.color;
        let hsv = colorFunc.rgbToHsv(color);
        let top = 150 - hsv.v / 100 * 150 - 6;
        let left = hsv.s / 100 * 230 - 6;
        this.state = {
            color: func.clone(color),
            dotid: func.uuid(),
            pickerid: func.uuid(),
            top: top,
            left: left
        }
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.mouseChange = this.mouseChange.bind(this);
        this.setColor = this.setColor.bind(this);

    }

    /**
     * 交由父组件渲染
     * @param {*} color 
     */
    setColor(color) {
        let hsv = colorFunc.rgbToHsv(color);
        let top = 150 - hsv.v / 100 * 150 - 6;
        let left = hsv.s / 100 * 230 - 6;
        this.setState({
            color: func.clone(color),
            top: top,
            left: left
        })
    }

    /**
     * 
     * @param {*} event 
     */
    onMouseDown(event) {
        try {

            this.down = true;
            // this.props.onChange && this.props.onChange(color);
            document.addEventListener("mouseup", this.onMouseUp)
            this.mouseChange(event);
        }
        catch (e) {
            this.down = false;
        }

    }
    onMouseMove(event) {
        if (this.down) {
            this.mouseChange(event);
        }
    }
    onMouseUp(event) {
        this.down = false;
        document.removeEventListener("mouseup", this.onMouseUp)
    }
    mouseChange(event) {
        try {
            let offset = {};
            if (event.target === document.getElementById(this.state.dotid)) {
                offset.offsetX = event.target.offsetLeft + 6;
                offset.offsetY = event.target.offsetTop + 6;
            }
            else {
                offset.offsetX = event.nativeEvent.offsetX;
                offset.offsetY = event.nativeEvent.offsetY;
            }
            let hsv = colorFunc.rgbToHsv(this.state.color);
            let b = 0 > offset.offsetY ? 0 : offset.offsetY
                , s = 0 > offset.offsetX ? 0 : offset.offsetX;
            hsv = {
                s: (((230 < s ? 230 : s) + 6) / 230 * 100),
                v: 100 - ((150 < b ? 150 : b) + 6) / 150 * 100,
                h: hsv.h
            }
            let color = colorFunc.hsvToRgb(hsv);
            this.setState({
                top: (offset.offsetY - 6),
                left: (offset.offsetX - 6),
            })
            color.a = this.props.color.a;
            console.log("d", color)
            this.props.onChange && this.props.onChange(color);
        }
        catch (e) {
            console.log("e", e)
        }

    }

    render() {
        let color = this.state.color;
        let top = this.state.top;
        let left = this.state.left;
        return <div className="wasabi-color-picker"
            style={{ background: "rgb(" + [color.r, color.g, color.b].join(",") + ")" }}>
            <div className="wasabi-color-picker-to-right">
                <div className="wasabi-color-picker-to-top">
                    <div className="wasabi-color-picker-dot"
                        onMouseDown={this.onMouseDown.bind(this)}
                        id={this.state.dotid} style={{ top: top, left: left }}></div>
                    {/**因为要计算相对父窗口的偏移量，加一个zindex更大的遮罩层，得到offsetX */}
                    <div id={this.state.pickerid} style={{ width: "100%", height: "100%", zIndex: 2 }}
                        onMouseDown={this.onMouseDown.bind(this)}
                        onMouseMove={this.onMouseMove.bind(this)}
                    ></div>
                </div>
            </div>
        </div>
    }
}

class ColorNumberPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            colordotId: func.uuid(),
            opacitydotId: func.uuid(),
            r: null,
            g: null,
            b: null,
            a: null,
            left: 0,
            color: null,
            oldColor: null,
        }

        this.opacityMouseDown = this.opacityMouseDown.bind(this);
        this.opacityMouseMove = this.opacityMouseMove.bind(this);
        this.opacityChange = this.opacityChange.bind(this);
        this.colorMouseDown = this.colorMouseDown.bind(this);
        this.colorMouseMove = this.colorMouseMove.bind(this);
        this.colorChange = this.colorChange.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);

    }
    static getDerivedStateFromProps(props, state) {
        if (func.diff(props.color, state.oldColor)) {
            let hsv = colorFunc.rgbToHsv(props.color);

            return {
                r: props.color.r,
                g: props.color.g,
                b: props.color.b,
                a: props.color.a,
                left: parseInt(hsv.h / 360 * 160) - 6,
                color: func.clone(props.color),
                oldColor: func.clone(props.color),
            }
        }

        return null;
    }
    onChange(type, event) {
        let newState = {};
        newState[type] = event.target.value;
        if (type !== "a" && regs.integer.test(event.target.value) && event.target.value * 1 <= 255 && event.target.value * 1 >= 0) {
            newState.color = this.state.color;
            newState.color[type] = event.target.value;
            this.props.onChange && this.props.onChange(newState.color);
        }
        else if (type === "a" && regs.number.test(event.target.value) && event.target.value * 1 <= 1 && event.target.value * 1 >= 0) {
            newState.color = this.state.color;
            newState.color[type] = event.target.value;
            this.props.onChange && this.props.onChange(newState.color);
        }

        this.setState(newState);
    }
    opacityMouseDown(event) {

        this.opacityDown = true;
        this.opacityChange(event);
        document.addEventListener("mouseup", this.onMouseUp)

    }
    opacityMouseMove(event) {
        if (this.opacityDown) {
            this.opacityChange(event);
        }

    }
    opacityChange(event) {
        try {
            event.stopPropagation();
            let color = func.clone(this.state.color);
            let left = 0;
            if (event.target === document.getElementById(this.state.opacitydotId)) {
                left = event.target.offsetLeft;
            }
            else {
                left = event.nativeEvent.offsetX;
            }
            color.a = parseFloat((left / 160).toFixed(2));
            this.setState({
                a: color.a,
                color: color
            })
            this.props.onChange && this.props.onChange(color);

        }
        catch (e) {

        }

    }
    colorMouseDown(event) {
        this.colorDown = true;
        this.colorChange(event);
        document.addEventListener("mouseup", this.onMouseUp)

    }
    colorMouseMove(event) {
        if (this.colorDown) {
            this.colorChange(event);
        }
    }
    colorChange(event) {
        try {
          
            let left = 0;
            if (event.target === document.getElementById(this.state.colordotId)) {
                left = event.target.offsetLeft + 6;
            }
            else {
                left = event.nativeEvent.offsetX;
            }
            let hsv = {
                h: left / 160 * 360,
                s: 100,
                v: 100
            };
            let color = colorFunc.hsvToRgb(hsv);
            color.a = this.state.color.a;
            this.setState({
                r: color.r,
                g: color.g,
                b: color.b,
                color: color,
                left: parseInt(hsv.h / 360 * 160) - 6,
            })
            this.props.onChange && this.props.onChange(color, true);
        }
        catch (e) {

        }


    }
    onMouseUp() {
        this.opacityDown = false;
        this.colorDown = false;
        document.removeEventListener("mouseup", this.onMouseUp)
    }
    render() {
        let color = this.state.color;
        return <div className="wasabi-color-number">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="wasabi-color-number-dot">
                    <div style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "7px",
                        backgroundColor: "rgba(" + [color.r, color.g, color.b, color.a].join(",") + ")"
                    }}></div>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div className="wasabi-color-number-color-line">
                        <div
                            onMouseDown={this.colorMouseDown}
                            onMouseMove={this.colorMouseMove}
                            style={{
                                zIndex: 1, cursor: "pointer", width: "100%", height: "100%", position: "absolute", left: 0, top: 0,

                            }}></div>
                        <div id={this.state.colordotId} onMouseDown={this.colorMouseDown} className="dot"
                            style={{ cursor: "pointer", zIndex: 2, left: this.state.left }}></div>
                    </div>
                    <div className="wasabi-color-number-opacity-line" >
                        <div style={{
                            width: "100%", height: "100%", position: "relative",
                            backgroundImage: "linear-gradient(to right, rgba(255,0,0,0) 0%, rgb(255,0,0) 100%)"
                        }}>
                            <div
                                onMouseDown={this.opacityMouseDown}
                                onMouseMove={this.opacityMouseMove}
                                style={{
                                    zIndex: 1, cursor: "pointer", position: "absolute", left: 0, top: 0,
                                    backgroundImage: "linear-gradient(to right,rgba(" + [this.state.r, this.state.g, this.state.b, 0].join(",") + ") 0% ,rgb(" + [this.state.r, this.state.g, this.state.b].join(",") + ") 100%)", width: "100%", height: "100%"
                                }}></div>
                            <div onMouseDown={this.opacityMouseDown}
                                id={this.state.opacitydotId} className="dot"
                                style={{ cursor: "pointer", zIndex: 2, left: "calc(" + (this.state.a * 100) + "% - 6px)" }}>

                            </div>

                        </div>

                    </div>
                </div>
            </div>
            <div className="wasabi-color-number-op">
                <div style={{ display: "flex" }}>
                    <input key="red" name="red" value={this.state.r} onChange={this.onChange.bind(this, "r")}></input>
                    <input key="green" name="green" value={this.state.g} onChange={this.onChange.bind(this, "g")}></input>
                    <input key="blue" name="blue" value={this.state.b} onChange={this.onChange.bind(this, "b")}></input>
                    <input key="opacity" name="opacity" value={this.state.a} onChange={this.onChange.bind(this, "a")}></input>
                </div>
                <div style={{ display: "flex" }}>
                    <div className="txt" key="R">R</div>
                    <div className="txt" key="G">G</div>
                    <div className="txt" key="B">B</div>
                    <div className="txt" key="A">A</div>
                </div>
            </div>
        </div>
    }
};

let Used = React.memo(function ({ onClick }) {
    let ccolors = window.localStorage.getItem("wasabi-colors") ? JSON.parse(window.localStorage.getItem("wasabi-colors")) : colors;
    return <div className="wasabi-color-used">
        <div style={{ fontSize: 16 }}>最近使用</div>
        <div style={{ width: "100%", display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
            {ccolors && ccolors.map((color, index) => {
                return <div key={index} className="wasabi-color-used-dot" onClick={onClick && onClick.bind(this, color, true)}>
                    <div style={{
                        width: "100%",
                        height: "100%",
                        cursor: "pointer",
                        backgroundColor: "rgba(" + [color.r, color.g, color.b, color.a].join(",") + ")"
                    }}></div>
                </div>
            })}
        </div>
    </div>
});

class Color extends React.Component {
    constructor(props) {
        super(props)
        this.colorPicker = React.createRef();
        this.state = {
            color: { r: 239, g: 28, b: 37, a: 1 }
        }
        this.onChange = this.onChange.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }
    onChange(color, force) {
        this.setState({
            color: color
        })
        if (force) {

            this.colorPicker.current.setColor(color)
        }
    }
    /**
     * 
     */
    onSelect() {
        let ccolors = window.localStorage.getItem("wasabi-colors") ? JSON.parse(window.localStorage.getItem("wasabi-colors")) : colors;
        let color = this.state.color;
        let find = ccolors.find((item) => {
            return [item.r, item.g, item.b, item.a].join(",") === [color.r, color.g, color.b, color.a].join(",");
        })
        if (!find) {
            ccolors.unshift(this.state.color);
            ccolors.splice(ccolors.length - 1, 1);
            window.localStorage.setItem("wasabi-colors", JSON.stringify(ccolors));
        }
        this.props.onSelect && this.props.onSelect(color, color, this.props.name);
    }
    render() {
        return <div className="wasabi-color">
            <ColorPickerPanel
                ref={this.colorPicker}
                color={this.state.color} onChange={this.onChange.bind(this)}
            ></ColorPickerPanel>
            <ColorNumberPanel color={this.state.color} onChange={this.onChange.bind(this)}></ColorNumberPanel>
            <Used onClick={this.onChange}></Used>
            <div style={{ position: "absolute", bottom: "0px", textAlign: "center", width: "100%", height: 50, lineHeight: "50px", boxShadow: "var(--box-shadow)" }}>
                <Button size="small" theme="primary" onClick={this.onSelect}>确定</Button></div>
        </div>
    }
}
Color.propTypes = {
    onSelect: PropTypes.func,//搜索事件
}
export default Color;