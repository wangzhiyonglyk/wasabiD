/*create by wangzy
//date:2016-03-02后开始独立框架改造
//标签页组
*/
require("../../sass/Base/NAvigation/MenuTabs.scss");
require("../../sass/Base/Buttons/icon.scss");
var React =require("react");
var Tab=require("./MenuTab.jsx");
var TabSection=require("./MenuTabSection.jsx");
var LinkButton=require("../Buttons/LinkButton.jsx");

class MenuTabs extends  React.Component {
    constructor(props) {
        super(props);
        this.menuHandler = this.menuHandler.bind(this);
        this.homeHandler = this.homeHandler.bind(this);
        this.userHandler=  this.userHandler.bind(this);
        this.tabClickHandler = this.tabClickHandler.bind(this);
        this.tabCloseHandler = this.tabCloseHandler.bind(this);
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
    }
    state = {
        tabs: this.props.tabs,
        activeIndex: -1,//为了区别主页而设置的,-1代表主页
        menuVisible: false,
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            tabs: nextProps.tabs,
            activeIndex: (nextProps.tabs)?nextProps.tabs.length-1:-1,
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
            activeIndex:-1,
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
        activeIndex:index
        });
    }

    tabCloseHandler(index) {
        //改变了数据结构，必需回传给父组件
        var newTabs = this.state.tabs;
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
        this.setState({
            tabs: newTabs,
            activeIndex:index
        })
        if (this.props.tabNumChangeHandler) {
            this.props.tabNumChangeHandler(newTabs);//返回给你父组组件更新
        }
    }

    render() {
        var tabobj = [];
        var sectionobj = [];
        var tabclickHandler = this.tabClickHandler;
        var tabCloseHandler = this.tabCloseHandler;
        if(this.state.tabs instanceof  Array)
        {
            this.state.tabs.map( (child, index) =>{
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
                tabobj.push(<Tab key={"tab"+index} index={index} title={child.title} iconCls={child.iconCls}
                                 active={child.active} clickHandler={tabclickHandler}
                                 closeHandler={tabCloseHandler}></Tab>);
                sectionobj.push(<TabSection key={"tabsection"+index} url={child.url}
                                            active={(this.state.activeIndex===-1)?false: child.active}
                                            content={child.content}></TabSection>);
            });
        }
        else
        {

        }

        if (this.props.homeUrl != null) {
            sectionobj.unshift(<TabSection key={"homesection"} url={this.props.homeUrl}
                                           active={(this.state.activeIndex===-1)?true:false}></TabSection>)
        }

        return (
            <div>
                <ul className=" wasabi-nav-tabs">
                    <li className={"tabmenu "+(this.state.menuVisible?"close":"")} onClick={this.menuHandler}></li>
                    <li className={"tabhome "+((this.state.activeIndex===-1)?"active":"")} title="首页" onClick={this.homeHandler}>
                        <div className="split"></div></li>
                    {tabobj}
                    <li style={{float:"right"}} className="tabuser" title="用户" onClick={this.userHandler}>
                    </li>
                </ul>
                { sectionobj}
            </div>);

    }
};
module.exports=MenuTabs;
