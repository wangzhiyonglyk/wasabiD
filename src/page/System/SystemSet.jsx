
import React from "react"
import SlideMenu from "../../Navigation/SlideMenu";
import Separator from "../../Layout/Separator";
import LinkButton from "../../Buttons/LinkButton";
class SystemSet extends React.Component {
  constructor(props) {
    super(props);
    this.sidemenu = React.createRef();

    this.open = this.open.bind(this);
    this.close = this.close.bind(this)
  }
  open() {
    this.sidemenu.current.open();
  }
  close() {
    this.sidemenu.current.close();
  }
  render() {
    return <SlideMenu ref={this.sidemenu}>
      <div style={{ fontSize: 16, height: 60, borderBottom: "1px solid var(--border-color)", lineHeight: "60px", paddingLeft: 20, marginBottom: 60 }}>
        <span>系统设置</span>
        <LinkButton theme="danger" onClick={this.props.systemClose} iconCls="icon-close" style={{ float: "right", marginRight: 20, marginTop: 22 }}></LinkButton>
      </div>
      <Separator key="0">导航栏模式</Separator>
      <div key="d0" style={{ display: "flex", justifyContent: "space-around", overflow: "hidden" }}>
        <img key="1" onClick={this.props.systemSet.bind(this, "navTheme", "left")} style={{ cursor: "pointer", border: this.props.navTheme === "left" ? "2px solid var(--primary-color)" : null, borderRadius: 4 }} src={require("./img/left.png")}></img>
        <img key="2" onClick={this.props.systemSet.bind(this, "navTheme", "leftTop")} style={{ cursor: "pointer", border: this.props.navTheme === "leftTop" ? "2px solid var(--primary-color)" : null, borderRadius: 4 }} src={require("./img/lefttop.png")}></img>
        {/* <img key="3" onClick={this.props.systemSet.bind(this, "navTheme", "top")} style={{ cursor: "pointer", border: this.props.navTheme === "top" ? "2px solid var(--primary-color)" : null, borderRadius: 4 }} src={require("./img/top.png")}></img> */}
      </div>
      <Separator key="1">系统主题</Separator>
      <div key="d1" style={{ display: "flex", justifyContent: "space-around" }}>
        <span key="1" onClick={this.props.systemSet.bind(this, "systemTheme", "primary")} className="wasabi-theme-box" style={{ backgroundColor: "var(--primary-color)" }}>  {this.props.systemTheme === "primary" ? <i className="icon-check" style={{ color: "white" }}></i> : null}</span>
        <span key="2" onClick={this.props.systemSet.bind(this, "systemTheme", "success")} className="wasabi-theme-box" style={{ backgroundColor: "var(--success-color)" }}>  {this.props.systemTheme === "success" ? <i className="icon-check" style={{ color: "white" }}></i> : null}</span>
        <span key="3" onClick={this.props.systemSet.bind(this, "systemTheme", "warning")} className="wasabi-theme-box" style={{ backgroundColor: "var(--warning-color)" }}>   {this.props.systemTheme === "warning" ? <i className="icon-check" style={{ color: "white" }}></i> : null}</span>
        <span key="4" onClick={this.props.systemSet.bind(this, "systemTheme", "danger")} className="wasabi-theme-box" style={{ backgroundColor: "var(--danger-color)" }}>  {this.props.systemTheme === "danger" ? <i className="icon-check" style={{ color: "white" }}></i> : null}</span>
      </div>
      <Separator key="2">菜单主题</Separator>
      <div key="d2" style={{ display: "flex", justifyContent: "space-around" }}>
        <span key="1" onClick={this.props.systemSet.bind(this, "menuTheme", "black")} className="wasabi-theme-box" style={{ backgroundColor: "#001529" }}>   {this.props.menuTheme === "black" ?
          <i className="icon-check" style={{ color: "white" }}></i> : null}</span>
        <span key="2" onClick={this.props.systemSet.bind(this, "menuTheme", "white")} className="wasabi-theme-box" style={{ backgroundColor: "white", border: "1px solid var(--border-color)" }}>
          {this.props.menuTheme === "white" ? <i className="icon-check"></i> : null}
        </span>

      </div>
      <Separator key="3">顶栏主题</Separator>
      <div key="d3" style={{ display: "flex", justifyContent: "space-around" }}>
        <span key="1" onClick={this.props.systemSet.bind(this, "headerTheme", "black")} className="wasabi-theme-box" style={{ backgroundColor: "#001529" }}>   {this.props.headerTheme === "black" ? <i className="icon-check" style={{ color: "white" }}></i> : null}</span>
        <span key="2" onClick={this.props.systemSet.bind(this, "headerTheme", "white")} className="wasabi-theme-box" style={{ backgroundColor: "white", border: "1px solid var(--border-color)" }}> {this.props.headerTheme === "white" ? <i className="icon-check"></i> : null}</span>
        <span key="3" onClick={this.props.systemSet.bind(this, "headerTheme", "primary")} className="wasabi-theme-box" style={{ backgroundColor: "var(--primary-color)" }}>  {this.props.headerTheme === "primary" ? <i className="icon-check" style={{ color: "white" }}></i> : null}</span>
        <span key="4" onClick={this.props.systemSet.bind(this, "headerTheme", "success")} className="wasabi-theme-box" style={{ backgroundColor: "var(--success-color)" }}>  {this.props.headerTheme === "success" ? <i className="icon-check" style={{ color: "white" }}></i> : null}</span>
        <span key="5" onClick={this.props.systemSet.bind(this, "headerTheme", "warning")} className="wasabi-theme-box" style={{ backgroundColor: "var(--warning-color)" }}>  {this.props.headerTheme === "warning" ? <i className="icon-check" style={{ color: "white" }}></i> : null}</span>
        <span key="6" onClick={this.props.systemSet.bind(this, "headerTheme", "danger")} className="wasabi-theme-box" style={{ backgroundColor: "var(--danger-color)" }}>   {this.props.headerTheme === "danger" ? <i className="icon-check" style={{ color: "white" }}></i> : null}</span>
      </div>

    </SlideMenu>
  }
}

export default SystemSet;