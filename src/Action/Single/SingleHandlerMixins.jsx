/*
create by wangzhiyong
date:2016-10-30
desc:单页面应用的事件处理模型
 * edit 2021-01-15
 */
import React from "react"
import Msg from "../../Info/Msg.jsx";
let SingleHandlerMixins = {
  /**
   * 自定义按钮组事件
   * @param {*} name 
   */
  btnHandler(name) {
    this.props.btnHandler && this.props.btnHandler(name);
  },

  /**
 * 筛选查询
 * @param {*} params 
 */
  filterHandler: function (params) {
    params = { ...this.state.params, ...params };

    if (this.props.pageHandler)
      this.datagrid.current.reload(params);
  },
  /**
   * 弹出面板提交事件
   */
  modalOKHandler() {
    if (this.state.opType == "edit") {
      this.onUpdate();
    }
    else if (this.state.opType == "add") {
      this.addHandler();
    } else {
      this.modal.current.close();
    }
  },


  /**
   * 以下是增删改的事件
   */


  /**
  * 打开新增面板
  */
  addOpen: function () {
    try {
      setTimeout(() => {
        this.form.current && this.form.current.clearData();
        this.modal.current && this.modal.current.open(<span style={{ fontSize: 18, fontWeight: "bold" }}>{this.props.title}</span>);
      }, 50);

    }
    catch (e) {
    }
    this.setState({
      opType: 'add',
    });
    this.props.openAddHandler && this.props.openAddHandler();
  },
  /**
   * 新增事件
   * @param {*} model 
   */
  addHandler: function () {
    if (typeof this.props.addHandler === "function") {
      let data = {};
      if (this.props.autoOp) {
        if (this.form.current && this.form.current.validate()) {
          data = this.form.current.getData();
        }
        else {
          return;
        }
      }
      this.props.addHandler && this.props.addHandler(data);
    }
    else {
      Msg.error("您没有设置新增接口");
    }


  },

  /**
   * 打开编辑
   * @param {*} rowData 
   * @param {*} rowIndex 
   */
  openUpdate(rowData) {
    try {
      this.setState({
        opType: 'edit',
      });
      setTimeout(() => {
        this.form.current && this.form.current.setData(rowData);
        this.modal.current && this.modal.current.open(<span style={{ fontSize: 18, fontWeight: "bold" }}>{this.props.title}</span>);
      }, 50);
    }
    catch (e) {
    }
    if (typeof this.props.openonUpdate === "function") {
      this.props.openonUpdate(rowData);
    }



  },

  /**
   * 更新处理
   * @param {*} model 
   */
  onUpdate() {
    if (typeof this.props.onUpdate === "function") {
      let data = {};
      if (this.props.autoOp) {
        if (this.form.current && this.form.current.validate()) {
          data = this.form.current.getData();
        }
        else {
          return;
        }
      }
      this.props.onUpdate && this.props.onUpdate(data);
    }
    else {
      Msg.error("您没有设置更新接口");
    }
  },
  /**
    * 删除事件
    * @param {*} rowData 
    * @param {*} rowIndex 
    */
  deleteHandler: function (rowData, rowIndex) {
    //删除事件
    Msg.confirm('确定删除这条记录吗?', () => {
      if (typeof this.props.deleteHandler === "function") {
        this.props.deleteHandler && this.props.deleteHandler(rowData);
      }
      else {
        Msg.error("您没有设置删除接口");
      }

    });
  },

  /**
   * 查看详情
   * @param {*} rowData 
   * @param {*} rowIndex 
   */
  openDetail(rowData, rowIndex) {
    try {
      this.setState({
        opType: 'search',
      });
      setTimeout(() => {
        this.form.current && this.form.current.setData(rowData);
        this.modal.current && this.modal.current.open(<span style={{ fontSize: 18, fontWeight: "bold" }}>{this.props.title}</span>);

      }, 50);
    }
    catch (e) {
    }

    if (typeof this.props.onDetail === "function") {
      this.props.onDetail && this.props.onDetail(rowData);
    }
    else {

    }
  }
};

export default SingleHandlerMixins;