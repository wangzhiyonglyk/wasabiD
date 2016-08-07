/*
 Created by wangzy on 16/7/30.
*/
let fileType={};

/*
media
 */
let media=new Map();

media.set(  "audio/mpeg",".mp2" );
media.set(  "audio/mp3",".mp3" );
media.set( "audio/mp4",".mp4");
media.set(   "audio/mpeg",".mpeg");
media.set( "audio/mpeg",".mpg"  );
media.set( "application/vnd.ms-project",".mpp" );
media.set(  "audio/ogg",".ogg" );


/*
txt
 */

let txt=new Map();
txt.set(  "text/rtf",".rtf");
txt.set( "text/plain",".txt");
txt.set( "text/csv",".csv");
/*
pdf
 */
let pdf=new Map();
pdf.set( "application/pdf",".pdf");
/*
html

 */
let html=new Map();
html.set("application/xhtml+xml",".xhtml");
html.set("text/xml",".xml" );
html.set("text/html",".htm" );
html.set("text/html",".html");
html.set( "text/javascript",".js");
html.set( "application/json",".json");
html.set(  "text/css",".css" );
    /*
    excel
     */

    let excel=new Map();

excel.set("application/vnd.ms-excel",".xls" );
excel.set("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",".xlsx" );
/*
 word
 */
let word=new Map();
word.set("application/msword",".doc");
word.set("application/vnd.openxmlformats-officedocument.wordprocessingml.document",".docx" );

/*
 ppt
 */
let ppt=new Map();


ppt.set("application/vnd.openxmlformats-officedocument.presentationml.presentation",".pptx");
ppt.set("application/vnd.ms-powerpoint",".ppt");

/*
image
 */
let image=new Map();
image.set("image/bmp",".bmp");
image.set("image/vnd.dwg",".dwg");
image.set("image/vnd.dxf",".dxf");
image.set("image/gif",".gif" );
image.set("image/jp2",".jp2" );
image.set("image/jpeg",".jpe");
image.set("image/jpeg",".jpeg");
image.set("image/jpeg",".jpg" );
image.set("image/vnd.svf",".svf");
image.set( "image/tiff",".tif");
image.set("image/tiff",".tiff");
image.set("image/png",".png");

/*
压缩
 */
let zip=new Map();
zip.set(".zip"  , "aplication/zip");
zip.set("application/x-rar",".rar");

fileType.word=function(type) {//word文件
    if(word.has(type))
    {
        return true;
    }
    else {
        return false;
    }
}
fileType.excel=function(type) {//excel文件
    if(excel.has(type))
    {
        return true;
    }
    else {
        return false;
    }
}
fileType.ppt=function(type) {//ppt文件
    if(ppt.has(type))
    {
        return true;
    }
    else {
        return false;
    }
}
fileType.office=function(type) {//office格式文件

    if(fileType.word(type))
    {
        return true;
    }
    else if(fileType.excel(type))
    {
        return true;
    }
    else if(fileType.ppt(type))
    {
        return true;
    }
    else
    {
        return false;
    }

}
fileType.pdf=function(type) {//pdf 文件
    if(pdf.has(type))
    {
        return true;
    }
    else {
        return false;
    }
}
fileType.txt=function(type) {//txt 文件
    if(txt.has(type))
    {
        return true;
    }
    else {
        return false;
    }
}
fileType.html=function(type) {//html 文件
    if(html.has(type))
    {
        return true;
    }
    else {
        return false;
    }
}
fileType.image=function(type) {//image 文件
    if(image.has(type))
    {
        return true;
    }
    else {
        return false;
    }
}
fileType.media=function(type) {//media 文件
    if(media.has(type))
    {
        return true;
    }
    else {
        return false;
    }
}
fileType.zip=function(type) {//压缩 文件
    if(zip.has(type))
    {
        return true;
    }
    else {
        return false;
    }
}

fileType.type=function(value) {
    switch (value) {
        case "word":
            return word;
        case "excel":
            return excel;
        case     "ppt":
            return ppt;
        case      "office":
            return office;
        case      "txt":
            return txt;
        case     "pdf":
            return pdf;
        case     "html":
            return html;
        case     "image":
            return image;
        case     "media":
            return media;
        case      "zip":
            return zip;
        default:
            return null;
    }
}

module .exports=fileType;