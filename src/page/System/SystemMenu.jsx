import React from "react"
import Menus from "../../Navigation/Menus";
import MenuPanel from "../../Navigation/MenuPanel";
import MenuItem from "../../Navigation/MenuItem";
class SystemMenu extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <React.Fragment>
            {this.props.navTheme === "left" ? <div className={"system " + (this.props.menuTheme || "black")}>
            {this.props.logo ? <img className='logo' src={this.props.logo}></img> : null}
                <span className='title'>{this.props.title}</span>
            </div> : null}
            <Menus theme={this.props.menuTheme || "black"} colorTheme={this.props.systemTheme} style={{minHeight: this.props.navTheme !== "left"?"100%":null}}>
                {
                    this.props.menus && this.props.menus.map((item, index) => {
                        if (item.children && item.children.length > 0) {
                            return <MenuPanel iconCls={item.iconCls} key={index} expand={item.expand != null && item.expand != undefined ? item.expand : true} name={item.name} title={item.title}>
                                {
                                    item.children && item.children.map((route, subIndex) => {
                                        if (route.hide) {
                                            return null;
                                        }
                                        return <MenuItem iconCls={route.iconCls} key={index + "-" + subIndex} active={route.title == this.props.activeMenu} onClick={this.props.openMenu.bind(this, route, item)} name={route.name}>{route.title}</MenuItem>
                                    })

                                }
                            </MenuPanel>
                        }
                        else {
                            return <MenuPanel iconCls={item.iconCls} key={index} onClick={this.props.openMenu.bind(this, item)} name={item.name} title={item.title}></MenuPanel>
                        }

                    })
                }
            </Menus>
        </React.Fragment>
    }
}

export default SystemMenu;