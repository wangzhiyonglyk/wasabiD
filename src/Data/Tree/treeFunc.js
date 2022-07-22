//树的公共方法    edit 2022-03-31
//edit by 2022-07-22 完善

/** 
通过id找到节点路径
* @param {*} hashData hash表
* @param {*}id id
* @returns
*/
import func from "../../libs/func";
function findPathById(hashData, id) {
  return hashData && hashData.get(id);
}
/** 
要树结构数据中找到节点
* @param {*} data
* @param {*} path 路径
*/
function findNodeByPath(data, path) {
  let node = null;
  try {
    if (data && data.length > 0 && path && path.length > 0) {
      node = data[path[0]]; //节点链表
      if (path && path.length > 1) {
        for (let i = 1; i < path.length; i++) {
          if (node.children && node.children.length > 0) {
            node = node.children[path[i]];
          }
        }
      }
    }
  } catch (e) {
    console.error("findNodeByPath", e);
  }

  return node;
}
/** 
通过id找到节点 
@param {*} hashData
 @param {*} data
  @param {*} id id
  */
export function findNodeById(hashData, data, id) {
  try {
    if (Array.isArray(data)) {
      return findNodeByPath(data, findPathById(hashData, id));
    }
  } catch (e) {
    console.error("findNodeById", e);
  }
  return null;
}
/**
 * 找树结构数据中到节点链表
 * @param {*} data 数据
 * @param {*} path 路径
 */
export function findLinkNodesByPath(data, path) {
  let nodes = [];
  try {
    if (Array.isArray(data) && Array.isArray(path)) {
      nodes = [data[path[0]]]; //节点链表
      if (path && path.length > 1) {
        for (let i = 1; i < path.length; i++) {
          if (
            nodes[nodes.length - 1].children &&
            nodes[nodes.length - 1].children.length > 0
          ) {
            nodes.push(nodes[nodes.length - 1].children[path[i]]);
          }
        }
      }
    }
  } catch (e) {
    console.error("findLinkNodesByPath", e);
  }
  return nodes;
}

/** *
设置节点及子孙节点的勾选
* @param {*} hashData 节点位置数据
* @param {*} data 数据
* @param {*}id 节点id
* @param {*} isChecked 勾选状态
* @param {*} checkType 勾选方式

*/
export function setChecked(hashData, data, id, isChecked, checkType) {
  try {
    if (Array.isArray(data)) {
      let node = findNodeById(hashData, data, id);
      if (node) {
        node.isChecked = !!isChecked;
        //设置节点及子节点的勾选
        if (
          isChecked &&
          checkType &&
          checkType.y &&
          checkType.y.indexOf("s") > -1
        ) {
          node = setNodeChildrenChecked(node, node.isChecked);
        } else if (
          !isChecked &&
          checkType &&
          checkType.n &&
          checkType.n.indexOf("s") > -1
        ) {
          node = setNodeChildrenChecked(node, node.isChecked);
        }
        //设置祖先节点
        if (
          node.isChecked &&
          checkType &&
          checkType.y &&
          checkType.y.indexOf("p") > -1
        ) {
          setNodeParentsChecked(findLinkNodesByPath(data, node._path));
        } else if (
          !node.isChecked &&
          checkType &&
          checkType.n &&
          checkType.n.indexOf("p") > -1
        ) {
          setNodeParentsChecked(findLinkNodesByPath(data, node._path));
        }
      }
    }
  } catch (e) {
    console.error("setChecked", e);
  }
  return data;
}

/**
 * 单选时的勾选
 * @param {*} hashData 节点位置数据
 * @param {*} data 数据
 * @param {*} id 节点id
 * @param {*} isChecked 勾选状态
 * @param {*} radioType 勾选方式
 * @returns
 */
export function setRadioChecked(hashData, data, id, isChecked, radioType) {
  try {
    if (Array.isArray(data)) {
      const node = findNodeById(hashData, data, id);
      if (node) {
        if (radioType === "all") {
          data = clearChecked(data);
          node.isChecked = isChecked;
          node.half = false;
        } else if (radioType === "level") {
          const nodes = findLinkNodesByPath(data, node._path);
          if (nodes && nodes.length >= 2) {
            // 有父节点，去设置兄弟节点
            const parentRemoveNode = nodes[nodes.length - 2];
            if (
              parentRemoveNode.children &&
              parentRemoveNode.children.length > 0
            ) {
              for (let i = 0; i < parentRemoveNode.children.length; i++) {
                parentRemoveNode.children[i].isChecked = false;
                parentRemoveNode.children[i].half = false;
              }
            }
          } else if (nodes && nodes.length === 1) {
            // 根节点
            for (let i = 0; i < data.length; i++) {
              data[i].isChecked = falsedata[i].half = false;
            }
            // 本身
            if (nodes && nodes.length > 0) {
              nodes[nodes.length - 1].isChecked - isChecked;
              nodes[nodes.length - 1].half = false;
            }
          }
        }
      }
    }
  } catch (e) {
    console.log("setRadioChecked", e);
  }
  return data;
}

/**
 * *设置节点的子节点勾选
 * @param {*} node 节点对象
 * @param {*} isChecked 是否勾选
 * @returns
 */
function setNodeChildrenChecked(node, isChecked) {
  try {
    node.isChecked = isChecked;
    node.half = false; //设置为否
    if (Array.isArray(node.children)) {
      for (let i = 0; i < node.children.length; i++) {
        node.children[i] = setNodeChildrenChecked(node.children[i], isChecked);
      }
    }
  } catch (e) {
    console.error("setNodeChildrenChecked", e);
  }
  return node;
}
/**
设置祖先节点的
* @param {*} nodes 节点链表，包括自身
*/
export function setNodeParentsChecked(nodes) {
  try {
    if (nodes && nodes.length > 1) {
      //有父节点
      for (let i = nodes.length - 2; i >= 0; i--) {
        //倒序的
        if (nodes[i].children && nodes[i].children.length > 0) {
          let checkedNum = 0;
          let halfNum = 0;
          for (let j = 0; j < nodes[i].children.length; j++) {
            if (nodes[i].children[j].isChecked) {
              checkedNum++;
            }
            if (nodes[i].children[j].half) {
              halfNum++;
            }
          }
          if (checkedNum === nodes[i].children.length) {
            //全部勾选
            nodes[i].isChecked = true;
            nodes[i].half = false;
          } else if (
            (checkedNum > 0 && checkedNum !== nodes[i].children.length) ||
            halfNum > 0
          ) {
            //部分勾选，或者有半选
            nodes[i].isChecked = false;
            nodes[i].half = true;
          } else {
            nodes[i].isChecked = false;
            nodes[i].half = false;
          }
        }
      }
    }
  } catch (e) {
    console.error("setNodeParentsChecked", e);
  }
}

/**
 * 获取所有勾选的节点
@param {*} data
*/
export function getChecked(data, checkedArr = []) {
  try {
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        if (node.isChecked) {
          checkedArr.push(node);
          if (Array.isArray(node.children)) {
            getChecked(node.children, checkedArr);
          }
        }
      }
    }
  } catch (e) {
    console.error("getChecked", e);
  }
  return checkedArr;
}

/**
 * 清除勾选
* @param {*} data
@returns
*/
export function clearChecked(data) {
  try {
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        item.isChecked = false;
        item.half = false;
        if (Array.isArray(item.children)) {
          clearChecked(item.children);
        }
      }
    }
  } catch (e) {}
  return data;
}
/**
 * 勾选
 * @param {*} data
 * @returns
 */
export function checkedAll(data) {
  if (data && data instanceof Array && data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      data[i].isChecked = true;
      data[i].half = false;
      if (data[i].children && data[i].children.length > 0) {
        data[i].children = checkedAll(data[i].children);
      }
    }
    return data;
  }
}

/**
 * 设置折叠
 * @param {*} hashData
 * @param {*} data
 * @param {*} id
 * @param {*} isOpened 是否展开
 * @param {*} foldBroAble 是否折蠱兄弟节点
 */
export function setOpen(hashData, data, id, isOpened, foldBroAble = false) {
  try {
    if (Array.isArray(data)) {
      const node = findNodeById(hashData, data, id);
      if (node) {
        if (foldBroAble && isOpened) {
          // 本节点展开， 设置兄弟节点折叠
          const nodes = findLinkNodesByPath(data, node._path);
          let children = [];
          if (nodes && nodes.length > 1) {
            //有根节点
            children = nodes[nodes.length - 2].children;
          } else {
            children = data;
          }
          for (let i = 0; i < children.length; i++) {
            children[i].isOpened = !isOpened;
          }
        }
        if (isOpened) {
          // 如果是展开，设置祖先节点全部展开
          setLinkNodeOpen(hashData, data, node.id);
        } else {
          node.isOpened = isOpened;
        }
      }
    }
  } catch (e) {
    console.error("setOpen", e);
  }
  return data;
}

/**
 * 设置路径上所有节点都展开
 * @param {*} hashData
 * @param {*} data
 * @param {*} id
 * @returns
 */
export function setLinkNodeOpen(hashData, data = [], id) {
  try {
    if (Array.isArray(data)) {
      const node = findNodeById(hashData, data, id);
      if (node) {
        const nodes = findLinkNodesByPath(data, node._path);
        if (nodes && nodes.length > 0) {
          nodes.forEach((item) => {
            item.isOpened = true;
          });
        }
      }
    }
  } catch (e) {
    console.log("setLinkNodeOpen", e);
  }
  return data;
}

/**
 * 重命名
 * @param {*} hashData
 * @param {*} data
 * @param {*} id
 * @param {*} newText 新文本
 * @returns
 */
export function renameNode(hashData, data, id, newText, options) {
  if (Array.isArray(data)) {
    const node = findNodeById(hashData, data, id);
    if (node) {
      node.text = newText;
      node[options?.textField] = newText;
    }
  }
  return data;
}
/**
 * 删除节点
 * @param {*} hashData
 * @param {*} data
 * @param {*} id
 * @returns
 */
export function removeNode(hashData, data, id) {
  try {
    if (Array.isArray(data)) {
      const node = findNodeById(hashData, data, id);
      if (node) {
        let nodes = findLinkNodesByPath(data, node._path);
        if (nodes.length === 1) {
          //根节点
          try {
            data.splice(nodes[0]._path[0], 1); //删除
            hashData.delete(nodes[0].id); //删除hash记录
            return setChildrenPath(hashData, "", [], data);
          } catch (e) {
            console.error("removeNode", nodes);
          }
        } else {
          //父节点删除子节点
          //改变子节点的路径
          let parentRemoveNode = nodes[nodes.length - 2]; //找到父节点
          parentRemoveNode.children.splice(
            node._path[node._path.length - 1],
            1
          );
          hashData.delete(nodes[0].id); //删除hash记录
          removeHashData(hashData, node.children); //删除子节点的hash记录
          parentRemoveNode.children = setChildrenPath(
            hashData,
            parentRemoveNode.id,
            parentRemoveNode._path,
            parentRemoveNode.children
          );
        }
        return data;
      }
    }
  } catch (e) {
    console.error("removeNode", e);
  }
  return data;
}
/**
 * 删除子节点的hash记录
 * @param {*} hashData
 * @param {*} children
 */
function removeHashData(hashData, children) {
  if (Array.isArray(children)) {
    children.forEach((item) => {
      hashData.delete(item.id);
      removeHashData(hashData, item.children);
    });
  }
}
/**
 * 更新节点
 *  @param {*} hashData hash地址
 * @param {*} data 数据
 * @param {*} id 节点id
 * @param {*} newNode 新节点
 * @param {*} options 属性选项
 * @returns
 */
export function updateNode(hashData, data, id, newNode, options) {
  if (Array.isArray(data)) {
    const node = findNodeById(hashData, data, id);
    if (node) {
      const textField = options?.textField ?? "text";
      for (let key in newNode) {
        if (key !== "id" && key !== "pId") {
          //不更新id,pId
          node[key] = newNode[key];
        }
      }
      //更新文本
      node.text = newNode[textField];
      if (Array.isArray(newNode[options?.childrenField] ?? newNode.children)) {
        //如果有子节点，则更新子节点,设置路径
        node.children = setChildrenPath(
          hashData,
          node.id,
          node._path,
          newNode.children,
          options
        );
      }

      return data;
    }
  } else {
    return [newNode];
  }

  return data;
}
/**
 * 移动到节点中
 * @param {*} hashData hash地址
 * @param {*} data 数据
 * @param {*} dragNodeId 移动节点
 * @param {*} dropNodeId 停靠节点
 * @param {*} options 节点属性
 */
export function moveInNode(hashData, data, dragNode, dropNode, options) {
  //在数据中找到节点，重新查找节点，这样才能保证节点在数据上
  try {
    dragNode = findNodeById(hashData, data, dragNode?.id);
    dropNode = findNodeById(hashData, data, dropNode?.id);
    let dropNodes = findLinkNodesByPath(data, dropNode._path); //停靠节点链表
    if (
      dragNode &&
      dropNode &&
      dropNodes &&
      dragNode.pId !== dropNode.id &&
      dropNodes.filter((node) => node.id === dragNode.id).length === 0
    ) {
      /**
       * 1. 停靠的节点不能是移动节点的父节点，相当于没移动
       * 2. 停靠的节点不能是移动节点的子节点，否则产生死循环
       */

      //移动节点的父节点要删除节点，并且要更改子节点的路径
      data = removeNode(hashData, data, dragNode.id);
      dropNode.isOpened = true; //停靠节点展开
      //先添加到停靠节点上第一个，防止子节点过长，而看不到效果
      //再重新设置路径
      dropNode.children.unshift(dragNode);
      dropNode.children = setChildrenPath(
        hashData,
        dropNode.id,
        dropNode._path,
        dropNode.children,
        options
      );
    } else {
      console.log(
        "停靠的节点不能是移动节点的父节点或者停靠的节点不能是移动节点的子节点"
      );
    }
  } catch (e) {
    console.error("moveInNode", e);
  }
  return data;
}
/**
 * 移动到节点之前
 * @param {*} hashData hash地址
 * @param {*} data 数据
 * @param {*} dragNodeId 移动节点
 * @param {*} dropNodeId 停靠节点
 * @param {*} options 节点属性
 */
export function moveBeforeNode(hashData, data, dragNode, dropNode, options) {
  return moveBeforeOrAfterNode(hashData, data, dragNode, dropNode, options, 0);
}
/**
 * 移动到节点之后
 * @param {*} data
 * @param {*} dragNode
 * @param {*} dropNode
 */
export function moveAterNode(hashData, data, dragNode, dropNode, options) {
  return moveBeforeOrAfterNode(hashData, data, dragNode, dropNode, options, 1);
}
/**
 * 移动到节点前或后
 * @param {*} hashData hash地址
 * @param {*} data 数据
 * @param {*} dragNodeId 移动节点
 * @param {*} dropNodeId 停靠节点
 * @param {*} options 节点属性
 * @param {*} step 步长
 * @returns
 */
function moveBeforeOrAfterNode(
  hashData,
  data,
  dragNode,
  dropNode,
  options,
  step = 0
) {
  try {
    //在数据中找到节点，重新查找节点，这样才能保证节点在数据上
    dragNode = findNodeById(hashData, data, dragNode?.id);
    dropNode = findNodeById(hashData, data, dropNode?.id);
    let dropNodes = findLinkNodesByPath(data, dropNode._path); //停靠节点链表
    if (
      dragNode &&
      dropNode &&
      dropNodes &&
      dropNodes.filter((node) => node.id === dragNode.id).length === 0
    ) {
      /**
       *  停靠的节点不能是移动节点的子节点，否则产生死循环
       */
      data = removeNode(hashData, data, dragNode.id);
      if (dropNodes.length === 1) {
        //第一层节点,

        let leftData = data.slice(0, dropNode._path[0] + step); //前面节点
        let rightData = data.slice(dropNode._path[0] + step, data.length); //后面节点
        dragNode.pId = "";
        dragNode._path = dropNode._path[0] + step;
        leftData.push(dragNode);
        data = [].concat(leftData, rightData); //组成新数据
        //设置路径
        data = setChildrenPath(hashData, "", [], data, options);
      } else {
        let parentDropNode = dropNodes[dropNodes.length - 2]; //找到停靠节点的父节点
        let leftData = parentDropNode.children.slice(
          0,
          leafDropNode._path[0] + step
        );
        let rightData = parentDropNode.children.slice(
          leafDropNode._path[0] + step,
          parentDropNode.children.length
        );
        dragNode.pId = "";
        dragNode._path = leafDropNode._path[0] + step;
        leftData.push(dragNode);
        parentDropNode.children = [].concat(leftData, rightData);
        parentDropNode.children = setChildrenPath(
          hashData,
          parentDropNode.id,
          parentDropNode._path,
          parentDropNode.children,
          options
        );
      }
    } else {
      console.log("停靠的节点不能是移动节点的子节点");
    }
  } catch (e) {
    console.error("moveBeforeOrAfterNode", e);
  }
  return data;
}

/**
 * 设置子节点的路径
 * @param {*} pId 父节点id
 * @param {*} path 父节点路径
 * @param {*} children 子节点
 * @param {*} options 属性选项
 */
export function setChildrenPath(
  hashData = new Map(),
  pId,
  path,
  children,
  options
) {
  const idField = options?.idField ?? "id";
  const parentField = options?.parentField ?? "pId";
  const textField = options?.textField ?? "text";
  const childrenField = options?.childrenField ?? "children";
  if (!pId && options?.isSimpleData) {
    //如果没有父节点，说明全部更新
    children = func.toTreeData(children, idField, parentField, textField);
  }
  try {
    if (Array.isArray(children)) {
      for (let i = 0; i < children.length; i++) {
        let newPath = [...path, i];
        try {
          children[i]._path = newPath;
          children[i].pId = pId;
          children[i]._isLast = i === children.length - 1; //是否是最后一个节点用于画线
          children[i].id = children[i][idField];
          children[i].text = children[i][textField];
          hashData.set(children[i].id, newPath);
        } catch (e) {
          console.log("setChildrenPath", e);
        }
        //设置子节点
        if (Array.isArray(children[i][childrenField])) {
          children[i].children = setChildrenPath(
            hashData,
            children[i].id,
            newPath,
            children[i][childrenField],
            options
          );
        }
      }
      return children;
    }
  } catch (e) {
    console.error("setChildrenPath", e);
  }

  return [];
}

/**
 * 筛选节点
 * @param {*} flatData 扁平化数据
 * @param {*} filterValue 筛选值
 * @returns
 */
export function filter(flatData, filterValue = "") {
  let filterData = [];
  filterValue = (filterValue ?? "").toString().trim();
  try {
    if (filterValue) {
      for (let i = 0; i < flatData.length; i++) {
        let item = null;
        if ((flatData[i].text + "").indexOf(filterValue) > -1) {
          item = flatData[i];
          item.isOpened = true;
          filterData.push(item);
        }
      }
    }
  } catch (e) {}
  return [];
}
/**
 *  * 追加子节点
 * @param {*} hashData
 * @param {*} data
 * @param {*} pId
 * @param {*} children 添加的子节点
 * @param {*} options
 * @returns
 */
export function appendChildren(hashData, data = [], pId, children, options) {
  try {
    if (Array.isArray(children)) {
      let parentNode = findNodeById(hashData, data, pId);
      //去掉id已经存在的节点
      let newChildren = children.filter(
        (item) => !hashData.has(item[options?.idField] ?? item?.id)
      );

      // 格式化
      if (parentNode) {
        parentNode.isOpened = true; //节点展开
        let oldChildren = parentNode.children ?? [];
        oldChildren = oldChildren.concat(newChildren);
        parentNode.children = oldChildren;
        // 设置节点路径
        parentNode.children = setChildrenPath(
          hashData,
          parentNode.id,
          parentNode._path,
          parentNode.children,
          options
        );

        return data;
      } else if (pId === null || pId === "" || pId === undefined) {
        // 根节点,
        hashData = new Map(); //重新设置
        data = setChildrenPath(hashData, "", [], children, options);
        return data;
      }
    }
  } catch (e) {
    console.log("append", e);
  }
}
