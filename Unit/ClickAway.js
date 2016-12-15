/**
 * Created by wangzhiyong on 2016/12/12.
 * 从rctui改造过来，暂时先es5语法
 */
let React=require("react");
let dom=require("./dom.js");
import * as Events from './events';
let ClickAway= {

    componentWillUnmount () {
        this.unbindClickAway();
    },

    bindClickAway () {
        const fn = this.getClickAwayEvent();
        Events.on(document, 'click', fn);
        Events.on(document, 'touchstart', fn);
    },

    unbindClickAway () {
        const fn = this.getClickAwayEvent();
        Events.off(document, 'click', fn);
        Events.off(document, 'touchstart', fn);
    },

    registerClickAway (onClickAway, target) {
        this.clickAwayTarget = target;
        this.onClickAway = onClickAway;
    },

    getClickAwayEvent () {
        let fn = this._clickAwayEvent;
        if (!fn) {
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
