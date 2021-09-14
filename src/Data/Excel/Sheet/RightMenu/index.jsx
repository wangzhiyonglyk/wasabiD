/**
 * create by wangzhiyong
 * date:2021-07-03
 * desc:右键菜单
 */
import React from "react";
import ContentMenuPanel from "../../../ContentMenu/ContentMenuPanel";
import ContentMenu from "../../../ContentMenu";
import LinkButton from "../../../../Buttons/LinkButton";
class RightMenu extends React.Component {
    constructor(props) {
        super(props);
        this.menu = React.createRef();
        this.state = {

        }
        this.onClick = this.onClick.bind(this);
    }
    open(event) {
        if (event) {
            this.menu.current.open(event);
        }
    }

    onClick(name, event) {
        if (this.props.onClick && name) {
            if (name.indexOf("align") > -1) {
                name = name.split("-");
                this.props.onClick("changeProps", name[0], name[1]);
            }
            else if (name === "merge" || name === "wrap") {
                this.props.onClick("changeProps", name);
            }
            else {
                this.props.onClick("changeCells", name);
            }
        }


    }
    render() {
        return <ContentMenu ref={this.menu} style={this.props.style} onClick={this.onClick}>
            <ContentMenuPanel key="1">
                <div><LinkButton theme="info" iconCls="icon-list" title="对齐">对齐</LinkButton> <LinkButton theme="info" iconCls="icon-caret-right" style={{ marginLeft: 30 }}></LinkButton></div>
                <ContentMenu>
                    <ContentMenuPanel key="1" name="align-left"><LinkButton theme="info" iconCls="icon-align-left" title="左对齐">左对齐</LinkButton></ContentMenuPanel>
                    <ContentMenuPanel key="2" name="align-center"><LinkButton theme="info" iconCls="icon-align-center" title="居中对齐">居中对齐</LinkButton></ContentMenuPanel>
                    <ContentMenuPanel key="3" name="align-right"><LinkButton theme="info" iconCls="icon-align-right" title="右对齐">右对齐</LinkButton></ContentMenuPanel>
                </ContentMenu>
            </ContentMenuPanel>
            <ContentMenuPanel key="2" name="merge-cell"><LinkButton theme="info" iconCls="icon-merge-cell" title="合并单元格">合并单元格</LinkButton></ContentMenuPanel>
            <ContentMenuPanel key="3" name="wrap"><LinkButton theme="info" iconCls="icon-wrap" title="自动换行">自动换行</LinkButton></ContentMenuPanel>
            <ContentMenuPanel key="4">
                <div><LinkButton theme="info" iconCls="icon-expand" title="插入">插入</LinkButton> <LinkButton theme="info" iconCls="icon-caret-right" style={{ marginLeft: 30 }}></LinkButton></div>
                <ContentMenu>
                    <ContentMenuPanel key="1" name="addCellDown"><LinkButton theme="info" iconCls="icon-arrow-down" title="活动单元格下移">活动单元格下移</LinkButton></ContentMenuPanel>
                    <ContentMenuPanel key="2" name="addCellRight"><LinkButton theme="info" iconCls="icon-arrow-right" title="活动单元格右移">活动单元格右移</LinkButton></ContentMenuPanel>
                    <ContentMenuPanel key="3" name="addRow"><LinkButton theme="info" iconCls="icon-arrowsh" title="插入整行">插入整行</LinkButton></ContentMenuPanel>
                    <ContentMenuPanel key="4" name="addColumn"><LinkButton theme="info" iconCls="icon-arrowsv" title="插入整列">插入整列</LinkButton></ContentMenuPanel>
                </ContentMenu>
            </ContentMenuPanel>
            <ContentMenuPanel key="5">
                <div><LinkButton theme="info" iconCls="icon-reduce" title="删除">删除</LinkButton> <LinkButton theme="info" iconCls="icon-caret-right" style={{ marginLeft: 30 }}></LinkButton></div>
                <ContentMenu>
                    <ContentMenuPanel key="1" name="deleteCellDown"><LinkButton theme="info" iconCls="icon-arrow-down" title="活动单元格下移">活动单元格下移</LinkButton></ContentMenuPanel>
                    <ContentMenuPanel key="2" name="deleteCellRight"><LinkButton theme="info" iconCls="icon-arrow-right" title="活动单元格右移">活动单元格右移</LinkButton></ContentMenuPanel>
                    <ContentMenuPanel key="3" name="deleteRow"><LinkButton theme="info" iconCls="icon-arrowsh" title="删除整行">删除整行</LinkButton></ContentMenuPanel>
                    <ContentMenuPanel key="4" name="deleteColumn"><LinkButton theme="info" iconCls="icon-arrowsv" title="删除整列">删除整列</LinkButton></ContentMenuPanel>
                </ContentMenu>
            </ContentMenuPanel>

        </ContentMenu>

    }
}
export default RightMenu;