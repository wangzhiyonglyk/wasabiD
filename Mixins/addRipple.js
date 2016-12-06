/**
 * Created by wangzhiyong on 2016/12/6.
 * 在点击时 ，按钮的添加波纹特效
 *
 */
let React=require("react");
let addRipple={
    rippleHandler:function (event) {
        var $ripple ;
        if( event.target.children.length>0)
        {

            event.target.removeChild( event.target.children[0]);
        }
        $ripple=   document.createElement("span");
        $ripple.className="ripple";
        event.target.appendChild($ripple);
        $ripple.style.left=( event.clientX - event.target.getBoundingClientRect().left- event.target.getBoundingClientRect().width / 2)+"px";
        $ripple.style. top=( event.clientY- event.target.getBoundingClientRect().Top -  event.target.getBoundingClientRect().height / 2)+"px";

    }
}
module.exports=addRipple;