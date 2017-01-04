/**
 * Created by wangzhiyong on 2016/12/12.
 * 从rctui改造过来,绑定全局单击事件
 */
let React=require("react");
let ReactDOM=require("react-dom");
let dom=require("./dom.js");
import * as Events from './events';
let ClickAway= {

    componentWillUnmount () {
        this.unbindClickAway();
    },

    bindClickAway () {//绑定事件
        const fn = this.getClickAwayEvent();//得到要执行事件
        Events.on(document, 'click', fn);
        Events.on(document, 'touchstart', fn);
    },

    unbindClickAway () {//解除绑定事件
        const fn = this.getClickAwayEvent();
        Events.off(document, 'click', fn);
        Events.off(document, 'touchstart', fn);
    },

    registerClickAway (onClickAway, target) {//注册绑定事件
        this.clickAwayTarget = target;
        this.onClickAway = onClickAway;
    },

    getClickAwayEvent () {
        let fn = this._clickAwayEvent;//
        if (!fn) {//第一次不存在的时候
            fn = (event) => {
                let el = this.clickAwayTarget || ReactDOM.findDOMNode(this);

                // Check if the target is inside the current component
                if (event.target !== el && !dom.isDescendant(el, event.target)) {
                    if (this.onClickAway) {
                        this.onClickAway();
                    }
                }
            }
            this._clickAwayEvent = fn;
        }
        return fn;
    }
}
module.exports=ClickAway;
