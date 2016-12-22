/**
 * Created by apple on 16/8/5.
 */
let React=require("react");
let showUpdate={
    showUpdate:function(newParam,oldParam) {//判断前后参数是否相同
        let isupdate=false;
        if(!oldParam) {
            oldParam = this.state.params;
        }
        if(!newParam&&!oldParam)
        {//都为空
            isupdate=false;//
            return isupdate;
        }
        else if(newParam&&!oldParam&&Object.keys(newParam).length==0)
        {//原来没有参数,现在有了参数,但参数个数为0
            isupdate=false;
            return isupdate;

        }
        else if(newParam&&!oldParam&&Object.keys(newParam).length>0)
        {//原来没有参数,现在有了参数,但是参数个数不为0
            isupdate=true;
            return isupdate;

        }
        else if(!newParam&&oldParam)
        {//清空了参数
            isupdate=true;
            return isupdate;

        }
        else if(newParam&&oldParam&&(Object.keys(newParam).length!=Object.keys(oldParam).length))
        {//都有参数,但是参数个数已经不一样了
            isupdate=true;
            return isupdate;
        }
        else
        { //有参数,但参数个数相同,对比

            for(var par in newParam)
            {
                try {


                    if (newParam[par] == oldParam[par]) {
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

        }


    },

}
module .exports=showUpdate;