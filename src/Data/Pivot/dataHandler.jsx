/**
 * create by wangzhiyong
 * date:2020-12-21
 * desc 交叉表中，对数据加工，生成渲染的数据模型
 */
import func from "../../libs/func"
import Columns from "./Configuration/Columns";
export default {

    /**
     * 生成所需要的数据模型
     * @param {*} columns 列纬度
     * @param {*} rows 行纬度
     *  @param {*} values 统计列
     * @param {*} data 数据
     */
    setRowsAndColunmsAndData(columns = [], rows = [], values = [], data = []) {

        /***设置列纬度的表头**/
        {

            /**
          * 有多少个列纬度，就应该表头有多少行，另外一个统计指标的行，就是表头全部的行
           */
            let headers = [];//列表头
            for (let col = 0; col < columns.length + 1; col++) {
                //根据列纬度的分组，添加一行
                headers.push([])
            };

            /**设置行纬度的树，简单数据结构**/
            let rowsTreeData = [];
            let realData = [];//真实的统计数据
            /***处理数据 */
            {
                for (let i = 0; i < data.length; i++) {
         
                    headers = this.setHeaders(columns, values, headers, data[i]);
                    rowsTreeData = this.setRowsTree(rows, rowsTreeData, data[i]);

                }

            }

            /**继续处理列纬度的表头 */
            {

                //排序 todo 此处要改进
                for (let col = 0; col < columns.length + 1; col++) {
                    //冒泡
                    for (let i = 0; i < headers[col].length - 1; i++) {
                        for (let j = 0; j < headers[col].length - i - 1; j++) {
                            if (headers[col][j].name > headers[col][j + 1].name) {
                                let temp = headers[col][j];
                                headers[col][j] = headers[col][j + 1];
                                headers[col][j + 1] = temp;
                            }
                        }
                    }
                }
                //计算所跨列数
                for (let col = 0; col < columns.length; col++) {
                    for (let i = 0; i < headers[col].length; i++) {
                        let colSpan = 0;
                        for (let j = 0; j < headers[columns.length].length; j++) {//通过最后一行数据行来判断
                            if (headers[columns.length][j].name.indexOf(headers[col][i].name) > -1) {
                                colSpan++;
                            }
                        }
                        headers[col][i].colSpan = colSpan;
                    }
                }
            }
             //todo 如何保证树节点的顺序
            /**继续处理行纬度，增加行标 */
            {

            }
            realData=  this.setData(rowsTreeData,headers,data,realData);
            this.setState({
                ischange:false,
                headers: headers,
                realData: realData,
                rowsTreeData: rowsTreeData
            })
        }
    },
    /**
     * 生成列纬度的表头数据
      * @param {*} columns 列纬度 
    * @param {*} columns 统计的指标
     * @param {*} headers 之前生成的列纬度的表头数据
     * @param {*} dataCurrentRow 当前行的数据
     */
    setHeaders(columns = [], values = [], headers = [], dataCurrentRow = {}) {
        let colnamestr = [];//用于表头列的关键字,包括前面列纬度的值总和，才是当前列的字段关键字
        for (let col = 0; col < columns.length; col++) {
            colnamestr.push(columns[col].name + "|" + dataCurrentRow[columns[col].name] || "");//保存前面加当前的，用于最终数据列取值的对应的字段name
            //处理列
            if (headers[col].filter(item => { return item.name == colnamestr.join("-") }) == 0) {
                //没有添加此列
                headers[col].push({
                    label: dataCurrentRow[columns[col].name] || "",//列显示的名
                    name: colnamestr.join("-"),//列名，不会对应具体的数据列
                });//添加一个列
            }
        }
        //处理数据行的列
        for (let v = 0; v < values.length; v++) {
            if (headers[columns.length].filter(item => { return item.name == (colnamestr.join("-") + "-" + values[v].name) }) == 0) {

                headers[columns.length].push({
                    label: values[v].label + "(" + values[v].collectName + ")",//列显示的名
                    name: colnamestr.join("-") + "-" + values[v].name,//会对应具体的数据列，
                    colSpan: 1,//数据行的列，只占一列
                });//添加一个列
            }

        }
        return headers;



    },

    /**
     * 根本当行的数据，生成行纬度的部分树数据
     * @param {*} rowsTreeData 之前的生成的行纬度的部分树数据
     * @param {*} dataCurrentRow 当前行的数据
     */
    setRowsTree(rows = [], rowsTreeData = [], dataCurrentRow = []) {
        //生成简单的数据结构放入tree,就可以了
        let rowidstr = "";//用于树组件
        let rowParentIdstr = "";
        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            rowParentIdstr = rowidstr;
            rowidstr = rowidstr ? rowidstr + "-" +rows[rowIndex].name+"|"+ dataCurrentRow[rows[rowIndex].name] : rows[rowIndex].name+"|"+dataCurrentRow[rows[rowIndex].name];
            if (rowsTreeData.filter((item) => { return item.id ==( rowidstr) }).length == 0) {
                rowsTreeData.push({
                    id: rowidstr,
                    pId: rowParentIdstr,
                    isParent: rowIndex < rows.length - 1 ? true : false,//是否父节点，
                    open: rowIndex < rows.length - 1 ? true : false,//父节点展开，
                    text: dataCurrentRow[rows[rowIndex].name]
                })
            }
        }
        return rowsTreeData;
    },

    /**
     * 根据已经生成的表头，与行树，及当前行的数据，生成真实的表格统计数据
     * @param {*} rowsTreeData 
     * @param {*} headers 
     * @param {*} data 原始数据
    * @param {*} realData 得到的真实的统计数据
     */
    setData(rowsTreeData, headers,data, realData) {
        for (let i = 0; i < rowsTreeData.length; i++) {
                if (realData.filter(item => { item._id == rowsTreeData[i].id }).length == 0) {
                    if (rowsTreeData[i].isParent == true) {
                        //不属于统计行，
                        realData.push({
                            _id: rowsTreeData[i].id
                        });//增加空白行
                    }
                    else {
                        //属于统计行，得到真实的数据，根据最后一行表头
                        let obj = {
                            _id: rowsTreeData[i].id
                        }
                        for (let j = 0; j < headers[headers.length - 1].length; j++) {
                            let headerNames = headers[headers.length - 1][j].name.split("-");
                            for(let rowIndex=0;rowIndex<data.length;rowIndex++){
                             let   dataCurrentRow=data[rowIndex];
                                let find = true;
                                for (let k = 0; k < headerNames.length - 1; k++) {
                                    let cname = headerNames[k].split("|");//得到在数据中的列名，及值 
        
                                    if (dataCurrentRow[cname[0]] != cname[1]) {
                                        //当前行找不到rows对应的数据
                                        find = false;
                                    }
                                }
                                let rowsTreeDataId=rowsTreeData[i].id.split("-");
                                for(let r=0;r<rowsTreeDataId.length;r++){
                                    let rname = rowsTreeDataId[r].split("|");//得到在数据中的列名，及值 
        
                                    if (dataCurrentRow[rname[0]] != rname[1]) {
                                        //当前行找不到rows对应的数据
                                        find = false;
                                    }
                                }
                                if (find) {//找到值
                                    let value = dataCurrentRow[headerNames[headerNames.length - 1]];
                                    obj[headers[headers.length - 1][j].name] = value;
                                }
                               
                            }
                           
    
                        }
                        realData.push(obj);
                    }
                }
              
            
           

        }
        return realData;
    }

}