

//树的公共方法

/***
 * 通过id找到节点
 */
 export function findNodeById(data, id) {
    let node;
    if (data && data.length > 0 && id !== null && id !== undefined && id !== "") {
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === id) {
                return data[i];
            }
            else if (data[i].children && data[i].children instanceof Array && data[i].children.length > 0) {
                node = findNodeById(data[i].children, id);
                if (node) {
                    return node;
                }
            }
        }
    }
    return node;
};
/**
 * 找到节点 
 * @param {*} data 
 * @param {*} path 
 */
export function findNodeByPath(data, path) {
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
};
/**
 * 找到叶子节点链表
 * @param {*} data 
 * @param {*} path 
 */
export function findLinkNodesByPath(data, path) {
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
};
/**
 * 只设置自身的勾选
 * @param {*} value 
 * @param {*} data 
 */
export function setSelfChecked(value, data) {

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
                data[i].children = setSelfChecked(value, data[i].children);
            }
        }

    }
    return data;

}
/**
 * 设置节点及子孙节点的勾选
 * @param {*} data 数据
 * @param {*} node 节点
 * @param {*} checked 勾选状态
 * @param {*} checkType 勾选方式
 * @returns 
 */
export function setChecked(data, node, checked, checkType) {
    try {
        let nodes = findLinkNodesByPath(data, node._path);
        if (nodes && nodes.length > 0) {
            let leaf = nodes[nodes.length - 1];//叶子节点，即实际勾选的节点
            leaf.checked = !!checked;
            //设置节点及子节点的勾选
            if (checked && checkType && checkType.y && checkType.y.indexOf("s") > -1) {
                leaf = setNodeChildrenChecked(leaf, leaf.checked);
            }
            else if (!checked && checkType && checkType.n && checkType.n.indexOf("s") > -1) {
                leaf = setNodeChildrenChecked(leaf, leaf.checked);

            }
            //设置祖先节点
            if (leaf.checked && checkType && checkType.y && checkType.y.indexOf("p") > -1) {
                setNodeParentsChecked(nodes);
            }
            else if (!leaf.checked && checkType && checkType.n && checkType.n.indexOf("p") > -1) {
                setNodeParentsChecked(nodes);
            }
        }
    }
    catch (e) {
        console.log("setChecked", e)
    }
    return data;
}
/**
 * 单选时的勾选
 * @param {*} data 
 * @param {*} node 
 * @param {*} checked 
 * @param {*} radioType 
 */
export function setRadioChecked(data, node, checked, radioType) {
    try {
        if (radioType ==="all") {
            data = clearChecked(data);
             node = findNodeByPath(data, (node._path ?? findNodeById(node.id)._path));
            node.checked = checked;
            node.half = false;
        }
        else if (radioType ==="level") {
            let nodes = findLinkNodesByPath(data, node._path ? node._path : findNodeById(node.id)?._path);
            if (nodes && nodes.length >= 2) {
                //有父节点,去设置兄弟节点
                let parentRemoveNode = nodes[nodes.length - 2];
                if (parentRemoveNode.children && parentRemoveNode.children.length > 0) {
                    for (let i = 0; i < parentRemoveNode.children.length; i++) {
                        parentRemoveNode.children[i].checked = false;
                        parentRemoveNode.children[i].half = false;
                    }
                }
            }
            else if (nodes && nodes.length === 1) {
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
}
/**
 * 设置节点的子节点勾选
 * @param {*} node 
 * @param {*} checked 
 * @returns 
 */
export function setNodeChildrenChecked(node, checked) {
    node.checked = checked;
    node.half = false;//设置为否
    if (node.children && node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
            node.children[i] = setNodeChildrenChecked(node.children[i], checked);
        }
    }
    return node;
}

/**
  * 设置祖先节点的
 * 
 * @param {*} nodes 节点链表，包括自身
 */
export function setNodeParentsChecked(nodes) {
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
                else if ((checkedNum > 0 && checkedNum !== nodes[i].children.length )|| halfNum > 0) {
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
}
/**
 * 获取所有勾选的节点
 * @param {*} data 
 */
export function getChecked(data) {
    let checkedArr = [];
    if (data && data instanceof Array && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].checked) {
                checkedArr.push(data[i]);
            }
            if (data[i].children && data[i].children.length > 0) {
                checkedArr = [].concat(checkedArr, getChecked(data[i].children));
            }
        }
    }
    return checkedArr;
}
/**
 * 清除勾选
 * @param {*} data 
 * @returns 
 */
export function clearChecked(data) {

    if (data && data instanceof Array && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            data[i].checked = false;
            data[i].half = false;
            if (data[i].children && data[i].children.length > 0) {
                data[i].children = clearChecked(data[i].children);
            }
        }
        return data;
    }
}
/**
* 勾选
* @param {*} data 
* @returns 
*/
export function checkedAll(data) {

    if (data && data instanceof Array && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            data[i].checked = true;
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
* @param {*} data 
* @param {*} node 
* @param {*} open
*/
export function setOpen(data, node, open) {
    try {
        node = findNodeByPath(data, (node._path ?? findNodeById(node.id)._path));
        node.open = open;
        return data;
    }
    catch (e) {

    }

}
/**
 * 重命名
 * @param {*} data 
 * @param {*} id 
 * @returns 
 */
export function renameNode(data, node, newText) {
    if (data && data.length > 0) {
        let nodes = findLinkNodesByPath(data, (node._path ?? findNodeById(node.id)._path));
        if (nodes) {
            nodes[nodes.length - 1].text = newText;
        }
    }
    return data;
}
/**
 * 删除节点
 * @param {*} node 
 */
export function removeNode(data, node) {
    let nodes = findLinkNodesByPath(data, (node._path ?? findNodeById(node.id)._path));
    if (nodes.length === 1) {
        //根节点
        try {

            data.splice(nodes[0]._path[0], 1);//删除
            return setChildrenPath("",[],data);

        }
        catch (e) {
            console.log("removeNode", nodes)
        }
    }
    else {
        //父节点删除子节点
        //改变子节点的路径
        let parentRemoveNode = nodes[nodes.length - 2];
        parentRemoveNode.children.splice(node._path[node._path.length - 1], 1);
        parentRemoveNode.children = setChildrenPath(parentRemoveNode.id, parentRemoveNode._path, parentRemoveNode.children);
    }
    return data;

}
/**
 * 更新节点
 * @param {*} data 
 * @param {*} newNode 新节点
 * @returns 
 */
 export function updateNode(data,newNode) {
    if(Array.isArray(data)&&data.length>0)
    {
       let  node = newNode._path?findNodeByPath(data, (newNode._path)): findNodeById(data,newNode.id);
       if(node){
          for(let key in newNode){
              node[key]=newNode[key]
          }
          node.children= setChildrenPath(node.id,node._path,newNode.children)
          return data;
       }   
    }
    else{
        return [newNode];
    }
 
    return data;


}
/**
 * 移动到节点中
 * @param {*} data 
 * @param {*} dragNode 移动节点
 * @param {*} dropNode 停靠节点
 */
 export function moveInNode(data, dragNode, dropNode) {
    //在数据中找到节点
    let dragNodes = findLinkNodesByPath(data, dragNode._path);
    let dropNodes = findLinkNodesByPath(data, dropNode._path);
    
    if (dropNodes) {
        let leafDragNode = dragNodes[dragNodes.length - 1];//在数据中找到移动节点
        let leafDropNode = dropNodes[dropNodes.length - 1];//在数据中找到停靠节点
        leafDropNode.open = true;
        if (!leafDropNode.children) { leafDropNode.children = []; }
        //先添加到停靠节点上
        leafDropNode.children.push({
            ...leafDragNode,
            pId: leafDropNode.id,
            _path: [...leafDropNode._path, leafDropNode.children.length],
            children: setChildrenPath(leafDragNode.id, [...leafDragNode._path, leafDragNode.children.length], leafDragNode.children)
        })
        //移动的父节点要删除节点，并且要更改子节点的路径
        data = removeNode(data, leafDragNode);
    }
    return data;
}
/**
 * 移动到节点之前
 * @param {*} data 
 * @param {*} dragNode 
 * @param {*} dropNode 
 */
export function moveBeforeNode(data, dragNode, dropNode) {
    return moveBeforeOrAfterNode(data, dragNode, dropNode, 0)
}
/**
 * 移动到节点之后
 * @param {*} data 
 * @param {*} dragNode 
 * @param {*} dropNode 
 */
export function moveAterNode(data, dragNode, dropNode) {
    return moveBeforeOrAfterNode(data, dragNode, dropNode, 1)
}
/**
 * 移动到节点之后
 * @param {*} data 
 * @param {*} dragNode 
 * @param {*} dropNode 
 * @param {*} step 移动步数
 * @returns 
 */
export function moveBeforeOrAfterNode(data, dragNode, dropNode, step = 0) {
    try {
        let dragNodes = findLinkNodesByPath(data, dragNode._path);
        let dropNodes = findLinkNodesByPath(data, dropNode._path);
        if (dragNodes && dropNodes) {
            let leafDragNode = dragNodes[dragNodes.length - 1];//在数据中找到移动节点
            let leafDropNode = dropNodes[dropNodes.length - 1];//在数据中找到停靠节点
            if (dropNodes.length ===1) {//根节点
                data = [
                    ...data.slice(0, leafDropNode._path[0] + step),
                    {
                        ...leafDragNode,
                        pId: "",
                        _path: leafDropNode._path,
                    },
                    ...data.slice(leafDropNode._path[0] + step, data.length),
                ]
                data = setChildrenPath("", [], data);
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
                parentDropNode.children = setChildrenPath(parentDropNode.id, parentDropNode._path, parentDropNode.children);

            }
            //移动的父节点要删除节点，并且要更改子节点的路径
            data = removeNode(data, leafDragNode);
        }
    } catch (e) {

    }
    return data;
}

/**
 * 更改子节点的路径
 * @param {*} pId 
 * @param {*} path 
 * @param {*} children 

 */
export function setChildrenPath(pId, path, children) {
    if (children && children.length > 0) {
        for (let i = 0; i < children.length; i++) {
            try {
                children[i]._path = [...path, i];
            }
            catch (e) {
                console.log("setChildrenPath", i, children, children[i])
            }
            children[i].pId = pId;
            if (children[i].children && children[i].children.length > 0) {
                children[i].children = setChildrenPath(children[i].id, [...path, i], children[i].children);
            }
        }
        return children;
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
    filterValue =(filterValue??"").toString().trim();
    try {
        if (filterValue) {
            for (let i = 0; i < flatData.length; i++) {
                let item = null;
                if ((flatData[i].id + "").indexOf(filterValue) > -1 || (flatData[i].text + "").indexOf(filterValue) > -1) {
                    item = flatData[i];
                    item.open = true;
                   filterData.push(item);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
                }
                

            }
        }
       
    }
    catch (e) { }
    return [];

}
/**
 * 添加子节点
 */
export function appendChildren(data = [], children, row) {
    //格式化
    if (row) {
        if (!row._path) {//没有路径
            row = findNodeById(data, row.id);
        }
        let nodes = findLinkNodesByPath(data, row._path);
        if (nodes && nodes.length > 0) {
            //找到了
            let leaf = nodes[nodes.length - 1];
            let oldChildren = leaf.children ?? [];
            leaf.children = [].concat(oldChildren, children);
            //设置节点路径
            leaf.children = setChildrenPath(leaf.id, leaf._path, leaf.children);
        }
        return data;
    }
    else {//根节点
        data = data.concat(children);
        data = setChildrenPath("",[],data);
        return data;
    }


}


