import SheetModel from "./SheetModel"
const sheetFunc = {
    init(title = "sheet1", rowCount = 50, columnCount = 30, sheet = null) {
        if (sheet && sheet instanceof SheetModel) {
            return sheet;
        }
        else {
            let headers = this.initColumnNames(columnCount);
            let cells = this.initCells(rowCount, columnCount);
            return new SheetModel(title, rowCount, columnCount, headers, cells);

        }


    },
    initColumnNames: function (count = 30) {
        let arr = [];
        for (let i = 0; i < 26; i++) {
            arr.push({
                width: 100,
                label: String.fromCharCode(65 + i)
            });//输出A-Z 26个大写字母
            if (arr.length >= count) {
                return arr;
            }
        }
        for (let i = 0; i < 25; i++) {
            for (let j = i + 1; j < 26; j++) {
                arr.push({
                    width: 100,
                    label: String.fromCharCode(65 + i) + String.fromCharCode(65 + j)
                });
                if (arr.length >= count) {
                    return arr;
                }
            }
        }
        return arr;
    },
    initCells: function (rowCount, columnCount) {
        let cells = [];

        for (let i = 0; i < rowCount; i++) {
            let rows = [];
            for (let j = 0; j < columnCount; j++) {
                rows.push(this.cellFormatInit(i, j));
            }
            cells.push(rows);
        }
        return cells;
    },
    //初始化单元格
    cellFormatInit: function (rowIndex = 0, columnIndex = 0) {
        return {
            type: "text",//类型
            options: {},//单元格编辑参数
            rowIndex: rowIndex,
            columnIndex: columnIndex,
            rowSpan: 1,
            colSpan: 1,
            label: "",
            value: "",
            align: "center",
            underline: false,
            italic: false,
            backgroundColor:null,
            bold: false,
            fontSize: 14,
            fontFamily: "inherit",
            color: "var(--color)",
            wrap: false
        }
    },
    /**
     * 插入一行
       * @param {*} columnIndex 
    * @param {*} sheet 
    * @returns  
     */
    insertRow: function (rowIndex, sheet) {
        sheet = JSON.parse(JSON.stringify(sheet));
        let row = [];
        for (let i = 0; i < sheet.columnCount; i++) {
            row.push(this.cellFormatInit(rowIndex, i));
        }
        sheet.cells = [
            ...sheet.cells.slice(0, rowIndex),
            row,
            ...sheet.cells.slice(rowIndex)
        ]
        //重置列号
        for (let i = rowIndex; i < sheet.cells.length; i++) {
            for (let j = 0; j < sheet.cells[i].length; j++) {
                try {
                    sheet.cells[i][j].rowIndex=i;
                }
                catch (e) {

                }

            }

        }
        sheet.rowCount++;
        return sheet;
    },
    /**
     * 插入一列
     * @param {*} columnIndex 
     * @param {*} sheet 
     * @returns 
     */
    insertColumn: function (columnIndex, sheet) {
        sheet = JSON.parse(JSON.stringify(sheet));
        for (let i = 0; i < sheet.cells.length; i++) {
            sheet.cells[i] = [
                ...sheet.cells[i].slice(0, columnIndex)
                ,
                this.cellFormatInit(i, columnIndex)
                ,
                ...sheet.cells[i].slice(columnIndex)
            ]
            //重置列号
            for (let j = columnIndex; j < sheet.cells[i].length; j++) {
                sheet.cells[i][j].columnIndex=j;
            }
        }
        //追加一个表头
        sheet.headers = sheetFunc.appendHeader(sheet.headers);
        sheet.columnCount++;
        return sheet

    },

    /**
     * 删除一行
     * @param {*} startRowIndex 
     *  @param {*} endRowIndex 
     * @param {*} sheet 
     */
    deleteRow: function (startRowIndex, endRowIndex, sheet) {
        sheet = JSON.parse(JSON.stringify(sheet));
        let arr=[];
        for(let i=0;i<endRowIndex-startRowIndex+1;i++){
            let row = [];
            for (let j = 0; j < sheet.columnCount; j++) {
                row.push(this.cellFormatInit(sheet.cells.length-1-(endRowIndex-startRowIndex)+i, i));
            }
            arr.push(row);
        }
        sheet.cells = [
            ...sheet.cells.slice(0, startRowIndex),
            ...sheet.cells.slice(endRowIndex+1),
            ...arr
        ]
        //重置行号
        for (let i = startRowIndex; i < sheet.cells.length; i++) {
            for (let j = 0; j < sheet.cells[i].length; j++) {
                try {
                    sheet.cells[i][j].rowIndex=i;
                }
                catch (e) {

                }

            }

        }
       
        return sheet;
    },

    /**
     * 删除某一列
     * @param {*} columnIndex 
     * @param {*} sheet 
     */
    deleteColumn: function (startColumnIndex,endColumnIndex, sheet) {
        sheet = JSON.parse(JSON.stringify(sheet));
        for (let i = 0; i < sheet.cells.length; i++) {
            let newColumns=[];
            for(let j=0;j<endColumnIndex-startColumnIndex+1;j++){
                newColumns.push(this.cellFormatInit(i,j));
            }
            sheet.cells[i] = [
                ...sheet.cells[i].slice(0, startColumnIndex), 
                ...sheet.cells[i].slice(endColumnIndex+1),
               ...newColumns
            ]
        //重置列号
            for (let j = startColumnIndex; j < sheet.cells[i].length; j++) {
                sheet.cells[i][j].columnIndex=j;
            }
        }
        return sheet;
    },
    /**
     * 追加一列表头
     * @param {*} headers 
     */
    appendHeader: function (headers) {
        headers = JSON.parse(JSON.stringify(headers));
        if (headers.length < 26) {
            headers.push({
                width: 100,
                label: String.fromCharCode(65 + (headers.length))
            });
            return headers;
        }
        else {
            for (let i = 0; i < 25; i++) {
                for (let j = i + 1; j < 26; j++) {
                    let find = headers.find(item => {
                        item.label === String.fromCharCode(65 + i) + String.fromCharCode(65 + j)
                    })
                    if (!find) {
                        headers.push({
                            width: 100,
                            label: String.fromCharCode(65 + i) + String.fromCharCode(65 + j)
                        });
                        return headers;
                    }
                }
            }

        }
        return headers;
    },


}

export default sheetFunc;