/**
 * Created by wangzy on 16/6/17.
 * edit by wangzhiyong 
 * date:2017-08-14 进行大改版
 * desc:框架入口
 */

'use strict';

require("whatwg-fetch");//让safari支持fetch

/*****************按钮组件******************/
exports.Button = require('./Buttons/Button.jsx');//普通按钮
exports.LinkButton = require('./Buttons/LinkButton.jsx');//可移动，可带图标，可带链接的按钮
exports.Toolbar = require('./Buttons/Toolbar.jsx');//LinkButton按钮集合组件

/*****************数据组件******************/
exports.DataGrid = require('./Data/DataGrid.jsx');//数据列表组件
exports.Tree = require('./Data/Tree.jsx');//树的组件
exports.Transfer = require('./Data/Transfer.jsx');//穿梭框组件


/*****************表单集组件******************/
exports.SearchBar = require('./Form/SearchBar.jsx');//表单查询组件
exports.Form = require('./Form/Form.jsx');//表单提交组件

/*****************表单组件******************/
exports.Input = require('./Form/Input.jsx');//通用表单组件
exports.Text = require('./Form/Text.jsx');//文本框
exports.None = require('./Form/None.jsx');//空白占位表单组件
/*****************类按钮表单组件******************/

exports.Radio = require('./Form/Radio.jsx');//单选框集合组件
exports.CheckBox = require('./Form/CheckBox.jsx');//复选框集合组件
exports.SwitchButton = require('./Form/SwitchButton.jsx');//开关组件


/*****************日期组件******************/
exports.Time = require('./Form/Time.jsx');//时间选择组件
exports.DateD = require('./Form/DateD.jsx');//日期选择组件
exports.DateTime = require('./Form/DateTime.jsx');//日期时间选择组件
exports.DateRange = require('./Form/DateRange.jsx');//日期范围选择组件
exports.DateTimeRange = require('./Form/DateTimeRange.jsx');//日期时间范围选择组件

/*****************下拉组件******************/
exports.MutiText = require('./Form/MutiText.jsx');//多行添加组件
exports.Select = require('./Form/Select.jsx');//普通下拉选择组件
exports.Picker = require('./Form/Picker.jsx');//级联选择组件
exports.TreePicker = require('./Form/TreePicker.jsx');//下拉树选择组件
exports.DatePicker = require('./Form/DatePicker.jsx');//通用下拉日期组件
exports.ComboBox = require('./Form/ComboBox.jsx');//通用下拉框组件
exports.SearchBox = require('./Form/SearchBox.jsx');//筛选框



/*****************布局组件******************/

exports.Drop = require('./Layout/Drop.jsx');//停靠组件
exports.Layout = require('./Layout/Layout.jsx');//布局组件
exports.Center = require('./Layout/Center.jsx');//布局组件-中间
exports.Header = require('./Layout/Header.jsx');//布局组件-头部
exports.Footer = require('./Layout/Footer.jsx');//布局组件-底部
exports.Left = require('./Layout/Left.jsx');//布局组件-左侧
exports.Right = require('./Layout/Right.jsx');//布局组件-右侧
exports.Container = require('./Layout/Container.jsx');//布局组件-网格容器
exports.Row = require('./Layout/Row.jsx');//布局组件-行
exports.Col = require('./Layout/Col.jsx');//布局组件-列


exports.Modal = require('./Layout/Modal.jsx');//模态层组件
exports.Panel = require('./Layout/Panel.jsx');//面板组件
exports.Resize = require('./Layout/Resize.jsx');//可调整大小组件
exports.Reverse = require('./Layout/Reverse.jsx');//翻转组件

exports.SlidePanel = require('./Layout/SlidePanel.jsx');//滑动面板
exports.Message = require('./Unit/Message.jsx');//消息组件
exports.ToolTip = require('./Unit/ToolTip.jsx');//提示信息组件
exports.Tooltip_shy = require('./Unit/Tooltip_shy.jsx');//提示信息组件-shy
exports.Progress = require('./Unit/Progress.jsx');//进步条组件

/*****************导航组件******************/
exports.Menus = require('./Navigation/Menus.jsx');//菜单组件
exports.MenuPanel=require('./Navigation/MenuPanel.jsx');//菜单面板组件
exports.Tabs = require('./Navigation/Tabs.jsx');//页签组件
exports.TabPanel=require('./Navigation/TabPanel.jsx');//页签面板组件
exports.Track = require('./Navigation/Track.jsx');//物流跟踪

/*****************功能组件******************/
exports.Import = require('./Action/Import.jsx');//excel导入组件
exports.Upload = require('./Action/Upload.jsx');//上传组件
exports.Single = require('./Action/Single.jsx');//单页面组件
exports.Page = require('./Action/Page.jsx');//页面基类



exports.ButtonModel = require('./Model/ButtonModel.js');//按钮数据模型
exports.FetchModel = require('./Model/FetchModel.js');//ajax查询数据模型
exports.FooterModel = require('./Model/FooterModel.js');//列表页脚数据模型
exports.FormModel = require('./Model/FormModel.js');//表单数据模型
exports.HeaderModel = require('./Model/HeaderModel.js');//列表表头数据模型
exports.MenuModel = require('./Model/MenuModel.js');//菜单数据模型
exports.PickerModel = require('./Model/PickerModel.js');//级联选择框数据模型
exports.TabModel = require('./Model/TabModel.js');//页签数据模型
exports.NodeModel = require('./Model/NodeModel.js');//树节点数据模型


exports.unit = require('./libs/unit.js');//常用函数
exports.ClickAway = require('./Unit/ClickAway.js');//全局单击事件






