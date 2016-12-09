//将跳转分页独立出来
let React=require("react");
var Text=require("../Form/Text.jsx");
let DataPage=React.createClass({

    propTypes:{
        pageSize:React.PropTypes.number,
        pageIndex:React.PropTypes.number,
        pageTotal:React.PropTypes.number,
        pageUpdate:React.PropTypes.func,
    },
  getDefaultProps(){
        return{
            pageSize:20,
            pageIndex:1,
        }
  },
    getInitialState(){
        return{
            pageSize:this.props.pageSize,
            pageIndex:this.props.pageIndex,
            pageTotal:this.props.pageTotal,
            pageUpdate:null,
        }
    },
    componentWillReceiveProps:function (nextProps) {
      this.setState({
          pageSize:nextProps.pageSize,
          pageIndex:nextProps.pageIndex,
          pageTotal:nextProps.pageTotal,
      })
    },
    pageSizeKeyUp:function (event) {//取得改变分页大小的值
        let regs=new RegExp(/^[-+]?[0-9]+$/);
        if (event.keyCode == 13 && regs.test(event.target.value)&&event.target.value*1>0&&event.target.value<=100) {
         if(this.props.pageUpdate)
         {
             this.props.pageUpdate(this.refs.size.getValue(),this.refs.index.getValue())
         }
       }
       else
        {

        }
    },

    pageIndexKeyUp:function (event) {//取得新跳转页号

        let regs=new RegExp(/^[-+]?[0-9]+$/);
        if (event.keyCode == 13 && regs.test(event.target.value)&&event.target.value*1>0&&event.target.value<=this.state.pageTotal) {
            if(this.props.pageUpdate)
            {
                this.props.pageUpdate(this.refs.size.getValue(),this.refs.index.getValue())
            }
        }
        else
        {

        }
    },

    render:function () {
        return <div style={{display:"inline-block"}}>
    每页<div style={{display:"inline-block"}} ><Text ref="size"   onKeyUp={this.pageSizeKeyUp} value={this.state.pageSize} style={{width:30,height:20}}></Text></div>条，
    第<div style={{display:"inline-block"}} ><Text ref="index"  style={{width:30,height:20}}  onKeyUp={this.pageIndexKeyUp} value={this.state.pageIndex}></Text></div>页
</div>
    }

})
module.exports=DataPage;