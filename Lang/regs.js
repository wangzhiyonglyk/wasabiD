/**
 * Created by zhiyongwang on 2016-03-24.
 */

export default {
    email: /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i,
    url: /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
    number: /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,
    date: /^(\d{4})-(\d{2})-(\d{2})$/,//日期
    datetime:/(\d{4}-\d{2}-\d{2}\d{2}:\d{2}:\d{2})|(\d{2}-\d{2}\d{2}:\d{2}:\d{2})|(\d{2}:\d{2}:\d{2})$/,
    daterange:/^(\d{4})-(\d{2})-(\d{2}),(\d{4})-(\d{2})-(\d{2})$/,
    datetimerange:/(\d{4}-\d{2}-\d{2}\d{2}:\d{2}:\d{2})|(\d{2}-\d{2}\d{2}:\d{2}:\d{2})|(\d{2}:\d{2}:\d{2}),(\d{4}-\d{2}-\d{2}\d{2}:\d{2}:\d{2})|(\d{2}-\d{2}\d{2}:\d{2}:\d{2})|(\d{2}:\d{2}:\d{2})$/,
    alpha: /^[a-z ._-]+$/i,
    alphanum: /^[a-z0-9_]+$/i,
    password: /^[\x00-\xff]+$/,
    integer: /^[-+]?[0-9]+$/,
    /*
       add wangzhiyong
       date:2017-06-07
       desc：对手机号码的验证进行修改
       移动号段：
       134 135 136 137 138 139 147 150 151 152 157 158 159 172 178 182 183 184 187 188
       联通号段：
       130 131 132 145 155 156 171 175 176 185 186
       电信号段：
       133 149 153 173 177 180 181 189
       */
      mobile: /^(((13[0-9]{1})|(14[579]{1})|(15[0-9]{1})|(17[1235678]{1})|(18[0-9]{1}))+\d{8})$/,
         idcard:function (value) {//身份证号码
        //15位和18位身份证号码的正则表达式
        var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

        //如果通过该验证，说明身份证格式正确，但准确性还需计算
        if (regIdCard.test(value)) {
            if (value.length == 18) {
                var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里
                var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
                var idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
                for (var i = 0; i < 17; i++) {
                    idCardWiSum += value.substring(i, i + 1) * idCardWi[i];
                }

                var idCardMod = idCardWiSum % 11;//计算出校验码所在数组的位置
                var idCardLast = value.substring(17);//得到最后一位身份证号码

                //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
                if (idCardMod == 2) {
                    if (idCardLast == "X" || idCardLast == "x") {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
                    if (idCardLast == idCardY[idCardMod]) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        } else {
            return false;
        }


    },
    sql:/alert\s*\(|<script>|<\/script>|--/,//防止脚本注入，与sql注入

};
