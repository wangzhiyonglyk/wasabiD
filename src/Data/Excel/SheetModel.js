class SheetModel {
    constructor(title="sheet1",rowCount, columnCount, headers, cells) {
        this.rowCount = rowCount;
        this.columnCount = columnCount;
        this.startRowIndex = null;//初始化开始单元格下标
        this.startColumnIndex = null;//初始化开始单元格下标
        this.endRowIndex = null;//结束
        this.endColumnIndex = null;//结束
        this.headers = headers;
        this.cells = cells;
        this.title=title;
    }
}

export default SheetModel;