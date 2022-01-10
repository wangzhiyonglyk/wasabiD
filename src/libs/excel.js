import XLSX from "xlsx"
let excel = {
    /**
     * 读取excel
     * @param {*} file 
     * @param {*} callback 
     */
    readFile(file) {
        try {
            let reader = new FileReader();
            reader.readAsBinaryString(file);
            return new Promise((resolve, reject) => {
                reader.onload = function (e) {
                    let data = e.target.result;
                    let workbook = XLSX.read(data, { type: 'binary' });
                    resolve(workbook);

                };
                reader.onerror = function (e) {
                    reject("error");
                }
            })

        }
        catch (e) {
            console.log(e)
            return Promise.reject("error");
        }


    },
    /**
     * 
     * @param {*} workbook 
     * @param {*} sheetIndex 
     * @returns 
     */
    workbook2csv(workbook, sheetIndex = 0) {
        try {
            let sheetNames = workbook.SheetNames; // 工作表名称集合
            let worksheet = workbook.Sheets[sheetNames[sheetIndex]]; // 这里我们只读取第一张sheet
            let csv = XLSX.utils.sheet_to_csv(worksheet);
            console.log("csv",csv);
            return csv;

        }
        catch (e) {

        }
        return null;

    },

    /**
   * 上传的工作表转成json格式
   * @param {*} workbook 
   * @param {*} sheetIndex 
   * @returns 
   */
    workbook2json(workbook, sheetIndex = 0) {
        try {
            let csv = this.workbook2csv(workbook, sheetIndex);
            return this.csv2json(csv);
        }
        catch (e) {

        }
        return null;

    },

   /***
    * csv转json
    */
    csv2json(csv,headerset=true) {
        let json = {
            headers: [],
            body: [],
        }
        try {
            let rows = csv.split('\n');
            rows.pop(); // 最后一行没用的
            if(headerset){
                for (let i = 0; i < 1; i++) {
                    let column = rows[i].split(",");
                    for (let j = 0; j < column.length; j++) {
                        json.headers.push(column[j]);
                    }
                }
            }
           
            for (let i =(headerset?1:0); i < rows.length; i++) {
                let column = rows[i].split(",");
                let row = [];
                for (let j = 0; j < column.length; j++) {
                    row.push(column[j]);
                }
                json.body.push(row);
            }
            return json;

        }
        catch (e) {

        }
        return json;




    },
    /**
     * 
     * @param {*} json 
     * @returns 
     */
    json2csv(json) {
        var csv = [];
        if (json.headers && json.headers instanceof Array && json.headers.length > 0) {
            let header = [];
            for (let i = 0; i < json.headers.length; i++) {
                header.push(json.headers[i]);
            }
            csv.push(header.join(","));

        }
        if (json.body && json.body instanceof Array && json.body.length > 0) {

            for (let i = 0; i < json.body.length; i++) {
                let row = [];
                for (let j = 0; j < json.body[i].length; j++) {
                    row.push(json.body[i][j]);
                }
                csv.push(row.join(","));
            }

        }
        return csv.join('\n')+"\n";
    },
    // csv转sheet对象
    csv2sheet(csv) {
        let sheet = {}; // 将要生成的sheet
        csv = csv.split('\n');
        csv.forEach(function (row, i) {
            row = row.split(',');
            if (i == 0) sheet['!ref'] = 'A1:' + String.fromCharCode(65 + row.length - 1) + (csv.length - 1);
            row.forEach(function (col, j) {
                sheet[String.fromCharCode(65 + j) + (i + 1)] = { v: col };
            });
        });
    
        return sheet;
    },

    /**
     * 将一个sheet转成最终的excel文件的blob对象
     * @param {*} sheet 
     * @param {*} sheetName 
     * @returns 
     */
    sheet2blob(sheet, sheetName) {
        sheetName = sheetName || 'sheet1';
        let workbook = {
            SheetNames: [sheetName],
            Sheets: {}
        };
        workbook.Sheets[sheetName] = sheet;
        // 生成excel的配置项
        let wopts = {
            bookType: 'xlsx', // 要生成的文件类型
            bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
            type: 'binary'
        };
        let wbout = XLSX.write(workbook, wopts);
        let blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
        // 字符串转ArrayBuffer
        function s2ab(s) {
            let buf = new ArrayBuffer(s.length);
            let view = new Uint8Array(buf);
            for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
        return blob;
    }

}
export default excel;