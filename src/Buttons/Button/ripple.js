/**
 *
 *Material Design 的波纹特效
 */
let ripple = function (element) {
    element&&element.addEventListener('click',
        (event) => {
            //先创建容器
            let ripplerContainer = element.querySelector('.ripple-container');
            let elementPosition = element.getBoundingClientRect();//父元素宽度与高度
            if (ripplerContainer) {
                ripplerContainer.remove();
            }
            let rippleContainer = document.createElement('div');
            rippleContainer.style.position = 'absolute';
            rippleContainer.style.zIndex =(element.style.zIndex?element.style.zIndex+1:99);//默认高一个
            rippleContainer.style.width = elementPosition.width + 'px';
            rippleContainer.style.left ='0px';
            rippleContainer.style.top ='0px';
            rippleContainer.style.height = elementPosition.height + 'px';
            rippleContainer.className = 'ripple-container';
            rippleContainer.style.overflow = 'hidden';
            element.appendChild(rippleContainer);
            let circleD= elementPosition.width*2;//波纹范围，以宽度为标准
            //波纹元素
            let ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.width = circleD + 'px';
            ripple.style.height = circleD + 'px';
            ripple.style.borderRadius = '500px';
            ripple.style.left = ((event.pageX - elementPosition.left) - circleD / 2) + 'px';
            ripple.style.top = ((event.pageY - elementPosition.top) - circleD / 2) + 'px';
            ripple.className = 'ripple';
            rippleContainer.appendChild(ripple);
            ripple.addEventListener('animationend', () => {
                rippleContainer.remove();
            }, false)
        })
}

export default ripple;
