/**
 * 系统页
 * 2021-07-29 完善
 */
import React from "react";
import PropTypes from 'prop-types';

import Layout from "../../Layout/Layout";
import Left from "../../Layout/Left";
import Center from "../../Layout/Center";

import Container from "../../Layout/Container";
import GlobalSearch from "../../Data/GlobalSearch"
import SystemHeader from "./SystemHeader";
import dom from "../../libs/dom";

import "./index.css";
import SystemSet from "./SystemSet";
import SystemMenu from "./SystemMenu";
import SystemCenter from "./SystemCenter";


class System extends React.Component {
  constructor(props) {
    super(props);
    this.tabsref = React.createRef();
    this.systeset = React.createRef();
    this.globalsearch = React.createRef();
    this.state = {
      leftWidth: this.props.leftWidth || 210,
      groupTitle: "",
      activeMenu: "",
      tabs: [],
      activeShortCuts: null,

    };
    this.setLeftWidth = this.setLeftWidth.bind(this);

  }

  componentDidMount() {
    let receiveMessage = (event) => {
      if (event.data) {
        let data = (event.data);
        if (data && data.type == "openTab") {

          this.openMenu(data)
        }
      }
    }
    window.addEventListener("message", receiveMessage, false);

  }

  /**
   * 显示左侧菜单
   */
  setLeftWidth() {
    if (this.state.leftWidth === 0) {
      this.setState({
        leftWidth: this.props.leftWidth || 210,
      })
    }
    else {
      this.setState({
        leftWidth: 0,
      })
    }
  }
  /**
   * 打开菜单
   * @param {*} route 
   */
  openMenu(route, group) {
    this.setState({
      activeMenu: route.title,
      groupTitle: group && group.title || "",
    })
    let findIndex = null;
    let e = this.state.tabs.find((selfItem, index) => {
      if (selfItem.title == route.title) {
        findIndex = index;
        return true;
      }
      return false;
    });

    //如果没找到
    if (!e) {
      this.state.tabs.push(route);
      this.setState({
        tabs: this.state.tabs
      });
    } else {
      //如果找到了
      try {
        this.tabsref.current.tabsref.current.changeActive(findIndex);
      }
      catch (e) {

      }
    }

  }

  /**
 * 菜单关闭
 * @param {*} index 
 */
  closeMenu(index) {
    let tabs = this.state.tabs;
    tabs.splice(index, 1)
    this.setState({
      tabs: tabs,
    })
  }
  /**
   * 快捷菜单单击事件
   * @param {*} index 
   * @param {*} name 
   * @param {*} title 
   */
  activeShortHandler(index, name, title, url) {
    this.setState({
      activeShortCuts: index,
    })
    if (url) {//如果有url则会打开菜单
      this.openMenu({ name: name, title: title, url: url });
    }
    this.props.shortcutsClick && this.this.shortcutsClick(name, babel);
  }
  /**
     * 系统设置
     */
  systemOpen() {
    this.systeset.current.open();
  }
  /**
   * 系统设置关闭
   */
  systemClose() {
    this.systeset.current.close();
  }
  /**
   * 系统设置
   */
  systemSet(prop,value){
   window.localStorage.setItem(prop,value);
   this.setState({})
  }
  /**
   * 打开全局搜索
   */
  searchOpen() {
    this.setState({
      isuserExpand: false,
      isnoticeExpand: false,
    })
    this.globalsearch.current.open()
  }
  render() {
    let navTheme = window.localStorage.getItem("navTheme") || "left";
    let systemTheme = window.localStorage.getItem("systemTheme") || "primary";
    let menuTheme = window.localStorage.getItem("menuTheme") || "black";
    let headerTheme = window.localStorage.getItem("headerTheme") || "white";
    return <Container>
      <Layout className={"wasabi-system " + this.props.theme}>
        {navTheme !== "left" ? <SystemHeader {...this.props} {...this.state}
        navTheme={navTheme}
        headerTheme={headerTheme}
          systemOpen={this.systemOpen.bind(this)}
          setLeftWidth={this.setLeftWidth.bind(this)}
          searchOpen={this.searchOpen.bind(this)}
          activeShortHandler={this.activeShortHandler.bind(this)}
          
        ></SystemHeader> : null}
        <Left width={this.state.leftWidth}>
          <SystemMenu title={this.props.title} navTheme={navTheme} menuTheme={menuTheme} systemTheme={systemTheme} openMenu={this.openMenu.bind(this)} menus={this.props.menus} activeMenu={this.state.activeMenu}></SystemMenu>
        </Left>
        <Center>
          <Layout>
            {navTheme === "left" ? <SystemHeader
              {...this.props} {...this.state}
              navTheme={navTheme}
              headerTheme={headerTheme}
              systemOpen={this.systemOpen.bind(this)}
              setLeftWidth={this.setLeftWidth.bind(this)}
              searchOpen={this.searchOpen.bind(this)}
              activeShortHandler={this.activeShortHandler.bind(this)}
            ></SystemHeader> : null}
            <Center>
              <SystemCenter ref={this.tabsref} tabs={this.state.tabs} systemTheme={systemTheme} closeMenu={this.closeMenu.bind(this)}></SystemCenter>
            </Center>
          </Layout>
        </Center>
      </Layout>
      <SystemSet ref={this.systeset} systemSet={this.systemSet.bind(this)} systemClose={this.systemClose.bind(this)}
        navTheme={navTheme}
        systemTheme={systemTheme}
        menuTheme={menuTheme}
        headerTheme={headerTheme}
      ></SystemSet>
      <GlobalSearch ref={this.globalsearch}></GlobalSearch>
    </Container>
  }
}

System.propTypes = {
  title: PropTypes.string,//标题
  logo: PropTypes.string,//图标
  shortcuts: PropTypes.array,//快捷访问菜单
  // [
  //   { name:"index", title: "首页",iconCls:"", href: "" },
  //   { name:"user", title: "个人设置",iconCls:"", href: "" },
  //   { name:"system", title: "系统设置",iconCls:"", href: "" },

  // ]
  menus: PropTypes.array,//菜单
    // [
  //   { name:"index", title: "首页",iconCls:"", href: "" },
  //   { name:"user", title: "个人设置",iconCls:"", href: "" },
  //   { name:"system", title: "系统设置",iconCls:"", href: "" },

  // ]
  notices:PropTypes.array,//通知信息
  nick: PropTypes.string,//登陆用户昵称
  userSet:PropTypes.func,//用户个人资料设置
  changePassword:PropTypes.func,//用户修改密码
  noticeClick:PropTypes.func,//消息详情
}
System.defaultProps = {
  theme: "black",
}

export default System;