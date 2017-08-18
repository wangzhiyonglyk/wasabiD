/**
 * create by wangzhiyong 
 * date:2017-08-14
 * desc:将表单属性默认值独立
 */
export default {
             //公共属性
            type:"text",
            name:"",
            label:null,
            title:null,
         
            value:"",
            text:"",
            placeholder:"",
            readonly:false,
            required:false,
        
            hide:false,
            regexp:null,
            invalidTip:null,
            style:{},
            controlStyle:{},
            className:"",
           
              //其他属性 text
            rows:5,
            cols:1,
            min:null,
            max:null,
            onClick:null,
            onChange:null,


            //其他属性 combobox
            multiple:false,
            valueField:"value",
            textField:"text",
            url:null,
            params:null,
            dataSource:"data",
            data:null,
            extraData:null,
            onSelect:null,

           //其他属性 picker
            secondUrl:null,
            secondParams:null,
            secondParamsKey:null,
            thirdUrl:null,
            thirdParams:null,
            thirdParamsKey:null,
            hotTitle:"热门选择",
            hotData:null,
        }