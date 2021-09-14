import React from "react";
import Tabs from "../../Navigation/Tabs/Tabs";
import TabPanel from "../../Navigation/Tabs/TabPanel";
class SystemCenter extends React.Component {
    constructor(props) {
        super(props);
        this.tabsref = React.createRef();
    }
    render() {
        return <Tabs onClose={this.props.closeMenu.bind(this)} ref={this.tabsref}  theme={this.props.systemTheme}>
            {this.props.tabs && this.props.tabs.map((item,index) => {
                return (
                    <TabPanel  key={item.title+index} title={item.title} iconCls={item.iconCls}>
                        {
                            typeof item.url === "string" ? <iframe
                              
                                src={item.url}
                                style={{ width: "100%", height: "calc(100% - 10px)", border: "none" }}
                            >

                            </iframe> : item.url
                        }

                    </TabPanel>
                );
            })}
        </Tabs>
    }
}

export default SystemCenter;