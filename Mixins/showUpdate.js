/**
 * Created by apple on 16/8/5.
 */
let React=require("react");
let showUpdate={
    showUpdate:function(params) {
        let isupdate=false;
        if((params&&!this.state.params)||(params&&this.state.params&&Object.keys(params).length!=Object.keys(this.state.params).length))
        {//新的参数不为空，旧参数为空， 新参数不空，旧参数不为空，但长度不一样
            isupdate=true;
            return isupdate;
        }
        for(var par in params)
        {
            try {


                if (params[par] == this.state.params[par]) {
                    continue;
                }
                else {
                    isupdate = true;
                    return isupdate;
                }
            }catch (e)
            {
                isupdate = true;
                return isupdate;
            }

        }
        return isupdate;
    }
}
module .exports=showUpdate;