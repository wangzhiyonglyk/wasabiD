/*
 create by wangzhiyong
 date:2016-12-13
 desc:树节点组件
 edit 2020-10-24 勾选还是有缺陷
 edit 2021-05-11 勾选优化，todo 还要继续优化
 edit 2021-06-19 完善完成
  2021-11-28 完善组件，修复bug，增加连线，调整勾选，图标，文字等样式
2022-01-04 将树扁平化，去掉了子节点
2022-01-06 增加勾选可自定义，前面箭头可以定义等功能
   2022-01-07 修复树节点中文本节点宽度的bug
   2022-01-07 根据类型折叠图标不同
   2022-01-10 修复选择的bug
 */
import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import CheckBox from "../../Form/CheckBox";
import Radio from "../../Form/Radio";
import Text from "../../Form/Text";
import func from "../../libs/func";
import TreeNodeFormat from "./TreeNodeFormat";
import config from "./config";
function NodeView(props) {
  //节点属性
  let row = TreeNodeFormat(props);
  //从node的属性
  const {
    clickId,
    loadingId,
    selectAble,
    checkStyle,
    renameAble,
    removeAble,
    rename,
  } = props;
  //tree的事件
  const { onDoubleClick, onClick, onChecked, onExpand } = props;
  //node的事件
  const {
    onNodeDragStart,
    onNodeDragEnd,
    onNodeDrop,
    onNodeDragOver,
    onNodeDragLeave,
    onBlur,
    onKeyUp,
    beforeNodeRename,
    beforeNodeRemove,
    textFormatter,
  } = props;
  let title = row.title || row.text; //提示信息
  let iconCls = row.iconCls; //默认图标图标
  if (row.isParent) {
    //如果是父节点
    if (row.isOpened) {
      //打开状态，
      iconCls = row.iconOpen ? row.iconOpen : row.iconCls; //没有则用默认图标
    } else {
      //关闭状态
      iconCls = row.iconClose ? row.iconClose : row.iconCls; ///没有则用默认图标
    }
  }
  if (loadingId === row.id) {
    //正在异步加载
    iconCls = "icon-loading tree-loading";
  }
  let childrenLength = row.isOpened === false ? 0 : row?.children?.length || 0; //子节点个数
  let textwidthReduce = 20; //文本字段减少的宽度
  //空白位，表示节点层级
  let blankControl = [];
  if (row._path.length > 1) {
    for (let i = 1; i < row._path.length; i++) {
      blankControl.push(<span key={i} style={{ width: 20 }}></span>);
      textwidthReduce += 20;
    }
  }
  //节点前面箭头图标
  let arrowIcon;
  if (row.isParent) {
    //是父节点才有箭头
    if (row.isOpened) {
      if (props.arrowUnFoldIcon) {
        arrowIcon = (
          <div
            className={"wasabi-tree-li-icon"}
            style={{ display: "inline-block" }}
            onClick={row.isParent ? onExpand : null}
          >
            {props.arrowUnFoldIcon}
          </div>
        );
      }
    } else {
      if (props.arrowFoldIcon) {
        arrowIcon = (
          <div
            className={"wasabi-tree-li-icon"}
            style={{ display: "inline-block" }}
            onClick={row.isParent ? onExpand : null}
          >
            {props.arrowFoldIcon}
          </div>
        );
      }
    }
    if (!arrowIcon) {
      let icon = props.componentType === "tree" ? "icon-caret" : "icon-arrow";
      arrowIcon = (
        <i
          className={
            (clickId === row.id ? " selected " : "") +
            (row.open
              ? ` wasabi-tree-li-icon  ${icon}-down `
              : ` wasabi-tree-li-icon  ${icon}-right`)
          }
          onClick={row.isParent ? onExpand : null}
        >
          {/* span用于右边加虚线*/}
          <span className="wasabi-tree-li-icon-beforeRight"></span>
          {/* 用于向下加虚线 */}
          <span
            className="wasabi-tree-li-icon-afterBelow"
            style={{
              height:
                (childrenLength + 1) * config.rowDefaultHeight +
                (row._isLast ? config.rowDefaultHeight * -1 : 15),
            }}
          ></span>
        </i>
      );
    }
  } else {
    //不是父节点，占位符
    arrowIcon = (
      <i
        className={
          (clickId === row.id ? " selected " : "") + " wasabi-tree-li-icon-line"
        }
      >
        <span
          className="wasabi-tree-li-icon-afterBelow"
          style={{
            height:
              (childrenLength + 1) * config.rowDefaultHeight +
              (row._isLast ? config.rowDefaultHeight * -1 : 15),
          }}
        ></span>
      </i>
    );
  }

  let checkNode; //勾选节点
  if (checkStyle === "checkbox" && (selectAble || row.selectAble)) {
    checkNode = (
      <CheckBox
        half={row.half}
        name={"node" + row.id}
        /**有子节点有向下的虚线**/
        className={
          (clickId === row.id ? " selected " : "") +
          (childrenLength > 0 ? " hasChildren " : "  ")
        }
        value={row.isChecked ? row.id : ""}
        data={[{ value: row.id, text: "" }]}
        onSelect={onChecked}
      ></CheckBox>
    );
  } else if (checkStyle === "radio" && (selectAble || row.selectAble)) {
    checkNode = (
      <Radio
        type="radio"
        half={row.half}
        name={"node" + row.id}
        /**有子节点有向下的虚线**/
        className={
          (clickId === row.id ? " selected " : "") +
          (childrenLength > 0 ? " hasChildren " : "  ")
        }
        value={row.isChecked ? row.id : ""}
        data={[{ value: row.id, text: "" }]}
        onSelect={onChecked}
      ></Radio>
    );
  } else if (typeof checkStyle === "function" && row.selectAble) {
    checkNode = checkStyle(row);
  }

  if (checkNode) {
    textwidthReduce += 20;
  }
  //得到文本值
  let text = row.text;
  if (textFormatter && typeof textFormatter === "function") {
    //如果有自定义函数
    text = textFormatter(row);
  }
  //节点元素
  return (
    <li
      className="wasabi-tree-li"
      key={row.pId + "-" + row.id}
      style={{ display: row.hide ? "none" : "flex" }}
    >
      {blankControl}
      {/* 折叠节点 */}
      {/* //  不是父节点也要一个占位符 */}
      {arrowIcon}
      {/* 勾选 可以是自定义的组件 */}
      {checkNode}
      {/* 文本节点 */}
      <div
        id={row.nodeid}
        style={{ width: `calc(100% - ${textwidthReduce}px)` }}
        className={
          clickId === row.id
            ? "wasabi-tree-li-node selected"
            : "wasabi-tree-li-node"
        }
        title={title}
        onDrop={onNodeDrop}
        onDragOver={onNodeDragOver}
        onDragLeave={onNodeDragLeave}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      >
        {rename ? (
          <Text
            id={row.textid}
            required={true}
            onKeyUp={onKeyUp}
            onBlur={onBlur}
            name={"key" + row.id}
            value={row.text}
          ></Text>
        ) : (
          <div
            key="2"
            className="wasabi-tree-li-node-text-div"
            draggable={row.draggAble}
            onDragEnd={onNodeDragEnd}
            onDragStart={onNodeDragStart}
          >
            {/* 没有勾选功能时并且有子节点时有虚线 */}
            <i
              key="3"
              className={
                (!row.selectAble && childrenLength
                  ? " noCheckhasChildren "
                  : "  ") +
                iconCls +
                " wasabi-tree-text-icon"
              }
            ></i>
            <a href={row.href} className="wasabi-tree-txt">
              {text}
            </a>
          </div>
        )}
        {!rename && renameAble ? (
          <i
            key="edit"
            className={"icon-edit edit"}
            title="重命名"
            onClick={beforeNodeRename}
          ></i>
        ) : null}
        {!rename && removeAble ? (
          <i
            key="delete"
            className={"icon-delete edit"}
            title="删除"
            onClick={beforeNodeRemove}
          ></i>
        ) : null}
      </div>
    </li>
  );
}
NodeView = React.memo(NodeView);
function TreeNode(props) {
  const [rename, setRename] = useState(false);
  const [textid] = useState(func.uuid());
  const [nodeid] = useState(func.uuid());
  useEffect(() => {
    if (rename) {
      let input = document.getElementById(textid);
      if (input) {
        input.focus();
      }
    }
  }, [rename, textid]);

  /***
   * 注意此处所有的方法
   * 将节点数据row传回来，保证属性都是最新的
   * 方法中的props则只用于调用函数，因为函数不会变
   */

  /**
   * 单击事件
   */
  const onClick = useCallback(() => {
    let row = TreeNodeFormat(props);
    props.onClick && props.onClick(row.id, row.text, row);
  }, [props]);

  /**
   * 双击事件
   */
  const onDoubleClick = useCallback(() => {
    let row = TreeNodeFormat(props);
    props.onDoubleClick && props.onDoubleClick(row.id, row.text, row);
  }, [props]);
  /**
   * 勾选
   */
  const onChecked = useCallback(
    (checkValue) => {
      let row = TreeNodeFormat(props);
      props.onChecked && props.onChecked(row.id, row.text, row, checkValue);
    },
    [props]
  );
  /**
   * 节点展开/折叠
   */
  const onExpand = useCallback(() => {
    let row = TreeNodeFormat(props);
    let isOpened = !!!row.isOpened;
    props.onExpand && props.onExpand(isOpened, row.id, row.text, row);
  }, [props]);

  /**
   * 重命名
   */
  const onNodeRename = useCallback(
    (id, text, row, value) => {
      setRename(false);
      props.onRename && props.onRename(id, text, row, value);
    },
    [props]
  );

  /**
   * 重命名之前
   */
  const beforeNodeRename = useCallback(() => {
    let rename = true; //默认允许
    if (props.beforeRename) {
      let row = TreeNodeFormat(props);
      rename = props.beforeRename(row.id, row.text, row);
    }
    setRename(rename);
  }, [props]);
  /**
   * 失去焦点
   */
  const onBlur = useCallback(
    (value) => {
      let row = TreeNodeFormat(props);
      onNodeRename(row.id, row.text, row, value);
    },
    [props, onNodeRename]
  );
  /**
   * 回车
   */
  const onKeyUp = useCallback(
    (event) => {
      if (event.keyCode === 13) {
        let row = TreeNodeFormat(props);
        onNodeRename(row.id, row.text, row, event.target.value.trim());
      }
    },
    [props, onNodeRename]
  );
  /**
   * 删除之前
   */
  const beforeNodeRemove = useCallback(() => {
    let row = TreeNodeFormat(props);
    let remove = true;
    if (props.beforeRemove) {
      remove = props.beforeRemove(row.id, row.text, row);
    }
    if (remove) {
      props.onRemove && props.onRemove(row.id, row.text, row);
    }
  }, [props]);

  /**
   *
   * 下面是处理拖动的事件
   */
  const onNodeDragStart = useCallback(
    (event) => {
      let row = TreeNodeFormat(props);
      row.children = null; //注意了不传children下去
      if (row.draggAble) {
        let draggAble = true;
        if (props.beforeDrag) {
          draggAble = props.beforeDrag((row.id, row.text, row));
        }
        if (draggAble) {
          event.dataTransfer.setData("drag", JSON.stringify(row)); //保存起来
          window.localStorage.setItem("wasabi-drag-item", JSON.stringify(row)); //保存起来给别的地方使用
          props.onDrag && props.onDrag(row.id, row.text, row);
        }
      }
    },
    [props]
  );
  /**
   * 拖动组件，拖动结束
   */
  const onNodeDragEnd = useCallback((event) => {
    event.preventDefault();
    //不用这个事件的原因
    //在树组件本身内停靠时，这个事件有时候没有响应，原因不详，并且无法使用event.dataTransfer的，数据不对，原因不详
    //但是拖动到外部的时候，没有问题,先标记
  }, []);

  /**
   * 容器经过事件,要阻止默认事件，否则浏览默认是搜索
   */
  const onNodeDragOver = useCallback(
    (event) => {
      event.preventDefault(); //一定加这句,否则无法停靠
      let row = TreeNodeFormat(props);
      if (row.dropAble) {
        const domClientY = document
          .getElementById(nodeid)
          .getBoundingClientRect().top;
        const mouseClientY = event.clientY;
        if (
          (!row.dropType ||
            (row.dropType && row.dropType.inddexOf("before") > -1)) &&
          mouseClientY - domClientY < 10
        ) {
          //前插入
          document.getElementById(nodeid).style.borderTop =
            "1px solid var(--primary-color)";
          document.getElementById(nodeid).style.borderBottom = "none";
          document.getElementById(nodeid).style.backgroundColor =
            "var(--background-color)";
          window.localStorage.setItem("wasabi-drag-type", "before");
        } else if (
          (!row.dropType ||
            (row.dropType && row.dropType.inddexOf("in") > -1)) &&
          mouseClientY - domClientY < 30
        ) {
          //包含
          document.getElementById(nodeid).style.borderTop = "none";
          document.getElementById(nodeid).style.borderBottom = "none";
          document.getElementById(nodeid).style.backgroundColor =
            "var(--background-color)";
          window.localStorage.setItem("wasabi-drag-type", "in");
        } else if (
          !row.dropType ||
          (row.dropType && row.dropType.inddexOf("after") > -1)
        ) {
          //后插入
          document.getElementById(nodeid).style.borderTop = "none";
          document.getElementById(nodeid).style.borderBottom =
            "1px solid var(--primary-color)";
          document.getElementById(nodeid).style.backgroundColor =
            "var(--background-color)";
          window.localStorage.setItem("wasabi-drag-type", "after");
        }
      }
    },
    [props, nodeid]
  );
  /**
   * 容器离开事件
   * @param {} event
   */
  const onNodeDragLeave = useCallback(
    (event) => {
      event.preventDefault();
      document.getElementById(nodeid).style.borderTop = "none";
      document.getElementById(nodeid).style.borderBottom = "none";
      document.getElementById(nodeid).style.backgroundColor = null;
    },
    [nodeid]
  );
  /**
   * 容器组件的停靠事件
   */
  const onNodeDrop = useCallback(
    (event) => {
      event.preventDefault();
      let row = TreeNodeFormat(props);
      document.getElementById(nodeid).style.borderTop = "none";
      document.getElementById(nodeid).style.borderBottom = "none";
      document.getElementById(nodeid).style.backgroundColor = null;
      let drag = JSON.parse(event.dataTransfer.getData("drag"));
      if (!drag) {
        drag = JSON.parse(window.localStorage.getItem("wasabi-drag-item"));
      }
      let dragType = window.localStorage.getItem("wasabi-drag-type");
      if (!drag) {
        return;
      }
      if (row.dropAble) {
        //允许停靠

        let dropAble = true; //可以停靠
        if (props.beforeDrop) {
          dropAble = props.beforeDrop(drag, row, dragType); //存在并且返回
        }
        if (dropAble) {
          window.localStorage.removeItem("wasabi-drag-type");
          props.onDrop && props.onDrop(drag, row, dragType);
        }
      }
    },
    [props, nodeid]
  );

  return (
    <NodeView
      {...props}
      rename={rename}
      textid={textid}
      nodeid={nodeid}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onChecked={onChecked}
      onExpand={onExpand}
      onBlur={onBlur}
      onKeyUp={onKeyUp}
      beforeNodeRename={beforeNodeRename}
      beforeNodeRemove={beforeNodeRemove}
      onNodeDragEnd={onNodeDragEnd}
      onNodeDragLeave={onNodeDragLeave}
      onNodeDragOver={onNodeDragOver}
      onNodeDragStart={onNodeDragStart}
      onNodeDrop={onNodeDrop}
    ></NodeView>
  );
}

TreeNode.propTypes = {
  isParent: PropTypes.bool, //是否是父节点
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired, //值
  pId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired, //父节值
  text: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired, //标题
  title: PropTypes.string, //提示信息
  arrowFoldIcon: PropTypes.node, //折叠图标
  arrowUnFoldIcon: PropTypes.node, //展开图标
  iconCls: PropTypes.string, //默认图标
  iconClose: PropTypes.string, //[父节点]关闭图标
  iconOpen: PropTypes.string, //[父节点]打开图标
  isOpened: PropTypes.bool, //是否处于打开状态
  isChecked: PropTypes.bool, //是否被勾选
  selectAble: PropTypes.bool, //是否允许勾选
  draggAble: PropTypes.bool, //是否允许拖动，
  dropAble: PropTypes.bool, //是否允许停靠
  dropType: PropTypes.array, //停靠的模式["before","in","after"]
  href: PropTypes.string, //节点的链接
  hide: PropTypes.bool, //是否隐藏
  children: PropTypes.array, //子节点

  /**事件都是通过父组件传下来的 */
  //after事件
  onClick: PropTypes.func, //单击的事件
  onDoubleClick: PropTypes.func, //双击事件
  onCheck: PropTypes.func, //勾选/取消勾选事件
  onExpand: PropTypes.func, //展开事件
  onRename: PropTypes.func, //重命名事件
  onRemove: PropTypes.func, //删除事件
  onRightClick: PropTypes.func, //右键菜单
  onDrag: PropTypes.func, //拖动事件
  onDrop: PropTypes.func, //停靠事件
  //before 事件
  beforeDrag: PropTypes.func, //拖动前事件
  beforeDrop: PropTypes.func, //停靠前事件
  beforeRemove: PropTypes.func, //删除前事件
  beforeRename: PropTypes.func, //重命名前事件
  beforeRightClick: PropTypes.func, //鼠标右键前事件
};
TreeNode.defaultProps = {
  iconCls: "icon-text",
  iconClose: "icon-folder",
  iconOpen: "icon-folder-open",
  children: [],
};

export default React.memo(TreeNode);
