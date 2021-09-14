/*
 Created by wangzhiyong on 16/7/30.
*/
let fileType = {};

/*
media
 */
fileType.media = new Map();

fileType.media.set("audio/mpeg", ".mp2");
fileType.media.set("audio/mp3", ".mp3");
fileType.media.set("audio/mp4", ".mp4");
fileType.media.set("audio/mpeg", ".mpeg");
fileType.media.set("audio/mpeg", ".mpg");
fileType.media.set("application/vnd.ms-project", ".mpp");
fileType.media.set("audio/ogg", ".ogg");


/*
txt
 */

fileType.txt = new Map();
fileType.txt.set("text/rtf", ".rtf");
fileType.txt.set("text/plain", ".txt");
fileType.txt.set("text/csv", ".csv");
/*
pdf
 */
fileType.pdf = new Map();
fileType.pdf.set("application/pdf", ".pdf");
/*
html

 */
fileType.html = new Map();
fileType.html.set("application/xhtml+xml", ".xhtml");
fileType.html.set("text/xml", ".xml");
fileType.html.set("text/html", ".htm");
fileType.html.set("text/html", ".html");
fileType.html.set("text/javascript", ".js");
fileType.html.set("application/json", ".json");
fileType.html.set("text/css", ".css");

/*
json
 */
fileType.json = new Map();
fileType.json.set("application/json", ".json");

/*
excel
 */

fileType.excel = new Map();

fileType.excel.set("application/vnd.ms-excel", ".xls");
fileType.excel.set("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".xlsx");
/*
 word
 */
fileType.word = new Map();
fileType.word.set("application/msword", ".doc");
fileType.word.set("application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".docx");

/*
 ppt
 */
fileType.ppt = new Map();


fileType.ppt.set("application/vnd.openxmlformats-officedocument.presentationml.presentation", ".pptx");
fileType.ppt.set("application/vnd.ms-powerpoint", ".ppt");



/*
压缩
 */
fileType.zip = new Map();
fileType.zip.set(".zip", "aplication/zip");
fileType.zip.set("application/x-rar", ".rar");

/*
 image
 */
fileType.image = new Map();
fileType.image.set("image/bmp", ".bmp");
fileType.image.set("image/vnd.dwg", ".dwg");
fileType.image.set("image/vnd.dxf", ".dxf");
fileType.image.set("image/gif", ".gif");
fileType.image.set("image/jp2", ".jp2");
fileType.image.set("image/jpeg", ".jpe");
fileType.image.set("image/jpeg", ".jpeg");
fileType.image.set("image/jpeg", ".jpg");
fileType.image.set("image/vnd.svf", ".svf");
fileType.image.set("image/tiff", ".tif");
fileType.image.set("image/tiff", ".tiff");
fileType.image.set("image/png", ".png");

fileType.getTypeMap = function (value) {
    switch (value) {
        case "word":
            return fileType.word;
        case "excel":
            return fileType.excel;
        case "ppt":
            return fileType.ppt;
        case "office":
            return fileType.office;
        case "txt":
            return fileType.txt;
        case "pdf":
            return fileType.pdf;
        case "html":
            return fileType.html;
        case "image":
            return fileType.image;
        case "media":
            return fileType.media;
        case "zip":
            return fileType.zip;
        case "json":
            return fileType.json;
        default:
            return null;
    }
}

//文件筛选
fileType.filter = function (accept = "", files = []) {

    let result = true;
    if (accept && files) {
        accept = accept ? accept.split(",") : [];
        let fileTypestr = "";//得到所有的文件类型
        for (let i = 0; i < accept.length; i++) {
            let mymap = fileType.getTypeMap(accept[i]);
            if (mymap) {
                for (let key of mymap.keys()) {
                    fileTypestr += key + ",";
                }
            }
        }
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                if (files[i].type && fileTypestr.indexOf(files[i].type) <= -1) {
                    result = false;
                    break;
                }
                else {

                }
            }
        }
        else if (files) {
            //一个文件
            if (files.type && fileTypestr.indexOf(files.type) <= -1) {
                result = false;

            }
        }

    }
    return result;
}

export default fileType;