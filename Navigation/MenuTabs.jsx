/*create by wangzy
 //date:2016-03-02后开始a独立框架改造
 //标签页组
 */
require("../Sass/Navigation/MenuTabs.scss");
require("../Sass/Buttons/icon.scss");
var React =require("react");
var Tab=require("./MenuTab.jsx");
var TabSection=require("./MenuTabSection.jsx");
var LinkButton=require("../Buttons/LinkButton.jsx");
var unit=require("../libs/unit.js");

class MenuTabs extends  React.Component {
    constructor(props) {
        super(props);
        this.menuHandler = this.menuHandler.bind(this);
        this.homeHandler = this.homeHandler.bind(this);
        this.userHandler=  this.userHandler.bind(this);
        this.tabClickHandler = this.tabClickHandler.bind(this);
        this.tabCloseHandler = this.tabCloseHandler.bind(this);
        this.leftClickHandler= this.leftClickHandler.bind(this);
        this.rightClickHandler= this.rightClickHandler.bind(this);

         var availNum=parseInt( this.props.availWidth / this.props.cellWidth);
         var rightIndex=0;
         if(this.props.tabs instanceof  Array&&this.props.tabs.length>0)
         {
             if(this.props.tabs.length<availNum)
             {
                 rightIndex=this.props.tabs.length-1;
             }
             else{
                 rightIndex=availNum-1;
             }
         }
        //复制一份，当菜单关闭时用于比较显示的位置，不能直接复制给状态值，这样会导致不停的刷新
         this.oldTabs=unit.clone(this.props.tabs);

        this.  state = {
            tabs: this.props.tabs,
            homeActive: -1,//主页是否处于激活状态
            menuVisible: false,
            leftIndex: 0,//可见的第一个下标
            rightIndex:rightIndex,//可见的最后一个下标
            availNum: availNum//可用个数

        }
    }

    static    propTypes = {
        tabs: React.PropTypes.array,//标签页数据
        homeUrl: React.PropTypes.string,//主页的链接地址
        menuHandler: React.PropTypes.func.isRequired,//菜单按钮的单击事件
        userHandler: React.PropTypes.func.isRequired,//用户个人中心按钮的单击事件
        tabNumChangeHandler: React.PropTypes.func.isRequired,//标签页数据发生改变事件
    }
    static defaultProps = {

        tabs: null,
        homeUrl: null,
        cellWidth:151,//单元格宽度
        availWidth:document.body.getBoundingClientRect().width-160,//可用宽度
    }


    componentWillReceiveProps(nextProps) {
        var leftIndex=this.state.leftIndex;
        var rightIndex=this.state.rightIndex;
        if(nextProps.tabs instanceof  Array) {
         if(nextProps.tabs.length<=this.state.availNum){//没有超过不管

             leftIndex=0;
             rightIndex=nextProps.tabs.length-1;
         }
         else{
             if(nextProps.tabs.length>this.oldTabs.length){//追加了

                 leftIndex=nextProps.tabs.length-this.state.availNum;
                 rightIndex=nextProps.tabs.length-1;
             }
             else if(nextProps.tabs.length<this.oldTabs.length) {//减少了

                 if(rightIndex<nextProps.tabs.length-1)
                 {//不用处理，仍然可以显示

                 }
                 else
                 {//左侧处理，右侧显示最后一个

                     leftIndex=this.state.leftIndex-(this.oldTabs.length-nextProps.tabs.length);
                     rightIndex=nextProps.tabs.length-1;
                 }

             }
         }
        }


            this.setState({
                tabs:( nextProps.tabs),
                leftIndex:leftIndex,
                rightIndex:rightIndex,
                homeActive: (nextProps.tabs&&nextProps.tabs.length>0)?false:true,
                menuVisible: nextProps.menuVisible,

            })
    }

    menuHandler() {//显示/隐藏菜单的事件
        this.setState({
            menuVisible: !this.state.menuVisible
        })
        this.props.menuHandler(!this.state.menuVisible);//回调父组件
    }
    userHandler(){
        this.props.userHandler();//回调父组件
    }

    homeHandler(){//主页的单击事件
        var newTabs = this.state.tabs;
        //当前激动的tab下标保存
        for (var i = 0; i < newTabs.length; i++) {

            newTabs[i].active = false;

        }
        this.setState({
            homeActive:true,
            tabs:newTabs
        })

    }



    tabClickHandler(index) {

        //页签单击事件
        var newTabs = this.state.tabs;
        //当前激动的tab下标保存
        for (var i = 0; i < newTabs.length; i++) {
            if (i == index) {
                newTabs[index].active = true;
            }
            else {
                newTabs[i].active = false;
            }
        }
        this.setState({
            tabs: newTabs,
            homeActive:false,
        });
    }

    tabCloseHandler(index) {

      this.oldTabs=unit.clone( this.state.tabs);//保留旧的
        var newTabs =this.state.tabs;
        var parentuuid = newTabs[index].parentuuid;
        var parentIndex = null;//父页面的下标
        for (var i = 0; i < newTabs.length; i++) {
            if (newTabs[i].uuid == parentuuid) {
                parentIndex = i;
                break;
            }
        }
        if (newTabs[index].active == true) { //删除tab为激活的tab
            if (parentIndex != null) {//存在父页面，父页面激活
                newTabs[parentIndex].active = true;
            }
            else {//不存在父页面，激活临近页面
                if (index < newTabs.length - 1) {//不是最后一个，下一个激活
                    newTabs[index + 1].active = true;

                }
                else {
                    //最后一个，上一个激活
                    if (index != 0) {
                        newTabs[index - 1].active = true;
                    }
                    else {
                    }

                }
            }
        }
        newTabs.splice(index, 1);//删除

        var leftIndex=this.state.leftIndex;
        var rightIndex=this.state.rightIndex;


            if(newTabs.length<=this.state.availNum){//没有超过不管
                leftIndex=0;
                rightIndex=newTabs.length-1;
            }
            else{
                    if(rightIndex<newTabs.length)
                    {//不用处理，仍然可以显示,注意这里的

                    }
                    else
                    {//左侧处理，右侧显示最后一个
                        leftIndex=leftIndex-1;
                        rightIndex=newTabs.length-1;
                    }


            }




        this.setState({
            tabs: newTabs,
            leftIndex:leftIndex,
            rightIndex:rightIndex,
            homeActive:newTabs.length==0?true:false
        })
        if (this.props.tabNumChangeHandler) {
            this.props.tabNumChangeHandler(newTabs);//返回给你父组组件更新
        }
    }

    leftClickHandler() {

      if(this.state.leftIndex>0)
      {
          this.setState({
              leftIndex:this.state.leftIndex-1,
              rightIndex:this.state.rightIndex-1,
          })
      }
    }
    rightClickHandler() {
        if(this.state.rightIndex<this.state.tabs.length-1)
        {
            this.setState({
                leftIndex:this.state.leftIndex+1,
                rightIndex:this.state.rightIndex+1,
            })
        }
    }

    render() {
        var tabobj = [];
        var sectionobj = [];
        var tabclickHandler = this.tabClickHandler;
        var tabCloseHandler = this.tabCloseHandler;
        var showArrow=false;//是否显示箭头

        if(this.state.tabs instanceof  Array) {
            if (this.state.tabs.length > this.state.availNum) {//大于可用个数
                showArrow = true;
            }

            this.state.tabs.map((child, index) => {
                if (child.active == true) {//保存当前激活标签uuid，用于子标签中打开新标签时设置其父标签
                    window.localStorage.setItem("alog_currentTabUUID", child.uuid);//保存当前激活节点，用于新建tab
                    if (child.parentuuid != null) {
                        var parentTabUUID = window.localStorage.getItem("parentTabUUID");
                        if (parentTabUUID == null) {
                            parentTabUUID = "";
                        }
                        parentTabUUID += child.uuid + "$" + child.parentuuid;//);//保存当前激活节点的uuid及父节点的uuid,用于关闭tab时刷新父节点,
                        window.localStorage.setItem("parentTabUUID", parentTabUUID);
                    }

                }
                tabobj.push(<Tab key={"tab" + index} index={index} title={child.title} iconCls={child.iconCls}
                                 active={child.active} clickHandler={tabclickHandler}
                                 closeHandler={tabCloseHandler} hide={(index>=this.state.leftIndex&&index<=this.state.rightIndex)?false:true}></Tab>);
                sectionobj.push(<TabSection key={"tabsection" + index} url={child.url}
                                            active={(this.state.homeActive) ? false : child.active}
                                            content={child.content}></TabSection>);
            });
        }
        else {

        }

        if (this.props.homeUrl != null) {
            sectionobj.unshift(<TabSection key={"homesection"} url={this.props.homeUrl}
                                           active={(this.state.homeActive)?true:false}></TabSection>)
        }

        return (
            <div className="wasabi-nav-container">
                <ul className=" wasabi-nav-tabs" ref="menutab">
                    <li className={"tabmenu "+(this.state.menuVisible?"close":"")} onClick={this.menuHandler}></li>
                    <li className={"tabhome "+((this.state.homeActive)?"active":"")} title="首页" onClick={this.homeHandler}>
                        <div className="split"></div></li>

                    <li className="left icon-left" onClick={this.leftClickHandler} style={{display:showArrow?"block":"none"}}></li>
                    <li className="content" style={{width:this.props.availWidth}}>
                        <ul style={{left:this.state.left}}>  {tabobj}</ul>
                    </li>

                    <li className="right icon-right" onClick={this.rightClickHandler} style={{display:showArrow?"block":"none"}}></li>
                    <li style={{float:"right"}} className="tabuser" title="用户" onClick={this.userHandler}>
                    </li>
                </ul>
                { sectionobj}
            </div>);

    }
};
module.exports=MenuTabs;
