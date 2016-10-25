/**
 * Created by wangzy on 16/6/17.
 * desc:框架入口
 */

'use strict';

require("whatwg-fetch");
/*****************按钮组件******************/
exports.Button = require('./Base/Buttons/Button.jsx');//普通按钮
 exports.LinkButton = require('./Base/Buttons/LinkButton.jsx');//可移动，可带图标，可带链接的按钮
 exports.Toolbar = require('./Base/Buttons/Toolbar.jsx');//LinkButton按钮集合组件

/*****************数据组件******************/
 exports.DataGrid = require('./Base/Data/DataGrid.jsx');//数据列表组件
 exports.MenuTree = require('./Base/Data/MenuTree.jsx');//简单树的组件

/*****************表单集组件******************/
 exports.SearchBar = require('./Base/Form/searchBar.jsx');//表单查询组件
 exports.Form = require('./Base/Form/Form.jsx');//表单提交组件

/*****************表单组件******************/
exports.Input = require('./Base/Form/Input.jsx');//通用表单组件

/*****************类按钮表单组件******************/
exports.Text = require('./Base/Form/Text.jsx');//文本框
exports.Radio = require('./Base/Form/Radio.jsx');//单选框集合组件
exports.CheckBox = require('./Base/Form/CheckBox.jsx');//复选框集合组件
exports.SwitchButton = require('./Base/Form/SwitchButton.jsx');//开关组件


/*****************日期组件******************/
exports.Time = require('./Base/Form/Time.jsx');//时间选择组件
exports.DateD = require('./Base/Form/DateD.jsx');//日期选择组件
exports.DateTime = require('./Base/Form/DateTime.jsx');//日期时间选择组件
exports.DateRange = require('./Base/Form/DateRange.jsx');//日期范围选择组件
exports.DateTimeRange = require('./Base/Form/DateTimeRange.jsx');//日期时间范围选择组件

/*****************下拉组件******************/
exports.Select = require('./Base/Form/Select.jsx');//普通下拉选择组件
exports.Picker = require('./Base/Form/Picker.jsx');//级联选择组件
exports.GridPicker = require('./Base/Form/GridPicker.jsx');//下拉列表选择组件
exports.PanelPicker = require('./Base/Form/PanelPicker.jsx');//级联选择组件

exports.DatePicker = require('./Base/Form/DatePicker.jsx');//通用下拉日期组件
exports.ComboBox = require('./Base/Form/ComboBox.jsx');//通用下拉框组件
exports.SearchBox = require('./Base/Form/SearchBox.jsx');//筛选框



/*****************布局组件******************/
 exports.Drop = require('./Base/Layout/Drop.jsx');//停靠组件

exports.Modal = require('./Base/Layout/Modal.jsx');//模态层组件
 exports.Panel = require('./Base/Layout/Panel.jsx');//面板组件
 exports.Resize = require('./Base/Layout/Resize.jsx');//可调整大小组件
 exports.Reverse = require('./Base/Layout/Reverse.jsx');//翻转组件

 exports.SlidePanel = require('./Base/Layout/SlidePanel.jsx');//滑动面板
 exports.Message = require('./Base/Unit/Message.jsx');//消息组件
 exports.ToolTip = require('./Base/Unit/ToolTip.jsx');//提示信息组件
 exports.Tooltip_shy = require('./Base/Unit/Tooltip_shy.jsx');//提示信息组件-shy
 exports.ProgressCricle = require('./Base/Unit/ProgressCricle.jsx');//环形进度条组件-shy

/*****************导航组件******************/
exports.MenuTabs = require('./Base/Navigation/MenuTabs.jsx');//菜单tab组件
exports.Tabs = require('./Base/Navigation/Tabs.jsx');//页签组件
exports.Track = require('./Base/Navigation/Track.jsx');//物流跟踪


/*****************功能组件******************/
exports.Import = require('./Action/Import.jsx');//excel导入组件



 exports.ButtonModel = require('./model/ButtonModel.js');//按钮数据模型
 exports.FetchModel = require('./model/FetchModel.js');//ajax查询数据模型
 exports.FooterModel = require('./model/FooterModel.js');//列表页脚数据模型
exports.FormModel = require('./model/FormModel.js');//表单数据模型
 exports.HeaderModel = require('./model/HeaderModel.js');//列表表头数据模型
 exports.MenuModel = require('./model/MenuModel.js');//菜单数据模型
exports.PickerModel = require('./model/PickerModel.js');//级联选择框数据模型
exports.TabModel = require('./model/TabModel.js');//页签数据模型


 exports.unit = require('./libs/unit.js');//常用函数





