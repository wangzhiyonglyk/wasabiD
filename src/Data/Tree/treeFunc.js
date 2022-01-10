import func from "../../libs/func";
//树的公共方法
const treeFunc = {

    /***
     * 通过id找到节点
     */
    findNodeById(data, id) {
        let node;
        if (data && data.length > 0 && id !== null && id !== undefined && id !== "") {
            for (let i = 0; i < data.length; i++) {
                if (data[i].id === id) {
                    return data[i];
                }
                else if (data[i].children && data[i].children instanceof Array && data[i].children.length > 0) {
                    node = treeFunc.findNodeById(data[i].children, id);
                    if (node) {
                        return node;
                    }
                }
            }
        }
        return node;
    },
    /**
     * 找到节点 
     * @param {*} data 
     * @param {*} path 
     */
    findNodeByPath(data, path) {
        let node;
        if (data && data.length > 0 && path && path.length > 0) {
            node = data[path[0]];//节点链表
            if (path && path.length > 1) {
                for (let i = 1; i < path.length; i++) {
                    if (node.children && node.children.length > 0) {
                        node = node.children[path[i]];
                    }
                }
            }
        }
        return node;
    },
    /**
     * 找到叶子节点链表
     * @param {*} data 
     * @param {*} path 
     */
    findLinkNodesByPath(data, path) {
        let nodes = [];
        if (data && data.length > 0 && path && path.length > 0) {
            nodes = [data[path[0]]];//节点链表
            if (path && path.length > 1) {
                for (let i = 1; i < path.length; i++) {
                    if (nodes[nodes.length - 1].children && nodes[nodes.length - 1].children.length > 0) {
                        nodes.push(nodes[nodes.length - 1].children[path[i]]);
                    }
                }
            }
        }
        return nodes;
    },
    /**
     * 只设置自身的勾选
     * @param {*} value 
     * @param {*} data 
     */
    setSelfChecked(value, data) {

        if (value) {
            for (let i = 0; i < data.length; i++) {
                if (("," + value + ",").indexOf("," + data[i].id + ",") > -1) {
                    data[i].checked = true;
                }
                else {
                    data[i].checked = false;
                }
                //继续遍历
                if (data[i].children && data[i].children.length > 0) {
                    data[i].children = treeFunc.setSelfChecked(value, data[i].children);
                }
            }

        }
        return data;

    },
    /**
     * 设置节点及子孙节点的勾选
     * @param {*} data 数据
     * @param {*} node 节点
     * @param {*} checked 勾选状态
     * @param {*} checkType 勾选方式
     * @returns 
     */
    setChecked(data, node, checked, checkType) {

        try {
            let nodes = this.findLinkNodesByPath(data, node._path);
            if (nodes && nodes.length > 0) {
                let leaf = nodes[nodes.length - 1];//叶子节点，即实际勾选的节点
                //设置节点及子节点的勾选
                if (checked && checkType && checkType.y && checkType.y.indexOf("s") > -1) {
                    leaf = this.setNodeChildrenChecked(leaf, checked);
                }
                else if (!checked && checkType && checkType.n && checkType.n.indexOf("s") > -1) {
                    leaf = this.setNodeChildrenChecked(leaf, checked);

                }
                //设置祖先节点
                if (checked && checkType && checkType.y && checkType.y.indexOf("p") > -1) {
                    this.setNodeParentsChecked(nodes);
                }
                else if (!checked && checkType && checkType.n && checkType.n.indexOf("p") > -1) {
                    this.setNodeParentsChecked(nodes);
                }
            }
        }
        catch (e) {

        }

        return data;




    },
    /**
     * 单选时的勾选
     * @param {*} data 
     * @param {*} node 
     * @param {*} checked 
     * @param {*} radioType 
     */
    setRadioChecked(data, node, checked, radioType) {
        try {
            if (radioType == "all") {
                data = treeFunc.clearChecked(data);
                let nodes = this.findLinkNodesByPath(data, node._path);
                if (nodes && nodes.length > 0) {
                    nodes[nodes.length - 1].checked = checked;
                    nodes[nodes.length - 1].half = false;
                }
            }
            else if (radioType == "level") {

                let nodes = this.findLinkNodesByPath(data, node._path);
                if (nodes && nodes.length >= 2) {
                    //有父节点
                    let parentRemoveNode = nodes[nodes.length - 2];
                    if (parentRemoveNode.children && parentRemoveNode.children.length > 0) {
                        for (let i = 0; i < parentRemoveNode.children.length; i++) {
                            parentRemoveNode.children[i].checked = false;
                            parentRemoveNode.children[i].half = false;
                        }
                    }
                }
                else if (nodes && nodes.length == 1) {
                    //根节点
                    for (let i = 0; i < data.length; i++) {
                        data[i].checked = false;
                        data[i].half = false;
                    }
                }
                //本身
                if (nodes && nodes.length > 0) {
                    nodes[nodes.length - 1].checked = checked;
                    nodes[nodes.length - 1].half = false;
                }
            }

        }
        catch (e) {
            console.log(e)
        }
        return data;
    },
    /**
     * 设置节点的子节点勾选
     * @param {*} node 
     * @param {*} checked 
     * @returns 
     */
    setNodeChildrenChecked(node, checked) {
        node.checked = checked;
        node.half = false;//设置为否
        if (node.children && node.children.length > 0) {
            for (let i = 0; i < node.children.length; i++) {
                node.children[i] = this.setNodeChildrenChecked(node.children[i], checked);
            }
        }
        return node;
    },

    /**
      * 设置祖先节点的
     * 
     * @param {*} nodes 节点链表，包括自身
     */
    setNodeParentsChecked(nodes) {
        if (nodes && nodes.length > 1) {
            //有父节点
            for (let i = nodes.length - 2; i >= 0; i--) {//倒序的
                if (nodes[i].children && nodes[i].children.length > 0) {
                    let checkedNum = 0;
                    let halfNum = 0;
                    for (let j = 0; j < nodes[i].children.length; j++) {
                        if (nodes[i].children[j].checked) {
                            checkedNum++;
                        }
                        if (nodes[i].children[j].half) {
                            halfNum++;
                        }

                    }
                    if (checkedNum === nodes[i].children.length) {//全部勾选
                        nodes[i].checked = true;
                        nodes[i].half = false;
                    }
                    else if (checkedNum > 0 && checkedNum !== nodes[i].children.length || halfNum > 0) {
                        //部分勾选，或者有半选
                        nodes[i].checked = false;
                        nodes[i].half = true;
                    }
                    else {
                        nodes[i].checked = false;
                        nodes[i].half = false;
                    }
                }
            }
        }
    },
    /**
     * 获取所有勾选的节点
     * @param {*} data 
     */
    getChecked(data) {
        let checkedArr = [];
        if (data && data instanceof Array && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].checked) {
                    checkedArr.push(data[i]);
                }
                if (data[i].children && data[i].children.length > 0) {
                    checkedArr = [].concat(checkedArr, this.getChecked(data[i].children));
                }
            }
        }
        return checkedArr;
    },
    /**
     * 清除勾选
     * @param {*} data 
     * @returns 
     */
    clearChecked(data) {

        if (data && data instanceof Array && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                data[i].checked = false;
                data[i].half = false;
                if (data[i].children && data[i].children.length > 0) {
                    data[i].children = treeFunc.clearChecked(data[i].children);
                }
            }
            return data;
        }
    },
    /**
  * 勾选
  * @param {*} data 
  * @returns 
  */
    checkedAll(data) {

        if (data && data instanceof Array && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                data[i].checked = true;
                data[i].half = false;
                if (data[i].children && data[i].children.length > 0) {
                    data[i].children = treeFunc.checkedAll(data[i].children);
                }
            }
            return data;
        }
    },
    /**
     * 设置折叠
     * @param {*} data 
     * @param {*} node 
     */
    setOpen(data, node) {
        let nodes = this.findLinkNodesByPath(data, node._path);
        if (nodes && nodes.length > 0) {
            let leaf = nodes[nodes.length - 1];//叶子节点，即实际的节点    
            leaf.open = leaf.open == null || leaf.open == undefined ? false : !leaf.open;
        }
        return data;
    },
    /**
     * 重命名
     * @param {*} data 
     * @param {*} id 
     * @returns 
     */
    renameNode(data, node, newText) {
        if (data && data.length > 0) {
            let nodes = treeFunc.findLinkNodesByPath(data, node._path);
            if (nodes) {
                nodes[nodes.length - 1].text = newText;
            }
        }
        return data;
    },
    /**
     * 删除节点
     * @param {*} id 
     */
    removeNode(data, node) {
        let nodes = treeFunc.findLinkNodesByPath(data, node._path);
        if (nodes.length == 1) {
            //根节点
            data.splice(nodes[0]._path[0], 1);//删除
            //改变所有节点的路径
            data = treeFunc.setChildrenPath("", [], data);
        }
        else {
            //父节点删除子节点
            //改变子节点的路径
            let parentRemoveNode = nodes[nodes.length - 2];
            parentRemoveNode.children.splice(node._path[node._path.length - 1], 1);
            parentRemoveNode.children = treeFunc.setChildrenPath(parentRemoveNode.id, parentRemoveNode._path, parentRemoveNode.children);
        }
        return data;

    },
    /**
     * 移动到节点中
     * @param {*} data 
     * @param {*} dragNode 移动节点
     * @param {*} dropNode 停靠节点
     */
    moveInNode(data, dragNode, dropNode) {
        //在数据中找到节点
        let dragNodes = treeFunc.findLinkNodesByPath(data, dragNode._path);
        let dropNodes = treeFunc.findLinkNodesByPath(data, dropNode._path);
        if (dropNodes) {
            let leafDragNode = dragNodes[dragNodes.length - 1];//在数据中找到移动节点
            let leafDropNode = dropNodes[dropNodes.length - 1];//在数据中找到停靠节点

            if (!leafDropNode.children) { leafDropNode.children = []; }
            //先添加到停靠节点上
            leafDropNode.children.push({
                ...leafDragNode,
                pId: leafDropNode.id,
                _path: [...leafDropNode._path, leafDropNode.children.length],
                children: treeFunc.setChildrenPath(leafDragNode.id, [...leafDragNode._path, leafDragNode.children.length], leafDragNode.children)
            })
            //移动的父节点要删除节点，并且要更改子节点的路径
            data = treeFunc.removeNode(data, leafDragNode);
        }
        return data;
    },
    /**
     * 移动到节点之前
     * @param {*} data 
     * @param {*} dragNode 
     * @param {*} dropNode 
     */
    moveBeforeNode(data, dragNode, dropNode) {
        return treeFunc.moveBeforeOrAfterNode(data, dragNode, dropNode, 0)
    },
    /**
     * 移动到节点之后
     * @param {*} data 
     * @param {*} dragNode 
     * @param {*} dropNode 
     */
    moveAterNode(data, dragNode, dropNode) {
        return treeFunc.moveBeforeOrAfterNode(data, dragNode, dropNode, 1)
    },
    /**
     * 移动到节点之后
     * @param {*} data 
     * @param {*} dragNode 
     * @param {*} dropNode 
     * @param {*} step 移动步数
     * @returns 
     */
    moveBeforeOrAfterNode(data, dragNode, dropNode, step = 0) {

        try {
            let dragNodes = treeFunc.findLinkNodesByPath(data, dragNode._path);
            let dropNodes = treeFunc.findLinkNodesByPath(data, dropNode._path);
            if (dragNodes && dropNodes) {
                let leafDragNode = dragNodes[dragNodes.length - 1];//在数据中找到移动节点
                let leafDropNode = dropNodes[dropNodes.length - 1];//在数据中找到停靠节点
                if (dropNodes.length == 1) {//根节点
                    data = [
                        ...data.slice(0, leafDropNode._path[0] + step),
                        {
                            ...leafDragNode,
                            pId: "",
                            _path: leafDropNode._path,
                        },
                        ...data.slice(leafDropNode._path[0] + step, data.length),
                    ]
                    data = this.setChildrenPath("", [], data);
                }
                else {
                    let parentDropNode = dropNodes[dropNodes.length - 2];//找到父节点
                    parentDropNode.children = [
                        ...parentDropNode.children.slice(0, leafDropNode._path[0] + step),
                        {
                            ...leafDragNode,
                            pId: leafDropNode.pId,
                            _path: leafDropNode._path,
                        },
                        ...parentDropNode.children.slice(leafDropNode._path[0] + step, parentDropNode.children.length)
                    ]
                    parentDropNode.children = this.setChildrenPath(parentDropNode.id, parentDropNode._path, parentDropNode.children);

                }
                //移动的父节点要删除节点，并且要更改子节点的路径
                data = treeFunc.removeNode(data, leafDragNode);
            }
        } catch (e) {

        }
        return data;
    },
    /**
     * 更改子节点的路径
     * @param {*} pId 
     * @param {*} path 
     * @param {*} children 

     */
    setChildrenPath(pId, path, children) {
        if (children && children.length > 0) {
            for (let i = 0; i < children.length; i++) {
                try {
                    children[i]._path = [...path, i];
                }
                catch (e) {
                    console.log(i, children, children[i])
                }
                children[i].pId = pId;
                if (children[i].children && children[i].children.length > 0) {
                    children[i].children = treeFunc.setChildrenPath(children[i].id, [...path, i], children[i].children);
                }
            }
            return children;
        }
        return [];

    },
    /**
  * 筛选节点
  * @param {*} key 
  */
    filter(data, key = "") {
        let filter = [];
        key = key.trim();
        if (key) {
            for (let i = 0; i < data.length; i++) {
                let item = null;
                if ((data[i].id + "").indexOf(key) > -1 || (data[i].text + "").indexOf(key) > -1) {
                    item = data[i];
                    item.open = true;
                }
                if (data[i].children && data[i].children.length > 0) {
                    let childrenFilter = treeFunc.filter(data[i].children, key);
                    if (childrenFilter && childrenFilter.length > 0) {
                        item = data[i];
                        item.open = true;
                        item.children = childrenFilter;
                    }
                }
                if (item) {
                    filter.push(item);
                }

            }
        }
        return filter;
    },
    /**
     * 添加子节点
     */
    appendChildren(data, children, row) {
        //格式化
        if (row && row._path) {
            let nodes = treeFunc.findLinkNodesByPath(data, row._path);
            if (nodes && nodes.length > 0) {
                //找到了
                let leaf = nodes[nodes.length - 1];
                leaf.children = children;
                //设置节点路径
                leaf.children = treeFunc.setChildrenPath(leaf.id, leaf._path, leaf.children);
            }
            return data;
        }
        else {//根节点
            data = data.concat(children);
            data = treeFunc.setChildrenPath("", [], data);
        }

    },
    /**
   * 对扁平化的数据设置属性
   * @param {*} visibleData 
   * @param {*} data 
   */
    setVisibleDataProps(visibleData, data) {
        if (visibleData.length > 0) {
            let result = [];
            visibleData.forEach(item => {
                let yuanItem = treeFunc.findNodeByPath(data, item._path);
                //目前就获取这两个属性
                result.push(
                    {
                        ...item,
                        checked: yuanItem.checked,
                        open: yuanItem.open
                    }
                );
            })
            return result;
        }
        return [];
    }
}

export default treeFunc