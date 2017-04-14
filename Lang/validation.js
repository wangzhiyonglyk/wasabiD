/**
 * Created by zhiyongwang on 2016-03-24.
 */


var  validation= {
    alpha: '只能包含英文字符，"-"，"_"',
    alphanum: '只能包含数字、英文字符和"_"',
    email: '邮箱格式不正确',
    url:"网址格式不正确",
    mobile:"手机号码格式不正确",
    integer: '必须为整数',
    idcard:"身份证号码格式不正确",
    required: '',
    invalidTip:"输入格式无效",
    date:"日期格式为: 0000-00-00",
    max: {
        array: '最多选择 {0} 个选项',
        number: '不能大于 {0}',
        string: '最大长度不能超过 {0} 个字符'
    },
    min: {
        array: '最少选择 {0} 个选项',
        number: '不能小于 {0}',
        string: '最小长度不能少于 {0} 个字符'
    },
    number: '必须为数字',
    password: '密码含有非法字符',
    url: 'url格式不正确',
    email: '邮箱格式不正确',
    fileSize: '最大上传文件大小不能超过 {0} KB'
}
module.exports=validation;

