/**
 * Created by wangzhiyong on 16/8/28.
 * desc :使用Immutable来优化组件的更新
 */
let React=require("react");
let Immutable=require("immutable");

var shouldComponentUpdate= {
    shouldComponentUpdate: function (nextProps, nextState) {
        return this.deepCompare(this, nextProps, nextState);
    },

    deepCompare: function (instance, nextProps, nextState) {
        return !Immutable.is(instance.props, nextProps) || !Immutable.is(instance.state, nextState);
    }
}
