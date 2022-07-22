/**
 * 树节点基本属性
 */
class TreeNodeRow {
  constructor() {
    this.isParent = null; //是否是父节点
    this.id = ""; //值
    this.pId = ""; //父节点
    this.text = ""; //标题
    this.title = ""; //提示信息
    this.iconCls = ""; //默认图标
    this.iconClose = ""; //[父节点]关闭图标
    this.iconOpen = ""; //[父节点]打开图标
    this.isOpened = false; //是否处于打开状态
    this.checked = false; //是否被勾选
    this.selectAble = false; //是否允许勾选
    this.draggAble = false; //是否允许拖动，
    this.dropAble = false; //是否允许停靠
    this.href = null; //节点的链接
    this.hide = false; //是否隐藏
    this.children = null; //子节点
    this.nodeid = ""; //dom的id
    this.textid = ""; //文本的id
    this.children = null;
    this._path = null; //路径
    this.half = false; //是否半选
    this.isLast = false; //是否是同级最后一个节点
  }
}
function formatterTreeNode(props) {
  let row = new TreeNodeRow(); //得到节点数据，有默认值，并且不包含方法
  for (let key in props) {
    if (
      typeof props[key] !== "function" &&
      props[key] !== undefined &&
      props[key] !== null
    ) {
      row[key] = props[key];
    }
  }
  return row;
}

export default formatterTreeNode;
